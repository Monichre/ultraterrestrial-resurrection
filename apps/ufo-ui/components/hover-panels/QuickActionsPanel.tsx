"use client"

import { Zap, Search, Download, Share, Sparkles, FileStack } from "lucide-react"
import { PanelWrapper } from "./PanelWrapper"

const QUICK_ACTIONS = [
  { icon: Search, label: "Deep Search", description: "Search across all data", color: "emerald" },
  { icon: Download, label: "Export Research", description: "Download as PDF/CSV", color: "blue" },
  { icon: Share, label: "Share Findings", description: "Generate shareable link", color: "amber" },
  { icon: Sparkles, label: "AI Analysis", description: "Run pattern detection", color: "purple" },
  { icon: FileStack, label: "Batch Import", description: "Import multiple files", color: "cyan" },
]

const COLOR_MAP = {
  emerald: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
  amber: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20",
  purple: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20",
}

export function QuickActionsPanel() {
  return (
    <PanelWrapper texture="grid" className="w-72">
      <div className="p-4 border-b border-neutral-800/50">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Zap size={16} />
          Quick Actions
        </h3>
        <p className="text-xs text-neutral-500 mt-1">Frequently used commands</p>
      </div>
      
      <div className="p-2 space-y-1">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group"
          >
            <div className={`p-1.5 rounded-md transition-colors ${COLOR_MAP[action.color as keyof typeof COLOR_MAP]}`}>
              <action.icon size={14} />
            </div>
            <div className="flex-1">
              <div className="font-medium">{action.label}</div>
              <div className="text-xs text-neutral-500">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </PanelWrapper>
  )
}
