"use server";

import { formSchema } from "@/lib/schema";
import { headers, cookies } from "next/headers";
import type { z } from "zod";

// Rate limiting en mémoire (remplacer par Upstash Redis en prod)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000;

// Calcul algorithmique de fallback (utilisé si N8N/Claude ne répond pas)
function calculateFallback(data: z.infer<typeof formSchema>): { prixBas: number; prixHaut: number } {
  const PRIX_REFERENCE: Record<string, number> = {
    appartement: 2200, maison: 2600, terrain: 120, "local commercial": 1800,
  };
  const PRIX_NANCY_CP: Record<string, { appartement: number; maison: number }> = {
    "54000": { appartement: 2500, maison: 2900 },
    "54140": { appartement: 1800, maison: 2200 },
    "54500": { appartement: 1700, maison: 2100 },
    "54600": { appartement: 2400, maison: 2800 },
    "54520": { appartement: 2100, maison: 2500 },
    "54510": { appartement: 1900, maison: 2200 },
    "54130": { appartement: 2200, maison: 2600 },
    "54320": { appartement: 1900, maison: 2300 },
    "54280": { appartement: 2200, maison: 2500 },
    "54180": { appartement: 2200, maison: 2600 },
    "54710": { appartement: 2100, maison: 2400 },
    "54270": { appartement: 2100, maison: 2400 },
  };

  const cp = data.adresse.match(/\b(54\d{3})\b/)?.[1] ?? null;
  let refAuMetre = PRIX_REFERENCE[data.type] ?? 2000;
  if (cp && PRIX_NANCY_CP[cp] && (data.type === "appartement" || data.type === "maison")) {
    refAuMetre = PRIX_NANCY_CP[cp][data.type];
  }

  const etatInt = parseInt(data.etatInterieur ?? "3");
  const etatCom = parseInt(data.etatCommuns ?? "3");
  let coeff = [0, 0.80, 0.90, 1.00, 1.05, 1.15][etatInt] ?? 1.00;
  if (data.type === "appartement") {
    if (etatCom === 1) coeff -= 0.05;
    if (etatCom >= 4) coeff += 0.02;
  }
  if (data.anneeConstruction && data.anneeConstruction >= 2015) coeff += 0.05;

  const parseStat = (v?: string) => (!v ? 0 : v === "4+" ? 4 : parseInt(v));
  const surfPonderee =
    data.surface +
    ((data.surfaceBalcon ?? 0) + (data.surfaceTerrasse ?? 0)) * 0.3 +
    (data.surfaceJardin ?? 0) * 0.15;

  let base = surfPonderee * refAuMetre * coeff;
  base += parseStat(data.statInterieur) * 15000;
  base += parseStat(data.statExterieur) * 7000;

  return { prixBas: Math.round(base * 0.92), prixHaut: Math.round(base * 1.08) };
}

export async function submitLead(formData: FormData) {
  try {
    // 1. Rate limiting
    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const now = Date.now();
    const rl = rateLimitMap.get(ip);
    if (rl) {
      if (now - rl.lastReset > WINDOW_MS) rateLimitMap.set(ip, { count: 1, lastReset: now });
      else if (rl.count >= MAX_REQUESTS) return { error: "Trop de requêtes. Réessayez plus tard." };
      else rl.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

    // 2. Validation Zod
    const entries = Object.fromEntries(formData.entries());
    const raw = {
      ...entries,
      surface: entries.surface ? Number(entries.surface) : undefined,
      chambres: entries.chambres ? Number(entries.chambres) : undefined,
      surfaceJardin: entries.surfaceJardin ? Number(entries.surfaceJardin) : undefined,
      surfaceTerrasse: entries.surfaceTerrasse ? Number(entries.surfaceTerrasse) : undefined,
      surfaceBalcon: entries.surfaceBalcon ? Number(entries.surfaceBalcon) : undefined,
      anneeConstruction: entries.anneeConstruction ? Number(entries.anneeConstruction) : undefined,
      consent: entries.consent === "true",
    };
    const validatedData = formSchema.parse(raw);

    // 3. Appel N8N (Claude Haiku + email + SQLite)
    let prixBas = 0;
    let prixHaut = 0;
    let commentaire = "";
    let source: "claude" | "algorithme" = "algorithme";

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

    if (webhookUrl) {
      try {
        const n8nRes = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": webhookSecret ?? "",
          },
          body: JSON.stringify(validatedData),
          signal: AbortSignal.timeout(15000), // 15s max
        });

        if (n8nRes.ok) {
          const n8nData = await n8nRes.json();
          if (n8nData.prixBas && n8nData.prixHaut) {
            prixBas = n8nData.prixBas;
            prixHaut = n8nData.prixHaut;
            commentaire = n8nData.commentaire ?? "";
            source = "claude";
          }
        }
      } catch {
        // Silently fallback — N8N a quand même reçu les données pour l'email
      }
    }

    // 4. Fallback algorithmique si Claude n'a pas répondu
    if (!prixBas || !prixHaut) {
      const fallback = calculateFallback(validatedData);
      prixBas = fallback.prixBas;
      prixHaut = fallback.prixHaut;
      source = "algorithme";
    }

    // 5. Stocker l'estimation en cookie sécurisé (15 min)
    const cookieData = {
      prenom: validatedData.prenom,
      type: validatedData.type,
      adresse: validatedData.adresse,
      agent: validatedData.agent ?? "jordane",
      prixBas,
      prixHaut,
      commentaire,
      source,
    };

    const cookieStore = await cookies();
    cookieStore.set("merino_estimation", JSON.stringify(cookieData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return {
      success: true,
      prenom: validatedData.prenom,
      agent: validatedData.agent ?? "jordane",
    };
  } catch (error: any) {
    if (error.name === "ZodError") {
      return { error: "Données invalides.", details: error.errors };
    }
    return { error: "Une erreur interne s'est produite." };
  }
}
