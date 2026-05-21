# Proposed Tool Ideas for Stotina.com

Below is a short description of each tool the user selected.  All of them are intended to be **client‑side only**, built as a single‑file Vue component (or a small helper module) and require no external APIs or large dependencies.

---

## 1. Lorem Ipsum Generator
Generates placeholder text.  The user can choose the number of paragraphs, sentences per paragraph, or words per sentence.  Implementation uses a static array of common Lorem‑Ipsum words and simple random selection.  UI includes a textarea showing the result and a **Copy** button.

---

## 2. Color Palette Generator
Allows the user to input a base colour (hex, rgb, or hsl) and automatically creates a harmonious palette (e.g., complementary, analogous, triadic).  The component displays colour swatches with their hex values and a **Copy** button for each.  The colour math is done with native JavaScript; no heavy colour‑library is needed.

---

## 3. CRON Schedule Parser & Construction Tool
Parses a CRON expression into a human‑readable description (e.g., “Every Monday at 14:30”) and also lets the user build a CRON string by selecting values from dropdowns for minute, hour, day‑of‑month, month, and day‑of‑week.  The parser follows the standard 5‑field syntax and is implemented with a few regular‑expression rules.

---

## 4. QR Code Generator (Canvas)
Renders a QR code for any text or URL using a tiny pure‑JS algorithm (e.g., the `qrious` library, ~5 KB) or a custom implementation based on the QR‑Code specification.  The QR code is drawn on an HTML `<canvas>` element, and the user can download it as a PNG.

---

## 5. CSV / JSON / YAML Converter
Accepts data in CSV / JSON / YAML format, converts it to a CSV / JSON / YAML result. User can select input and output types of will.
If input cannot be visualized as the output type (example: non-array JSON as CSV) an appropriate error message is shown instead.

---

## 6. Simple Stopwatch / Timer
Provides start, stop, reset and lap functionality.  The elapsed time is displayed with millisecond precision.  Laps are listed below the timer and can be copied.  Implementation uses `setInterval` and Vue reactive state.

---

## 7. Text Diff Viewer
Shows a side‑by‑side diff of two text inputs.  A lightweight line‑based diff algorithm (Myers) is implemented in ~100 lines of JavaScript.  Added/removed lines are highlighted with green/red backgrounds respectively.

---

## 8. JsonPath Visualizer Tool
Allows the user to type a JSONPath expression and see the matching nodes highlighted in a formatted JSON view.  The component parses the JSON with `JSON.parse`, evaluates the JsonPath using a small handcrafted evaluator (supporting `$.store.book[*].author`‑style queries), and highlights results.

---

All of these tools fit the project’s constraints:

* **No backend** – everything runs in the browser.
* **Minimal dependencies** – only native APIs or very small helper libraries.
* **Consistent UI** – reuse the existing Tailwind‑based styling and the `ToolListElement` navigation pattern.
