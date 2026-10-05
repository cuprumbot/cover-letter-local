import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log the received information on the server's console
    console.log("----------------------------------------");
    console.log("SERVER: Received payload from frontend:");
    console.log(payload);
    console.log("----------------------------------------");

    // Prepare information to send to Serper API
    // Note: The payload contains 'company' rather than 'organization'
    const query = `glassdoor salary ${payload.jobTitle} ${payload.company} ${payload.location || 'Guatemala'}`;
    
    console.log("----------------------------------------");
    console.log("SERVER: CALLING SERPER API");
    console.log("Information being sent to Serper:", JSON.stringify({ q: query }, null, 2));
    console.log("----------------------------------------");

    let serperData = null;

    // --- TEMPORARY CHEAT FOR LOCAL MODEL DEBUGGING (TODO: REMOVE LATER) ---
    if (payload.company && payload.company.toLowerCase().includes("telus")) {
      console.log("Using hardcoded Telus data to save Serper credits.");
      return NextResponse.json({
        success: true,
        message: "Payload received securely",
        serperData: [
          {
            title: "TELUS Digital Full Stack Developer Salaries ...",
            snippet: "The salary starts at $120,414 per year (estimate) and goes up to $284,740 per year (estimate) for the highest level of seniority. How much does ...",
            link: "https://www.glassdoor.com/Salary/TELUS-Digital-Full-Stack-Developer-Salaries-E2841163_D_KO14,34.htm"
          },
          {
            title: "TELUS Digital Salaries in Guatemala City",
            snippet: "Full Stack Developer. 6 Salaries submitted. GTQ 20K - GTQ 27K /mo. Fullstack ... The average TELUS Digital salary in Guatemala City can vary greatly by role.",
            link: "https://www.glassdoor.com/Salary/TELUS-Digital-Guatemala-City-Salaries-EI_IE2841163.0,13_IL.14,28_IC4358305.htm"
          },
          {
            title: "TELUS Digital Salaries in Guatemala City",
            snippet: "Full Stack Developer. 6 Salaries submitted. GTQ 240K - GTQ 323K /yr. Fullstack ... The average TELUS Digital salary in Guatemala City can vary greatly by role.",
            link: "https://www.glassdoor.com/Salary/TELUS-Digital-Guatemala-City-Salaries-EI_IE2841163.0,13_IL.14,28_IC4358305.htm?payPeriod=ANNUAL"
          }
        ]
      });
    }
    // --- END TEMPORARY CHEAT ---

    try {
      if (process.env.SERPER_API_KEY) {
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: query }),
        });
        
        if (!response.ok) {
          throw new Error(`Serper API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract the snippets from the organic results
        if (data.organic && data.organic.length > 0) {
          // Take up to top 3 snippets
          serperData = data.organic.slice(0, 3).map((result: any) => ({
            title: result.title,
            snippet: result.snippet,
            link: result.link
          }));
        } else {
          serperData = []; // No results found
        }
      } else {
        console.warn("SERPER_API_KEY is not set. Returning mock Serper data for development.");
        serperData = [
          { 
            title: `Salaries for ${payload.jobTitle} at ${payload.company}`,
            snippet: `The estimated total pay for a ${payload.jobTitle} is Q15,000 per month in the ${payload.location || 'Guatemala'} area.`,
            link: "https://www.glassdoor.com/mock"
          }
        ];
      }
    } catch (serperError) {
      console.error("Error calling Serper:", serperError);
      serperData = { error: "Failed to fetch salary data from Serper" };
    }

    console.log("----------------------------------------");
    console.log("SERVER: INFORMATION RECEIVED FROM SERPER:");
    console.log(JSON.stringify(serperData, null, 2));
    console.log("----------------------------------------");

    return NextResponse.json({ 
      success: true, 
      message: "Payload received securely",
      serperData
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
