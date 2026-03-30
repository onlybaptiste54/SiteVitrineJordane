"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

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
    photo: "/photoLouis.jpg",
    titre: "Co-fondateur MERINO",
  },
};

export default function ChargementClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentKey = (searchParams.get("agent") as keyof typeof AGENT_DATA) || "jordane";
  const agent = AGENT_DATA[agentKey] || AGENT_DATA["jordane"];
  const prenom = searchParams.get("prenom") || "";

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyse du secteur immobilier...");

  const statusMessages = [
    "Analyse du secteur immobilier...",
    "Recherche des biens similaires vendus récemment...",
    "Ajustement selon la surface et les critères...",
    "Finalisation de votre dossier..."
  ];

  useEffect(() => {
    if (progress < 25) setStatusText(statusMessages[0]);
    else if (progress < 50) setStatusText(statusMessages[1]);
    else if (progress < 80) setStatusText(statusMessages[2]);
    else setStatusText(statusMessages[3]);
  }, [progress]);

  useEffect(() => {
    // 20 secondes = 20000ms. On avance de 1% toutes les 200ms
    const intervalMs = 200;
    const increment = 100 / (20000 / intervalMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/confirmation");
          }, 500);
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-merino-blue flex items-center justify-center p-4 selection:bg-merino-orange/30">
      
      {/* Cadre Principal - Très épuré, très "Apple/Luxe" */}
      <div className="bg-white rounded-[2rem] p-8 md:p-10 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
        
        {/* Titre et Barre en haut */}
        <div className="mb-8">
          <h2 className="text-[22px] leading-snug font-medium text-merino-blue mb-5">
            <span className="font-bold">{prenom ? `${prenom}, r` : "R"}etour automatique</span><br/>de votre estimation en cours...
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between items-end text-sm">
              <span className="text-gray-500 font-medium tracking-wide text-xs uppercase animate-pulse">
                {statusText}
              </span>
              <span className="text-merino-orange font-bold text-xs">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-merino-orange transition-all duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Espace Vidéo - Format Vertical */}
        <div className="w-64 max-w-full mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-md flex items-center justify-center">
          {/* Vidéo de Louis qui va se lancer */}
          <video 
            src="/video-louis.mp4" 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          ></video>
          
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"></div>
        </div>

        {/* Pied : Mention Agent très fine */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shadow-sm relative">
            <Image 
              src={agent.photo} 
              alt={agent.nomComplet}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left flex flex-col justify-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Votre conseiller</span>
            <span className="text-merino-black font-semibold text-sm">{agent.nomComplet}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
