import { z } from "zod";

export const formSchema = z.object({
  // Etape 1
  type: z.enum(["appartement", "maison", "terrain", "local commercial"]),
  adresse: z.string().min(5, "L'adresse est requise (min 5 caractères)"),
  surface: z.number({ message: "La surface est requise" }).positive("La surface doit être positive"),
  chambres: z.number().optional(),

  // Etape 2
  surfaceJardin: z.number().optional(),
  surfaceTerrasse: z.number().optional(),
  surfaceBalcon: z.number().optional(),
  statInterieur: z.string().optional(),
  statExterieur: z.string().optional(),

  // Etape 3
  anneeConstruction: z.number().optional(),
  etatInterieur: z.string().optional(),
  etatCommuns: z.string().optional(),

  // Etape 4
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().regex(/^(?:0|\+33 ?)[1-9](?:[ .-]?\d{2}){4}$/, "Numéro de téléphone invalide"),
  
  agent: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Vous devez accepter les conditions d'utilisation"),
});

export type FormData = z.infer<typeof formSchema>;
