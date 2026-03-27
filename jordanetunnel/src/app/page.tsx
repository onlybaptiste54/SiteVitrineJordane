import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LandingForm from "@/components/LandingForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-merino-ecru">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-merino-blue text-white z-50 shadow-md">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/LogoMerino.png"
              alt="MERINO Logo"
              width={160}
              height={50}
              className="h-10 w-auto brightness-0 invert" 
              priority
            />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="tel:0759599297"
              className="bg-merino-orange hover:bg-orange-500 text-white font-extrabold py-2 px-6 rounded-full transition-colors text-sm md:text-base mr-2 flex items-center gap-2 shadow-sm"
            >
              07 59 59 92 97
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-4 md:py-32 bg-gradient-to-b from-merino-blue-dark to-merino-blue text-white min-h-[90vh] flex flex-col justify-center">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 max-w-xl">
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 leading-relaxed shadow-sm">
              <span className="text-merino-orange font-extrabold text-lg mr-1">3,3%</span>c'est l'écart moyen constaté entre le premier prix affiché et le prix signé au moment du compromis.
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
              Vendez <span className="text-merino-orange">vite</span> et au <span className="text-merino-orange">bon prix</span> avec notre méthode.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90">
              Une estimation gratuite en 2 minutes. On vous rappelle sous 24h.
            </p>

            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-bold text-lg">Guide offert : Vendre vite et au bon prix</h3>
                  <p className="text-white/70 text-sm">Vous pourrez le télécharger gratuitement après votre estimation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div id="formulaire" className="bg-white rounded-2xl shadow-2xl p-6 text-merino-black relative w-full lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 z-10 border border-white/40">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-merino-blue">Connaître le prix de mon bien</h2>
              <p className="text-gray-500 text-xs mt-1">Estimation gratuite · Résultat immédiat</p>
            </div>
            <Suspense fallback={<div className="text-center py-6 opacity-50">Chargement du formulaire...</div>}>
              <LandingForm />
            </Suspense>
          </div>

        </div>
      </section>

      <section className="bg-merino-blue-dark border-l-8 border-merino-orange py-12 px-6 shadow-inner">
        <div className="container mx-auto max-w-4xl text-center">
            <p className="text-xl md:text-2xl text-white font-medium italic">
            "Si vous êtes arrivé sur ce site, c'est qu'on a identifié que<span className="text-merino-orange"> vous aviez un projet de vente.</span> C'est exactement ce qu'on fait pour <span className="text-merino-orange">vendre votre bien</span> : cibler les acheteurs qui cherchent un bien comme le vôtre et  <span className="text-merino-orange">vous trouver un acquéreur rapidement.</span>"
            </p>
        </div>
      </section>

      {/* METHODE MERINO */}
      <section className="py-24 px-4 bg-merino-gray-light">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-merino-blue mb-4">La Méthode MERINO</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">Une approche experte et ciblée pour une transaction réussie.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-merino-blue/10 text-merino-blue rounded-xl flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Estimation précise</h3>
              <p className="text-gray-600 text-sm leading-relaxed">On analyse votre bien et le marché local pour vous donner une valeur réaliste et argumentée.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-merino-blue/10 text-merino-blue rounded-xl flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Mise en valeur</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Photos professionnelles, aménagement virtuel par l'IA au besoin. Votre bien est présenté sous son meilleur jour.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-merino-blue/10 text-merino-blue rounded-xl flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Diffusion & ciblage</h3>
              <p className="text-gray-600 text-sm leading-relaxed">On diffuse votre bien là où se trouvent vos acheteurs et on cible précisément les profils intéressés.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-merino-blue/10 text-merino-blue rounded-xl flex items-center justify-center font-bold text-xl mb-6">4</div>
              <h3 className="text-xl font-bold mb-3">Accompagnement A-Z</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Visites, négociation, paperasse, notaire. On gère tout. Vous n'avez qu'à signer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-24 px-4 bg-merino-ecru">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-merino-blue text-center mb-20">Ils nous ont fait confiance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Une vraie différence par rapport aux agences traditionnelles. Grâce à eux, nous avons enfin eu des visites régulières et concrètes."</p>
              <div className="font-bold text-merino-blue-dark">Evelyne H.</div>
              <div className="text-sm text-gray-500">Nancy</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Ils savent utiliser tous les dispositifs et leurs réseaux pour vendre rapidement et au bon prix. Je recommande vivement."</p>
              <div className="font-bold text-merino-blue-dark">Pierre C.</div>
              <div className="text-sm text-gray-500">Malzéville</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex text-yellow-500 mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">"Professionnels, disponibles, d'un dynamisme remarquable. Vendu en 3 semaines au prix annoncé."</p>
              <div className="font-bold text-merino-blue-dark">Sophie M.</div>
              <div className="text-sm text-gray-500">Laneuveville-devant-Nancy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-merino-blue text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Prêt à vendre votre bien ?</h2>
          <p className="text-xl text-white/80 mb-10">Estimation gratuite · Rappel sous 24h · Sans engagement</p>
          <a
            href="#formulaire"
            className="inline-block bg-merino-orange hover:bg-orange-500 text-white font-bold py-4 px-10 rounded-full transition-all text-xl shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Connaître le prix de mon bien →
          </a>
        </div>
      </section>

      <footer className="bg-merino-black text-gray-400 py-12 px-4 text-center">
        <div className="container mx-auto">
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold mb-2">MERINO</h3>
            <p>Agence immobilière indépendante basée à Nancy.</p>
          </div>
          <div className="text-sm border-t border-gray-800 pt-8 flex flex-col items-center gap-2">
            <p>Vos données ne seront jamais transmises à des tiers.</p>
            <p>© 2026 MERINO - Nancy. Tous droits réservés.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link href="#" className="hover:text-white transition-colors">Mentions légales liées au site</Link>
              <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
