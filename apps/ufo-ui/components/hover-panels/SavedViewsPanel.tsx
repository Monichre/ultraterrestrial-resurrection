"use client"

import { Bookmark, Plus, Star, MoreHorizontal } from "lucide-react"
import { PanelWrapper } from "./PanelWrapper"

const SAVED_VIEWS = [
  { id: 1, name: "Nimitz Timeline", starred: true, lastViewed: "2 hours ago" },
  { id: 2, name: "Government Disclosure", starred: false, lastViewed: "1 day ago" },
  { id: 3, name: "Mass Sightings", starred: true, lastViewed: "3 days ago" },
  { id: 4, name: "Roswell Deep Dive", starred: false, lastViewed: "1 week ago" },
]

export function SavedViewsPanel() {
  return (
    <PanelWrapper texture="paper" className="w-72">
      <div className="p-4 border-b border-neutral-800/50">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bookmark size={16} />
          Saved Views & Pathways
        </h3>
        <p className="text-xs text-neutral-500 mt-1">Quick access to your research</p>
      </div>
      
      <div className="p-2 space-y-1">
        {SAVED_VIEWS.map((view) => (
          <button
            key={view.id}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{view.name}</span>
                {view.starred && <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
              </div>
              <span className="text-xs text-neutral-600">{view.lastViewed}</span>
            </div>
            <MoreHorizontal size={14} className="text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
        
        <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 border border-dashed border-neutral-700/50 mt-2">
          <Plus size={14} />
          Save Current View
        </button>
      </div>
    </PanelWrapper>
  )
}
