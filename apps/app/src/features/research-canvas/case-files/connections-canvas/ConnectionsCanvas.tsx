'use client'

import {
  Background,
  BackgroundVariant,
  getNodesBounds,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {EvidentiaryStateBadge} from '@/features/mindmap/components/evidentiary-state-badge'
import {
  EVIDENTIARY_STATES,
  type EvidentiaryState,
} from '@/features/mindmap/utils/evidentiary-state'
import {CanvasDrawer} from '../canvas/canvas-drawer/canvas-drawer'
import {EvidenceEdge, TIER_DASH, TIER_STROKE, type EvidenceEdgeFlowData} from './evidence-edge'
import {EntityCanvasNode, type EntityNodeFlowData} from './entity-canvas-node'
import {NotationPinNode, type NotationPinFlowData} from './notation-pin-node'
import type {CanvasEntity, ConnectionsCanvasProps, EvidenceRelation} from './types'
import {cn} from '@/utils'

const nodeTypes = {entity: EntityCanvasNode, pin: NotationPinNode}
const edgeTypes = {evidence: EvidenceEdge}

/** Weaker tiers start collapsed — strong claims lead, speculation on demand. */
const DEFAULT_VISIBLE_TIERS: EvidentiaryState[] = ['Observed', 'Corroborated', 'Contested']

type Pin = {id: string; x: number; y: number; text: string}

function ConnectionsCanvasInner({
  entities,
  relations,
  positions = {},
  focusEntityId,
  seedId,
  initialVisibleTiers,
}: ConnectionsCanvasProps) {
  const {screenToFlowPosition, flowToScreenPosition, fitView, getNodes} = useReactFlow()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const seed = seedId ?? focusEntityId ?? entities[0]?.id

  const [focusId, setFocusId] = useState<string | null>(focusEntityId ?? null)
  const [selected, setSelected] = useState<EvidenceRelation | null>(null)
  const [hiddenTiers, setHiddenTiers] = useState<Set<EvidentiaryState>>(
    () =>
      new Set(
        EVIDENTIARY_STATES.filter(
          (t) => !(initialVisibleTiers ?? DEFAULT_VISIBLE_TIERS).includes(t),
        ),
      ),
  )
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(seed ? [seed] : []))
  const [pins, setPins] = useState<Pin[]>([])
  const [legendOpen, setLegendOpen] = useState(false)

  const entityById = useMemo(() => new Map(entities.map((e) => [e.id, e])), [entities])

  /** Undirected adjacency — traversal doesn't care about edge direction. */
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const r of relations) {
      if (!m.has(r.from)) m.set(r.from, new Set())
      if (!m.has(r.to)) m.set(r.to, new Set())
      m.get(r.from)!.add(r.to)
      m.get(r.to)!.add(r.from)
    }
    return m
  }, [relations])

  /**
   * Progressive disclosure: a node is visible iff reachable from the seed via a
   * path where every intermediate node has been expanded. `revealParent`
   * records which expanded node surfaced it (fallback layout anchor).
   */
  const {visibleIds, revealParent} = useMemo(() => {
    const visible = new Set<string>(seed ? [seed] : [])
    const parent = new Map<string, string>()
    const queue = seed ? [seed] : []
    while (queue.length) {
      const cur = queue.shift()!
      if (!expandedIds.has(cur)) continue
      for (const nb of neighbors.get(cur) ?? []) {
        if (!visible.has(nb)) {
          visible.add(nb)
          parent.set(nb, cur)
          queue.push(nb)
        }
      }
    }
    return {visibleIds: visible, revealParent: parent}
  }, [seed, expandedIds, neighbors])

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
      // Reframe only when the reveal actually lands outside the viewport —
      // a collapse or in-frame reveal must not hijack the user's pan/zoom.
      requestAnimationFrame(() => {
        const b = getNodesBounds(getNodes())
        const tl = flowToScreenPosition({x: b.x, y: b.y})
        const br = flowToScreenPosition({x: b.x + b.width, y: b.y + b.height})
        const w = wrapperRef.current?.clientWidth ?? window.innerWidth
        const h = wrapperRef.current?.clientHeight ?? window.innerHeight
        if (tl.x < 0 || tl.y < 0 || br.x > w || br.y > h) {
          fitView({duration: 300, padding: 0.2})
        }
      })
    },
    [fitView, flowToScreenPosition, getNodes],
  )

  const hiddenCount = useCallback(
    (id: string) => {
      let n = 0
      for (const nb of neighbors.get(id) ?? []) if (!visibleIds.has(nb)) n++
      return n
    },
    [neighbors, visibleIds],
  )

  /** Ego set: focused node + neighbors reachable over *visible* tiers only. */
  const egoSet = useMemo(() => {
    if (!focusId) return null
    const set = new Set<string>([focusId])
    for (const r of relations) {
      if (hiddenTiers.has(r.tier)) continue
      if (r.from === focusId) set.add(r.to)
      if (r.to === focusId) set.add(r.from)
    }
    return set
  }, [focusId, relations, hiddenTiers])

  const toggleTier = (tier: EvidentiaryState) =>
    setHiddenTiers((prev) => {
      const next = new Set(prev)
      next.has(tier) ? next.delete(tier) : next.add(tier)
      return next
    })

  const nodes: Node[] = useMemo(() => {
    const computed = new Map<string, {x: number; y: number}>()
    const perParentCount = new Map<string, number>()
    const fallbackPos = (id: string) => {
      const cached = computed.get(id)
      if (cached) return cached
      const parent = revealParent.get(id)
      const anchor = parent ? positions[parent] ?? computed.get(parent) ?? {x: 0, y: 0} : {x: 0, y: 0}
      const i = perParentCount.get(parent ?? '_') ?? 0
      perParentCount.set(parent ?? '_', i + 1)
      // golden-angle ring around the node that revealed it
      const angle = i * 2.399963
      const p = {x: anchor.x + Math.cos(angle) * 320, y: anchor.y + Math.sin(angle) * 320}
      computed.set(id, p)
      return p
    }

    const entityNodes: Node[] = entities
      .filter((e) => visibleIds.has(e.id))
      .map((e, i) => {
        const hc = hiddenCount(e.id)
        return {
          id: e.id,
          type: 'entity',
          position: positions[e.id] ?? fallbackPos(e.id),
          data: {
            kind: e.kind,
            label: e.label,
            sublabel: e.sublabel,
            focused: focusId === e.id,
            dimmed: egoSet ? !egoSet.has(e.id) : false,
            hiddenCount: hc,
            expanded: expandedIds.has(e.id),
            onToggleExpand: () => toggleExpand(e.id),
          } satisfies EntityNodeFlowData,
        }
      })
    const pinNodes: Node[] = pins.map((p) => ({
      id: p.id,
      type: 'pin',
      position: {x: p.x, y: p.y},
      draggable: true,
      data: {
        text: p.text,
        onTextChange: (text: string) =>
          setPins((prev) => prev.map((q) => (q.id === p.id ? {...q, text} : q))),
        onRemove: () => setPins((prev) => prev.filter((q) => q.id !== p.id)),
      } satisfies NotationPinFlowData,
    }))
    return [...entityNodes, ...pinNodes]
  }, [entities, positions, visibleIds, revealParent, egoSet, focusId, pins, hiddenCount, expandedIds, toggleExpand])

  const inspectRelation = useCallback(
    (edgeId: string) => {
      const rel = relations.find((r) => r.id === edgeId)
      if (rel) setSelected(rel)
    },
    [relations],
  )

  const edges: Edge[] = useMemo(
    () =>
      relations.map((r) => {
        const ghosted = hiddenTiers.has(r.tier)
        return {
          id: r.id,
          type: 'evidence',
          source: r.from,
          target: r.to,
          hidden: !visibleIds.has(r.from) || !visibleIds.has(r.to),
          interactive: !ghosted,
          markerEnd: ghosted
            ? undefined
            : {type: MarkerType.ArrowClosed, width: 14, height: 14, color: TIER_STROKE[r.tier]},
          data: {
            relation: r.relation,
            tier: r.tier,
            via: r.via,
            counterReading: r.counterReading,
            note: r.note,
            dimmed: egoSet ? !(egoSet.has(r.from) && egoSet.has(r.to)) : false,
            ghosted,
            onInspect: inspectRelation,
          } satisfies EvidenceEdgeFlowData,
        }
      }),
    [relations, hiddenTiers, egoSet, inspectRelation, visibleIds],
  )

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    if (node.type !== 'entity') return
    setFocusId((prev) => (prev === node.id ? null : node.id))
  }, [])

  const onEdgeClick = useCallback(
    (_: unknown, edge: Edge) => inspectRelation(edge.id),
    [inspectRelation],
  )

  const onPaneDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const p = screenToFlowPosition({x: e.clientX, y: e.clientY})
      setPins((prev) => [...prev, {id: `pin_${prev.length}_${Date.now()}`, x: p.x, y: p.y, text: ''}])
    },
    [screenToFlowPosition],
  )

  const tierCounts = useMemo(() => {
    const c = new Map<EvidentiaryState, number>()
    for (const r of relations) c.set(r.tier, (c.get(r.tier) ?? 0) + 1)
    return c
  }, [relations])

  const selFrom = selected ? entityById.get(selected.from) : undefined
  const selTo = selected ? entityById.get(selected.to) : undefined

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <div ref={wrapperRef} className='relative h-full w-full bg-neutral-950'>
      {/* mobile legend toggle */}
      <button
        type='button'
        onClick={() => setLegendOpen((o) => !o)}
        aria-expanded={legendOpen}
        className='ut-mono absolute left-3 top-3 z-20 rounded border border-neutral-700 bg-neutral-900/90 px-2 py-1 text-[9px] tracking-widest text-neutral-400 sm:hidden'>
        [ TIERS ]
      </button>

      {/* legend — app panel chrome */}
      <div
        className={cn(
          'absolute left-3 top-10 z-10 w-[190px] rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3 shadow-lg shadow-neutral-800/50 sm:top-3',
          !legendOpen && 'max-sm:hidden',
        )}>
        <div className='ut-mono mb-2 text-[9px] font-semibold tracking-widest text-neutral-500'>
          EVIDENTIARY TIERS
        </div>
        <div className='flex flex-col gap-1'>
          {EVIDENTIARY_STATES.map((tier) => {
            const off = hiddenTiers.has(tier)
            const count = tierCounts.get(tier) ?? 0
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                disabled={count === 0}
                aria-pressed={!off}
                aria-label={`${tier} edges — ${count} relation${count === 1 ? '' : 's'}${off ? ', hidden' : ', shown'}`}
                className={cn(
                  'flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 text-left transition-all hover:border-neutral-700 hover:bg-white/5',
                  off && 'opacity-35',
                  count === 0 && 'cursor-default opacity-20',
                )}>
                <svg width='30' height='6' aria-hidden className='shrink-0'>
                  <line
                    x1='0'
                    y1='3'
                    x2='30'
                    y2='3'
                    stroke={TIER_STROKE[tier]}
                    strokeWidth={tier === 'Corroborated' ? '3' : tier === 'Observed' ? '1.5' : '2'}
                    strokeDasharray={TIER_DASH[tier]}
                  />
                </svg>
                <EvidentiaryStateBadge state={tier} />
                <span className='ml-auto ut-mono text-[9px] text-neutral-500'>{count}</span>
              </button>
            )
          })}
        </div>
        <div className='ut-mono mt-2 border-t border-neutral-800 pt-2 text-[9px] leading-snug text-neutral-400'>
          +N chip → reveal connections
          <br />
          click node → focus neighbors
          <br />
          click edge → inspect
          <br />
          dbl-click canvas → pin note
          <br />
          faint dashes → hidden tier
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={() => setFocusId(null)}
        onDoubleClick={onPaneDoubleClick}
        fitView
        minZoom={0.3}
        maxZoom={1.6}
        zoomOnDoubleClick={false}
        colorMode='dark'
        nodesConnectable={false}
        nodesFocusable
        edgesFocusable
        proOptions={{hideAttribution: true}}>
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color='#1f1f1f' />
      </ReactFlow>

      <CanvasDrawer side='right' open={!!selected} showHandle={false} onOpenChange={(o) => !o && setSelected(null)}>
        {selected ? (
          <div className='space-y-4 p-1'>
            <div>
              <div className='ut-mono text-[9px] tracking-widest text-neutral-500'>RELATION</div>
              <div className='mt-1 flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-neutral-100'>
                <span className='ut-mono uppercase tracking-wide'>{selFrom?.label}</span>
                <span className='text-[10px] italic text-neutral-500'>
                  —{selected.relation.replaceAll('_', ' ')}→
                </span>
                <span className='ut-mono uppercase tracking-wide'>{selTo?.label}</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <span className='ut-mono text-[9px] tracking-widest text-neutral-500'>TIER</span>
              <EvidentiaryStateBadge state={selected.tier} />
            </div>

            <div>
              <div className='ut-mono mb-1.5 text-[9px] tracking-widest text-neutral-500'>
                EVIDENCE BASIS
              </div>
              {selected.via.length ? (
                <ul className='space-y-1'>
                  {selected.via.map((v, i) => (
                    <li key={i} className='flex items-baseline gap-2 text-xs text-neutral-300'>
                      <span className='ut-mono shrink-0 text-[8.5px] uppercase text-neutral-500'>
                        {v.kind}
                      </span>
                      {v.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='text-xs italic text-neutral-600'>no sources recorded</div>
              )}
            </div>

            <div>
              <div className='ut-mono mb-1.5 text-[9px] tracking-widest text-neutral-500'>
                COUNTER-READING
              </div>
              <div className={cn('text-xs leading-snug', selected.counterReading ? 'text-neutral-300' : 'italic text-neutral-600')}>
                {selected.counterReading ?? 'none recorded yet — what cuts against this?'}
              </div>
            </div>

            <div className='border-t border-neutral-800 pt-3'>
              <div className='ut-mono mb-1.5 text-[9px] tracking-widest text-neutral-500'>
                NEXT TRACE
              </div>
              <div className='text-xs italic leading-snug text-neutral-500'>
                {selected.note ?? 'what evidence would change this reading?'}
              </div>
            </div>
          </div>
        ) : null}
      </CanvasDrawer>
    </div>
  )
}

export function ConnectionsCanvas(props: ConnectionsCanvasProps) {
  return (
    <ReactFlowProvider>
      <ConnectionsCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
