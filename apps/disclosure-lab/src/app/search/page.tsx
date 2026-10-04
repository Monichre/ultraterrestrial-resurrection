'use client'

import { useCallback, useState } from 'react'

type Source = 'neon' | 'knowledge-base' | 'vector-store' | 'compare'

const SOURCES: { id: Source; label: string }[] = [
  { id: 'neon', label: 'Neon' },
  { id: 'knowledge-base', label: 'Knowledge base' },
  { id: 'vector-store', label: 'Vector store' },
  { id: 'compare', label: 'Compare' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('Roswell')
  const [source, setSource] = useState<Source>('compare')
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const run = useCallback(async () => {
    setError(null)
    setBusy(true)
    try {
      const data = await runSearch(source, query)
      setResult(data)
    } catch (err) {
      setError(String(err))
    } finally {
      setBusy(false)
    }
  }, [query, source])

  return (
    <div style={{ padding: 20, display: 'grid', gap: 12 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        SEARCH
      </h1>
      <p style={{ color: 'var(--lab-muted)', margin: 0 }}>
        Neon FTS · local archive · OpenAI Vector Store (same search/fetch as openai-vector-store-mcp)
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SOURCES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSource(item.id)}
            className="lab-mono"
            style={{
              border: '1px solid var(--lab-border)',
              background: source === item.id ? 'var(--lab-accent)' : 'var(--lab-panel)',
              color: source === item.id ? '#0e1114' : 'var(--lab-text)',
              padding: '6px 10px',
              fontSize: 11,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void run()
          }}
          style={{
            flex: 1,
            background: 'var(--lab-panel)',
            border: '1px solid var(--lab-border)',
            color: 'var(--lab-text)',
            padding: 8,
          }}
        />
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '8px 12px' }}
        >
          {busy ? 'Searching…' : 'Search'}
        </button>
      </div>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
      {result ? (
        <pre
          className="lab-mono"
          style={{
            overflow: 'auto',
            background: 'var(--lab-panel)',
            border: '1px solid var(--lab-border)',
            padding: 12,
            fontSize: 11,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  )
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `failed ${url}`)
  return data
}

async function runSearch(source: Source, query: string) {
  if (source === 'neon') return postJson('/api/search', { query })
  if (source === 'knowledge-base') return postJson('/api/corpus', { query })
  if (source === 'vector-store') return postJson('/api/vector-store', { query })

  const [neon, knowledgeBase, vectorStore] = await Promise.allSettled([
    postJson('/api/search', { query }),
    postJson('/api/corpus', { query }),
    postJson('/api/vector-store', { query }),
  ])
  return {
    neon: unwrap(neon),
    knowledgeBase: unwrap(knowledgeBase),
    vectorStore: unwrap(vectorStore),
  }
}

function unwrap(result: PromiseSettledResult<unknown>) {
  return result.status === 'fulfilled' ? result.value : { error: String(result.reason) }
}
