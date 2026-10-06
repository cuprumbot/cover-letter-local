# Architecture Diagram: Split Brain Cover Letter Generator

The application uses a "Split Brain" architecture to handle sensitive user data securely while leveraging powerful external LLMs.

## Components

1. **Client (Browser / Local Brain)**
   - Technology: Next.js Frontend (React)
   - Responsibility: Captures user input (LinkedIn URL, salary information, target job), sends a sanitized payload to the server. Afterwards it receives Serper/Glassdoor information from the server and uses regex heuristics to extract salary information and analyze the results. Finally, it receives a personalized cover letter and displays it to the user.

2. **Server (Next.js API Routes)**
   - Technology: Next.js Route Handlers
   - Responsibility: Acts as a secure orchestrator. Injects API keys and proxies requests to external services to ensure client-side code never exposes secrets.

3. **Cloud APIs (External Services)**
   - **Serper API:** Fetches salary ranges via Google Search.
   - **Proxycurl API:** Extracts professional experience from LinkedIn profiles and adds it to the sanitized payload.
   - **Google Gemini Pro:** Generates the cover letter using sanitized payloads.

## Connections (Data Flow)

- **Client:** User interface with a form to capture user input.
- **Client -> Server:** Sends sanitized profile URL and job context information.
- **Server -> Serper:** Fetches salary ranges via Google Search.
- **Serper -> Server:** Returns raw salary information.
- **Server -> Client:** Returns the salary information to the browser.
- **Client:** Using regex heuristics extracts the salaries and analyzes the results.
- **Server -> Proxycurl:** Fetches job experience information from Linkedin.
- **Proxycurl -> Server:** Returns raw job experience information.
- **Server -> Gemini Pro:** Sends sanitized context to generate the letter. The user name and salary is never included in this prompt.
- **Gemini Pro -> Server:** Returns the generated letter.
- **Server -> Client:** Returns the cover letter to the browser.
- **Client:** Restores the user name in the cover letter locally before displaying.
