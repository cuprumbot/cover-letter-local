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