'use client'

import { useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('Roswell')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setError(null)
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error ?? 'failed')
    else setResult(data)
  }

  return (
    <div style={{ padding: 20, display: 'grid', gap: 12 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        SEARCH
      </h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
          onClick={run}
          style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '8px 12px' }}
        >
          Search
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
