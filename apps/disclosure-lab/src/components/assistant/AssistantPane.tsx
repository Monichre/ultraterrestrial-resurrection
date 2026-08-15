'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo, useState } from 'react'
import type { Selection } from '@/app/page'

type Props = {
  selection: Selection
  onClearSelection: () => void
}

export function AssistantPane({ selection, onClearSelection }: Props) {
  const [input, setInput] = useState('')

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/agent',
        prepareSendMessagesRequest: ({ id, messages, body, trigger, messageId }) => ({
          body: {
            ...body,
            id,
            messages,
            trigger,
            messageId,
            selection,
          },
        }),
      }),
    [selection],
  )

  const { messages, sendMessage, status, error } = useChat({ transport })

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
        <span className="lab-mono" style={{ fontSize: 11, color: 'var(--lab-muted)' }}>
          ASSISTANT · READ ONLY
        </span>
        {selection ? (
          <button
            type="button"
            onClick={onClearSelection}
            className="lab-mono"
            style={{
              marginLeft: 'auto',
              border: '1px solid var(--lab-border)',
              background: '#1a2420',
              color: 'var(--lab-accent)',
              padding: '2px 8px',
              fontSize: 11,
            }}
            title="Clear selection context"
          >
            ctx · {selection.table}/{selection.title.slice(0, 40)} ×
          </button>
        ) : (
          <span style={{ marginLeft: 'auto', color: 'var(--lab-muted)', fontSize: 11 }}>
            no selection
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {messages.length === 0 ? (
          <p style={{ color: 'var(--lab-muted)' }}>
            Ask about schema, search the corpus, or run read-only SQL. Writes stay in the tables pane.
          </p>
        ) : null}
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 12 }}>
            <div className="lab-mono" style={{ fontSize: 10, color: 'var(--lab-muted)' }}>
              {m.role}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {m.parts
                ?.map((part, i) => {
                  if (part.type === 'text') return <span key={i}>{part.text}</span>
                  if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
                    return (
                      <div
                        key={i}
                        className="lab-mono"
                        style={{
                          fontSize: 11,
                          color: 'var(--lab-accent)',
                          borderLeft: '2px solid var(--lab-border)',
                          paddingLeft: 8,
                          margin: '6px 0',
                        }}
                      >
                        tool · {part.type.replace(/^tool-/, '')}
                      </div>
                    )
                  }
                  return null
                })
                .filter(Boolean)}
            </div>
          </div>
        ))}
        {error ? <p style={{ color: 'var(--lab-danger)' }}>{error.message}</p> : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!input.trim() || status === 'streaming') return
          sendMessage({ text: input })
          setInput('')
        }}
        style={{
          display: 'flex',
          gap: 8,
          padding: 12,
          borderTop: '1px solid var(--lab-border)',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the lab assistant…"
          style={{
            flex: 1,
            background: 'var(--lab-bg)',
            border: '1px solid var(--lab-border)',
            color: 'var(--lab-text)',
            padding: '8px 10px',
          }}
        />
        <button
          type="submit"
          disabled={status === 'streaming'}
          style={{ background: 'var(--lab-accent)', color: '#0e1114', border: 0, padding: '8px 12px' }}
        >
          Send
        </button>
      </form>
    </div>
  )
}
