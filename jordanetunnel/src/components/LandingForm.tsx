"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { formSchema, type FormData } from "@/lib/schema";
import { submitLead } from "@/app/actions";
import { Loader2, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentUrl = searchParams.get("agent") || "louis";
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent: agentUrl,
      type: "appartement",
      chambres: 3,
      etatInterieur: "3",
      etatCommuns: "3",
      consent: false
    }
  });

  const watchType = watch("type");
  const watchChambres = watch("chambres");
  const watchEtatInt = watch("etatInterieur");
  const watchEtatCom = watch("etatCommuns");

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const adresseValue = watch("adresse");

  useEffect(() => {
    if (!adresseValue || adresseValue.length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresseValue)}&limit=5`);
        const data = await res.json();
        if (data?.features) {
          setSuggestions(data.features);
          if (data.features.length > 0) setShowSuggestions(true);
        }
      } catch (e) {
        console.error("Erreur BAN:", e);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [adresseValue]);

  // Stepper Logic
  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(["type", "adresse", "surface"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const formData = new window.FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && !(typeof value === 'number' && isNaN(value))) {
          formData.append(key, value.toString());
        }
      });

      const result = await submitLead(formData);

      if (result.error) {
        setServerError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Données passées en cookie côté serveur — on passe juste prenom/agent pour l'écran de chargement
      const prenom = result.prenom ?? "";
      const agent = result.agent ?? agentUrl;
      router.push(`/chargement?prenom=${encodeURIComponent(prenom)}&agent=${encodeURIComponent(agent)}`);
    } catch (e) {
      setServerError("Une erreur inattendue est survenue.");
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            step === s ? "bg-merino-orange text-white ring-4 ring-orange-100" : 
            step > s ? "bg-merino-blue text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {step > s ? "✓" : s}
          </div>
          {s < 4 && (
            <div className={`h-1 w-8 sm:w-16 md:w-20 mx-2 rounded-full ${step > s ? "bg-merino-blue" : "bg-gray-100"}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const getEtatLabel = (val: string | undefined) => {
    switch(val) {
      case "1": return "À rénover entièrement";
      case "2": return "Des travaux à prévoir";
      case "3": return "Bon état général";
      case "4": return "Très bon état";
      case "5": return "Refait à neuf";
      default: return "Bon état général";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {renderStepIndicator()}

      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {serverError}
        </div>
      )}
      
      <input type="hidden" {...register("agent")} />

      {/* --- ETAPE 1 --- */}
      <div className={step === 1 ? "block space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Type *</label>
            <select
              {...register("type")}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue focus:border-merino-blue outline-none transition-all text-sm"
            >
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="terrain">Terrain</option>
              <option value="local commercial">Local commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Surface (m²) *</label>
            <input
              type="number"
              placeholder="Ex: 85"
              {...register("surface", { valueAsNumber: true })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue focus:border-merino-blue outline-none transition-all text-sm"
            />
            {errors.surface && <p className="text-red-500 text-xs mt-1">{errors.surface.message}</p>}
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Adresse complète *</label>
          <input
            type="text"
            placeholder="Ex: 12 rue Jeanne d'Arc, Nancy"
            {...register("adresse")}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue focus:border-merino-blue outline-none transition-all relative z-10 text-sm"
          />
          {errors.adresse && <p className="text-red-500 text-xs mt-1">{errors.adresse.message}</p>}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto top-full left-0">
              {suggestions.map((s, idx) => (
                <li 
                  key={idx}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 text-xs text-gray-700 font-medium"
                  onMouseDown={() => {
                    setValue("adresse", s.properties.label, { shouldValidate: true });
                    setShowSuggestions(false);
                  }}
                >
                  {s.properties.label}
                  <span className="block text-xs text-gray-400 font-normal">{s.properties.context}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-semibold text-gray-700">Nombre de chambres (optionnel)</label>
            <span className="text-sm font-bold text-merino-orange">{watchChambres}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            {...register("chambres", { valueAsNumber: true })}
            className="w-full accent-merino-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Studio / 0</span>
            <span>10+</span>
          </div>
        </div>
      </div>

      {/* --- ETAPE 2 --- */}
      <div className={step === 2 ? "block space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
        <h3 className="font-bold text-merino-blue text-sm mb-2 border-b pb-2">Les extérieurs (Optionnel)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Jardin (m²)</label>
            <input type="number" placeholder="Ex: 100" {...register("surfaceJardin", { setValueAs: v => v === "" ? undefined : Number(v) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-merino-blue text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Terrasse (m²)</label>
            <input type="number" placeholder="Ex: 20" {...register("surfaceTerrasse", { setValueAs: v => v === "" ? undefined : Number(v) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-merino-blue text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Balcon (m²)</label>
            <input type="number" placeholder="Ex: 5" {...register("surfaceBalcon", { setValueAs: v => v === "" ? undefined : Number(v) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-merino-blue text-sm" />
          </div>
        </div>

        <h3 className="font-bold text-merino-blue text-sm mb-2 mt-4 border-b pb-2">Les stationnements (Optionnel)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Intérieur (Garage, Box...)</label>
            <select {...register("statInterieur")} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-merino-blue text-sm">
              <option value="">Aucun</option>
              <option value="1">1 place</option>
              <option value="2">2 places</option>
              <option value="3">3 places</option>
              <option value="4+">4 places ou +</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Extérieur (Parking...)</label>
            <select {...register("statExterieur")} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-merino-blue text-sm">
              <option value="">Aucun</option>
              <option value="1">1 place</option>
              <option value="2">2 places</option>
              <option value="3">3 places</option>
              <option value="4+">4 places ou +</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- ETAPE 3 --- */}
      <div className={step === 3 ? "block space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Année de construction (Optionnel)</label>
          <input type="number" placeholder="Ex: 1990" {...register("anneeConstruction", { setValueAs: v => v === "" ? undefined : Number(v) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue outline-none text-sm" />
        </div>

        <div className="pt-2">
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">État Intérieur</label>
            <span className="text-xs font-bold text-merino-orange bg-orange-100 px-2 py-0.5 rounded text-right">{getEtatLabel(watchEtatInt)}</span>
          </div>
          <input type="range" min="1" max="5" step="1" {...register("etatInterieur")} className="w-full accent-merino-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Travaux</span>
            <span>Neuf</span>
          </div>
        </div>

        {watchType === "appartement" && (
          <div className="pt-2">
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">État Parties Communes</label>
              <span className="text-xs font-bold text-merino-orange bg-orange-100 px-2 py-0.5 rounded text-right">{getEtatLabel(watchEtatCom)}</span>
            </div>
            <input type="range" min="1" max="5" step="1" {...register("etatCommuns")} className="w-full accent-merino-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Travaux</span>
              <span>Neuf</span>
            </div>
          </div>
        )}
      </div>

      {/* --- ETAPE 4 --- */}
      <div className={step === 4 ? "block space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 flex gap-3">
          <ShieldCheck className="text-merino-blue shrink-0 mt-0.5" />
          <p className="text-xs text-merino-blue-dark leading-relaxed font-medium">L'estimation est prête ! Indiquez vos coordonnées pour déverrouiller votre fourchette de prix locale.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Prénom *</label>
            <input type="text" placeholder="Ex: Jean" {...register("prenom")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue text-sm outline-none" />
            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Nom *</label>
            <input type="text" placeholder="Ex: Dupont" {...register("nom")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue text-sm outline-none" />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">E-mail *</label>
          <input type="email" placeholder="Ex: jean.dupont@mail.com" {...register("email")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue text-sm outline-none" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Téléphone *</label>
          <input type="tel" placeholder="Ex: 06 12 34 56 78" {...register("telephone")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-merino-blue text-sm outline-none" />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
        </div>

        <div className="flex items-start gap-3 mt-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center h-5 mt-0.5">
            <input id="consent" type="checkbox" {...register("consent")} className="w-4 h-4 text-merino-orange bg-gray-100 border-gray-300 rounded focus:ring-merino-orange focus:ring-2 cursor-pointer" />
          </div>
          <div className="text-xs text-gray-600">
            <label htmlFor="consent" className="cursor-pointer">
              J'accepte d'être recontacté(e) concernant mon projet de vente et j'accepte les{" "}
              <a href="https://www.agencemerino.com" target="_blank" rel="noopener noreferrer" className="text-merino-blue underline hover:text-merino-orange transition-colors">
                Conditions Générales d'Utilisation (CGU)
              </a>. *
            </label>
            {errors.consent && <p className="text-red-500 text-xs mt-1 block font-bold">{errors.consent.message}</p>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
        {step > 1 && (
          <button type="button" onClick={handlePrev} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
        )}
        
        {step < 4 ? (
          <button type="button" onClick={handleNext} className="flex-1 bg-merino-blue hover:bg-merino-blue-dark text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            Étape {step + 1} <ArrowRight size={18} />
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="flex-1 bg-merino-orange hover:bg-orange-500 text-white font-bold py-3 text-base rounded-xl transition-all shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
            {isSubmitting ? "Analyse..." : "Suivant"}
          </button>
        )}
      </div>

    </form>
  );
}
