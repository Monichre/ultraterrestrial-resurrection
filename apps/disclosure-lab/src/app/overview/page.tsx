'use client'

import { useEffect, useState } from 'react'

export default function OverviewPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/overview')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error ?? 'failed')
        setData(j)
      })
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1 className="lab-mono" style={{ fontSize: 14, letterSpacing: '0.08em' }}>
        OVERVIEW
      </h1>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
      {!data && !error ? <p style={{ color: 'var(--lab-muted)' }}>Loading…</p> : null}
      {data ? (
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
          <section>
            <h2 style={{ fontSize: 13 }}>Table counts</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {data.counts?.map((c: { table: string; count: number }) => (
                  <tr key={c.table}>
                    <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                      {c.table}
                    </td>
                    <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>
            <h2 style={{ fontSize: 13 }}>Embedding coverage</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {data.embeddingCoverage?.map(
                  (c: { table: string; total: number; embedded: number }) => (
                    <tr key={c.table}>
                      <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                        {c.table}
                      </td>
                      <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>
                        {c.embedded}/{c.total}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </section>
        </div>
      ) : null}
    </div>
  )
}
