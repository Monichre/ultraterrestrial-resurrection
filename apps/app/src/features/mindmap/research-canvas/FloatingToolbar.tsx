'use client'

import {useMemo, useState} from 'react'
import type {ReactNode} from 'react'
import {Network, Clock, Filter, LayoutGrid, Layers, FolderOpen, FileText, Archive, Bookmark, Zap, History, Users, Settings, ScrollText, Crosshair} from 'lucide-react'
import {useReactFlow, type Node} from '@xyflow/react'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {ToolbarButton} from './ToolbarButton'
import {useActiveRecord} from './active-record-chip'
import {NetworkPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/NetworkPanel'
import {FilterPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/FilterPanel'
import {SavedViewsPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/SavedViewsPanel'
import {AssetLibraryPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/AssetLibraryPanel'
import {LayoutPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/LayoutPanel'
import {LayersPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/LayersPanel'
import {QuickActionsPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/QuickActionsPanel'
import {HistoryPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/HistoryPanel'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import {useMindMapStore} from '@/features/mindmap/store'
import {SynthesisPanelHost} from '@/features/mindmap/components/synthesis-panel'
import type {SynthesisNode, SynthesisEdge} from '@/features/mindmap/actions/synthesize-investigation'

// Same resolution trick as research-suggestions-dock.tsx: record nodes carry
// a table in node.data under one of a few historical key names.
const resolveNodeTable = (node: Node): string | null => {
  const d = node.data as Record<string, unknown> | undefined
  const raw = d?.table ?? d?.xata_table ?? d?.type
  return typeof raw === 'string' && raw ? raw : null
}

const isRecordNode = (node: Node): boolean =>
  (node.id.startsWith('rec_') || node.id.startsWith('doc_')) &&
  node.type !== 'userInputNode' &&
  Boolean(resolveNodeTable(node))

const resolveNodeTitle = (node: Node): string => {
  const d = node.data as Record<string, unknown> | undefined
  const title = d?.title ?? d?.label ?? d?.name
  return typeof title === 'string' && title ? title : node.id
}

// The v0 reference is a visual rail, not a source of product behavior. The
// icons that have real canvas panels are interactive; the remaining reference
// slots are marked unavailable instead of opening the old page-builder mocks.
const TOOLBAR_GROUPS = [
  {label: 'Explore', items: [
    {id: 'network', icon: <Network size={20} />, tooltip: 'Network Graph Explorer', panel: 'network'},
    {id: 'timeline', icon: <Clock size={20} />, tooltip: 'Timeline Scrubber', panel: 'timeline'},
    {id: 'filter', icon: <Filter size={20} />, tooltip: 'Filter Panel', panel: 'filter'},
    {id: 'layout', icon: <LayoutGrid size={20} />, tooltip: 'Layout Algorithms', panel: 'layout'},
  ]},
  {label: 'Content', items: [
    {id: 'layers', icon: <Layers size={20} />, tooltip: 'Layers', panel: 'layers'},
    {id: 'assets', icon: <FolderOpen size={20} />, tooltip: 'Asset Library', panel: 'assets'},
    {id: 'documents', icon: <FileText size={20} />, tooltip: 'Documents', panel: ''},
    {id: 'archive', icon: <Archive size={20} />, tooltip: 'Archive', panel: ''},
  ]},
  {label: 'Manage', items: [
    {id: 'saved-views', icon: <Bookmark size={20} />, tooltip: 'Saved Views & Pathways', panel: 'saved-views'},
    {id: 'quick-actions', icon: <Zap size={20} />, tooltip: 'Quick Actions', panel: 'quick-actions'},
    {id: 'history', icon: <History size={20} />, tooltip: 'Session History', panel: 'history'},
    {id: 'collaboration', icon: <Users size={20} />, tooltip: 'Collaboration', panel: ''},
    {id: 'settings', icon: <Settings size={20} />, tooltip: 'Settings', panel: ''},
  ]},
]

const PANELS: Record<string, ReactNode> = {
  network: <NetworkPanel />,
  filter: <FilterPanel />,
  layout: <LayoutPanel />,
  layers: <LayersPanel />,
  'saved-views': <SavedViewsPanel />,
  assets: <AssetLibraryPanel />,
  'quick-actions': <QuickActionsPanel />,
  history: <HistoryPanel />,
}

export interface FloatingToolbarProps {
  panels?: Partial<Record<string, ReactNode>>
}

export function FloatingToolbar({panels}: FloatingToolbarProps) {
  const {activeTool, pinnedPanel, setActiveTool, togglePinnedPanel} = useMindMapUiStore()
  const activeRecord = useActiveRecord()
  const {fitView} = useReactFlow()
  const resolvedPanels = useMemo(() => panels ?? {}, [panels])

  // Synthesize Investigation — local panel state only; this is a canvas
  // action, not navigation, so it does not touch the Zustand UI store or
  // the mindmap-context god-object.
  const [showSynthesis, setShowSynthesis] = useState(false)
  const storeNodes = useMindMapStore((s) => s.nodes)
  const storeEdges = useMindMapStore((s) => s.edges)

  const synthesisNodes = useMemo<SynthesisNode[]>(() => {
    return storeNodes.filter(isRecordNode).map((n) => ({
      id: n.id,
      table: resolveNodeTable(n) as string,
      title: resolveNodeTitle(n),
    }))
  }, [storeNodes])

  const synthesisEdges = useMemo<SynthesisEdge[]>(() => {
    const ids = new Set(synthesisNodes.map((n) => n.id))
    return storeEdges
      .filter((e) => ids.has(e.source) && ids.has(e.target))
      .map((e) => {
        const data = e.data as Record<string, unknown> | undefined
        const reasoning = data?.reasoning
        return {
          source: e.source,
          target: e.target,
          ...(typeof e.label === 'string' ? {label: e.label} : {}),
          ...(typeof reasoning === 'string' ? {reasoning} : {}),
        }
      })
  }, [storeEdges, synthesisNodes])

  const canSynthesize = synthesisNodes.length >= 2

  const renderToolbarItem = (item: (typeof TOOLBAR_GROUPS)[number]['items'][number]) => {
    const isPinned = pinnedPanel === item.id
    const panel = resolvedPanels[item.panel] ?? PANELS[item.panel]

    if (!panel) {
      return (
        <span
          key={item.id}
          role='img'
          aria-label={`${item.tooltip} unavailable`}
          title={`${item.tooltip} unavailable`}
          className='flex size-10 items-center justify-center rounded-full text-[var(--ut-ink-faint)] opacity-40'>
          {item.icon}
        </span>
      )
    }

    const button = (
      <ToolbarButton
        key={item.id}
        tooltip={item.tooltip}
        isActive={activeTool === item.id}
        onClick={() => {
          setActiveTool(item.id)
          if (item.panel) {
            togglePinnedPanel(item.id)
          }
        }}
      >
        {item.icon}
      </ToolbarButton>
    )

    if (item.panel && panel) {

      if (isPinned) {
        return (
          <div key={item.id} className="relative">
            {button}
            <div className="absolute left-full top-0 ml-4 z-50">{panel}</div>
          </div>
        )
      }

      return (
        <HoverCard key={item.id} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>{button}</HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            sideOffset={16}
            className="bg-transparent border-none shadow-none w-auto p-0"
          >
            {panel}
          </HoverCardContent>
        </HoverCard>
      )
    }

    return button
  }

  return (
    <>
      <aside aria-label='Research toolbar' className="absolute top-1/2 left-4 z-20 -translate-y-1/2 flex w-14 flex-col items-center gap-1 rounded-2xl border border-white/10 bg-neutral-800/95 p-2 text-[var(--ut-paper)] shadow-[0_1px_0_0_#ffffff0d_inset] backdrop-blur-md">
        {TOOLBAR_GROUPS.map((group, index) => (
          <div key={group.label} className='flex flex-col items-center gap-1'>
            {index > 0 && <div role='none' className='my-1 h-px w-6 shrink-0 bg-white/10' />}
            <span className='sr-only'>{group.label}</span>
            {group.items.map(renderToolbarItem)}
          </div>
        ))}

        {/* Active record — lights when a card is selected; click flies to it. */}
        {activeRecord && (
          <ToolbarButton
            tooltip={`Focus record: ${activeRecord.title}`}
            isActive
            onClick={() => fitView({nodes: [{id: activeRecord.id}], duration: 400, maxZoom: 1.1})}
          >
            <Crosshair size={20} strokeWidth={2} />
          </ToolbarButton>
        )}

        {/* Synthesize Investigation — turns the assembled canvas into an
            Ultraterrestrial research narrative. Needs at least two record
            nodes to have anything to synthesize. */}
        {canSynthesize && (
          <ToolbarButton
            tooltip="Synthesize Investigation"
            isActive={showSynthesis}
            onClick={() => setShowSynthesis((v) => !v)}
          >
            <ScrollText size={20} strokeWidth={2} />
          </ToolbarButton>
        )}

        <div role="none" className="my-1 h-px w-6 shrink-0 bg-white/10" />

        {/* Profile */}
        <div aria-label='Research profile' className='flex size-10 items-center justify-center rounded-full bg-stone-200 text-[10px] font-medium tracking-widest text-stone-500' title='Research profile'>
          RN
        </div>
      </aside>

      <SynthesisPanelHost
        open={showSynthesis}
        nodes={synthesisNodes}
        edges={synthesisEdges}
        onClose={() => setShowSynthesis(false)}
      />
    </>
  )
}
