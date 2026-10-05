"use client";

import { useState } from "react";
import { Sparkles, Briefcase, Building2, Clock, User, Link, MapPin, AlignLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function CoverLetterForm() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    experienceYears: "",
    currentSalary: "",
    desiredSalary: "",
    name: "",
    linkedin: "",
    aboutYou: "",
    jobOffer: "",
    location: "Guatemala",
  });

  const [showOptional, setShowOptional] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);

  const sampleData = [
    {
      jobTitle: "Desarrollador Full Stack",
      company: "Telus International",
      experienceYears: "4",
      currentSalary: "18000",
      desiredSalary: "22000",
      name: "Carlos Mendoza",
      linkedin: "https://linkedin.com/in/carlosmendoza-gt",
      aboutYou: "Desarrollador Full Stack con experiencia en React y Node.js. Apasionado por crear interfaces rápidas y escalables.",
      jobOffer: "Buscamos un desarrollador Full Stack con 3+ años de experiencia. Conocimientos en AWS y bases de datos NoSQL son un plus.",
      location: "Ciudad de Guatemala",
    },
    {
      jobTitle: "Ingeniero de Datos",
      company: "Banco Industrial",
      experienceYears: "5",
      currentSalary: "20000",
      desiredSalary: "25000",
      name: "Ana Sofía Barrios",
      linkedin: "https://linkedin.com/in/anabarrios-data",
      aboutYou: "Ingeniera de datos especializada en pipelines ETL con Python y Spark. Experiencia optimizando consultas complejas.",
      jobOffer: "Se requiere Ingeniero de Datos senior para liderar la migración hacia arquitecturas basadas en nube. Fuertes habilidades en SQL y Big Data.",
      location: "Guatemala",
    },
    {
      jobTitle: "Desarrollador Frontend",
      company: "Cervecería Ambev Guatemala",
      experienceYears: "2",
      currentSalary: "12000",
      desiredSalary: "16000",
      name: "Luis Castillo",
      linkedin: "https://linkedin.com/in/lcastillo-front",
      aboutYou: "Especialista en React y Tailwind CSS, enfocado en accesibilidad y diseño responsivo con experiencia en metodologías ágiles.",
      jobOffer: "Posición para desarrollador Frontend enfocado en e-commerce. Experiencia con Next.js y Vercel es altamente valorada.",
      location: "Guatemala",
    }
  ];

  const handleFillSample = () => {
    setFormData(sampleData[sampleIndex]);
    setSampleIndex((prev) => (prev + 1) % sampleData.length);
    setShowOptional(true); // Expande para que se vean todos los datos
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Privacy Constraint: Sanitize the payload.
    // Must NOT include name, currentSalary, or desiredSalary.
    const safePayload = {
      jobTitle: formData.jobTitle,
      company: formData.company,
      experienceYears: formData.experienceYears,
      aboutYou: formData.aboutYou,
      jobOffer: formData.jobOffer,
      location: formData.location,
      linkedin: formData.linkedin,
    };

    // Sensitive data remains strictly on the client
    const sensitiveLocalData = {
      name: formData.name,
      currentSalary: formData.currentSalary,
      desiredSalary: formData.desiredSalary,
    };

    console.log("--- START: Payload Verification ---");
    console.log("📡 CLIENT: Sending safe payload to backend:", safePayload);
    console.log("🔒 CLIENT: Data kept ONLY locally:", sensitiveLocalData);
    console.log("--- END: Payload Verification ---");

    setIsLoading(true);
    try {
      const response = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePayload),
      });

      const data = await response.json();
      console.log("📥 CLIENT: Received response from backend:", data);
      
    } catch (error) {
      console.error("❌ CLIENT: Error calling backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 shadow-2xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-zinc-800/50 transition-all duration-300 hover:shadow-emerald-500/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Job Title */}
        <div className="space-y-2 group">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
            Puesto al que aplicas
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
              <Briefcase size={18} />
            </div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Ej. Desarrollador Full Stack"
              className="block w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-2 group">
          <label htmlFor="company" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
            Empresa
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
              <Building2 size={18} />
            </div>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Ej. Telus International"
              className="block w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-2 group">
          <label htmlFor="experienceYears" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
            Años de experiencia
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
              <Clock size={18} />
            </div>
            <input
              type="number"
              id="experienceYears"
              name="experienceYears"
              min="0"
              step="0.5"
              required
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="Ej. 3"
              className="block w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Salaries Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Salary */}
          <div className="space-y-2 group">
            <label htmlFor="currentSalary" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
              Salario actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-semibold text-zinc-400 group-focus-within:text-emerald-500">
                Q
              </div>
              <input
                type="number"
                id="currentSalary"
                name="currentSalary"
                min="0"
                required
                value={formData.currentSalary}
                onChange={handleChange}
                placeholder="0.00"
                className="block w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-400">
                GTQ
              </div>
            </div>
          </div>

          {/* Desired Salary */}
          <div className="space-y-2 group">
            <label htmlFor="desiredSalary" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
              Salario deseado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-semibold text-zinc-400 group-focus-within:text-emerald-500">
                Q
              </div>
              <input
                type="number"
                id="desiredSalary"
                name="desiredSalary"
                min="0"
                required
                value={formData.desiredSalary}
                onChange={handleChange}
                placeholder="0.00"
                className="block w-full pl-10 pr-12 py-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-400">
                GTQ
              </div>
            </div>
          </div>
        </div>

        {/* Optional Details Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
          >
            {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>Más detalles</span>
          </button>
        </div>

        {/* Optional Fields Panel */}
        <div className={`space-y-6 overflow-hidden transition-all duration-500 ease-in-out ${showOptional ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0 m-0'}`}>
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-6">
            
            {/* Name */}
            <div className="space-y-2 group">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                Tu nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2 group">
              <label htmlFor="linkedin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                Tu perfil de Linkedin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
                  <Link size={18} />
                </div>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/tu-perfil"
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2 group">
              <label htmlFor="location" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                Ubicación
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Guatemala"
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* About You */}
            <div className="space-y-2 group">
              <label htmlFor="aboutYou" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                Acerca de ti
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
                  <AlignLeft size={18} />
                </div>
                <textarea
                  id="aboutYou"
                  name="aboutYou"
                  rows={3}
                  value={formData.aboutYou}
                  onChange={handleChange}
                  placeholder="Breve descripción de tus habilidades o logros principales..."
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>
            </div>

            {/* Job Offer Details */}
            <div className="space-y-2 group">
              <label htmlFor="jobOffer" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400">
                Oferta laboral a la que aplicas
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-zinc-400 group-focus-within:text-emerald-500">
                  <FileText size={18} />
                </div>
                <textarea
                  id="jobOffer"
                  name="jobOffer"
                  rows={3}
                  value={formData.jobOffer}
                  onChange={handleChange}
                  placeholder="Pega aquí los requisitos o descripción del puesto si la tienes..."
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full relative group overflow-hidden rounded-xl bg-zinc-900 dark:bg-white px-8 py-4 text-white dark:text-zinc-900 font-medium transition-all duration-300 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl'}`}
          >
            {!isLoading && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
            <div className="relative flex items-center justify-center gap-2">
              <Sparkles size={20} className={isLoading ? "animate-spin" : "group-hover:animate-pulse"} />
              <span>{isLoading ? "Generando..." : "Generar"}</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={handleFillSample}
            className="w-full py-3 px-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 active:scale-[0.98]"
          >
            Llenar con datos de prueba
          </button>
        </div>
      </form>
    </div>
  );
}
