# Eder

Describe a piece of furniture in natural language — Master Eder builds it for you as a 2D illustration.

**Demo:** https://mastereder.netlify.app/

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
- Ollama (local) / Anthropic Claude (production)
- HTML Canvas (2D perspective rendering)

## Production (Netlify)

Set these environment variables in Netlify:

```
ANTHROPIC_API_KEY=sk-ant-...
```

The Netlify Function at `netlify/functions/ask.ts` handles the API call server-side.

Session requests are tracked via Netlify Blobs — limits are configured in `shared/config.ts`.
