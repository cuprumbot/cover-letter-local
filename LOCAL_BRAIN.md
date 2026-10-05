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

### 5. Aggregation & Priority Filtering
Because Glassdoor data sometimes mixes converted USD approximations with exact GTQ local data (and USD ranges often skew higher or lower than true local ranges), the algorithm places the parsed values into separate buckets based on their origin:
- `gtqValues`
- `usdValues`
- `otherValues`

**Filtering Logic:**
1. If we find *any* explicit `gtqValues` (length $\ge$ 1), the algorithm will **discard** all USD/Other data and form the range exclusively using the pure GTQ local data.
2. If no GTQ data is found, it falls back to the calculated `usdValues`.
3. If neither is found, it falls back to `otherValues` (like EUR).

This yields the final, most accurate normalized monthly Quetzales (GTQ) amounts, which are then aggregated to find the min and max range.

## Negotiation Logic & Private Note
Once the final range is established (or if no range could be formed), the `ResultsView` calculates the user's position relative to this range to provide a private "Nota Privada de Negociación". This note provides actionable advice on when and how to mention their desired salary during interviews.

Here is the logic matrix used:

| Condición (Ubicación en el Rango) | Análisis (¿Expectativa realista?) | Tip de Negociación (Nota Privada) |
| :--- | :--- | :--- |
| **Muy por debajo**<br>`deseado < min * 0.8` | Expectativa muy por debajo del mínimo que suele pagar la empresa. *(Realista pero perjudicial)* | No menciones el salario hasta que te pregunten. Podrías estar dejando dinero en la mesa; pide al menos el mínimo del rango. |
| **Por debajo + Gran Aumento**<br>`deseado < min` &<br>`aumento >= 30%` | Por debajo de la empresa, pero representa un excelente aumento (+X%) para ti. *(Realista)* | Eres un candidato muy atractivo económicamente. Puedes dar tu número temprano; es probable que lo acepten rápido y tú ganas un gran aumento. |
| **Por debajo**<br>`deseado < min` &<br>`aumento < 30%` | Tu expectativa es modesta y está por debajo del rango de la empresa. *(Realista)* | Esto podría acelerar tu contratación. No te adelantes a dar un número; deja que ellos hagan la primera oferta, ¡podrían ofrecerte más! |
| **Parte Baja**<br>`min <= deseado < min + (span/3)` | Expectativa realista. Te sitúas en la parte baja del rango de la empresa. *(Realista)* | Tienes una posición segura. Si preguntan, da este número con confianza desde la primera entrevista. |
| **Parte Media**<br>`min+(span/3) <= deseado <= max-(span/3)` | Expectativa muy realista, justo en el promedio de lo que paga la empresa. *(Realista)* | Es un excelente punto medio. Da este número cuando pregunten, demostrando que conoces el valor del rol en la empresa. |
| **Parte Alta**<br>`max-(span/3) < deseado <= max` | Expectativa realista pero en la parte alta del rango de la empresa. *(Realista)* | Muestra tu valor primero. Espera a la segunda entrevista o cuando estén claramente interesados en ti antes de hablar de números. |
| **Ligeramente por encima**<br>`max < deseado <= max * 1.2` | Tu expectativa supera levemente el límite máximo detectado para la empresa. *(Poco realista)* | No menciones el salario inicial. Enamóralos con tu experiencia primero; deberás justificar por qué aportas más valor que un candidato promedio. |
| **Muy por encima**<br>`deseado > max * 1.2` | Expectativa poco realista. Está significativamente por encima de lo que la empresa suele pagar. *(Poco realista)* | Sé muy cauteloso. Considera negociar beneficios (bonos, vacaciones) si no llegan a tu número. Deja el salario para la etapa final. |

*(Nota: `span` se refiere a la diferencia entre el máximo y el mínimo: `max - min`)*

### Fallback (Sin datos suficientes)
Si el algoritmo no logra extraer un rango válido de Glassdoor, se evalúa únicamente el incremento porcentual respecto a su salario actual:

| Condición | Análisis | Tip de Negociación |
| :--- | :--- | :--- |
| **Aumento $\le$ 20%** | Sin datos de la empresa, pero el incremento del X% es razonable. *(Realista)* | Puedes mencionar tu expectativa con tranquilidad, es un salto natural en tu carrera. |
| **Aumento > 20%** | Sin datos de la empresa, y el incremento del X% es ambicioso. *(Poco realista)* | Evita dar un número primero. Espera a entender bien las responsabilidades y demuestra tu experiencia para justificar este salto salarial. |
