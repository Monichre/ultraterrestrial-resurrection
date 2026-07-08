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

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='border-b border-white/10 px-3 py-2.5 last:border-b-0'>
      <p className='mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/45'>
        {label}
      </p>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className='text-[11px] text-white/35 italic'>None surfaced.</p>
  }
  return (
    <ul className='space-y-1'>
      {items.map((item) => (
        <li key={item} className='flex gap-1.5 text-[11px] leading-relaxed text-white/70'>
          <span className='text-white/30'>–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
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
      className='pointer-events-auto absolute right-5 top-20 bottom-20 z-30 flex w-[420px] flex-col overflow-hidden rounded-xl border border-white/10 bg-black/70 backdrop-blur-md'
    >
      {/* Header */}
      <div className='flex items-center gap-2 border-b border-white/10 px-3 py-2.5'>
        <ScrollText className='size-4 text-violet-300' />
        <span className='text-xs font-semibold uppercase tracking-[0.14em] text-white/80'>
          Synthesis
        </span>
        <div className='ml-auto flex items-center gap-1'>
          {status === 'ready' && (
            <button
              type='button'
              onClick={run}
              className='rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white'
              aria-label='Re-synthesize'
            >
              <RefreshCw className='size-3.5' />
            </button>
          )}
          <button
            type='button'
            onClick={onClose}
            className='rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white'
            aria-label='Close synthesis panel'
          >
            <X className='size-3.5' />
          </button>
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        {status === 'loading' && (
          <div className='flex flex-col items-center gap-2 py-16 text-center'>
            <RefreshCw className='size-4 animate-spin text-white/30' />
            <p className='text-[11px] text-white/40'>Synthesizing the field…</p>
          </div>
        )}

        {status === 'failed' && (
          <div className='flex flex-col items-center gap-2 px-6 py-16 text-center'>
            <p className='text-[11px] leading-relaxed text-white/40'>
              No provider available — the canvas remains your instrument.
            </p>
            <button
              type='button'
              onClick={run}
              className='mt-1 rounded-md border border-white/15 px-2.5 py-1 text-[10.5px] text-white/60 transition hover:bg-white/10 hover:text-white'
            >
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && synthesis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Section label='Signal'>
              <p className='text-[11px] leading-relaxed text-white/75 italic'>{synthesis.signal}</p>
            </Section>

            <Section label='Evidentiary Ground'>
              <div className='space-y-1.5'>
                <p className='text-[11px] leading-relaxed text-white/70'>
                  <span className='mr-1 text-[9px] uppercase tracking-wide text-emerald-300/80'>
                    Strongest
                  </span>
                  {synthesis.evidentiaryGround.strongest}
                </p>
                <p className='text-[11px] leading-relaxed text-white/70'>
                  <span className='mr-1 text-[9px] uppercase tracking-wide text-amber-300/80'>
                    Weakest
                  </span>
                  {synthesis.evidentiaryGround.weakest}
                </p>
              </div>
            </Section>

            <Section label='Sequence'>
              <BulletList items={synthesis.sequence} />
            </Section>

            <Section label='Field Map'>
              <p className='text-[11px] leading-relaxed text-white/70'>{synthesis.fieldMap}</p>
            </Section>

            <Section label='Contradictions'>
              <BulletList items={synthesis.contradictions} />
            </Section>

            <Section label='Readings'>
              <div className='space-y-2'>
                {(Object.keys(READING_META) as ReadingKey[]).map((key) => (
                  <p key={key} className='text-[11px] leading-relaxed text-white/70'>
                    <span className={`mr-1 text-[9px] uppercase tracking-wide ${READING_META[key].accent}`}>
                      {READING_META[key].label}
                    </span>
                    {synthesis.readings[key]}
                  </p>
                ))}
              </div>
            </Section>

            <Section label='Evidentiary Weight'>
              <p className='text-[11px] leading-relaxed text-white/70'>{synthesis.evidentiaryWeight}</p>
            </Section>

            <Section label='Open Questions'>
              <BulletList items={synthesis.openQuestions} />
            </Section>

            <Section label='Next Traces'>
              <BulletList items={synthesis.nextTraces} />
            </Section>

            <div className='px-3 py-2.5'>
              <span className='inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 py-px text-[9px] uppercase tracking-wide text-violet-300'>
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
