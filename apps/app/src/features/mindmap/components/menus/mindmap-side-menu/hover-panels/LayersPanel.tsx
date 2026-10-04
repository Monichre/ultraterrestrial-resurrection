"use client"

import { useMemo } from "react"
import { Eye, EyeOff, Layers as LayersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMindMapStore } from "@/features/mindmap/store"
import { useMindMapUiStore } from "@/features/mindmap/store/mindmap-ui-store"

const TYPE_COLORS = [
  "bg-blue-500/20 text-blue-400",
  "bg-green-500/20 text-green-400",
  "bg-yellow-500/20 text-yellow-400",
  "bg-purple-500/20 text-purple-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-rose-500/20 text-rose-400",
  "bg-orange-500/20 text-orange-400",
]

function prettifyType(type: string) {
  if (!type) return "Untyped"
  return type
    .replace(/Node$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

export function LayersPanel() {
  const { nodes } = useMindMapStore()
  const { hiddenNodeTypes, toggleNodeTypeHidden } = useMindMapUiStore()

  const layers = useMemo(() => {
    const counts = new Map<string, number>()
    for (const node of nodes) {
      const type = String((node.data as Record<string, unknown>)?.type ?? node.type ?? "untyped")
      counts.set(type, (counts.get(type) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }, [nodes])

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2">
          <LayersIcon size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Layers</h3>
        </div>
        <p className="text-xs text-neutral-400 mt-1">Toggle visibility by entity type</p>
      </header>

      <div className="p-2 overflow-y-auto max-h-96">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-500">
            <LayersIcon size={20} className="mb-2 opacity-50" strokeWidth={2} />
            <p className="text-sm">No layers yet</p>
            <p className="text-xs">Add nodes to the canvas to see layers</p>
          </div>
        ) : (
          <div className="space-y-1">
            {layers.map((layer, index) => {
              const isHidden = hiddenNodeTypes.includes(layer.type)
              return (
                <div
                  key={layer.type}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-700/30 transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleNodeTypeHidden(layer.type)}
                    className="size-6 p-0 hover:bg-white/10"
                    title={isHidden ? "Show layer" : "Hide layer"}
                  >
                    {isHidden ? (
                      <EyeOff size={14} className="text-gray-500" strokeWidth={2} />
                    ) : (
                      <Eye size={14} className="text-white" strokeWidth={2} />
                    )}
                  </Button>

                  <div className={`w-2 h-2 rounded-full ${TYPE_COLORS[index % TYPE_COLORS.length]}`} />

                  <span className={`flex-1 text-sm ${isHidden ? "text-gray-500" : "text-white"}`}>
                    {prettifyType(layer.type)}
                  </span>

                  <Badge className="bg-neutral-700 text-white text-xs">{layer.count}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-t-[#292f35] p-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{layers.length} layers</span>
          <span>{hiddenNodeTypes.length} hidden</span>
        </div>
      </footer>
    </div>
  )
}
