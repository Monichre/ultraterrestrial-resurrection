"use client"

import { useState } from "react"
import {
  Network,
  Clock,
  LayoutGrid,
  Filter,
  Bookmark,
  Zap,
  FolderOpen,
  Archive,
  Layers,
  FileText,
  Users,
  History,
  Settings,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ToolbarButton } from "./ToolbarButton"

// Explore group
import { NetworkPanel } from "@/components/hover-panels/NetworkPanel"
import { TimelinePanel } from "@/components/hover-panels/TimelinePanel"
import { FilterPanel } from "@/components/hover-panels/FilterPanel"
import { LayoutPanel } from "@/components/hover-panels/LayoutPanel"

// Content group
import { LayersPanel } from "@/components/hover-panels/LayersPanel"
import { AssetLibraryPanel } from "@/components/hover-panels/AssetLibraryPanel"
import { TemplatesPanel } from "@/components/hover-panels/TemplatesPanel"
import { ArchivePanel } from "@/components/hover-panels/ArchivePanel"

// Manage group
import { SavedViewsPanel } from "@/components/hover-panels/SavedViewsPanel"
import { QuickActionsPanel } from "@/components/hover-panels/QuickActionsPanel"
import { HistoryPanel } from "@/components/hover-panels/HistoryPanel"
import { CollaborationPanel } from "@/components/hover-panels/CollaborationPanel"
import { SettingsPanel } from "@/components/hover-panels/SettingsPanel"

interface ToolbarItem {
  id: string
  icon: React.ReactNode
  tooltip: string
  submenu: React.ReactNode
}

interface ToolbarGroup {
  label: string
  items: ToolbarItem[]
}

const TOOLBAR_GROUPS: ToolbarGroup[] = [
  {
    label: "Explore",
    items: [
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
        id: "filter",
        icon: <Filter size={20} strokeWidth={2} />,
        tooltip: "Filter Panel",
        submenu: <FilterPanel />,
      },
      {
        id: "layout",
        icon: <LayoutGrid size={20} strokeWidth={2} />,
        tooltip: "Layout Algorithms",
        submenu: <LayoutPanel />,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        id: "layers",
        icon: <Layers size={20} strokeWidth={2} />,
        tooltip: "Layers",
        submenu: <LayersPanel />,
      },
      {
        id: "assets",
        icon: <FolderOpen size={20} strokeWidth={2} />,
        tooltip: "Asset Library",
        submenu: <AssetLibraryPanel />,
      },
      {
        id: "templates",
        icon: <FileText size={20} strokeWidth={2} />,
        tooltip: "Templates",
        submenu: <TemplatesPanel />,
      },
      {
        id: "archive",
        icon: <Archive size={20} strokeWidth={2} />,
        tooltip: "Archive Datasets",
        submenu: <ArchivePanel />,
      },
    ],
  },
  {
    label: "Manage",
    items: [
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
        id: "history",
        icon: <History size={20} strokeWidth={2} />,
        tooltip: "History",
        submenu: <HistoryPanel />,
      },
      {
        id: "collaboration",
        icon: <Users size={20} strokeWidth={2} />,
        tooltip: "Collaboration",
        submenu: <CollaborationPanel />,
      },
      {
        id: "settings",
        icon: <Settings size={20} strokeWidth={2} />,
        tooltip: "Settings",
        submenu: <SettingsPanel />,
      },
    ],
  },
]

const ALL_ITEMS = TOOLBAR_GROUPS.flatMap((g) => g.items)

export function FloatingToolbar() {
  const [activeTool, setActiveTool] = useState<string>("network")

  const renderItem = (item: ToolbarItem) => {
    const button = (
      <ToolbarButton
        key={item.id}
        tooltip={item.tooltip}
        isActive={activeTool === item.id}
        onClick={() => setActiveTool(item.id)}
      >
        {item.icon}
      </ToolbarButton>
    )

    return (
      <HoverCard key={item.id} openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>{button}</HoverCardTrigger>
        <HoverCardContent
          side="right"
          align="start"
          sideOffset={16}
          className="bg-transparent border-none shadow-none w-auto p-0"
        >
          {item.submenu}
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <aside
      aria-label="Research toolbar"
      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 flex flex-col items-center gap-1 p-2 rounded-2xl bg-neutral-800/95 text-white shadow-[0_0_0_0_#ffffff_inset,0_0_0_1px_#ffffff0d_inset,0_1px_0_0_#ffffff0d_inset] backdrop-blur-md overflow-hidden"
      style={{
        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inflicted-1xid7cGZMmE1zz4oQgcbm6qthjn6c4.png)`,
        backgroundRepeat: "repeat",
        backgroundSize: "150px 150px",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Explore group */}
      <span className="sr-only">Explore</span>
      {TOOLBAR_GROUPS[0].items.map(renderItem)}

      <div role="none" className="my-1 w-6 h-px bg-white/10 shrink-0" />

      {/* Content group */}
      <span className="sr-only">Content</span>
      {TOOLBAR_GROUPS[1].items.map(renderItem)}

      <div role="none" className="my-1 w-6 h-px bg-white/10 shrink-0" />

      {/* Manage group */}
      <span className="sr-only">Manage</span>
      {TOOLBAR_GROUPS[2].items.map(renderItem)}

      <div role="none" className="my-1 w-6 h-px bg-white/10 shrink-0" />

      {/* Profile */}
      <ToolbarButton tooltip="Research Profile" className="p-0 w-10 h-10">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://placehold.co/128x128" alt="Researcher Avatar" />
        </Avatar>
      </ToolbarButton>
    </aside>
  )
}
