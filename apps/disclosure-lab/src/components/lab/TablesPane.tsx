'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Selection } from '@/app/page'

type Props = {
  refreshKey: number
  selection: Selection
  onSelect: (s: Selection) => void
  onRequestConfirm: (token: string, summary: string) => void
}

const DEFAULT_TABLES = [
  'events',
  'key_figures',
  'topics',
  'organizations',
  'sightings',
  'testimonies',
  'documents',
  'artifacts',
  'locations',
]

const PAGE_SIZE = 500

function titleOf(row: Record<string, unknown>) {
  return String(row.name ?? row.title ?? row.id ?? 'row')
}

export function TablesPane({ refreshKey, selection, onSelect, onRequestConfirm }: Props) {
  const [table, setTable] = useState('events')
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadPage = useCallback(
    async (opts: { offset: number; append: boolean }) => {
      const res = await fetch(
        `/api/tables?table=${encodeURIComponent(table)}&size=${PAGE_SIZE}&offset=${opts.offset}`,
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Load failed')
      const next = (data.records ?? []) as Record<string, unknown>[]
      setRows((prev) => (opts.append ? [...prev, ...next] : next))
      setTotal(typeof data.total === 'number' ? data.total : next.length)
      setHasMore(Boolean(data.hasMore))
    },
    [table],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setBusy(true)
      setError(null)
      setRows([])
      setTotal(0)
      setHasMore(false)
      try {
        await loadPage({ offset: 0, append: false })
      } catch (err) {
        if (!cancelled) setError(String(err))
      } finally {
        if (!cancelled) setBusy(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [table, refreshKey, loadPage])

  useEffect(() => {
    if (!selection || selection.table !== table) {
      setDraft('')
      return
    }
    const row = rows.find((r) => String(r.id) === selection.id)
    if (row) setDraft(JSON.stringify(row, null, 2))
  }, [selection, rows, table])

  async function loadMore() {
    if (!hasMore || loadingMore || busy) return
    setLoadingMore(true)
    setError(null)
    try {
      await loadPage({ offset: rows.length, append: true })
    } catch (err) {
      setError(String(err))
    } finally {
      setLoadingMore(false)
    }
  }

  async function save() {
    try {
      const values = JSON.parse(draft) as Record<string, unknown>
      const id = selection?.id ?? (typeof values.id === 'string' ? values.id : undefined)
      const { id: _drop, ...rest } = values
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id, values: rest }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Prepare failed')
      if (data.needsConfirm) onRequestConfirm(data.token, data.summary)
    } catch (err) {
      setError(String(err))
    }
  }

  const statusLabel = busy
    ? 'loading…'
    : `${rows.length} of ${total.toLocaleString()} total`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid var(--lab-border)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <label className="lab-mono" style={{ fontSize: 11, color: 'var(--lab-muted)' }}>
          TABLE
        </label>
        <select
          value={table}
          onChange={(e) => {
            setTable(e.target.value)
            onSelect(null)
          }}
          style={{ background: 'var(--lab-bg)', color: 'var(--lab-text)', border: '1px solid var(--lab-border)' }}
        >
          {DEFAULT_TABLES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="lab-mono" style={{ color: 'var(--lab-muted)', fontSize: 11 }}>
          {statusLabel}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>
        <div style={{ overflow: 'auto', borderRight: '1px solid var(--lab-border)' }}>
          {error ? <p style={{ color: 'var(--lab-danger)', padding: 12 }}>{error}</p> : null}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rows.map((row) => {
              const id = String(row.id ?? '')
              const active = selection?.id === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelect({
                        table,
                        id,
                        title: titleOf(row),
                      })
                    }
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      border: 0,
                      borderBottom: '1px solid var(--lab-border)',
                      background: active ? '#1e2a28' : 'transparent',
                      color: 'var(--lab-text)',
                      cursor: 'pointer',
                    }}
                  >
                    <div>{titleOf(row)}</div>
                    <div className="lab-mono" style={{ fontSize: 10, color: 'var(--lab-muted)' }}>
                      {id}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
          {hasMore ? (
            <div style={{ padding: 12 }}>
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="lab-mono"
                style={{
                  width: '100%',
                  border: '1px solid var(--lab-border)',
                  background: 'transparent',
                  color: 'var(--lab-accent)',
                  padding: '8px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {loadingMore ? 'loading…' : `Load more (${total - rows.length} remaining)`}
              </button>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--lab-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="lab-mono" style={{ fontSize: 11, color: 'var(--lab-muted)' }}>
              EDITOR · INSERT/UPDATE · confirm required
            </span>
            <button
              type="button"
              onClick={save}
              style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '4px 10px' }}
            >
              Prepare write
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Select a row or paste JSON object to insert/update"
            style={{
              flex: 1,
              width: '100%',
              resize: 'none',
              border: 0,
              background: 'var(--lab-bg)',
              color: 'var(--lab-text)',
              padding: 12,
              fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
              fontSize: 12,
            }}
          />
        </div>
      </div>
    </div>
  )
}
