'use client'

import { useState } from 'react'
import { ConfirmCard } from '@/components/lab/ConfirmCard'

export default function SqlPage() {
  const [query, setQuery] = useState('SELECT id, name FROM events ORDER BY date DESC NULLS LAST LIMIT 20')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [summary, setSummary] = useState('')

  async function run() {
    setError(null)
    setResult(null)
    const res = await fetch('/api/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'failed')
      return
    }
    if (data.needsConfirm) {
      setToken(data.token)
      setSummary(data.summary)
      return
    }
    setResult(data)
  }

  return (
    <div style={{ padding: 20, display: 'grid', gap: 12 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        SQL · DELETE/TRUNCATE BLOCKED
      </h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={8}
        style={{
          width: '100%',
          background: 'var(--lab-panel)',
          color: 'var(--lab-text)',
          border: '1px solid var(--lab-border)',
          padding: 12,
          fontFamily: 'IBM Plex Mono, monospace',
        }}
      />
      <button
        type="button"
        onClick={run}
        style={{ width: 'fit-content', background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '8px 12px' }}
      >
        Run
      </button>
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
      {token ? (
        <ConfirmCard
          token={token}
          summary={summary}
          onCancel={() => setToken(null)}
          onConfirmed={() => {
            setToken(null)
            setSummary('')
            setResult({ ok: true, confirmed: true })
          }}
        />
      ) : null}
    </div>
  )
}
