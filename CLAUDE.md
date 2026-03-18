# eder

## Project Description
The user describes a piece of furniture in natural language. The LLM interprets the
description and returns JavaScript Canvas drawing code that renders the furniture
as a simple 2D illustration.

## Stack
- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript
- Vite
- Ollama locally via `http://localhost:11434` (model: mistral)
- Anthropic SDK to be added later only in `useLLM.js` (for production/Netlify)
- HTML Canvas for rendering
- No CSS framework, no UI library
- CSS Reset: Andy Bell's Modern CSS Reset (`npm install @csstools/normalize.css`)

## Project Structure
```
src/
├── components/
│   ├── PromptInput.vue      # Text input for the furniture description
│   └── FurnitureCanvas.vue  # Canvas component for rendering
├── composables/
│   └── useLLM.js            # Wrapper function askLLM() – Ollama or Anthropic
├── App.vue
└── main.js
```

## LLM Abstraction (important!)
All LLM communication runs through a single function in `useLLM.js`:

```js
export async function askLLM(prompt) {
  // Local: Ollama
  // Later for production: Anthropic SDK or Netlify Function
}
```

This function must be built so that only this one file needs to be updated
to switch from Ollama to the Anthropic SDK.

## Ollama Configuration (local)
- Base URL: `http://localhost:11434/api/chat`
- Model: `mistral`
- No API key required

## LLM Prompt Strategy
The system prompt instructs Claude/Mistral to return **only** executable
JavaScript Canvas code — no Markdown, no explanations, no backtick fencing.
Only raw JS code that draws on a `<canvas>` element with a 2D context (`ctx`).

Example system prompt:
```
You are a drawing assistant. When the user describes a piece of furniture, you respond
exclusively with executable JavaScript code for an HTML Canvas 2D context.
The variable `ctx` is already available. Canvas size: 600x400px.
No Markdown, no explanations, only raw JS code.
```

## Canvas Rendering
- The returned JS code is executed via `new Function('ctx', code)(ctx)`
- Before each new render: clear the canvas with `ctx.clearRect(0, 0, 600, 400)`
- Errors during code execution must be shown in the UI (try/catch)

## UI Flow
1. User enters a description (e.g. "A round wooden table with four legs")
2. Button "Draw" → `askLLM()` is called
3. Loading indicator while the request is in progress
4. Canvas renders the result
5. Error message if the LLM returns no valid code

## CSS Reset
Install Andy Bell's Modern CSS Reset and import it first in `main.js`:

```js
// main.js – import order
import '@csstools/normalize.css'   // 1. CSS Reset
import './assets/main.css'         // 2. Custom styles
import { createApp } from 'vue'    // 3. Vue
import App from './App.vue'        // 4. Root component

createApp(App).mount('#app')
```

## Commands
- `npm run dev` – Start dev server (Vite)
- `npm run build` – Production build
- `npm run format` – Format code (Biome)
- `npm run lint` – Check linting + formatting (Biome)

## Accessibility (A11y)
- All interactive elements have visible labels (`<label>`, `aria-label`, or `aria-labelledby`)
- Status messages (loading, errors) use `aria-live` regions
- Canvas elements have `role="img"` and `aria-label`
- Errors are announced with `role="alert"`
- Buttons always have a descriptive text

## Code Quality
- Language: TypeScript (strict)
- Formatter & Linter: [Biome](https://biomejs.dev)
- Config: `biome.json`, `tsconfig.json`
- Before every commit: `npm run format`
- Code language: All comments, variable names, function names, and other identifiers in **English**
- User-facing strings (error messages, labels, status text) in **German** (user language)
- Function names always start with a verb (e.g. `renderCanvas`, `fetchData`)
- Boolean state variables always use the `is` prefix (e.g. `isLoading`, `isDisabled`)
- Event handler functions always start with `on` (e.g. `onSubmit`, `onClick`)

## Notes
- Ollama must be running locally: `ollama serve` + `ollama pull mistral`
- No backend needed for local development
- For production (Netlify), a Netlify Function will be added later to hide the
  Anthropic API key — only `useLLM.js` needs to be updated for this
