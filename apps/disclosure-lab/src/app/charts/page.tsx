'use client'

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function ChartsPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/charts')
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error ?? 'failed')
        setData(j)
      })
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1 className="lab-mono" style={{ fontSize: 14 }}>
        CHARTS
      </h1>
      {error ? <p style={{ color: 'var(--lab-danger)' }}>{error}</p> : null}
      {data?.eventsByYear ? (
        <div style={{ height: 360, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.eventsByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a323a" />
              <XAxis dataKey="year" stroke="#8b969e" />
              <YAxis stroke="#8b969e" />
              <Tooltip />
              <Bar dataKey="count" fill="#7eb8a8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ color: 'var(--lab-muted)' }}>Loading…</p>
      )}
    </div>
  )
}
