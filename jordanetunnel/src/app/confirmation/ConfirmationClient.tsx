"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PhoneCall, CalendarDays, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const PRIX_REFERENCE: Record<string, number> = {
  "appartement": 2200,
  "maison": 2600,
  "terrain": 120,
  "local commercial": 1800,
};

const PRIX_NANCY_CP: Record<string, { appartement: number, maison: number }> = {
  "54000": { appartement: 2500, maison: 2900 }, // Nancy Centre
  "54140": { appartement: 1800, maison: 2200 }, // Jarville
  "54500": { appartement: 1700, maison: 2100 }, // Vandoeuvre
  "54600": { appartement: 2400, maison: 2800 }, // Villers-lès-Nancy
  "54520": { appartement: 2100, maison: 2500 }, // Laxou
  "54510": { appartement: 1900, maison: 2200 }, // Tomblaine
  "54130": { appartement: 2200, maison: 2600 }, // Saint-Max
  "54320": { appartement: 1900, maison: 2300 }, // Maxéville
  "54280": { appartement: 2200, maison: 2500 }, // Seichamps
  "54180": { appartement: 2200, maison: 2600 }, // Heillecourt
  "54710": { appartement: 2100, maison: 2400 }, // Ludres
  "54270": { appartement: 2100, maison: 2400 }, // Essey-lès-Nancy
};

