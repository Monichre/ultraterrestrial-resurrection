'use client'

import {useMemo} from 'react'
import {Network, Clock, LayoutGrid, Filter, Bookmark, Zap, FolderOpen} from 'lucide-react'
import {Avatar, AvatarImage} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'

import {SavedViewsPanel} from './hover-panels/SavedViewsPanel'
import {QuickActionsPanel} from './hover-panels/QuickActionsPanel'
import {AssetLibraryPanel} from './hover-panels/AssetLibraryPanel'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'
import { ToolbarButton } from "./ToolbarButton"
import { NetworkPanel } from "./hover-panels/NetworkPanel"
import { TimelinePanel } from "./hover-panels/TimelinePanel"
import { LayoutPanel } from "./hover-panels/LayoutPanel"
import { FilterPanel } from "./hover-panels/FilterPanel"

const TOOLBAR_ITEMS = [
  {
    id: "network",
    icon: <Network size={20} strokeWidth={2} />,
    tooltip: "Network Graph Explorer",
    submenu: <NetworkPanel />,
  },
  {
    id: "timeline",
    icon: <Clock size={20} strokeWidth={2} />,
    tooltip: "Timeline Scrubber",
    submenu: <TimelinePanel />,
  },
  {
    id: "layout",
    icon: <LayoutGrid size={20} strokeWidth={2} />,
    tooltip: "Layout Algorithms",
    submenu: <LayoutPanel />,
  },
  {
    id: "filter",
    icon: <Filter size={20} strokeWidth={2} />,
    tooltip: "Filter Panel",
    submenu: <FilterPanel />,
  },
  {
    id: "saved-views",
    icon: <Bookmark size={20} strokeWidth={2} />,
    tooltip: "Saved Views & Pathways",
    submenu: <SavedViewsPanel />,
  },
  {
    id: "quick-actions",
    icon: <Zap size={20} strokeWidth={2} />,
    tooltip: "Quick Actions",
    submenu: <QuickActionsPanel />,
  },
  {
    id: "assets",
    icon: <FolderOpen size={20} strokeWidth={2} />,
    tooltip: "Asset Library",
    submenu: <AssetLibraryPanel />,
  },
]


export interface FloatingToolbarProps {
  panels?: Partial<Record<string, React.ReactNode>>
}

export function FloatingToolbar({panels}: FloatingToolbarProps) {
  const {activeTool, pinnedPanel, setActiveTool, togglePinnedPanel} = useMindMapUiStore()

  const resolvedPanels = useMemo(() => panels || {}, [panels])

  const renderToolbarItem = (item: any) => {
    const panel = resolvedPanels[item.id] ?? item.submenu
    const isPinned = pinnedPanel === item.id

    const button = (
      <ToolbarButton
        key={item.id}
        tooltip={item.tooltip}
        isActive={activeTool === item.id}
        onClick={() => {
          setActiveTool(item.id)
          togglePinnedPanel(item.id)
        }}>
        {item.icon}
      </ToolbarButton>
    )

    if (!panel) {
      return button
    }

    if (isPinned) {
      return (
        <div key={item.id} className='relative'>
          {button}
          <div className='absolute left-full top-0 ml-4'>{panel}</div>
        </div>
      )
    }

    return (
      <HoverCard key={item.id} openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>{button}</HoverCardTrigger>
        <HoverCardContent
          side='right'
          align='start'
          sideOffset={16}
          className='bg-transparent border-none shadow-none w-auto p-0'>
          {panel}
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <aside className='flex flex-col items-center gap-2 p-2 rounded-full bg-neutral-800/90 text-white shadow-[0_0_0_0_#ffffff_inset,0_0_0_1px_#ffffff0d_inset,0_1px_0_0_#ffffff0d_inset] backdrop-blur-md'>
      {/* Primary Tools */}
      {TOOLBAR_ITEMS.map(renderToolbarItem)}

      {/* Divider */}
      <div role='none' className='my-2 w-6 h-px bg-white/10 shrink-0'></div>

      {/* Profile */}
      <ToolbarButton tooltip='Research Profile' className='p-0 w-10 h-10'>
        <Avatar className='w-10 h-10'>
          <AvatarImage src='https://placehold.co/128x128' alt='Researcher Avatar' />
        </Avatar>
      </ToolbarButton>
    </aside>
  )
}
