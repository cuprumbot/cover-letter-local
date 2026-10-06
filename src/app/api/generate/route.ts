import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Log the received information on the server's console
    console.log("----------------------------------------");
    console.log("SERVER (/api/generate): Received payload from frontend:");
    console.log(payload);
    console.log("----------------------------------------");

    // Destructure payload
    const {
      jobTitle,
      company,
      experienceYears,
      aboutYou,
      jobOffer,
      linkedinData
    } = payload;

    // Sanitize linkedinData to ensure no names or PII are passed to the prompt
    let sanitizedLinkedinData = null;
    if (linkedinData) {
      // Create a deep copy to avoid mutating original
      sanitizedLinkedinData = JSON.parse(JSON.stringify(linkedinData));

      // We know Enrich Layer returns summary and experiences. 
      // If there's any 'name' field, delete it.
      if (sanitizedLinkedinData.name) {
        delete sanitizedLinkedinData.name;
      }
      if (sanitizedLinkedinData.first_name) {
        delete sanitizedLinkedinData.first_name;
      }
      if (sanitizedLinkedinData.last_name) {
        delete sanitizedLinkedinData.last_name;
      }
    }

    console.log("----------------------------------------");
    console.log("SERVER (/api/generate): PREPARING PROMPT FOR GEMINI");
    console.log("No sensitive PII (Name, Salaries) should be in this data.");
    console.log("----------------------------------------");

    const prompt = `
You are an expert career coach and copywriter. Your task is to write a highly compelling, professional, and modern cover letter for a candidate.

**IMPORTANT RULES:**
1. The output MUST be entirely in SPANISH.
2. DO NOT include the candidate's name or any placeholder for a signature at the end. The application will handle the name locally.
3. Be persuasive, highlighting the candidate's value based on the provided information.
4. Keep it concise (3-4 short paragraphs). No fluff.

**CANDIDATE INFORMATION:**
- Target Role: ${jobTitle || "Not specified"}
- Target Company: ${company || "Not specified"}
- Years of Experience: ${experienceYears || "Not specified"}
- Candidate's Self Summary: ${aboutYou || "Not specified"}

**JOB OFFER DESCRIPTION (IF ANY):**
${jobOffer || "No description provided. Write a general cover letter for the role."}

**LINKEDIN WORK HISTORY (IF ANY):**
${sanitizedLinkedinData ? JSON.stringify(sanitizedLinkedinData, null, 2) : "No LinkedIn history provided."}

Please write the cover letter now in Spanish.
`;

    console.log("--- PROMPT BEING SENT TO GEMINI ---");
    console.log(prompt);
    console.log("-----------------------------------");

    // Initialize Gemini AI
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning a mock cover letter.");
      return NextResponse.json({
        success: true,
        letter: "Estimado equipo de contratación,\n\nEscribo para expresar mi gran interés en la posición. (MOCK LETTER - GEMINI API KEY MISSING)"
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const generatedText = response.text;

    return NextResponse.json({
      success: true,
      letter: generatedText
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
