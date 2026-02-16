'use client'

import {useMemo} from 'react'
import type {ReactNode} from 'react'
import {Network, Clock, LayoutGrid, Filter, Bookmark, Zap, FolderOpen, Layers} from 'lucide-react'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {ToolbarButton} from './ToolbarButton'
import {NetworkPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/NetworkPanel'
import {TimelinePanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/TimelinePanel'
import {LayoutPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/LayoutPanel'
import {FilterPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/FilterPanel'
import {SavedViewsPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/SavedViewsPanel'
import {QuickActionsPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/QuickActionsPanel'
import {AssetLibraryPanel} from '@/features/mindmap/components/menus/mindmap-side-menu/hover-panels/AssetLibraryPanel'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

const TOOLBAR_ITEMS = [
  {
    id: 'menu',
    icon: <Layers size={20} strokeWidth={2} />,
    tooltip: 'Switch View',
    panel: null,
  },
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
    id: 'layout',
    icon: <LayoutGrid size={20} strokeWidth={2} />,
    tooltip: 'Layout Algorithms',
    panel: 'layout',
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
    id: 'quick-actions',
    icon: <Zap size={20} strokeWidth={2} />,
    tooltip: 'Quick Actions',
    panel: 'quick-actions',
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
  layout: <LayoutPanel />,
  filter: <FilterPanel />,
  'saved-views': <SavedViewsPanel />,
  'quick-actions': <QuickActionsPanel />,
  assets: <AssetLibraryPanel />,
}

export interface FloatingToolbarProps {
  panels?: Partial<Record<string, ReactNode>>
}

export function FloatingToolbar({panels}: FloatingToolbarProps) {
  const {activeTool, pinnedPanel, setActiveTool, togglePinnedPanel} = useMindMapUiStore()
  const resolvedPanels = useMemo(() => panels ?? {}, [panels])

  const renderToolbarItem = (item: (typeof TOOLBAR_ITEMS)[number]) => {
    const isPinned = pinnedPanel === item.id
    const panel = resolvedPanels[item.panel] ?? PANELS[item.panel]

    // Special handling for menu button - toggles full screen menu
    if (item.id === 'menu') {
      return (
        <ToolbarButton
          key={item.id}
          tooltip={item.tooltip}
          isActive={false}
          onClick={() => useMindMapUiStore.getState().toggleFullScreenMenu()}
        >
          {item.icon}
        </ToolbarButton>
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
    <aside className="absolute top-1/2 left-4 z-20 -translate-y-1/2 flex flex-col items-center gap-2 p-2 rounded-full bg-neutral-800/90 text-white shadow-[0_0_0_0_#ffffff_inset,0_0_0_1px_#ffffff0d_inset,0_1px_0_0_#ffffff0d_inset] backdrop-blur-md">
      {/* Primary Tools */}
      {TOOLBAR_ITEMS.map(renderToolbarItem)}

      {/* Divider */}
      <div role="none" className="my-2 w-6 h-px bg-white/10 shrink-0" />

      {/* Profile */}
      <ToolbarButton tooltip="Research Profile" className="p-0 w-10 h-10">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=researcher" alt="Researcher Avatar" />
          <AvatarFallback className="bg-neutral-700 text-white text-xs">RN</AvatarFallback>
        </Avatar>
      </ToolbarButton>
    </aside>
  )
}
