import { SYSTEM_PROMPT } from '#shared/prompts/systemPrompt'
import { extractCanvasCode } from '#shared/utils/extractCode'

interface OllamaResponse {
  message: { content: string }
}

export async function askLLM(prompt: string): Promise<string> {
  if (import.meta.env.VITE_LLM_PROVIDER === 'anthropic') {
    return askNetlify(prompt)
  }
  return askOllama(prompt)
}

async function askNetlify(prompt: string): Promise<string> {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.error) throw new Error(data.error)

  return data.code
}

async function askOllama(prompt: string): Promise<string> {
  const response = await fetch(import.meta.env.VITE_OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: import.meta.env.VITE_OLLAMA_MODEL,
      stream: false,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`)
  }

  const data: OllamaResponse = await response.json()
  const raw = data.message.content

  const code = extractCanvasCode(raw)

  if (code) return code

  throw new Error(`No valid code received. Response: "${raw.slice(0, 120)}…"`)
}
