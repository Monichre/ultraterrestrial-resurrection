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
          <section>
            <h2 style={{ fontSize: 13 }}>Knowledge base</h2>
            {data.knowledgeBase?.error ? (
              <p style={{ color: 'var(--lab-danger)' }}>{data.knowledgeBase.error}</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                      documents
                    </td>
                    <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>
                      {data.knowledgeBase?.documentCount}
                    </td>
                  </tr>
                  {Object.entries(data.knowledgeBase?.byType ?? {}).map(([type, count]) => (
                    <tr key={type}>
                      <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                        {type}
                      </td>
                      <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>{String(count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <section>
            <h2 style={{ fontSize: 13 }}>Vector store</h2>
            {data.vectorStore?.error ? (
              <p style={{ color: 'var(--lab-danger)' }}>{data.vectorStore.error}</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                      name
                    </td>
                    <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>
                      {data.vectorStore?.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                      files
                    </td>
                    <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>
                      {data.vectorStore?.fileCounts?.completed ?? '—'}/
                      {data.vectorStore?.fileCounts?.total ?? '—'}
                    </td>
                  </tr>
                  <tr>
                    <td className="lab-mono" style={{ padding: '4px 0', borderBottom: '1px solid var(--lab-border)' }}>
                      id suffix
                    </td>
                    <td style={{ textAlign: 'right', borderBottom: '1px solid var(--lab-border)' }}>
                      …{data.vectorStore?.idSuffix}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
