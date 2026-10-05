---
name: privacy-data-auditor
description: Audit data payloads and Next.js Route Handlers to ensure no PII (like user name or income) is sent to external APIs. Use whenever the user asks to write or modify API routes, external fetches, or the WebGPU payload.
---
# Privacy & Data Sanitization Auditor

## When to Use
Trigger this skill whenever you are writing code that handles the user's data payload or makes a network request to Gemini, Serper, or Proxycurl.

## Rules & Steps
1. **Verify Backend Isolation:** Ensure Proxycurl, Serper, and Gemini API keys strictly remain in the Next.js backend and are never exposed to the client.
2. **Payload Sanitization:** When structuring the JSON payload, explicitly verify that personal user data (name, current income) is excluded.
3. **Prompt Sanitization:** Ensure the final prompt sent to Gemini Pro contains no private information of the user. 
4. **Income Usage:** The income must only be used locally to compare against Glassdoor results for the salary brief.