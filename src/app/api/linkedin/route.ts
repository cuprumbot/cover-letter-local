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

    // --- TEMPORARY CHEAT FOR LOCAL MODEL DEBUGGING (TODO: REMOVE LATER) ---
    if (linkedinUrl && linkedinUrl.includes("christian-andres-brolo-torre")) {
      console.log("Using hardcoded LinkedIn data for Christian Brolo to save Enrich Layer credits.");
      return NextResponse.json({
        success: true,
        message: "LinkedIn data fetched successfully via Enrich Layer",
        linkedinData: {
          "summary": "Serious, responsible, proactive, direct to the point, organized, adaptable, likes to hear others opinions, reserved and quiet.<br> ",
          "experiences": [
            {
              "title": "QA Test Engineer",
              "company": "Cognits",
              "description": null,
              "starts_at": {
                "day": 1,
                "month": 11,
                "year": 2018
              },
              "ends_at": null
            },
            {
              "title": "QA Automation Engineer",
              "company": "Xik'",
              "description": null,
              "starts_at": {
                "day": 1,
                "month": 2,
                "year": 2016
              },
              "ends_at": {
                "day": 1,
                "month": 2,
                "year": 2018
              }
            },
            {
              "title": "Data Analysis Consultant",
              "company": "Capital Valley Tech",
              "description": null,
              "starts_at": {
                "day": 1,
                "month": 1,
                "year": 2017
              },
              "ends_at": {
                "day": 1,
                "month": 12,
                "year": 2017
              }
            },
            {
              "title": "Class assistant",
              "company": "Universidad Galileo",
              "description": "Class assistant at the following subjects: Applied methods I in four classes First Order differential equations in seven classes Linear Algebra I in one class Linear Algebra II in one class Math 208 in one class Math 308 in four classes Math III in two classes Math IV in three classes Math VI in one class",
              "starts_at": {
                "day": 1,
                "month": 10,
                "year": 2012
              },
              "ends_at": {
                "day": 1,
                "month": 11,
                "year": 2015
              }
            }
          ]
        }
      });
    }
    // --- END TEMPORARY CHEAT ---

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
