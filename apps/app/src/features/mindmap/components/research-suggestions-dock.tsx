'use client'

/**
 * Research Suggestions Dock — the canvas's intelligence surface.
 *
 * Watches what's on the canvas and surfaces the most promising unexplored
 * records from three data-native signals (documented join-table links,
 * pgvector semantic affinity of stored embeddings, temporal clustering),
 * synthesized into a running research hypothesis. During a Guided Tour the
 * dock locks onto the active waypoint so every suggestion supports the story
 * being told.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Link2,
  BrainCircuit,
  Clock,
  Plus,
  RefreshCw,
  ChevronDown,
  Compass,
} from 'lucide-react'
import type { Node } from '@xyflow/react'

import { useMindMapStore } from '@/features/mindmap/store'
import {
  getRelatedSuggestions,
  type RelatedSuggestion,
} from '@/features/mindmap/actions/related-records'
import {
  enrichHypothesis,
  type EnrichedHypothesis,
} from '@/features/mindmap/actions/enrich-hypothesis'
import { useActiveTourSeed } from '@/features/mindmap/tours/guided-tour-store'
import { useAddRecordNode } from '@/features/mindmap/hooks/use-add-record-node'

const REASON_META = {
  connected: {
    label: 'Documented link',
    icon: Link2,
    accent: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/10',
  },
  similar: {
    label: 'Semantic affinity',
    icon: BrainCircuit,
    accent: 'text-violet-400',
    border: 'border-violet-400/30',
    bg: 'bg-violet-400/10',
  },
  temporal: {
    label: 'Same era',
    icon: Clock,
    accent: 'text-amber-400',
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/10',
  },
} as const

const TABLE_LABEL: Record<string, string> = {
  events: 'Event',
  key_figures: 'Key Figure',
  topics: 'Topic',
  organizations: 'Organization',
  testimonies: 'Testimony',
  documents: 'Document',
  artifacts: 'Artifact',
}

const resolveNodeTable = (node: Node): string | null => {
  const d = node.data as Record<string, unknown> | undefined
  const raw = d?.table ?? d?.xata_table ?? d?.type
  return typeof raw === 'string' && raw ? raw : null
}

const isRecordNode = (node: Node): boolean =>
  node.id.startsWith('rec_') && node.type !== 'userInputNode' && Boolean(resolveNodeTable(node))

export function ResearchSuggestionsDock() {
  const nodes = useMindMapStore((s) => s.nodes)
  const tourSeed = useActiveTourSeed()
  const { addRecordNode } = useAddRecordNode()

  const [suggestions, setSuggestions] = useState<RelatedSuggestion[]>([])
  const [hypothesis, setHypothesis] = useState<string | null>(null)
  const [enriched, setEnriched] = useState<EnrichedHypothesis | null>(null)
  const [isEnriching, setIsEnriching] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const requestSeq = useRef(0)
  // One LLM enrichment per canvas composition — revisiting a tour waypoint
  // must not re-bill a provider.
  const enrichCache = useRef(new Map<string, EnrichedHypothesis>())

  // Key only on record identity — dragging must not refetch.
  const canvasIds = useMemo(
    () => nodes.filter(isRecordNode).map((n) => n.id),
    [nodes],
  )
  const seedKey = tourSeed ? `tour:${tourSeed.id}` : canvasIds.join('|')

  const fetchSuggestions = useCallback(() => {
    const seq = ++requestSeq.current
    const currentNodes = useMindMapStore.getState().nodes
    const recordNodes = currentNodes.filter(isRecordNode)
    const excludeIds = recordNodes.map((n) => n.id)

    const seeds = tourSeed
      ? [{ id: tourSeed.id, table: tourSeed.table }]
      : recordNodes.map((n) => ({ id: n.id, table: resolveNodeTable(n) as string }))

    if (!seeds.length) {
      setSuggestions([])
      setHypothesis(null)
      setEnriched(null)
      return
    }

    const cacheKey = tourSeed ? `tour:${tourSeed.id}` : excludeIds.join('|')
    const seedTitles = new Map(
      recordNodes.map((n) => {
        const d = n.data as Record<string, unknown> | undefined
        const title = d?.title ?? d?.label ?? d?.name
        return [n.id, typeof title === 'string' ? title : undefined] as const
      }),
    )

    startTransition(async () => {
      const result = await getRelatedSuggestions({ seeds, excludeIds, limit: 9 })
      if (seq !== requestSeq.current) return
      setSuggestions(result.suggestions)
      setHypothesis(result.hypothesis)
      setEnriched(null)

      // Deterministic hypothesis is the floor — enrich it with the frontier
      // fallback chain, but never block cards or the baseline on the LLM.
      const cached = enrichCache.current.get(cacheKey)
      if (cached) {
        setEnriched(cached)
        return
      }
      if (!result.hypothesis || !result.suggestions.length) return

      setIsEnriching(true)
      enrichHypothesis({
        seeds: seeds.map((s) => ({
          ...s,
          title: tourSeed?.id === s.id ? tourSeed.title : seedTitles.get(s.id),
        })),
        suggestions: result.suggestions,
        deterministicHypothesis: result.hypothesis,
        tourContext: tourSeed ? tourSeed.title : null,
      })
        .then((res) => {
          if (seq !== requestSeq.current) return
          setIsEnriching(false)
          if (res) {
            enrichCache.current.set(cacheKey, res)
            setEnriched(res)
          }
        })
        .catch(() => {
          if (seq === requestSeq.current) setIsEnriching(false)
        })
    })
  }, [tourSeed])

  useEffect(() => {
    if (!seedKey) {
      setSuggestions([])
      setHypothesis(null)
      setEnriched(null)
      return
    }
    const t = setTimeout(fetchSuggestions, 900)
    return () => clearTimeout(t)
  }, [seedKey, fetchSuggestions])

  const handleAdd = useCallback(
    (s: RelatedSuggestion) => {
      addRecordNode({
        id: s.id,
        table: s.table,
        title: s.title,
        record: s.record,
        sourceNodeId: s.seedId,
        edgeLabel: REASON_META[s.reason].label,
        edgeReasoning: s.reasonDetail,
      })
      setSuggestions((prev) => prev.filter((x) => x.id !== s.id))
    },
    [addRecordNode],
  )

  if (!seedKey) return null

  return (
    <div className='pointer-events-none absolute right-5 top-20 bottom-36 z-20 flex w-[330px] flex-col'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className='pointer-events-auto flex items-center gap-2 rounded-t-xl border border-white/10 bg-black/70 px-3 py-2.5 backdrop-blur-md'
      >
        <Sparkles className='size-4 text-emerald-400' />
        <span className='text-xs font-semibold uppercase tracking-[0.14em] text-white/80'>
          {tourSeed ? 'Tour Intelligence' : 'Research Signals'}
        </span>
        {tourSeed && (
          <span className='flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300'>
            <Compass className='size-3' />
            {tourSeed.title.length > 18 ? `${tourSeed.title.slice(0, 17)}…` : tourSeed.title}
          </span>
        )}
        <div className='ml-auto flex items-center gap-1'>
          <button
            type='button'
            onClick={fetchSuggestions}
            className='rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white'
            aria-label='Refresh suggestions'
          >
            <RefreshCw className={`size-3.5 ${isPending ? 'animate-spin' : ''}`} />
          </button>
          <button
            type='button'
            onClick={() => setCollapsed((c) => !c)}
            className='rounded-md p-1 text-white/50 transition hover:bg-white/10 hover:text-white'
            aria-label={collapsed ? 'Expand suggestions' : 'Collapse suggestions'}
          >
            <ChevronDown
              className={`size-3.5 transition-transform ${collapsed ? '-rotate-90' : ''}`}
            />
          </button>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key='dock-body'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='pointer-events-auto flex min-h-0 flex-col overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-black/60 backdrop-blur-md'
          >
            {/* Hypothesis — deterministic floor, swapped for the LLM-enriched
                thesis when a frontier provider responds */}
            <AnimatePresence mode='wait'>
              {(enriched?.hypothesis ?? hypothesis) && (
                <motion.div
                  key={enriched?.hypothesis ?? hypothesis}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`border-b border-white/10 border-l-2 px-3 py-2.5 ${
                    enriched ? 'border-l-violet-400/70' : 'border-l-emerald-400/60'
                  }`}
                >
                  <p className='text-[11px] leading-relaxed text-white/70 italic'>
                    {enriched?.hypothesis ?? hypothesis}
                  </p>
                  {enriched ? (
                    <span className='mt-1.5 inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 py-px text-[9px] uppercase tracking-wide text-violet-300'>
                      <BrainCircuit className='size-2.5' />
                      AI-refined · {enriched.provider}
                    </span>
                  ) : (
                    isEnriching && (
                      <span className='mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-wide text-white/35'>
                        <RefreshCw className='size-2.5 animate-spin' />
                        Refining hypothesis…
                      </span>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cards */}
            <div className='min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2'>
              <AnimatePresence mode='popLayout'>
                {suggestions.map((s, i) => {
                  const meta = REASON_META[s.reason]
                  const Icon = meta.icon
                  return (
                    <motion.button
                      layout
                      key={s.id}
                      type='button'
                      onClick={() => handleAdd(s)}
                      initial={{ opacity: 0, x: 28, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 28, scale: 0.9 }}
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 28,
                        delay: i * 0.045,
                      }}
                      className={`group w-full rounded-lg border ${meta.border} bg-white/[0.03] p-2.5 text-left transition hover:bg-white/[0.07]`}
                    >
                      <div className='flex items-start gap-2'>
                        <span className={`mt-0.5 rounded-md ${meta.bg} p-1 ${meta.accent}`}>
                          <Icon className='size-3.5' />
                        </span>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-1.5'>
                            <span className='truncate text-[12.5px] font-medium text-white/90'>
                              {s.title}
                            </span>
                            <span className='shrink-0 rounded border border-white/15 px-1 py-px text-[9px] uppercase tracking-wide text-white/40'>
                              {TABLE_LABEL[s.table] ?? s.table}
                            </span>
                          </div>
                          <p className={`mt-0.5 text-[10.5px] ${meta.accent}`}>{s.reasonDetail}</p>
                          {s.snippet && (
                            <p className='mt-1 line-clamp-2 text-[10.5px] leading-snug text-white/45'>
                              {s.snippet}
                            </p>
                          )}
                        </div>
                        <span className='mt-0.5 rounded-md border border-white/15 p-1 text-white/40 opacity-0 transition group-hover:opacity-100'>
                          <Plus className='size-3.5' />
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>

              {!suggestions.length && (
                <div className='flex flex-col items-center gap-2 py-8 text-center'>
                  {isPending ? (
                    <>
                      <RefreshCw className='size-4 animate-spin text-white/30' />
                      <p className='text-[11px] text-white/40'>
                        Scanning documented links, embeddings and timelines…
                      </p>
                    </>
                  ) : (
                    <p className='px-4 text-[11px] text-white/40'>
                      No unexplored records for the current canvas — try adding a different entity.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
