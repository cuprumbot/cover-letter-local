import { ArrowLeft, CheckCircle, HelpCircle, FileText, TrendingUp, AlertCircle, Sparkles, Copy, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export interface ResultsData {
  formData: any;
  marketData: string[];
  linkedinData?: any;
}

export function getAggregatedMarketRange(marketData: string[]): { min: number | null, max: number | null } {
  console.log("--- DEBUG: getAggregatedMarketRange START ---");
  console.log("Raw marketData received:", marketData);
  
  const gtqValues: number[] = [];
  const usdValues: number[] = [];
  const otherValues: number[] = [];

  // Regex to capture: [Currency?] [Amount] [K?] [Period?]
  const regex = /(?:([$€]|USD|EUR|GTQ|Q)\s*)?([\d.,]+)([kK]?)(?:\s*(?:\/|per|por|a\s+un|al)\s*(mo|month|mes|yr|year|año|anual|annual))?/gi;

  marketData.forEach((str, index) => {
    console.log(`\n--- Parsing snippet [${index}]: "${str}" ---`);
    
    const snippetHasYearly = /yr|year|año|anual|annual/i.test(str);
    const snippetHasMonthly = /mo|month|mes/i.test(str);
    
    let snippetMultiplier = 1;
    let snippetCurrencyType = "GTQ/Unknown";
    if (/\$|usd/i.test(str)) {
      snippetMultiplier = 7.8;
      snippetCurrencyType = "USD";
    } else if (/€|eur|euro/i.test(str)) {
      snippetMultiplier = 8.6;
      snippetCurrencyType = "EUR";
    }

    console.log(`Snippet Context -> hasYearly: ${snippetHasYearly}, hasMonthly: ${snippetHasMonthly}, fallbackMultiplier: ${snippetMultiplier} (${snippetCurrencyType})`);

    let match;
    let foundAny = false;
    while ((match = regex.exec(str)) !== null) {
      foundAny = true;
      const currStr = match[1];
      const numStr = match[2];
      const kStr = match[3];
      const perStr = match[4];

      if (numStr === '.' || numStr === ',') continue;

      let cleanNum = numStr.replace(/,/g, '');
      let value = parseFloat(cleanNum);
      if (isNaN(value)) continue;
      
      let originalValue = value;
      if (kStr && /k/i.test(kStr)) value *= 1000;
      if (value < 100) continue;

      // 1. Determine Multiplier & Currency Type
      let multiplier = snippetMultiplier;
      let currencyType = snippetCurrencyType;
      
      if (currStr) {
        if (/[$]|usd/i.test(currStr)) {
          multiplier = 7.8;
          currencyType = "USD";
        } else if (/€|eur|euro/i.test(currStr)) {
          multiplier = 8.6;
          currencyType = "EUR";
        } else if (/GTQ|Q/i.test(currStr)) {
          multiplier = 1;
          currencyType = "GTQ";
        }
      }

      // 2. Determine Period
      let isYearly = false;
      if (perStr) {
        if (/yr|year|año|anual|annual/i.test(perStr)) isYearly = true;
      } else {
        if (snippetHasYearly && !snippetHasMonthly) {
          isYearly = true;
        } else if (snippetHasMonthly && !snippetHasYearly) {
          isYearly = false;
        } else {
          if (currencyType === "USD" && originalValue > 10000) isYearly = true;
          else if (currencyType === "GTQ" && value * multiplier > 100000) isYearly = true;
        }
      }
      
      value *= multiplier;
      if (isYearly) value /= 12;
      const finalMonthlyGTQ = value;

      console.log(`Match "${match[0]}" -> Origin: ${currencyType} -> isYearly: ${isYearly} -> Calculated: Q${finalMonthlyGTQ.toFixed(2)} / month`);
      
      if (currencyType === "GTQ") {
        gtqValues.push(finalMonthlyGTQ);
      } else if (currencyType === "USD") {
        usdValues.push(finalMonthlyGTQ);
      } else {
        otherValues.push(finalMonthlyGTQ);
      }
    }
    
    if (!foundAny) console.log("No numbers matched in this snippet.");
  });

  console.log("\n--- AGGREGATION & FILTERING ---");
  console.log("Values originally GTQ:", gtqValues);
  console.log("Values calculated from USD:", usdValues);
  console.log("Values calculated from EUR/Other:", otherValues);

  let finalValuesToUse: number[] = [];

  // Prioritize GTQ values if we have enough to form a meaningful datapoint
  if (gtqValues.length >= 1) {
    console.log("🟢 Using ONLY GTQ values (discarding USD/Other) because we found explicit local data.");
    finalValuesToUse = gtqValues;
  } else if (usdValues.length >= 1) {
    console.log("🟡 No GTQ values found. Falling back to calculated USD values.");
    finalValuesToUse = usdValues;
  } else if (otherValues.length >= 1) {
    console.log("🟠 No GTQ or USD values found. Falling back to Other/EUR values.");
    finalValuesToUse = otherValues;
  }

  if (finalValuesToUse.length === 0) {
    console.log("--- DEBUG END: No valid values found, returning null ---");
    return { min: null, max: null };
  }
  
  const min = Math.round(Math.min(...finalValuesToUse));
  const max = Math.round(Math.max(...finalValuesToUse));

  console.log(`✅ Final Selected Range -> Min: Q${min}, Max: Q${max}`);
  console.log("--- DEBUG: getAggregatedMarketRange END ---");

  return { min, max };
}

export default function ResultsView({ data, onDismiss }: { data: ResultsData, onDismiss: () => void }) {
  const { formData, marketData, linkedinData } = data;

  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const generateLetter = async () => {
      try {
        console.log("CLIENT: Requesting cover letter from /api/generate...");
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: formData.jobTitle,
            company: formData.company,
            experienceYears: formData.experienceYears,
            aboutYou: formData.aboutYou,
            jobOffer: formData.jobOffer,
            linkedinData: linkedinData || null
          }),
        });
        
        const result = await response.json();
        console.log("CLIENT: Received cover letter response:", result);
        if (isMounted && result.success) {
          let letter = result.letter;
          if (formData.name) {
            // Deanonymization/Signature
            if (!letter.toLowerCase().includes("atentamente")) {
              letter += `\n\nAtentamente,\n${formData.name}`;
            } else {
              letter += `\n${formData.name}`;
            }
          }
          setCoverLetter(letter);
        } else if (isMounted) {
          setCoverLetter("Error generando la carta de presentación.");
        }
      } catch (error) {
        console.error("CLIENT: Error calling /api/generate:", error);
        if (isMounted) setCoverLetter("Error de conexión al generar la carta.");
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    generateLetter();
    return () => { isMounted = false; };
  }, [formData, linkedinData]);

  const { min, max } = getAggregatedMarketRange(marketData);

  const current = Number(formData.currentSalary) || 0;
  const desired = Number(formData.desiredSalary) || 0;
  
  let increasePercent = 0;
  if (current > 0) {
    increasePercent = Math.round(((desired - current) / current) * 100);
  }

  let marketRangeStr = "Sin datos concluyentes";
  let rangeStatusStr = "";
  let isWithinRange = false;
  
  let scaleMin = 0;
  let scaleMax = 100;
  const hasChart = min !== null && max !== null;

  // Evaluate Negotiation Logic
  let isRealistic = false;
  let isUnrealistic = false;
  let analysis = "";
  let negotiationTip = "";

  if (hasChart) {
    marketRangeStr = min === max ? `Q${min!.toLocaleString()}` : `Q${min!.toLocaleString()} - Q${max!.toLocaleString()}`;
    
    if (desired >= min! && desired <= max!) {
      isWithinRange = true;
      rangeStatusStr = "Dentro del rango de la empresa";
      isRealistic = true;
    } else if (desired > max!) {
      rangeStatusStr = "Por encima de la empresa";
      isUnrealistic = true;
    } else {
      rangeStatusStr = "Por debajo de la empresa";
      isRealistic = true;
    }

    const rangeSpan = max! - min!;
    
    // Detailed Negotiation Matrix
    if (desired < min! * 0.8) {
      analysis = "Expectativa muy por debajo del mínimo que suele pagar la empresa.";
      negotiationTip = "No menciones el salario hasta que te pregunten. Podrías estar dejando dinero en la mesa; pide al menos el mínimo del rango.";
    } else if (desired < min! && increasePercent >= 30) {
      analysis = `Por debajo de la empresa, pero representa un excelente aumento (+${increasePercent}%) para ti.`;
      negotiationTip = "Eres un candidato muy atractivo económicamente. Puedes dar tu número temprano; es probable que lo acepten rápido y tú ganas un gran aumento.";
    } else if (desired < min!) {
      analysis = "Tu expectativa es modesta y está por debajo del rango de la empresa.";
      negotiationTip = "Esto podría acelerar tu contratación. No te adelantes a dar un número; deja que ellos hagan la primera oferta, ¡podrían ofrecerte más!";
    } else if (desired >= min! && desired < min! + (rangeSpan / 3)) {
      analysis = "Expectativa realista. Te sitúas en la parte baja del rango de la empresa.";
      negotiationTip = "Tienes una posición segura. Si preguntan, da este número con confianza desde la primera entrevista.";
    } else if (desired >= min! + (rangeSpan / 3) && desired <= max! - (rangeSpan / 3)) {
      analysis = "Expectativa muy realista, justo en el promedio de lo que paga la empresa.";
      negotiationTip = "Es un excelente punto medio. Da este número cuando pregunten, demostrando que conoces el valor del rol en la empresa.";
    } else if (desired > max! - (rangeSpan / 3) && desired <= max!) {
      analysis = "Expectativa realista pero en la parte alta del rango de la empresa.";
      negotiationTip = "Muestra tu valor primero. Espera a la segunda entrevista o cuando estén claramente interesados en ti antes de hablar de números.";
    } else if (desired > max! && desired <= max! * 1.2) {
      analysis = "Tu expectativa supera levemente el límite máximo detectado para la empresa.";
      negotiationTip = "No menciones el salario inicial. Enamóralos con tu experiencia primero; deberás justificar por qué aportas más valor que un candidato promedio.";
    } else {
      analysis = "Expectativa poco realista. Está significativamente por encima de lo que la empresa suele pagar.";
      negotiationTip = "Sé muy cauteloso. Considera negociar beneficios (bonos, vacaciones) si no llegan a tu número. Deja el salario para la etapa final.";
    }

    const lowerBound = Math.min(min!, desired, current);
    const upperBound = Math.max(max!, desired, current);
    const padding = (upperBound - lowerBound) * 0.2 || min! * 0.2;
    scaleMin = Math.max(0, lowerBound - padding);
    scaleMax = upperBound + padding;
  } else {
    if (increasePercent <= 20) {
      isRealistic = true;
      analysis = `Sin datos de la empresa, pero el incremento del ${increasePercent}% es razonable.`;
      negotiationTip = "Puedes mencionar tu expectativa con tranquilidad, es un salto natural en tu carrera.";
    } else {
      isUnrealistic = true;
      analysis = `Sin datos de la empresa, y el incremento del ${increasePercent}% es ambicioso.`;
      negotiationTip = "Evita dar un número primero. Espera a entender bien las responsabilidades y demuestra tu experiencia para justificar este salto salarial.";
    }
  }

  const getPos = (val: number) => Math.max(0, Math.min(100, ((val - scaleMin) / (scaleMax - scaleMin)) * 100));

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onDismiss}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al formulario
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Local Salary Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <TrendingUp className="w-32 h-32 text-emerald-500" />
          </div>
          
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 z-10">
            Análisis Salarial
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full">
              Local Context
            </span>
          </h2>

          <div className="flex flex-col gap-3 mt-2 z-10">
            <div className="flex justify-between items-center bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-white dark:border-white/5">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Salario Actual:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Q{current.toLocaleString()} <span className="text-xs font-normal text-zinc-500">/ mes</span></span>
            </div>
            
            <div className="flex flex-col gap-1 bg-white/80 dark:bg-black/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 relative">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Salario Deseado:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">Q{desired.toLocaleString()} <span className="text-xs font-normal text-emerald-500/70">/ mes</span></span>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-1">
                {hasChart && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    isWithinRange 
                      ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' 
                      : 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/40'
                  }`}>
                    {rangeStatusStr}
                  </span>
                )}
                {increasePercent > 0 && (
                  <span className="flex items-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    +{increasePercent}%
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 bg-white/60 dark:bg-black/20 p-4 rounded-xl border border-white dark:border-white/5 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">Promedio de la empresa</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">{marketRangeStr}</span>
              </div>
              
              {/* Line Graph */}
              {hasChart && (
                <div className="mt-8 mb-4 px-4">
                  <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                    {/* Market Range Bar */}
                    <div 
                      className="absolute h-full bg-emerald-400 dark:bg-emerald-600/80 rounded-full"
                      style={{
                        left: `${getPos(min!)}%`,
                        width: `${Math.max(2, getPos(max!) - getPos(min!))}%`
                      }}
                    >
                      {/* Min Label */}
                      <span className="absolute -bottom-6 left-0 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 -translate-x-1/2">
                        Q{min!.toLocaleString()}
                      </span>
                      {/* Max Label */}
                      <span className="absolute -bottom-6 right-0 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 translate-x-1/2">
                        Q{max!.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Desired Salary Marker */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-600 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-zinc-900 shadow-md z-10"
                      style={{ left: `calc(${getPos(desired)}% - 8px)` }}
                    >
                      {/* Desired Label */}
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap bg-emerald-50 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                        Tú (Q{desired.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 p-4 bg-white/80 dark:bg-black/40 rounded-xl border border-white dark:border-zinc-800 shadow-sm z-10 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {isRealistic ? (
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                ) : isUnrealistic ? (
                  <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <HelpCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  ¿Expectativa realista? <span className={isRealistic ? "text-green-600 dark:text-green-400" : isUnrealistic ? "text-orange-600 dark:text-orange-400" : "text-zinc-600"}>{isRealistic ? "Sí" : isUnrealistic ? "No" : "Desconocido"}</span>
                </h3>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed ml-9">
                {analysis}
              </p>
            </div>

            <div className="border-t border-emerald-100 dark:border-emerald-900/30 pt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                  Nota Privada de Negociación
                </span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic border-l-2 border-emerald-300 dark:border-emerald-700 pl-3 py-1">
                {negotiationTip}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Letter Placeholder Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Carta de Presentación
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
              Gemini AI
            </span>
          </h2>
          
          {isGenerating ? (
            <div className="flex-1 min-h-[400px] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 transition-colors">
              <div className="text-center flex flex-col items-center gap-4 text-zinc-400 dark:text-zinc-600 p-6">
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-800 animate-pulse">
                  <Sparkles className="w-8 h-8 text-emerald-500 animate-spin-slow" />
                </div>
                <p className="font-semibold text-zinc-600 dark:text-zinc-400 mt-2 animate-pulse">
                  Redactando con Inteligencia Artificial...
                </p>
                <p className="text-sm max-w-sm leading-relaxed text-zinc-500">
                  Analizando la oferta de trabajo y tu perfil profesional para crear una carta altamente persuasiva.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex-1 p-6 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl whitespace-pre-wrap text-zinc-800 dark:text-zinc-300 font-serif leading-relaxed text-sm md:text-base selection:bg-emerald-200 dark:selection:bg-emerald-900 shadow-inner">
                {coverLetter || "No se pudo generar la carta."}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-2">
                <button
                  onClick={() => {
                    if (coverLetter) navigator.clipboard.writeText(coverLetter);
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copiar al portapapeles
                </button>
                <button
                  onClick={onDismiss}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Generar otra carta
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
