"use client"

import { Network, GitBranch, Share2, Waypoints, CircleDot } from "lucide-react"
import { PanelWrapper } from "./PanelWrapper"

export function NetworkPanel() {
  return (
    <PanelWrapper texture="grid" className="w-72">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Network size={16} />
          Network Graph Explorer
        </h3>
        <p className="text-xs text-neutral-500 mb-3">Visualize entity relationships</p>
        
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <GitBranch size={14} />
            </div>
            <div>
              <div className="font-medium">Connection Map</div>
              <div className="text-xs text-neutral-500">View linked entities</div>
            </div>
          </button>
          
          <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Share2 size={14} />
            </div>
            <div>
              <div className="font-medium">Entity Relationships</div>
              <div className="text-xs text-neutral-500">Explore connections</div>
            </div>
          </button>
          
          <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Waypoints size={14} />
            </div>
            <div>
              <div className="font-medium">Pathways</div>
              <div className="text-xs text-neutral-500">Trace event chains</div>
            </div>
          </button>
          
          <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <CircleDot size={14} />
            </div>
            <div>
              <div className="font-medium">Cluster Analysis</div>
              <div className="text-xs text-neutral-500">Group similar events</div>
            </div>
          </button>
        </div>
      </div>
    </PanelWrapper>
  )
}
