import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '#shared/prompts/systemPrompt'
import { extractCanvasCode } from '#shared/utils/extractCode'
import { MAX_PROMPT_LENGTH } from '#shared/config'

const client = new Anthropic()

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { prompt } = await req.json()

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return new Response(JSON.stringify({ error: `Prompt must not exceed ${MAX_PROMPT_LENGTH} characters.` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  const code = extractCanvasCode(raw)

  if (!code) {
    return new Response(
      JSON.stringify({ error: `No valid code received. Response: "${raw.slice(0, 120)}…"` }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(JSON.stringify({ code }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/ask' }
