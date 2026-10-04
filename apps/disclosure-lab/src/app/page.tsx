'use client'

import { useCallback, useMemo, useState } from 'react'
import { ConfirmCard } from '@/components/lab/ConfirmCard'
import { TablesPane } from '@/components/lab/TablesPane'
import { AssistantPane } from '@/components/assistant/AssistantPane'

export type Selection = {
  table: string
  id: string
  title: string
} | null

export default function HomePage() {
  const [selection, setSelection] = useState<Selection>(null)
  const [confirmToken, setConfirmToken] = useState<string | null>(null)
  const [confirmSummary, setConfirmSummary] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)

  const clearSelection = useCallback(() => setSelection(null), [])

  const requestConfirm = useCallback((token: string, summary: string) => {
    setConfirmToken(token)
    setConfirmSummary(summary)
  }, [])

  const onConfirmed = useCallback(() => {
    setConfirmToken(null)
    setConfirmSummary('')
    setRefreshKey((k) => k + 1)
  }, [])

  const chip = useMemo(() => selection, [selection])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: 'calc(100vh - 44px)' }}>
      <section
        style={{
          borderRight: '1px solid var(--lab-border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TablesPane
          refreshKey={refreshKey}
          selection={selection}
          onSelect={setSelection}
          onRequestConfirm={requestConfirm}
        />
      </section>
      <section style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AssistantPane selection={chip} onClearSelection={clearSelection} />
      </section>
      {confirmToken ? (
        <ConfirmCard
          token={confirmToken}
          summary={confirmSummary}
          onCancel={() => {
            setConfirmToken(null)
            setConfirmSummary('')
          }}
          onConfirmed={onConfirmed}
        />
      ) : null}
    </div>
  )
}
