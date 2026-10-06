"use client";

import { useState } from "react";
import CoverLetterForm from "@/components/CoverLetterForm";
import ResultsView, { ResultsData } from "@/components/ResultsView";

export default function Home() {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <main className="relative max-w-5xl mx-auto p-6 pt-16 pb-24 md:p-12 md:pt-24 z-10">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Generador de Cartas de Presentación
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl">
            Proporciona tu experiencia y los detalles de la oferta. Obtendrás una carta persuasiva y un análisis salarial diseñado para el mercado local, protegiendo tu privacidad.
          </p>
        </div>

        {resultsData ? (
          <ResultsView data={resultsData} onDismiss={() => setResultsData(null)} />
        ) : (
          <CoverLetterForm onSubmitSuccess={(data) => setResultsData(data)} />
        )}
      </main>
    </div>
  );
}
