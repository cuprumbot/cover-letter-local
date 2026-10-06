Use SPEC.md to create USER_STORIES.md

Read SPEC.md. Inspect the local reference code in /ref to understand how the local model workflow is structured. Based on all these sources, generate a comprehensive USER_STORIES.md file. Break the project down into small, sequential phases starting with project initialization, then the Next.js Route Handlers, and finally UI integration. Every user story must include specific, testable acceptance criteria that strictly adhere to the privacy constraints and the Guatemala tech market context skills.



Implement from USER_STORIES.md

Execute User Story #1 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Make sure nothing from our base files gets deleted or changed when initializing the project. The only valid change for our base files is appending information.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

    Once all acceptance criteria pass, stage and commit the changes using the Conventional Commits format specified in AGENTS.md.

Only stop when User Story #1 is fully verified and committed, then report what was done.

---

Execute User Story #2 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #2 is fully verified, then report what was done.

---

Execute User Story #3 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #3 is fully verified, then report what was done.

---

Execute User Story #4 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #4 is fully verified, then report what was done.

---

Execute User Story #5 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Add prints to console to debug and verify which info is being sent to the backend.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #5 is fully verified, then report what was done.

---

Execute User Story #6 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Use `ref/serper` as reference. Those files are from a previous implementation.

    Use Serper to get information from Glassdoor about salary ranges for the role and organization.

    Add prints to console to debug and verify which info is being sent between the frontend and backend.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #6 is fully verified, then report what was done.

---

We will jump from User Story #6 directly to #9 so we can show the results from Serper.

Execute User Story #9 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Use `ref/serper` as reference. Those files are from a previous implementation.

    Use Serper to get information from Glassdoor about salary ranges for the role and organization.

    Show the result from Serper in the frontend:
    - Dismiss the form and show a panel for the salary comparison. Create a placeholder below that will later contain the cover letter.
    - Use the info from Glassdoor to calculate the range for the salary. Make sure you are displaying the info in monthly quetzales (GTQ / Q). If you find the salary in USD, or yearly, make the calculations needed. Use an exchange rate of 1 USD = 7.8 GTQ.
    - Display a simple line graph that shows the range from Glassdoor, the user's current salary and their desired salary. Also show the increase percentage.
    - Display a simple message in spanish stating if the desired salary is realistic. The salary is realistic if it is inside the range.
    - If it is not possible to calculate a range, due to incomplete or badly formatted data, indicate that the desired salary is realistic if it is at most a 20% increase over the current one.

    Add prints to console to debug and verify which info is being sent between the frontend and backend.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #9 is fully verified, then report what was done.

---

Let's go back to User Story #7.

Execute User Story #7 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    Add prints to console to debug and verify which info is being between frontend and backend.

    Print in the server console which information is being sent to Proxycurl, so we can make sure no sensitive information leaves our app.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

    Do not commit. I have to manually test the changes first.

Only stop when User Story #7 is fully verified, then report what was done.

---

Execute User Story #8 from USER_STORIES.md.

Adhere strictly to the rules in AGENTS.md and the requirements in SPEC.md. Run all necessary terminal commands to scaffold the project, set up the directory structure, install dependencies, and remove boilerplate code.

Work autonomously end-to-end:

    If a Linkedin URL was provided, add the relevant information from Enrich Layer to our prompt. Make sure no sensitive information goes in the prompt, so first remove the user name.

    Prompt Gemini so it creates a cover letter. Send it structured information from the form such as job position, company, years of experience, about you, description of the job position. Remember that personal information such as name, current salary, expected salary should never be included in the prompt.

    If a Linkedin URL was provided, add the relevant information from Enrich Layer to our prompt. Make sure no sensitive information goes in the prompt, so first remove the user name.

    The information sent in the prompt should be well-structured.

    The prompt might be in english if that improves results, but the cover letter must be in spanish.

    Add prints to console to debug and verify which info is being sent to the backend.

    Complete each step required by the story's acceptance criteria without asking for intermediate approvals.

    Run npm run build to verify there are zero build or type errors. If you hit any errors, debug and resolve them independently.

Only stop when User Story #5 is fully verified, then report what was done.

---

Based on the documentation found in `ref/generador-excusas/README.md` and using the `excalidraw-diagram` modify our `README.md` to document the project.

The documentation must be in spanish. We will generate the english version at a later time.

Make sure to include the following sections:
- Explain what the app does.
- Explain split brain. Include tables to show:
    - The local brain is code using regex to get salary information. The cloud model is Gemini to generate the cover letters.
    - The reasons for this architecture: Privacy, we don't want sensitive information to be sent to an external LLM. Latency, we can show the user the salary analysis while they wait for the cover letter.
- Explain the split brain decisions. Sensitive data such as salaries and user name are never sent to an external LLM, regex are enough to get the salary information. The user Linkedin URL is only sent to our server and retrieved using a traditional API, this URL is optional. 
- Explain the tools used.
- Leave a placeholder where we will add screenshots of the web app later.
- Architecture:
    - Generate architecture diagrams using the `excalidraw-diagram` skills. 
    - Use tables to explain what happens locally, what happens in the server, what is sent to an external LLM.
    - Explain the heuristics. Use a table to explain how the salary analysis is done locally, using the information from Serper/Glassdoor.
    - Explain where the split brain decisions are, show a snippet of code showing where do we decide what to send and what to work locally.
- APIs:
    - Explain which APIs are used and how are they used. Show snippets of code.
    - Explain how authentication work and where and how the credentials are stored.
    - Explain what happens if some API fails or works slowly.
    - Explain how much each API call costs.
Privacy:
    - Explain which data we send to each API. Show snippets of code.
Prompts:
    - Explain the prompts used to generate the cover letter using Gemini.
- Explain the project structure.
- Explain the how to configure and run the project.

You should only modify `README.md`, not any code. You can create additional files if needed for the diagrams. Do not modify any code from the project.

Do not commit any change, I will check the results first.