'use client'

/**
 * Synthesis Panel — the surface for the "Synthesize Investigation" action.
 * Renders the Ultraterrestrial A-I research narrative
 * (docs/PLANS/2026-07-08-memory-first-vision-capture.md §15) built from
 * whatever the researcher has assembled on the canvas. Fetches once on
 * mount; the canvas itself is the fallback when no provider responds.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollText, X, RefreshCw, BrainCircuit } from 'lucide-react'

import {
  synthesizeInvestigation,
  type InvestigationSynthesis,
  type SynthesisNode,
  type SynthesisEdge,
} from '@/features/mindmap/actions/synthesize-investigation'

type ReadingKey = keyof InvestigationSynthesis['readings']

const READING_META: Record<ReadingKey, { label: string; accent: string }> = {
  prosaic: { label: 'Prosaic', accent: 'text-emerald-300/80' },
  institutional: { label: 'Institutional', accent: 'text-sky-300/80' },
  psychologicalSocial: { label: 'Psychological / Social', accent: 'text-amber-300/80' },
  anomalous: { label: 'Anomalous', accent: 'text-fuchsia-300/80' },
  mythopoetic: { label: 'Mythopoetic', accent: 'text-violet-300/80' },
}

/**
 * Dossier section. `index` is the schema's own A–I letter (vision §15) —
 * the document format made visible, not decorative numbering.
 */