const AGENT_DATA = {
  jordane: {
    prenom: "Jordane",
    nomComplet: "Jordane MOREL",
    telephone: "06 95 06 73 20",
    photo: "/jordane.jpg",
    titre: "Co-fondateur MERINO",
  },
  louis: {
    prenom: "Louis",
    nomComplet: "Louis PETITCOLIN",
    telephone: "07 59 59 92 97",
    photo: "/LOGO_BLEU.png",
    titre: "Co-fondateur MERINO",
  },
};

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const agentKey = (searchParams.get("agent") as keyof typeof AGENT_DATA) || "jordane";
  const agent = AGENT_DATA[agentKey] || AGENT_DATA["jordane"];
  const prenom = searchParams.get("prenom") || "";
  const type = searchParams.get("type") || "appartement";
  const surfaceRaw = searchParams.get("surface") || "0";
  const adresse = searchParams.get("adresse") || "";
  const surface = parseInt(surfaceRaw, 10);

  const anneeConstruction = searchParams.get("anneeConstruction") ? parseInt(searchParams.get("anneeConstruction") as string, 10) : null;
  const etatInterieur = searchParams.get("etatInterieur") ? parseInt(searchParams.get("etatInterieur") as string, 10) : 3;
  const etatCommuns = searchParams.get("etatCommuns") ? parseInt(searchParams.get("etatCommuns") as string, 10) : 3;
  const surfaceBalcon = searchParams.get("surfaceBalcon") ? parseInt(searchParams.get("surfaceBalcon") as string, 10) : 0;
  const surfaceTerrasse = searchParams.get("surfaceTerrasse") ? parseInt(searchParams.get("surfaceTerrasse") as string, 10) : 0;
  const surfaceJardin = searchParams.get("surfaceJardin") ? parseInt(searchParams.get("surfaceJardin") as string, 10) : 0;
  
  const parseStationnement = (val: string | null) => {
    if (!val) return 0;
    if (val === "4+") return 4;
    return parseInt(val, 10);
  };
  const statInterieur = parseStationnement(searchParams.get("statInterieur"));
  const statExterieur = parseStationnement(searchParams.get("statExterieur"));

  const [prixBas, setPrixBas] = useState(0);
  const [prixHaut, setPrixHaut] = useState(0);

  useEffect(() => {
    if (!isNaN(surface)) {
      // 1. BASE GEOGRAPHIQUE
      const cpMatch = adresse.match(/\b(54\d{3})\b/);
      const cp = cpMatch ? cpMatch[1] : null;
      
      let refAuMetre = PRIX_REFERENCE[type] || 2000;
      
      if (cp && PRIX_NANCY_CP[cp] && (type === "appartement" || type === "maison")) {
        refAuMetre = PRIX_NANCY_CP[cp][type as "appartement"|"maison"];
      }

      // 2. MODIFICATEURS D'ÉTAT
      let coeffEtat = 1;
      if (etatInterieur === 1) coeffEtat = 0.80; // À rénover entièrement
      else if (etatInterieur === 2) coeffEtat = 0.90; // Travaux
      else if (etatInterieur === 3) coeffEtat = 1.00; // Bon état
      else if (etatInterieur === 4) coeffEtat = 1.05; // Très bon état
      else if (etatInterieur === 5) coeffEtat = 1.15; // Neuf

      if (type === "appartement") {
        if (etatCommuns === 1) coeffEtat -= 0.05;
        if (etatCommuns >= 4) coeffEtat += 0.02;
      }

      if (anneeConstruction && anneeConstruction >= 2015) {
        coeffEtat += 0.05; // Bonus DPE
      }

      // 3. SURFACES PONDÉRÉES
      const surfacePonderee = surface + ((surfaceBalcon + surfaceTerrasse) * 0.30) + (surfaceJardin * 0.15);

      let basePrix = surfacePonderee * refAuMetre * coeffEtat;

      // 4. FORFAITS STATIONNEMENTS FIXES
      basePrix += (statInterieur * 15000);
      basePrix += (statExterieur * 7000);

      // Calcul de la fourchette commerciale +/- 8%
      setPrixBas(Math.round(basePrix * 0.92));
      setPrixHaut(Math.round(basePrix * 1.08));
    }
  }, [surface, type, adresse, anneeConstruction, etatInterieur, etatCommuns, surfaceBalcon, surfaceTerrasse, surfaceJardin, statInterieur, statExterieur]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-merino-blue-dark to-merino-blue py-12 px-4 selection:bg-merino-orange/30">
      <div className="container mx-auto max-w-4xl">
        
        {/* En-tête de page */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white mb-6 shadow-sm border 4 border-white/20 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {prenom ? `${prenom}, voici votre estimation.` : "Voici votre estimation."}
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">Cette fourchette indicative est calculée sur la base de critères objectifs de marché.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Bloc Résultat Principal */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between border border-gray-100">
            {/* Dégradé esthétique en arrière plan de la carte */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-merino-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <span className="uppercase tracking-wider text-xs font-bold text-merino-orange bg-merino-orange/10 px-3 py-1 rounded-full">
                Fourchette de marché
              </span>
              
                <div className="mt-8 mb-10">
                  <p className="text-gray-500 text-sm mb-2 font-medium">Prix estimé pour votre {type}</p>
                  {prixBas ? (
                    <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                      <span className="text-5xl md:text-6xl font-extrabold text-merino-blue tracking-tight">{formatPrice(prixBas)}</span>
                      <span className="text-2xl md:text-3xl text-gray-400 font-medium">à {formatPrice(prixHaut)}</span>
                    </div>
                  ) : (
                    <div className="text-4xl md:text-5xl font-extrabold text-merino-black tracking-tight">Calcul impossible</div>
                  )}
                </div>

              {/* Jauge de fiabilité */}
              <div className="mb-2">
                <p className="text-gray-400 font-medium text-xs uppercase tracking-widest text-center mb-4">
                  Fiabilité de l'estimation
                </p>
                <div className="flex justify-between text-sm font-semibold text-gray-400 mb-3 px-1">
                  <span className="text-red-400">Basse</span>
                  <span className="text-green-500">Haute</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-400 via-orange-300 to-green-400 relative shadow-inner">
                  {/* Curseur statique placé à ~20% (entre 10 et 30) */}
                  <div 
                    className="absolute w-6 h-6 bg-white border-4 border-merino-blue rounded-full shadow-lg top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110"
                    style={{ left: "20%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 relative z-10">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                <span className="text-merino-orange font-bold mr-1">Note :</span> 
                Cette valeur est purement algorithmique. Seul un œil expert de notre agence dans le Grand Nancy permet d'affiner précisément  en valorisant les atouts uniques de votre bien.
              </p>
            </div>
          </div>

          {/* Bloc Agent et Action */}
          <div className="bg-merino-blue-dark rounded-[2rem] p-8 md:p-10 shadow-2xl text-white flex flex-col border border-white/10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-merino-blue to-transparent opacity-50 z-0"></div>
            
            <div className="relative z-10 text-center flex-1 flex flex-col">
              
              <div className="mx-auto w-28 h-28 rounded-full border-4 border-merino-orange/80 bg-white p-1 shadow-lg mb-4 relative">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image 
                    src={agent.photo} 
                    alt={agent.nomComplet}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Pastille En Ligne */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-merino-blue-dark rounded-full"></div>
              </div>

              <h2 className="text-2xl font-bold">{agent.nomComplet}</h2>
              <p className="text-merino-orange/90 font-medium text-sm mb-6 uppercase tracking-wider">{agent.titre}</p>

              <div className="bg-white/10 rounded-xl p-4 mb-8 backdrop-blur-sm border border-white/5">
                <p className="text-sm text-white/90 leading-relaxed italic">
                  "J'ai bien reçu votre demande, je m'en occupe personnellement et vous rappelle sous 24H."
                </p>
              </div>

              <div className="mt-auto space-y-3">
                <a 
                  href={`tel:${agent.telephone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-3 w-full bg-merino-orange hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1 group"
                >
                  <PhoneCall size={20} className="group-hover:animate-bounce" />
                  <span>Être rappelé maintenant</span>
                  <ArrowRight size={18} className="ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all backdrop-blur-sm group"
                >
                  <CalendarDays size={20} />
                  <span>Prendre rendez-vous</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Action Finale */}
        <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 border-l-8 border-merino-blue transform hover:scale-[1.01] transition-transform">
          <div className="w-16 h-16 bg-merino-blue/5 rounded-2xl flex items-center justify-center text-merino-blue shrink-0">
            <Lock size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-extrabold text-xl text-merino-blue">Méthode / Guide</h3>
            <p className="text-gray-500 mt-1 font-medium">Téléchargez dès maintenant notre guide pour vendre vite et au bon prix.</p>
          </div>
          <button className="w-full md:w-auto bg-merino-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-merino-blue-dark transition-colors shrink-0 shadow-md">
            Recevoir mon estimation complète
          </button>
        </div>

        {/* Réassurance discrète en footer */}
        <div className="mt-12 text-center text-sm text-gray-400/80 max-w-lg mx-auto pb-4">
          Nous traitons vos données de manière confidentielle. <br/> Aucun engagement de votre part.
        </div>

      </div>
    </div>
  );
}
