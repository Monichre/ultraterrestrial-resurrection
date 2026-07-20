"use client"

import { Archive, Clock, FileText, Image, Video, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PanelWrapper } from "./PanelWrapper"

const ARCHIVED_ITEMS = [
  {
    id: 1,
    name: "Phoenix Lights Analysis",
    type: "document",
    archivedAt: "2 days ago",
    icon: FileText,
  },
  {
    id: 2,
    name: "Witness Interview Notes",
    type: "document",
    archivedAt: "1 week ago",
    icon: FileText,
  },
  {
    id: 3,
    name: "Radar Data Visualization",
    type: "image",
    archivedAt: "2 weeks ago",
    icon: Image,
  },
  {
    id: 4,
    name: "Press Conference Recording",
    type: "video",
    archivedAt: "1 month ago",
    icon: Video,
  },
]

export function ArchivePanel() {
  return (
    <PanelWrapper texture="fabric" className="w-80 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="flex items-center gap-2">
          <Archive size={18} className="text-neutral-400" />
          <h3 className="text-sm font-medium text-white">Archive</h3>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Recently archived items</p>
      </div>

      {/* Archived Items */}
      <ScrollArea className="h-64">
        <div className="p-2 space-y-1">
          {ARCHIVED_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <item.icon size={16} className="text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.name}</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock size={10} />
                  <span>{item.archivedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                >
                  <RotateCcw size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-800/50">
        <Button
          variant="ghost"
          className="w-full h-8 text-xs text-neutral-400 hover:text-white hover:bg-white/5"
        >
          <Trash2 size={14} className="mr-2" />
          Empty Archive
        </Button>
      </div>
    </PanelWrapper>
  )
}
