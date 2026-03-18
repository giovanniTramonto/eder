# Eder

Describe a piece of furniture in natural language — Meister Eder builds it for you as an isometric 2D illustration.

## Requirements

- [Node.js](https://nodejs.org) (v18+)
- [Ollama](https://ollama.com) with the `mistral` model

## Setup

```bash
# Start Ollama and pull the model
ollama serve
ollama pull mistral

# Copy env file and adjust if needed
cp .env.example .env

# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Stack

- Vue 3 + TypeScript + Vite
- Ollama (local)
- HTML Canvas (isometric rendering)

## Production

The Anthropic SDK will be integrated for production deployment (Netlify). Only `src/composables/useLLM.ts` needs to be updated for this.
