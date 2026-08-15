'use client'

import { useEffect, useState } from 'react'

export default function AuditPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/audit')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error ?? 'failed')
        setEntries(j.entries ?? [])
      })
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        AUDIT
      </h1>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {entries.map((e, i) => (
          <li
            key={`${e.ts}-${i}`}
            style={{
              borderBottom: '1px solid var(--lab-border)',
              padding: '8px 0',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 12,
            }}
          >
            <div style={{ color: 'var(--lab-muted)' }}>
              {e.ts} · {e.actor} · {e.tool}
              {e.table ? ` · ${e.table}` : ''}
            </div>
            <div>{e.summary}</div>
          </li>
        ))}
      </ul>
      {!entries.length && !error ? <p style={{ color: 'var(--lab-muted)' }}>No writes yet.</p> : null}
    </div>
  )
}
