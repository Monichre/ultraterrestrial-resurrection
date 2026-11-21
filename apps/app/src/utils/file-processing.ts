// Lightweight client-side file processing helpers for Prometheus page
// These are fallbacks used in Storybook/dev; server routes can replace them.

export async function extractTextFromFile(file: File): Promise<string> {
  // For text-like files we can read directly; for others, return a stub
  try {
    if (typeof file.text === 'function') {
      return await file.text()
    }
    return `Unsupported file type: ${file.type}`
  } catch (err) {
    console.error('extractTextFromFile error:', err)
    throw new Error('Failed to read file')
  }
}

export function generateSummary(text: string): string {
  if (!text) return 'No content to summarize.'
  // Naive summary: take first 5 lines or ~800 chars
  const trimmed = text.trim()
  const lines = trimmed.split(/\r?\n/).filter(Boolean)
  const firstLines = lines.slice(0, 5).join('\n')
  const clipped = firstLines.length > 800 ? firstLines.slice(0, 800) + '…' : firstLines
  return clipped || trimmed.slice(0, 800)
}

export function extractTopics(text: string): string[] {
  if (!text) return []
  const stop = new Set([
    'the','and','of','to','a','in','for','on','at','by','is','it','this','that','with','as','an','be','or','from','are','was','were','has','had','have','but','not','we','they','you','i','he','she','them','his','her','their','our','us','its','into','about','over','after','before','between','through','also','more','most','other','some','such','no','nor','only','own','same','so','than','too','very'
  ])
  const counts: Record<string, number> = {}
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .forEach((w) => {
      if (!w || w.length < 3 || stop.has(w)) return
      counts[w] = (counts[w] || 0) + 1
    })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w)
}