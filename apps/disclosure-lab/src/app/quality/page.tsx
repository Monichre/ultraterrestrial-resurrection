'use client'

import { useEffect, useState } from 'react'

const TIER_COLOR: Record<string, string> = {
  broken: 'var(--lab-danger)',
  needs_work: 'var(--lab-warn)',
  thin: 'var(--lab-muted)',
  ok: 'var(--lab-accent)',
}
const SEV_COLOR: Record<string, string> = {
  blocker: 'var(--lab-danger)',
  warn: 'var(--lab-warn)',
  info: 'var(--lab-muted)',
}

export default function QualityPage() {
  const [table, setTable] = useState('key_figures')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  function run(t: string) {
    setLoading(true)
    setError(null)
    fetch(`/api/quality?table=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error ?? 'failed')
        setData(j)
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    run(table)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  const report = data?.report
  const queue = showAll ? report?.queue : report?.queue?.slice(0, 50)

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 className="lab-mono" style={{ fontSize: 14, margin: 0 }}>
          QUALITY
        </h1>
        <select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          style={{ fontSize: 12, background: 'var(--lab-panel)', color: 'var(--lab-text)', border: '1px solid var(--lab-border)' }}
        >
          {(data?.supportedTables ?? ['key_figures']).map((t: string) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {loading ? <span style={{ color: 'var(--lab-muted)', fontSize: 12 }}>checking…</span> : null}
        {report ? (
          <span style={{ color: 'var(--lab-muted)', fontSize: 11 }}>
            {report.total} rows · run {report.runAt}
          </span>
        ) : null}
      </div>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}

      {report ? (
        <>
          <div style={{ display: 'flex', gap: 16, margin: '14px 0', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
            {(['broken', 'needs_work', 'thin', 'ok'] as const).map((tier) => (
              <div key={tier} style={{ border: '1px solid var(--lab-border)', padding: '8px 14px', background: 'var(--lab-panel)' }}>
                <div style={{ color: TIER_COLOR[tier], fontSize: 18 }}>{report.tiers[tier]}</div>
                <div style={{ color: 'var(--lab-muted)' }}>{tier}</div>
              </div>
            ))}
          </div>

          <h2 className="lab-mono" style={{ fontSize: 12, color: 'var(--lab-muted)' }}>
            RULES
          </h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
            <thead>
              <tr style={{ color: 'var(--lab-muted)', textAlign: 'left' }}>
                <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)' }}>sev</th>
                <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)' }}>rule</th>
                <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)' }}>count</th>
                <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)' }}>what it means / fix</th>
              </tr>
            </thead>
            <tbody>
              {report.rules.map((r: any) => (
                <tr key={r.id} style={{ opacity: r.count === 0 ? 0.45 : 1 }}>
                  <td style={{ padding: '4px 8px', color: SEV_COLOR[r.severity] }}>{r.severity}</td>
                  <td style={{ padding: '4px 8px' }}>{r.id}</td>
                  <td style={{ padding: '4px 8px', color: r.count ? 'var(--lab-text)' : 'var(--lab-muted)' }}>{r.count}</td>
                  <td style={{ padding: '4px 8px', color: 'var(--lab-muted)' }}>
                    {r.label} — {r.fix}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="lab-mono" style={{ fontSize: 12, color: 'var(--lab-muted)', marginTop: 18 }}>
            ENRICHMENT QUEUE — worst first
          </h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
            <tbody>
              {queue?.map((row: any) => (
                <tr key={row.id}>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)', color: TIER_COLOR[row.tier], width: 90 }}>
                    {row.tier}
                  </td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)', width: 40, color: 'var(--lab-muted)' }}>
                    {row.score}
                  </td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)' }}>
                    {row.label ?? row.id}
                  </td>
                  <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--lab-border)', color: 'var(--lab-muted)' }}>
                    {row.issues.join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {report.queue.length > 50 && !showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="lab-mono"
              style={{ marginTop: 8, fontSize: 11, background: 'none', border: '1px solid var(--lab-border)', color: 'var(--lab-accent)', padding: '4px 10px', cursor: 'pointer' }}
            >
              show all {report.queue.length}
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