function Section({
  index,
  label,
  children,
}: {
  index: string
  label: string
  children: ReactNode
}) {
  return (
    <div className='border-b border-[var(--ut-line)] px-3 py-2.5 last:border-b-0'>
      <p className='ut-mono mb-1.5 flex items-baseline gap-1.5 text-[9px] font-medium text-[var(--ut-ink-faint)]'>
        <span className='text-[var(--ut-ink-dim)]'>{index}.</span>
        {label}
      </p>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className='text-[11px] italic text-[var(--ut-ink-faint)]'>None surfaced.</p>
  }
  return (
    <ul className='space-y-1'>
      {items.map((item) => (
        <li key={item} className='flex gap-1.5 text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
          <span className='text-[var(--ut-ink-faint)]'>–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Redacted-lines skeleton — loading as a document awaiting declassification. */
function RedactionSkeleton() {
  const widths = ['82%', '64%', '91%', '55%', '74%', '38%']
  return (
    <div className='space-y-4 px-3 py-5' aria-hidden>
      {widths.map((w, i) => (
        <div key={i} className='space-y-2'>
          <div className='ut-redaction w-16 opacity-60' />
          <div className='ut-redaction' style={{ width: w }} />
        </div>
      ))}
    </div>
  )
}

export type SynthesisPanelProps = {
  nodes: SynthesisNode[]
  edges: SynthesisEdge[]
  focus?: string
  onClose: () => void
}

export function SynthesisPanel({ nodes, edges, focus, onClose }: SynthesisPanelProps) {
  const [synthesis, setSynthesis] = useState<InvestigationSynthesis | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const requestSeq = useRef(0)

  const run = () => {
    const seq = ++requestSeq.current
    setStatus('loading')
    synthesizeInvestigation({ nodes, edges, focus })
      .then((res) => {
        if (seq !== requestSeq.current) return
        if (res) {
          setSynthesis(res.synthesis)
          setProvider(res.provider)
          setStatus('ready')
        } else {
          setStatus('failed')
        }
      })
      .catch(() => {
        if (seq === requestSeq.current) setStatus('failed')
      })
  }

  useEffect(() => {
    run()
    // One synthesis per mount — re-run only via the explicit retry/refresh
    // affordances, never implicitly, to avoid re-billing a provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className='ut-panel pointer-events-auto absolute right-5 top-20 bottom-20 z-30 flex w-[420px] flex-col overflow-hidden rounded-lg backdrop-blur-md'
    >
      {/* Header — one typewriter wordmark moment, plus the file reference */}
      <div className='flex items-center gap-2 border-b border-[var(--ut-line)] px-3 py-2.5'>
        <ScrollText className='size-4 text-violet-300/90' />
        <div className='min-w-0'>
          <span className='ut-typewriter block text-[13px] leading-none text-[var(--ut-paper)]'>
            Case Synthesis
          </span>
          <span className='ut-mono mt-1 block text-[8px] text-[var(--ut-ink-faint)]'>
            UT·RC&ensp;//&ensp;N:{String(nodes.length).padStart(2, '0')}&ensp;·&ensp;E:
            {String(edges.length).padStart(2, '0')}
          </span>
        </div>
        <div className='ml-auto flex items-center gap-1'>
          {status === 'ready' && (
            <button
              type='button'
              onClick={run}
              className='rounded-md p-1 text-[var(--ut-ink-faint)] transition-colors duration-150 hover:bg-[oklch(0.93_0.015_90/0.1)] hover:text-[var(--ut-paper)]'
              aria-label='Re-synthesize'
            >
              <RefreshCw className='size-3.5' />
            </button>
          )}
          <button
            type='button'
            onClick={onClose}
            className='rounded-md p-1 text-[var(--ut-ink-faint)] transition-colors duration-150 hover:bg-[oklch(0.93_0.015_90/0.1)] hover:text-[var(--ut-paper)]'
            aria-label='Close synthesis panel'
          >
            <X className='size-3.5' />
          </button>
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        {status === 'loading' && (
          <div>
            <RedactionSkeleton />
            <p className='ut-mono px-3 pb-4 text-center text-[9px] text-[var(--ut-ink-faint)]'>
              Synthesizing the field…
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className='flex flex-col items-center gap-3 px-6 py-16 text-center'>
            <span className='ut-mono inline-block -rotate-2 rounded-[2px] border-2 border-[var(--ut-stamp)] px-2 py-1 text-[10px] font-medium text-[var(--ut-stamp)] opacity-80'>
              No carrier
            </span>
            <p className='text-[11px] leading-relaxed text-[var(--ut-ink-faint)]'>
              No provider available — the canvas remains your instrument.
            </p>
            <button
              type='button'
              onClick={run}
              className='mt-1 rounded-md border border-[var(--ut-line-strong)] px-2.5 py-1 text-[10.5px] text-[var(--ut-ink-dim)] transition-colors duration-150 hover:bg-[oklch(0.93_0.015_90/0.1)] hover:text-[var(--ut-paper)]'
            >
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && synthesis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Section index='A' label='Signal'>
              <p className='text-[11px] leading-relaxed text-[oklch(0.93_0.015_90/0.78)] italic'>
                {synthesis.signal}
              </p>
            </Section>

            <Section index='B' label='Evidentiary Ground'>
              <div className='space-y-1.5'>
                <p className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
                  <span className='ut-mono mr-1 text-[8.5px] text-emerald-300/80'>Strongest</span>
                  {synthesis.evidentiaryGround.strongest}
                </p>
                <p className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
                  <span className='ut-mono mr-1 text-[8.5px] text-amber-300/80'>Weakest</span>
                  {synthesis.evidentiaryGround.weakest}
                </p>
              </div>
            </Section>

            <Section index='C' label='Sequence'>
              <BulletList items={synthesis.sequence} />
            </Section>

            <Section index='D' label='Field Map'>
              <p className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>{synthesis.fieldMap}</p>
            </Section>

            <Section index='E' label='Contradictions'>
              <BulletList items={synthesis.contradictions} />
            </Section>

            <Section index='F' label='Readings'>
              <div className='space-y-2'>
                {(Object.keys(READING_META) as ReadingKey[]).map((key) => (
                  <p key={key} className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
                    <span className={`ut-mono mr-1 text-[8.5px] ${READING_META[key].accent}`}>
                      {READING_META[key].label}
                    </span>
                    {synthesis.readings[key]}
                  </p>
                ))}
              </div>
            </Section>

            <Section index='G' label='Evidentiary Weight'>
              <p className='text-[11px] leading-relaxed text-[var(--ut-ink-dim)]'>
                {synthesis.evidentiaryWeight}
              </p>
            </Section>

            <Section index='H' label='Open Questions'>
              <BulletList items={synthesis.openQuestions} />
            </Section>

            <Section index='I' label='Next Traces'>
              <BulletList items={synthesis.nextTraces} />
            </Section>

            {/* Dashed border = AI inference (analytical layer), never solid:
                the provenance delineation rule from DESIGN.md */}
            <div className='px-3 py-2.5'>
              <span className='ut-mono inline-flex items-center gap-1 rounded-full border border-dashed border-violet-400/40 bg-violet-400/10 px-2 py-0.5 text-[8.5px] text-violet-300'>
                <BrainCircuit className='size-2.5' />
                AI reading · {provider}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export function SynthesisPanelHost({
  open,
  ...props
}: SynthesisPanelProps & { open: boolean }) {
  return (
    <AnimatePresence>
      {open && <SynthesisPanel key='synthesis-panel' {...props} />}
    </AnimatePresence>
  )
}
