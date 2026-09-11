'use client'

import { useCallback, useEffect, useState } from 'react'

type Hit = {
  id: string
  title: string
  docType: string
  path: string
  tags: string[]
  originalPath?: string
}

type Stats = {
  root: string
  documentCount: number
  tagCount: number
  lastUpdated: string
  byType: Record<string, number>
}

type Doc = Hit & {
  preview?: { path: string; text: string | null; truncated?: boolean; error?: string | null; bytes?: number }
  files?: { name: string; path: string; size: number; type: string }[]
}

export default function CorpusPage() {
  const [query, setQuery] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [hits, setHits] = useState<Hit[]>([])
  const [selected, setSelected] = useState<Doc | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(() => {
    fetch('/api/corpus')
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'failed')
        setStats(data)
      })
      .catch((err) => setError(String(err)))
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  async function search() {
    setError(null)
    const res = await fetch('/api/corpus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query || 'ufo', limit: 40 }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'failed')
      return
    }
    setHits(data.results ?? [])
    setSelected(null)
  }

  async function openDoc(id: string) {
    setError(null)
    const res = await fetch(`/api/corpus?id=${encodeURIComponent(id)}`)
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'failed')
      return
    }
    setSelected(data)
  }

  return (
    <div style={{ padding: 20, display: 'grid', gap: 16 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        CORPUS
      </h1>
      <p style={{ color: 'var(--lab-muted)', margin: 0 }}>
        Local archive at packages/knowledge-base — read-only. {stats ? `${stats.documentCount} indexed docs` : ''}
      </p>
      {stats ? (
        <div className="lab-mono" style={{ fontSize: 11, color: 'var(--lab-muted)' }}>
          {Object.entries(stats.byType)
            .map(([type, count]) => `${type} ${count}`)
            .join(' · ')}
          {stats.lastUpdated ? ` · updated ${stats.lastUpdated.slice(0, 10)}` : ''}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void search()
          }}
          placeholder="title, tag, path…"
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
          onClick={() => void search()}
          style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '8px 12px' }}
        >
          Search
        </button>
      </div>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, minHeight: 420 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, overflow: 'auto' }}>
          {hits.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                onClick={() => void openDoc(hit.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: selected?.id === hit.id ? '#1a2420' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--lab-border)',
                  color: 'var(--lab-text)',
                  padding: '8px 4px',
                }}
              >
                <div>{hit.title}</div>
                <div className="lab-mono" style={{ fontSize: 10, color: 'var(--lab-muted)' }}>
                  {hit.docType} · {hit.id}
                </div>
              </button>
            </li>
          ))}
        </ul>
        <section
          style={{
            background: 'var(--lab-panel)',
            border: '1px solid var(--lab-border)',
            padding: 12,
            overflow: 'auto',
          }}
        >
          {selected ? (
            <>
              <h2 style={{ fontSize: 14, marginTop: 0 }}>{selected.title}</h2>
              <p className="lab-mono" style={{ fontSize: 11, color: 'var(--lab-muted)' }}>
                {selected.originalPath ?? selected.path}
              </p>
              {selected.preview?.error ? (
                <p style={{ color: 'var(--lab-warn)' }}>{selected.preview.error}</p>
              ) : null}
              {selected.preview?.text ? (
                <pre className="lab-mono" style={{ whiteSpace: 'pre-wrap', fontSize: 11 }}>
                  {selected.preview.text}
                  {selected.preview.truncated ? '\n\n[truncated]' : ''}
                </pre>
              ) : (
                <p style={{ color: 'var(--lab-muted)' }}>No text preview (likely a PDF).</p>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--lab-muted)' }}>Search, then open a document.</p>
          )}
        </section>
      </div>
    </div>
  )
}
