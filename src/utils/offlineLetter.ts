export function getOfflineCoverLetter(jobTitle: string, company: string): string {
  return `Estimado equipo de selección en ${company || "[Nombre de la Empresa]"},

Me dirijo a ustedes con gran entusiasmo para presentar mi candidatura al puesto de ${jobTitle || "[Puesto al que aplicas]"}. Durante mi trayectoria profesional, he desarrollado habilidades que considero encajan perfectamente con lo que su empresa busca.

He seguido de cerca el impacto y el crecimiento de ${company || "su organización"}, y me encantaría tener la oportunidad de aportar mi experiencia y dedicación a su equipo. Estoy seguro/a de que mi perfil puede contribuir significativamente a alcanzar los objetivos del departamento.`;
}
