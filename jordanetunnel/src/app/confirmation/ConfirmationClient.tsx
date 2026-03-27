"use client";

import Image from "next/image";
import { Lock, PhoneCall, ShieldCheck } from "lucide-react";

export type EstimationData = {
  prenom: string;
  type: string;
  adresse: string;
  agent: string;
  prixBas: number;
  prixHaut: number;
  commentaire?: string;
  source: "claude" | "algorithme";
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
    photo: "/photoLouis.jpg",
    titre: "Co-fondateur MERINO",
  },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);

export default function ConfirmationClient({ data }: { data: EstimationData }) {
  const agentKey = (data.agent as keyof typeof AGENT_DATA) in AGENT_DATA
    ? (data.agent as keyof typeof AGENT_DATA)
    : "jordane";
  const agent = AGENT_DATA[agentKey];
  const { prenom, type, prixBas, prixHaut, commentaire, source } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-merino-blue-dark to-merino-blue py-12 px-4 selection:bg-merino-orange/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10 mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white mb-6 shadow-sm border border-white/20 backdrop-blur-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {prenom ? `${prenom}, voici votre estimation.` : "Voici votre estimation."}
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
            {source === "claude"
              ? "Cette fourchette est calculee par intelligence artificielle sur la base des donnees du marche local."
              : "Cette fourchette indicative est calculee sur la base de criteres objectifs de marche."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between border border-gray-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-merino-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10">
              <span className="uppercase tracking-wider text-xs font-bold text-merino-orange bg-merino-orange/10 px-3 py-1 rounded-full">
                Fourchette de marche
              </span>

              <div className="mt-8 mb-10">
                <p className="text-gray-500 text-sm mb-2 font-medium">Prix estime pour votre {type}</p>
                {prixBas ? (
                  <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    <span className="text-5xl md:text-6xl font-extrabold text-merino-blue tracking-tight">{formatPrice(prixBas)}</span>
                    <span className="text-2xl md:text-3xl text-gray-400 font-medium">a {formatPrice(prixHaut)}</span>
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl font-extrabold text-merino-black tracking-tight">Calcul impossible</div>
                )}
              </div>

              <div className="mb-2">
                <p className="text-gray-400 font-medium text-xs uppercase tracking-widest text-center mb-4">
                  Fiabilite de l&apos;estimation
                </p>
                <div className="flex justify-between text-sm font-semibold text-gray-400 mb-3 px-1">
                  <span className="text-red-400">Basse</span>
                  <span className="text-green-500">Haute</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-400 via-orange-300 to-green-400 relative shadow-inner">
                  <div
                    className="absolute w-6 h-6 bg-white border-4 border-merino-blue rounded-full shadow-lg top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform hover:scale-110"
                    style={{ left: "20%" }}
                  ></div>
                </div>
              </div>

              {commentaire && (
                <p className="mt-6 text-sm text-gray-500 italic border-l-2 border-merino-orange/40 pl-3">
                  {commentaire}
                </p>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 relative z-10">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                <span className="text-merino-orange font-bold mr-1">Note :</span>
                Cette valeur est purement algorithmique. Seul un oeil expert de notre agence dans le Grand Nancy
                permet d&apos;affiner precisement en valorisant les atouts uniques de votre bien.
              </p>
            </div>
          </div>

          <div className="bg-merino-blue-dark rounded-[2rem] p-8 md:p-10 shadow-2xl text-white flex flex-col border border-white/10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-merino-blue to-transparent opacity-50 z-0"></div>

            <div className="relative z-10 text-center flex-1 flex flex-col">
              <div className="mx-auto w-28 h-28 rounded-full border-4 border-merino-orange/80 bg-white p-1 shadow-lg mb-4 relative">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image src={agent.photo} alt={agent.nomComplet} fill className="object-cover" />
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-merino-blue-dark rounded-full"></div>
              </div>

              <h2 className="text-2xl font-bold">{agent.nomComplet}</h2>
              <p className="text-merino-orange/90 font-medium text-sm mb-6 uppercase tracking-wider">{agent.titre}</p>

              <div className="bg-white/10 rounded-xl p-4 mb-8 backdrop-blur-sm border border-white/5">
                <p className="text-sm text-white/90 leading-relaxed italic">
                  "J&apos;ai bien recu votre demande, je m&apos;en occupe personnellement et vous rappelle sous 24H."
                </p>
              </div>

              <div className="mt-auto">
                <a
                  href={`tel:${agent.telephone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-3 w-full bg-merino-orange hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-1 group"
                >
                  <PhoneCall size={20} className="group-hover:animate-bounce" />
                  <span>{agent.telephone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 border-l-8 border-merino-blue transform hover:scale-[1.01] transition-transform">
          <div className="w-16 h-16 bg-merino-blue/5 rounded-2xl flex items-center justify-center text-merino-blue shrink-0">
            <Lock size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-extrabold text-xl text-merino-blue">Methode / Guide</h3>
            <p className="text-gray-500 mt-1 font-medium">Telechargez des maintenant notre guide pour vendre vite et au bon prix.</p>
          </div>
          <button className="w-full md:w-auto bg-merino-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-merino-blue-dark transition-colors shrink-0 shadow-md">
            Recevoir mon estimation complete
          </button>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400/80 max-w-lg mx-auto pb-4">
          Nous traitons vos donnees de maniere confidentielle. <br /> Aucun engagement de votre part.
        </div>
      </div>
    </div>
  );
}
