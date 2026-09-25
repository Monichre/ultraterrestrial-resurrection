'use client'

import {useMemo, useState} from 'react'
import type {ReactNode} from 'react'
import {Network, Clock, Filter, Bookmark, FolderOpen, ScrollText} from 'lucide-react'
import type {Node} from '@xyflow/react'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {ToolbarButton} from './ToolbarButton'
import {NetworkPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/NetworkPanel'
import {TimelinePanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/TimelinePanel'
import {FilterPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/FilterPanel'
import {SavedViewsPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/SavedViewsPanel'
import {AssetLibraryPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/AssetLibraryPanel'
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

const TOOLBAR_ITEMS = [
  {
    id: 'network',
    icon: <Network size={20} strokeWidth={2} />,
    tooltip: 'Network Graph Explorer',
    panel: 'network',
  },
  {
    id: 'timeline',
    icon: <Clock size={20} strokeWidth={2} />,
    tooltip: 'Timeline Scrubber',
    panel: 'timeline',
  },
  {
    id: 'filter',
    icon: <Filter size={20} strokeWidth={2} />,
    tooltip: 'Filter Panel',
    panel: 'filter',
  },
  {
    id: 'saved-views',
    icon: <Bookmark size={20} strokeWidth={2} />,
    tooltip: 'Saved Views & Pathways',
    panel: 'saved-views',
  },
  {
    id: 'assets',
    icon: <FolderOpen size={20} strokeWidth={2} />,
    tooltip: 'Asset Library',
    panel: 'assets',
  },
]

const PANELS: Record<string, ReactNode> = {
  network: <NetworkPanel />,
  timeline: <TimelinePanel />,
  filter: <FilterPanel />,
  'saved-views': <SavedViewsPanel />,
  assets: <AssetLibraryPanel />,
}

export interface FloatingToolbarProps {
  panels?: Partial<Record<string, ReactNode>>
}

export function FloatingToolbar({panels}: FloatingToolbarProps) {
  const {activeTool, pinnedPanel, setActiveTool, togglePinnedPanel} = useMindMapUiStore()
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

  const renderToolbarItem = (item: (typeof TOOLBAR_ITEMS)[number]) => {
    const isPinned = pinnedPanel === item.id
    const panel = resolvedPanels[item.panel] ?? PANELS[item.panel]

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
      <aside className="absolute top-1/2 left-4 z-20 -translate-y-1/2 flex flex-col items-center gap-2 p-2 rounded-full border border-[var(--ut-line)] bg-[var(--ut-surface)] text-[var(--ut-paper)] backdrop-blur-md">
        {/* Primary Tools */}
        {TOOLBAR_ITEMS.map(renderToolbarItem)}

        {/* Divider */}
        <div role="none" className="my-2 w-6 h-px bg-[var(--ut-line)] shrink-0" />

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

        {/* Divider */}
        <div role="none" className="my-2 w-6 h-px bg-[var(--ut-line)] shrink-0" />

        {/* Profile */}
        <ToolbarButton tooltip="Research Profile" className="p-0 w-10 h-10">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=researcher" alt="Researcher Avatar" />
            <AvatarFallback className="bg-neutral-700 text-white text-xs">RN</AvatarFallback>
          </Avatar>
        </ToolbarButton>
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
