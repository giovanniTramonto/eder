import Anthropic from '@anthropic-ai/sdk'
import { getStore } from '@netlify/blobs'
import { MAX_PROMPT_LENGTH, MAX_SESSION_REQUESTS, SESSION_DURATION_MS } from '#shared/config'
import { SYSTEM_PROMPT } from '#shared/prompts/systemPrompt'
import { extractCanvasCode } from '#shared/utils/extractCode'

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

  const sessionId = req.headers.get('X-Session-Id')
  if (sessionId) {
    const store = getStore('sessions')
    const count = ((await store.get(sessionId, { type: 'json' })) as number | null) ?? 0
    if (count >= MAX_SESSION_REQUESTS) {
      return new Response(JSON.stringify({ error: `Session limit of ${MAX_SESSION_REQUESTS} requests reached.` }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    await store.set(sessionId, count + 1, { ttl: SESSION_DURATION_MS / 1000 })
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
