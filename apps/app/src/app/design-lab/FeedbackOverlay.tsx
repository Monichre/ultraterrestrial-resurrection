'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'

type FeedbackComment = {
  id: string
  variant: string
  label: string
  selector: string
  text: string
}

type FeedbackOverlayProps = {
  targetName: string
}

function findVariant(el: Element | null): string {
  let cur: Element | null = el
  while (cur) {
    const v = cur.getAttribute('data-variant')
    if (v) return v
    cur = cur.parentElement
  }
  return '?'
}

function describeElement(el: Element): {label: string; selector: string} {
  const testId = el.getAttribute('data-testid')
  if (testId) {
    return {label: testId, selector: `[data-testid='${testId}']`}
  }
  const tag = el.tagName.toLowerCase()
  const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 48)
  const cls = typeof el.className === 'string' ? el.className.split(' ')[0] : ''
  const selector = cls ? `${tag}.${cls}` : tag
  return {label: text || tag, selector}
}

export function FeedbackOverlay({targetName}: FeedbackOverlayProps) {
  const [picking, setPicking] = useState(false)
  const [pending, setPending] = useState<{
    variant: string
    label: string
    selector: string
  } | null>(null)
  const [draft, setDraft] = useState('')
  const [overall, setOverall] = useState('')
  const [comments, setComments] = useState<FeedbackComment[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!picking) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (!t) return
      if (t.closest('[data-feedback-ui]')) return
      e.preventDefault()
      e.stopPropagation()
      const {label, selector} = describeElement(t)
      setPending({variant: findVariant(t), label, selector})
      setPicking(false)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [picking])

  const savePending = useCallback(() => {
    if (!pending || !draft.trim()) return
    setComments((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        variant: pending.variant,
        label: pending.label,
        selector: pending.selector,
        text: draft.trim(),
      },
    ])
    setPending(null)
    setDraft('')
  }, [pending, draft])

  const markdown = useMemo(() => {
    const byVariant = comments.reduce<Record<string, FeedbackComment[]>>((acc, c) => {
      ;(acc[c.variant] ??= []).push(c)
      return acc
    }, {})
    const sections = Object.entries(byVariant)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([variant, list]) => {
        const items = list
          .map((c, i) => `${i + 1}. **${c.label}** (\`${c.selector}\`)\n   "${c.text}"`)
          .join('\n\n')
        return `### Variant ${variant}\n${items}`
      })
      .join('\n\n')

    return `## Design Lab Feedback

**Target:** ${targetName}
**Comments:** ${comments.length}

${sections || '_(no element comments)_'}

### Overall Direction
${overall.trim() || '_(fill this in)_'}
`
  }, [comments, overall, targetName])

  const submit = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy feedback:', markdown)
    }
  }, [markdown])

  return (
    <div data-feedback-ui className='fixed bottom-4 right-4 z-[100] w-[320px] space-y-2'>
      <div className='rounded-lg border border-[var(--ut-line)] bg-[var(--ut-surface)] p-3 shadow-xl backdrop-blur-md'>
        <p className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>Design lab feedback</p>
        <div className='mt-2 flex gap-2'>
          <button
            type='button'
            onClick={() => setPicking((p) => !p)}
            className={`ut-mono flex-1 rounded border px-2 py-1.5 text-[8px] ${
              picking
                ? 'border-emerald-400/50 bg-emerald-400/15 text-emerald-300'
                : 'border-[var(--ut-line)] text-[var(--ut-ink-dim)]'
            }`}>
            {picking ? 'Click an element…' : 'Add Feedback'}
          </button>
          <span className='ut-mono self-center text-[8px] text-[var(--ut-ink-faint)]'>
            {comments.length} notes
          </span>
        </div>

        {pending && (
          <div className='mt-2 space-y-2 border-t border-[var(--ut-line)] pt-2'>
            <p className='text-[10px] text-[var(--ut-paper)]'>
              V{pending.variant} · {pending.label}
            </p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder='What should change?'
              className='w-full rounded border border-[var(--ut-line)] bg-[var(--ut-void)] px-2 py-1.5 text-[11px] text-[var(--ut-paper)] outline-none focus:border-emerald-400/40'
            />
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={savePending}
                className='ut-mono rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[8px] text-emerald-300'>
                Save
              </button>
              <button
                type='button'
                onClick={() => {
                  setPending(null)
                  setDraft('')
                }}
                className='ut-mono rounded border border-[var(--ut-line)] px-2 py-1 text-[8px] text-[var(--ut-ink-faint)]'>
                Cancel
              </button>
            </div>
          </div>
        )}

        <label className='mt-2 block space-y-1 border-t border-[var(--ut-line)] pt-2'>
          <span className='ut-mono text-[8px] text-[var(--ut-ink-faint)]'>Overall direction *</span>
          <textarea
            value={overall}
            onChange={(e) => setOverall(e.target.value)}
            rows={2}
            placeholder='e.g. Go with D’s path tour; keep B’s dossier rail…'
            className='w-full rounded border border-[var(--ut-line)] bg-[var(--ut-void)] px-2 py-1.5 text-[11px] text-[var(--ut-paper)] outline-none focus:border-emerald-400/40'
          />
        </label>

        <button
          type='button'
          disabled={!overall.trim()}
          onClick={submit}
          className='ut-mono mt-2 w-full rounded border border-emerald-400/40 bg-emerald-400/15 px-2 py-1.5 text-[8px] text-emerald-300 disabled:opacity-40'>
          {copied ? 'Copied — paste in chat' : 'Submit All Feedback'}
        </button>
      </div>
    </div>
  )
}
