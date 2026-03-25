export function extractCanvasCode(raw: string): string {
  const fenced = raw.match(/```(?:\w+)?\n([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : raw

  return candidate
    .split('\n')
    .filter(line => /^\s*(ctx\.|\/\/|$)/.test(line))
    .join('\n')
    .trim()
}
