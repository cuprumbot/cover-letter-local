# User Stories: AI Cover Letter Generator

This document outlines the sequential phases and user stories for the AI Cover Letter Generator. All features must adhere to the split-brain architecture, privacy rules, and the Guatemala tech context guidelines.

## Phase 1: Project Setup & Initialization

### 1. Project Scaffolding
**Description**: Initialize the Next.js (App Router) project with standard Tailwind CSS to serve as the foundation for the application.
**Acceptance Criteria**:
- [x] The Next.js app is created using the App Router.
- [x] Standard Tailwind CSS is configured (no non-standard Tailwind frameworks unless requested).
- [x] Project uses `npm` for package management.
- [x] Code is cleaned of default boilerplate and set up with a simple, modern layout.
- [x] All comments and documentation are written in English.

## Phase 2: Client-side Data Entry & Local Sanitization (Local Brain)
*This phase handles all client-side logic to replicate the "Local" part of the split-brain architecture, ensuring sensitive data is isolated.*

### 2. Main Input Form (Required Fields)
**Description**: Create the main UI form with the required inputs for the cover letter.
**Acceptance Criteria**:
- [x] Form includes fields: "Puesto al que aplicas", "Empresa", "Años de experiencia", "Salario actual" (GTQ), "Salario deseado" (GTQ).
- [x] All UI labels and placeholders are in Spanish.
- [x] Currency inputs clearly indicate Quetzales (GTQ / Q).
- [x] Form has a primary submit button labeled "Generar".

### 3. Optional Details Panel
**Description**: Implement a hidden panel for optional details that expands upon user interaction.
**Acceptance Criteria**:
- [x] Include a button labeled "Más detalles" to toggle the visibility of optional fields.
- [x] Optional fields include: "Tu nombre", "Tu perfil de Linkedin" (must validate for a valid URL), "Acerca de ti", "Oferta laboral a la que aplicas", and "Ubicación".
- [x] "Ubicación" defaults to "Guatemala".

### 4. Sample Data Generator
**Description**: Add a button to populate the form with realistic sample data to speed up testing and usage.
**Acceptance Criteria**:
- [x] A button is placed below the submit button to fill the form with example data.
- [x] Clicking the button multiple times cycles through different samples.
- [x] Data reflects the Guatemala tech market (e.g., Job Titles like "Desarrollador Full Stack", "Ingeniero de Datos").
- [x] Uses real, non-generic local companies (e.g., "Telus", "Banco Industrial").
- [x] Salary samples reflect realistic local ranges in GTQ (Quetzales).
- *Note (Pending Improvement)*: The sample data companies/roles need to be refined, as some combinations are returning weird values or incomplete data from Glassdoor/Serper.

### 5. Client-Side Sanitization & Payload Structuring
**Description**: Implement the local orchestration step that prepares the data to be sent to the backend, strictly separating sensitive info.
**Acceptance Criteria**:
- [x] When the user clicks "Generar", the client builds a JSON payload for the backend.
- [x] **Privacy Constraint**: The payload *must not* include the user's name, current income, or desired income.
- [x] The payload *can* include non-sensitive fields: job title, organization, years of experience, about, job offer details, location, and LinkedIn URL.
- [x] The client state retains the sensitive data (name, incomes) exclusively for local post-processing and comparison.

## Phase 3: Server-side Orchestration (Route Handlers)
*This phase handles external API integrations securely without leaking PII.*

### 6. Serper API Route Handler (Salary Context)
**Description**: Create a Next.js Route Handler to fetch salary context from Glassdoor using the Serper API.
**Acceptance Criteria**:
- [x] Route Handler receives only the non-sensitive job title and organization.
- [x] Securely fetches data using a server-side Serper API key.
- [x] Extracts salary ranges for similar positions.
- [x] **Security**: Serper API key is never exposed to the client.

### 7. Proxycurl API Route Handler (LinkedIn History)
**Description**: Create a Next.js Route Handler to extract work history from a LinkedIn profile.
**Acceptance Criteria**:
- [ ] Route Handler receives the LinkedIn URL (if provided).
- [ ] Securely fetches the user's professional summary and experience using Proxycurl.
- [ ] **Security**: Proxycurl API key is never exposed to the client.

### 8. Gemini Pro API Route Handler (Cover Letter Generation)
**Description**: Create a Next.js Route Handler that leverages the Gemini Pro model to write the cover letter.
**Acceptance Criteria**:
- [ ] Route Handler orchestrates the final prompt using the sanitized JSON payload and (if applicable) Proxycurl data.
- [ ] Uses the Google AI Studio `@google/genai` SDK.
- [ ] **Privacy Constraint**: The prompt sent to Gemini *strictly excludes* the user's name and current income.
- [ ] Instructs the model (prompt can be in English for better reasoning) to output the final cover letter in Spanish.
- [ ] **Security**: Gemini API key is never exposed to the client.

## Phase 4: Integration & UI Polish

### 9. Salary Expectation Summary (Local Comparison)
**Description**: Compare the user's local income data against the Serper results and display a localized summary.
**Acceptance Criteria**:
- [x] The frontend receives the salary range from the Serper Route Handler as soon as it's available.
- [x] **Privacy Constraint**: The client-side (traditional code/regex) compares the locally held "Salario deseado" and "Salario actual" against the fetched range.
- [x] Displays a short summary in Spanish assessing if the expectation is realistic, along with interview negotiation tips.

### 10. Display Final Cover Letter & Actions
**Description**: Present the final generated cover letter to the user with finishing touches.
**Acceptance Criteria**:
- [ ] The cover letter from Gemini is displayed on the UI.
- [ ] **Deanonymization/Signature**: If the user provided "Tu nombre", the client appends/signs the letter with the name locally.
- [ ] Include a simple "Copy to Clipboard" button.
- [ ] Include a button below the letter to generate another one (reset form/state).
- [ ] The design is simple, modern, mobile-responsive, uses standard Tailwind CSS, and uses simple SVG icons (no emojis).
