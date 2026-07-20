"use client"

import { Filter, RotateCcw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { PanelWrapper } from "./PanelWrapper"

const FILTER_CATEGORIES = [
  { label: "Sightings", color: "bg-emerald-500", count: 2341 },
  { label: "Close Encounters", color: "bg-amber-500", count: 847 },
  { label: "Documents", color: "bg-blue-500", count: 1256 },
  { label: "Witnesses", color: "bg-purple-500", count: 534 },
  { label: "Military Reports", color: "bg-rose-500", count: 312 },
  { label: "Government Files", color: "bg-cyan-500", count: 189 },
]

export function FilterPanel() {
  return (
    <PanelWrapper texture="paper" className="w-80">
      <div className="p-4 border-b border-neutral-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Filter size={16} />
            Filter Panel
          </h3>
          <button className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-1">Toggle data categories</p>
      </div>
      
      <div className="p-4 space-y-3">
        {FILTER_CATEGORIES.map((item) => (
          <div key={item.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`} />
              <div>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{item.label}</span>
                <span className="ml-2 text-xs text-neutral-600">{item.count.toLocaleString()}</span>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-neutral-800/50">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>5,479 items visible</span>
          <button className="text-emerald-400 hover:text-emerald-300 transition-colors">Apply Filters</button>
        </div>
      </div>
    </PanelWrapper>
  )
}
