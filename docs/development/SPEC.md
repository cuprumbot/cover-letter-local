# App Specification: AI Cover Letter Generator

## 1. Project Overview
A web application that generates personalized cover letters. To maximize privacy and reduce server costs, the app uses a "split-brain" architecture: sensitive user data is managed locally and never sent to any external LLM, and a server-side API (Gemini Pro) generates the polished, finished cover letter.

## 2. Target User & Inputs
The user is a job seeker wanting a fast cover letter with minimal typing. 

**Required User Inputs:**
These fields are shown by default.

- Job title (Short text) -> "Puesto al que aplicas"
- Organization (Short text) -> "Empresa"
- Years of experience (Number) -> "Años de experiencia"
- Current income (Number) -> "Salario actual"
- Desired income (Number) -> "Salario deseado"

**Optional User Inputs:**
These fields appear on a hidden panel, once you click some button with text "Más detalles" they appear.

- User name (Short text) to sign the cover letter -> "Tu nombre"
- Linkedin Profile URL (Short text, validation for URL) -> "Tu perfil de Linkedin"
- About you (Paragraph) -> "Acerca de ti"
- About the job (Paragraph) -> "Oferta laboral a la que aplicas"
- Location (Short text), prefilled with "Guatemala" by default -> "Ubicación"

## 3. The Step-by-Step User Flow
1. **Landing:** The user arrives at the site.
2. **Data Entry:** The required input fields are shown by default. The optional input fields are hidden, they show up once the user presses "Más detalles". The user fills out the form and presses a button to submit.
3. **Example Data:** There is an additional button below the submit button to fill the form with sample data. The sample data must change every time the user clicks it. This data comes from a file with some samples, use samples that make sense in Guatemala tech companies.
4. **Local Processing (Client-Side):** When the user clicks "Generar", the data is structured into a JSON payload that will be used to call Gemini API. Sensitive data such as user name, current income and desired income should never be included in this payload.
5. **Server Processing (Route Handlers):** The frontend sends the structured data and any optional data to the Next.js backend.
6. **Orchestration:** The backend concurrently:
   - Calls Serper to check Glassdoor for salaries for similar positions.
   - Calls Proxycurl (if a Linkedin URL is provided) to extract work history. 
7. **Final Generation:** The backend combines the JSON data with the Proxycurl data into a final prompt for Gemini Pro via the AI Studio SDK. This prompt should contain no private information of the user such as name or current income.
8. **Output:** Serper returns the salaries range for the position as soon as this info is available, this info is used to generate a small summary telling the user if their expectation is realistic and some interview tips about salary negotiation. Gemini Pro returns the final cover letter, which is also displayed on the user frontend, signed with their name if it was provided. A button to generate another letter is shown below.

## 4. Scope Boundaries
- **In Scope:** Simple copy-to-clipboard button, responsive mobile layout.
- **Out of Scope:** User authentication, saving cover letters to a database, PDF export.

## 5. Non-Functional Requirements
- **Security:** Proxycurl, Serper, and Gemini API keys must strictly remain in the Next.js backend.
- **User Privacy:** Personal user data, such as user name and income, should never be included in prompts sent to external services. Only summarized and formatted data should be sent. The income is only used to compare against the results from Glassdoor.