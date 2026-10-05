import { ArrowLeft, CheckCircle, HelpCircle, FileText, TrendingUp, AlertCircle } from "lucide-react";

export interface ResultsData {
  formData: any;
  marketData: string[];
}

export function getAggregatedMarketRange(marketData: string[]): { min: number | null, max: number | null } {
  console.log("--- DEBUG: getAggregatedMarketRange START ---");
  console.log("Raw marketData received:", marketData);
  const allValues: number[] = [];

  // Regex to capture: [Currency?] [Amount] [K?] [Period?]
  // Group 1: Currency ($, €, USD, EUR, GTQ, Q)
  // Group 2: Amount (digits and commas/dots)
  // Group 3: K modifier (k or K)
  // Group 4: Period (mo, month, mes, yr, year, año, anual, annual)
  const regex = /(?:([$€]|USD|EUR|GTQ|Q)\s*)?([\d.,]+)([kK]?)(?:\s*(?:\/|per|por|a\s+un|al)\s*(mo|month|mes|yr|year|año|anual|annual))?/gi;

  marketData.forEach((str, index) => {
    console.log(`\n--- Parsing snippet [${index}]: "${str}" ---`);
    
    const snippetHasYearly = /yr|year|año|anual|annual/i.test(str);
    const snippetHasMonthly = /mo|month|mes/i.test(str);
    
    // Default fallback multipliers for the snippet if no currency is attached to the number
    let snippetMultiplier = 1;
    if (/\$|usd/i.test(str)) snippetMultiplier = 7.8;
    else if (/€|eur|euro/i.test(str)) snippetMultiplier = 8.6;

    console.log(`Snippet Context -> hasYearly: ${snippetHasYearly}, hasMonthly: ${snippetHasMonthly}, fallbackMultiplier: ${snippetMultiplier}`);

    let match;
    let foundAny = false;
    while ((match = regex.exec(str)) !== null) {
      foundAny = true;
      const currStr = match[1];
      const numStr = match[2];
      const kStr = match[3];
      const perStr = match[4];

      if (numStr === '.' || numStr === ',') {
        console.log(`Skipping "${match[0]}" - Just punctuation`);
        continue;
      }

      let cleanNum = numStr.replace(/,/g, '');
      let value = parseFloat(cleanNum);
      if (isNaN(value)) {
        console.log(`Skipping "${match[0]}" - NaN after cleaning`);
        continue;
      }
      
      let originalValue = value;
      if (kStr && /k/i.test(kStr)) {
        value *= 1000;
      }
      
      if (value < 100) {
        console.log(`Skipping "${match[0]}" (value: ${value}) - below 100 threshold`);
        continue;
      }

      // 1. Determine Multiplier
      let multiplier = snippetMultiplier;
      if (currStr) {
        if (/[$]|usd/i.test(currStr)) multiplier = 7.8;
        else if (/€|eur|euro/i.test(currStr)) multiplier = 8.6;
        else if (/GTQ|Q/i.test(currStr)) multiplier = 1;
      }

      // 2. Determine Period
      let isYearly = false;
      if (perStr) {
        if (/yr|year|año|anual|annual/i.test(perStr)) isYearly = true;
      } else {
        // Fallback logic
        if (snippetHasYearly && !snippetHasMonthly) {
          isYearly = true;
        } else if (snippetHasMonthly && !snippetHasYearly) {
          isYearly = false;
        } else {
          // Mixed or neither. Guess based on magnitude.
          if (currStr && /[$]|usd/i.test(currStr)) {
            // USD values > 10,000 are usually yearly
            if (originalValue > 10000) isYearly = true;
          } else {
            // GTQ values > 100,000 are usually yearly
            if (value * multiplier > 100000) isYearly = true;
          }
        }
      }
      
      value *= multiplier;
      if (isYearly) value /= 12;

      console.log(`Match "${match[0]}" -> Base: ${originalValue}${kStr || ''} -> Currency: ${currStr || 'fallback'}, Period: ${perStr || 'fallback'} -> isYearly: ${isYearly} -> Calculated: Q${value.toFixed(2)} / month`);
      allValues.push(value);
    }
    
    if (!foundAny) {
      console.log("No numbers matched in this snippet.");
    }
  });

  console.log("\nAll extracted valid values:", allValues);

  if (allValues.length === 0) {
    console.log("--- DEBUG END: No values found, returning null ---");
    return { min: null, max: null };
  }
  
  const min = Math.round(Math.min(...allValues));
  const max = Math.round(Math.max(...allValues));

  console.log(`Final Range -> Min: Q${min}, Max: Q${max}`);
  console.log("--- DEBUG: getAggregatedMarketRange END ---");

  return { min, max };
}

