# Eder

Describe a piece of furniture in natural language — Master Eder builds it for you as a 2D illustration.

## Requirements

- [Node.js](https://nodejs.org) (v18+)
- [Ollama](https://ollama.com) with the `qwen2.5-coder` model

## Setup

```bash
# Start Ollama and pull the model
ollama serve
ollama pull qwen2.5-coder

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
- HTML Canvas (2D perspective rendering)

## Production

The Anthropic SDK will be integrated for production deployment (Netlify). Only `src/composables/useLLM.ts` needs to be updated for this.
