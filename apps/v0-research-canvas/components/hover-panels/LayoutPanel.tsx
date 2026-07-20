"use client"

import { useState } from "react"
import { LayoutGrid, Clock, Triangle, Globe, Network, Layers } from "lucide-react"
import { PanelWrapper } from "./PanelWrapper"

const LAYOUTS = [
  { 
    id: "chronological", 
    name: "Chronological", 
    description: "Timeline-based positioning",
    icon: Clock 
  },
  { 
    id: "thematic", 
    name: "Thematic", 
    description: "Grouped by topic/theme",
    icon: Triangle 
  },
  { 
    id: "geographic", 
    name: "Geographic", 
    description: "Location-based clustering",
    icon: Globe 
  },
  { 
    id: "network", 
    name: "Network Graph", 
    description: "Connection-based layout",
    icon: Network 
  },
  { 
    id: "hierarchical", 
    name: "Hierarchical", 
    description: "Parent-child relationships",
    icon: Layers 
  },
]

export function LayoutPanel() {
  const [activeLayout, setActiveLayout] = useState("chronological")
  const currentLayout = LAYOUTS.find(l => l.id === activeLayout)

  return (
    <PanelWrapper texture="noise" className="w-80 max-h-[500px] overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800/50">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <LayoutGrid size={16} />
          Layout Algorithms
        </h3>
        <p className="text-xs text-neutral-500 mt-1">Multiple perspectives for deeper context</p>
      </div>
      
      {/* Current Layout */}
      <div className="p-4 border-b border-neutral-800/50">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Current Layout</h4>
        {currentLayout && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="p-2 rounded-md bg-emerald-500/20">
              <currentLayout.icon size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{currentLayout.name}</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{currentLayout.description}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Available Layouts */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Available Layouts</h4>
        <div className="space-y-1">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setActiveLayout(layout.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeLayout === layout.id
                  ? 'bg-white/5 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-300'
              }`}
            >
              <layout.icon size={18} />
              <div className="text-left">
                <div className="text-sm font-medium">{layout.name}</div>
                <p className="text-xs text-neutral-500">{layout.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </PanelWrapper>
  )
}
