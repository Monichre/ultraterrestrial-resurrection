"use client"

import { Zap, Save, Download, RefreshCw, Trash2, Plus, Maximize, Sparkles, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMindMap } from "@/contexts/mindmap/mindmap-context"
import { useMindMapStore } from "@/features/mindmap/store"
import { useMindMapUiStore } from "@/features/mindmap/store/mindmap-ui-store"

function formatTime(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(timestamp).toLocaleDateString()
}

export function QuickActionsPanel() {
  const { fitView, saveMindMap, addUserInputNode, getNodes, getEdges, screenToFlowPosition } = useMindMap()
  const { setNodes, setEdges } = useMindMapStore()
  const { sessionEvents, addSessionEvent, setCommandMenuOpen } = useMindMapUiStore()

  const centerPosition = () => {
    if (typeof window === "undefined") return { x: 0, y: 0 }
    return screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }

  const handleAddNode = () => {
    addUserInputNode({ input: "", user: "User", position: centerPosition() })
  }

  const handleFitView = () => {
    fitView({ padding: 0.2 })
  }

  const handleSave = () => {
    saveMindMap()
    addSessionEvent({ type: "save", label: "Session saved" })
  }

  const handleExport = () => {
    if (typeof window === "undefined") return
    const data = { nodes: getNodes(), edges: getEdges(), exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `research-canvas-${Date.now()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
  }

  const actions = [
    {
      id: "add-node",
      name: "Add Node",
      description: "Drop a new input node on the canvas",
      icon: <Plus size={16} strokeWidth={2} />,
      shortcut: "N",
      onClick: handleAddNode,
    },
    {
      id: "search",
      name: "Search Database",
      description: "Open the command menu to query records",
      icon: <Sparkles size={16} strokeWidth={2} />,
      shortcut: "/",
      onClick: () => setCommandMenuOpen(true),
    },
    {
      id: "fit-view",
      name: "Fit to Screen",
      description: "Zoom to fit all nodes",
      icon: <Maximize size={16} strokeWidth={2} />,
      shortcut: "Ctrl+0",
      onClick: handleFitView,
    },
    {
      id: "save",
      name: "Save Session",
      description: "Persist the current canvas locally",
      icon: <Save size={16} strokeWidth={2} />,
      shortcut: "Ctrl+S",
      onClick: handleSave,
    },
    {
      id: "export",
      name: "Export JSON",
      description: "Download nodes and edges",
      icon: <Download size={16} strokeWidth={2} />,
      shortcut: "Ctrl+E",
      onClick: handleExport,
    },
    {
      id: "clear",
      name: "Clear Canvas",
      description: "Remove all nodes and edges",
      icon: <Trash2 size={16} strokeWidth={2} />,
      shortcut: "",
      onClick: handleClear,
      danger: true,
    },
  ]

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Quick Actions</h3>
        </div>
        <p className="text-xs text-neutral-400">Common canvas operations</p>
      </header>

      <div className="p-3 overflow-y-auto max-h-96 space-y-1">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            onClick={action.onClick}
            className="w-full justify-start h-auto p-3 hover:bg-white/10 text-left"
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  action.danger ? "bg-red-500/15 text-red-400" : "bg-neutral-700/50"
                }`}
              >
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{action.name}</span>
                  {action.shortcut && (
                    <Badge className="bg-white/5 text-[#8c8c8c] text-xs font-mono">
                      {action.shortcut}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-400 truncate">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}

        <Separator className="bg-white/5 my-2" />

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <History size={14} strokeWidth={2} />
            Recent Activity
          </h4>
          <div className="space-y-1">
            {sessionEvents.length === 0 ? (
              <p className="text-xs text-neutral-500 px-2 py-2">No recent activity</p>
            ) : (
              sessionEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-700/30 transition-colors"
                >
                  <span className="text-sm text-white truncate">{event.label}</span>
                  <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
