"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, Grid3X3, List, Upload, FileText, GitBranch, File } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PanelWrapper } from "./PanelWrapper"

type ViewMode = "grid" | "list"
type Tab = "my-files" | "saved-blocks" | "asset-library"

interface Asset {
  id: string
  name: string
  size: string
  lastModified: string
  icon: "document" | "graph" | "file"
}

const ASSETS: Asset[] = [
  { id: "1", name: "Research Notes", size: "2.4 MB", lastModified: "2 hours ago", icon: "document" },
  { id: "2", name: "Network Graph", size: "1.8 MB", lastModified: "1 day ago", icon: "graph" },
  { id: "3", name: "Timeline Data", size: "856 KB", lastModified: "3 days ago", icon: "file" },
]

const ICON_MAP = {
  document: FileText,
  graph: GitBranch,
  file: File,
}

export function AssetLibraryPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState<Tab>("my-files")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs: { id: Tab; label: string }[] = [
    { id: "my-files", label: "My Files" },
    { id: "saved-blocks", label: "Saved Blocks" },
    { id: "asset-library", label: "Asset Library" },
  ]

  return (
    <PanelWrapper texture="paper" className="w-80 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Asset Library</h3>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
              <SlidersHorizontal size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "text-white bg-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "text-white bg-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white/5 border-neutral-700/50 text-sm placeholder:text-neutral-500 focus-visible:ring-neutral-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-neutral-900"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="p-4 pt-2 max-h-64 overflow-y-auto">
        <div className={cn(
          "gap-3",
          viewMode === "grid" ? "grid grid-cols-2" : "flex flex-col"
        )}>
          {/* Upload Card */}
          <button className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-700/50 bg-white/5 hover:bg-white/10 hover:border-neutral-600 transition-colors",
            viewMode === "grid" ? "p-6" : "p-4 flex-row gap-3"
          )}>
            <Upload size={20} className="text-neutral-500 mb-2" />
            <span className="text-xs text-neutral-400">Upload</span>
          </button>

          {/* Asset Cards */}
          {ASSETS.map((asset) => {
            const IconComponent = ICON_MAP[asset.icon]
            return (
              <button
                key={asset.id}
                className={cn(
                  "rounded-lg bg-white/5 hover:bg-white/10 border border-neutral-700/30 transition-colors text-left",
                  viewMode === "grid" ? "p-4" : "p-3 flex items-center gap-3"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-md bg-neutral-700/30",
                  viewMode === "grid" ? "w-10 h-10 mb-3" : "w-8 h-8 flex-shrink-0"
                )}>
                  <IconComponent size={viewMode === "grid" ? 18 : 14} className="text-neutral-400" />
                </div>
                <div className={viewMode === "list" ? "flex-1 min-w-0" : ""}>
                  <p className="text-xs font-medium text-white truncate">{asset.name}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{asset.size}</p>
                  <p className="text-[10px] text-neutral-600">{asset.lastModified}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </PanelWrapper>
  )
}
