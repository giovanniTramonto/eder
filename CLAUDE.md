# eder

## Project Description
The user describes a piece of furniture in natural language. The LLM interprets the
description and returns JavaScript Canvas drawing code that renders the furniture
as a simple 2D illustration.

## Stack
- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript
- Vite
- Ollama locally via `http://localhost:11434` (model: qwen2.5-coder)
- Anthropic SDK via Netlify Function (production)
- HTML Canvas for rendering
- No CSS framework, no UI library
- CSS Reset: Andy Bell's Modern CSS Reset (`npm install @csstools/normalize.css`)

## Project Structure
```
shared/
├── config.ts                # Shared constants (MAX_PROMPT_LENGTH, MAX_SESSION_REQUESTS)
├── prompts/
│   └── systemPrompt.ts      # Shared system prompt
└── utils/
    └── extractCode.ts       # Shared canvas code extractor
src/
├── components/
│   ├── PromptInput.vue      # Text input for the furniture description
│   └── FurnitureCanvas.vue  # Canvas component for rendering
├── composables/
│   └── useLLM.ts            # askLLM() – switches between Ollama and Netlify
├── stylesheets/
│   ├── index.css            # Layer declarations + imports
│   ├── base.css             # @layer base
│   └── utilities.css        # @layer utilities
├── App.vue
└── main.ts
netlify/
└── functions/
    └── ask.ts               # Netlify Function – Anthropic SDK (production)
```

## Path Aliases
- `@/*` → `src/*` (Vite only)
- `#shared/*` → `shared/*` (Vite + Netlify via `package.json` imports field)

## LLM Abstraction
All LLM communication runs through `askLLM()` in `useLLM.ts`. The provider is selected automatically:

- `VITE_OLLAMA_URL` is set → calls Ollama directly from the browser
- `VITE_OLLAMA_URL` is not set → calls the Netlify Function at `/api/ask`

The system prompt lives in `shared/prompts/systemPrompt.ts` and is shared by both providers.

## Ollama Configuration (local)
- Base URL: `http://localhost:11434/api/chat`
- Model: `qwen2.5-coder`
- No API key required

## LLM Prompt Strategy
The system prompt instructs the LLM to return **only** executable
JavaScript Canvas code — no Markdown, no explanations, no backtick fencing.
Only raw JS code that draws on a `<canvas>` element with a 2D context (`ctx`).

Example system prompt:
```
You are a furniture illustrator. When the user describes a piece of furniture,
respond only with raw JavaScript for an HTML Canvas 2D context (variable: ctx,
600×400px). Draw in a 2D perspective view. Include few-shot examples for table,
shelf, and chair. No Markdown, no explanations, only raw JS.
```

## Canvas Rendering
- The returned JS code is executed via `new Function('ctx', code)(ctx)`
- Before each new render: clear the canvas with `ctx.clearRect(0, 0, 600, 400)`
- Errors during code execution must be shown in the UI (try/catch)

## UI Flow
1. User enters a description (e.g. "A round table with four legs")
2. Button "Build" → `askLLM()` is called
3. Loading indicator while the request is in progress
4. Canvas renders the result
5. Error message if the LLM returns no valid code

## CSS
Andy Bell's Modern CSS Reset is loaded via `src/stylesheets/index.css` using `@layer reset`. Layer order: `reset → base → utilities`.

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
- User-facing strings (error messages, labels, status text) in **English**
- Function names always start with a verb (e.g. `renderCanvas`, `fetchData`)
- Boolean state variables always use the `is` prefix (e.g. `isLoading`, `isDisabled`)
- Event handler functions always start with `on` (e.g. `onSubmit`, `onClick`)

## Rate Limiting (production only)
- Prompt max length: `MAX_PROMPT_LENGTH` (defined in `shared/config.ts`)
- Session limit: `MAX_SESSION_REQUESTS` requests per session (tracked via Netlify Blobs)
- Session ID generated client-side (`crypto.randomUUID()`) and stored in `sessionStorage`
- Button is disabled client-side when limit is reached

## Notes
- Ollama must be running locally: `ollama serve` + `ollama pull qwen2.5-coder`
- No backend needed for local development
- Production on Netlify: only `ANTHROPIC_API_KEY` needs to be set — `VITE_OLLAMA_URL` is absent by default