export default function ResultsView({ data, onDismiss }: { data: ResultsData, onDismiss: () => void }) {
  const { formData, marketData } = data;

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

  let isRealistic = false;
  let isUnrealistic = false;
  let analysis = "";

  if (hasChart) {
    marketRangeStr = min === max ? `Q${min!.toLocaleString()}` : `Q${min!.toLocaleString()} - Q${max!.toLocaleString()}`;
    
    if (desired >= min! && desired <= max!) {
      isWithinRange = true;
      rangeStatusStr = "Dentro del rango del mercado";
      isRealistic = true;
      analysis = "El salario deseado se encuentra dentro del rango del mercado local según los datos de Glassdoor.";
    } else if (desired > max!) {
      rangeStatusStr = "Por encima del mercado";
      isUnrealistic = true;
      analysis = "El salario deseado supera el rango máximo encontrado en el mercado local.";
    } else {
      rangeStatusStr = "Por debajo del mercado";
      isRealistic = true;
      analysis = "El salario deseado está por debajo del rango del mercado, lo cual podría acelerar tu contratación.";
    }

    const lowerBound = Math.min(min!, desired, current);
    const upperBound = Math.max(max!, desired, current);
    const padding = (upperBound - lowerBound) * 0.2 || min! * 0.2;
    scaleMin = Math.max(0, lowerBound - padding);
    scaleMax = upperBound + padding;
  } else {
    // If it is not possible to calculate a range...
    if (increasePercent <= 20) {
      isRealistic = true;
      analysis = "No se encontraron datos concluyentes en Glassdoor, pero el incremento solicitado es menor o igual al 20%, lo cual se considera realista.";
    } else {
      isUnrealistic = true;
      analysis = `No se encontraron datos concluyentes en Glassdoor. Un incremento del ${increasePercent}% podría ser difícil de justificar sin un cambio significativo de responsabilidades.`;
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
                <span className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">Promedio del Mercado</span>
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

          <div className="mt-4 p-4 bg-white/80 dark:bg-black/40 rounded-xl border border-white dark:border-zinc-800 shadow-sm z-10">
            <div className="flex items-center gap-3 mb-3">
              {isRealistic ? (
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              ) : isUnrealistic ? (
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              ) : (
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <HelpCircle className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
              )}
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                ¿Expectativa realista? <span className={isRealistic ? "text-green-600 dark:text-green-400 font-bold" : isUnrealistic ? "text-orange-600 dark:text-orange-400 font-bold" : "text-zinc-600 font-bold"}>{isRealistic ? "Sí" : isUnrealistic ? "No" : "Desconocido"}</span>
              </h3>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic border-l-2 border-emerald-300 dark:border-emerald-700 pl-3 bg-emerald-50/50 dark:bg-emerald-900/10 py-1 rounded-r-md">
              "{analysis}"
            </p>
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
          
          <div className="flex-1 min-h-[400px] flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <div className="text-center flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-600 p-6">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-800">
                <FileText className="w-8 h-8 text-emerald-400 opacity-80" />
              </div>
              <p className="font-semibold text-zinc-600 dark:text-zinc-400 mt-2">La carta se generará aquí próximamente</p>
              <p className="text-sm max-w-sm leading-relaxed">
                Este espacio está reservado para mostrar la carta de presentación final.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
