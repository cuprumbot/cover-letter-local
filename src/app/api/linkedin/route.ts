import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Log the received information on the server's console
    console.log("----------------------------------------");
    console.log("SERVER (/api/linkedin): Received payload from frontend:");
    console.log(payload);
    console.log("----------------------------------------");

    const linkedinUrl = payload.linkedin;

    if (!linkedinUrl) {
      return NextResponse.json({
        success: false,
        message: "No LinkedIn URL provided"
      }, { status: 400 });
    }

    console.log("----------------------------------------");
    console.log("SERVER (/api/linkedin): CALLING ENRICH LAYER API");
    console.log("Information being sent to Enrich Layer (URL only):", linkedinUrl);
    console.log("----------------------------------------");



    let linkedinData = null;

    try {
      if (process.env.PROXYCURL_API_KEY) {
        const response = await fetch(`https://enrichlayer.com/api/v2/profile?profile_url=${encodeURIComponent(linkedinUrl)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.PROXYCURL_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Enrich Layer API error: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();

        // Extract relevant work history and summary
        linkedinData = {
          summary: data.summary || data.headline || "",
          experiences: data.experiences ? data.experiences.map((exp: any) => ({
            title: exp.title,
            company: exp.company,
            description: exp.description,
            starts_at: exp.starts_at,
            ends_at: exp.ends_at
          })) : []
        };
      } else {
        console.warn("PROXYCURL_API_KEY is not set. Returning mock LinkedIn data for development.");
        linkedinData = {
          summary: "Mock LinkedIn Summary: Desarrollador de software experimentado.",
          experiences: [
            {
              title: "Senior Developer",
              company: "Mock Company",
              description: "Developed various scalable applications.",
              starts_at: { year: 2020, month: 1, day: 1 },
              ends_at: null
            }
          ]
        };
      }
    } catch (apiError) {
      console.error("Error calling Enrich Layer:", apiError);
      linkedinData = { error: "Failed to fetch data from Enrich Layer" };
    }

    console.log("----------------------------------------");
    console.log("SERVER (/api/linkedin): INFORMATION RECEIVED FROM ENRICH LAYER (Processed):");
    console.log(JSON.stringify(linkedinData, null, 2));
    console.log("----------------------------------------");

    return NextResponse.json({
      success: true,
      message: "LinkedIn data fetched successfully via Enrich Layer",
      linkedinData
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
