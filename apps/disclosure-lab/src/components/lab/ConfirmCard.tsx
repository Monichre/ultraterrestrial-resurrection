'use client'

import { useState } from 'react'
import { ClassificationStamp, TagPill } from '@repo/disclosure-ui/components'

type Props = {
  token: string
  summary: string
  onCancel: () => void
  onConfirmed: () => void
}

export function ConfirmCard({ token, summary, onCancel, onConfirmed }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Confirm failed')
      onConfirmed()
    } catch (err) {
      setError(String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: 'min(480px, 92vw)',
          background: 'var(--lab-panel)',
          border: '1px solid var(--lab-border)',
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ClassificationStamp level="secret" label="CONFIRM WRITE" />
          <TagPill label="LIVE NEON" variant="amber" />
        </div>
        <p style={{ marginTop: 0 }}>{summary}</p>
        {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={busy}
            style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '6px 12px' }}
          >
            {busy ? 'Writing…' : 'Confirm write'}
          </button>
        </div>
      </div>
    </div>
  )
}
