# Base Salary Parsing Algorithm

This document explains how the `getAggregatedMarketRange` function inside `ResultsView.tsx` works to parse raw text snippets returned by the Serper/Glassdoor search.

## The Challenge
The Glassdoor data comes back as unstructured text snippets. These snippets often contain:
- Multiple numbers with different currencies (e.g., USD `$`, `GTQ`).
- Multiple numbers with different time periods (e.g., `per year`, `/mo`).
- A mix of both in the exact same sentence, for example: `"The average salary for an Ingeniero is $20333 per year in Guatemala. Total pay range GTQ 13K - GTQ 25K/mo."`

A simple global check like `if (str.includes("year")) isYearly = true` fails here because the snippet is mixed, causing the GTQ numbers to be erroneously treated as yearly numbers and divided by 12.

## The Regex
To solve this, we extract context *around* the numbers using a capture group regex:

```javascript
const regex = /(?:([$€]|USD|EUR|GTQ|Q)\s*)?([\d.,]+)([kK]?)(?:\s*(?:\/|per|por|a\s+un|al)\s*(mo|month|mes|yr|year|año|anual|annual))?/gi;
```

### Capture Groups:
1. **Currency (`Group 1`)**: Looks for symbols (`$`, `€`, `Q`) or text (`USD`, `EUR`, `GTQ`) before the number. If missing, this group is `undefined`.
2. **Amount (`Group 2`)**: The core number (e.g., `13`, `20.5`, `25,000`).
3. **K Modifier (`Group 3`)**: Looks for `k` or `K` directly after the number to indicate thousands (e.g., `13K`).
4. **Period (`Group 4`)**: Looks for slashes or prepositions (`/`, `per`, `por`) followed by a time unit (`mo`, `year`, `año`). If missing, it's `undefined`.

## The Calculations & Fallback Logic

When iterating over all regex matches within a snippet, the algorithm applies the following logic:

### 1. Cleaning the Number
- Commas are removed (`20,333` -> `20333`).
- If the `K` modifier is captured (Group 3), the value is multiplied by 1,000.
- Values under `100` are discarded to filter out noise (like ratings or sample sizes).

### 2. Determining the Currency Multiplier
- **Explicit Match**: If Group 1 explicitly caught `$` or `USD`, we multiply by `7.8`. If it caught `€`, we multiply by `8.6`. If `GTQ` or `Q`, the multiplier is `1`.
- **Fallback**: If no explicit currency was attached to *this specific number*, we look at the entire snippet context. If the snippet mentions `$` or `USD` somewhere, we assume the unlabelled number is USD and multiply by `7.8`.

### 3. Determining the Time Period (Yearly vs Monthly)
- **Explicit Match**: If Group 4 explicitly caught a year keyword (`yr`, `year`, `año`), we set `isYearly = true`. If it caught a month keyword, `isYearly = false`.
- **Contextual Fallback**: If no explicit period is attached to the number:
  - If the overall snippet mentions *only* yearly keywords and no monthly keywords, we assume it's yearly.
  - If the overall snippet mentions *only* monthly keywords, we assume it's monthly.
  - **Magnitude Guessing (Mixed Context)**: If the snippet has *both* yearly and monthly keywords, we guess based on the value's magnitude:
    - If the number is marked as USD and `> 10,000`, it's almost certainly yearly.
    - If the number is marked as GTQ and `> 100,000`, it's almost certainly yearly.
    - Otherwise, default to monthly.

### 4. Final Adjustment
- Once the base value, multiplier, and time period are determined:
  - `value = value * multiplier`
  - `if (isYearly) value = value / 12`

This yields normalized monthly Quetzales (GTQ) amounts, which are then aggregated to find the min and max range.
