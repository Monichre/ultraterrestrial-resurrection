"use client"

import { useCallback, useEffect, useState } from "react"
import { Bookmark, Eye, Trash2, Clock, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import type { Edge, Node } from "@xyflow/react"
import { useMindMap } from "@/contexts/mindmap/mindmap-context"
import { useMindMapStore } from "@/features/mindmap/store"
import { useMindMapUiStore } from "@/features/mindmap/store/mindmap-ui-store"

const STORAGE_KEY = "mindmap-saved-views"

interface SavedView {
  id: string
  name: string
  created: number
  nodeCount: number
  nodes: Node[]
  edges: Edge[]
}

const EXPLORATION_PATHWAYS = [
  { id: "government-disclosure", name: "Government Disclosure Timeline", description: "Follow the progression of official UAP disclosures", steps: 8, duration: "15 min" },
  { id: "military-encounters", name: "Military Encounters Deep Dive", description: "Explore military UAP encounters and witness testimonies", steps: 12, duration: "25 min" },
  { id: "scientific-investigation", name: "Scientific Investigation Trail", description: "Track scientific approaches to UAP research", steps: 6, duration: "12 min" },
]

function loadSavedViews(): SavedView[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedView[]) : []
  } catch {
    return []
  }
}

function persistSavedViews(views: SavedView[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
}

function formatDate(timestamp: number) {
  const days = Math.floor((Date.now() - timestamp) / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return new Date(timestamp).toLocaleDateString()
}

export function SavedViewsPanel() {
  const { getNodes, getEdges, fitView } = useMindMap()
  const { setNodes, setEdges } = useMindMapStore()
  const { startTour, addSessionEvent, setActiveView } = useMindMapUiStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [views, setViews] = useState<SavedView[]>([])
  const [selectedView, setSelectedView] = useState<string | null>(null)

  useEffect(() => {
    setViews(loadSavedViews())
  }, [])

  const saveCurrent = useCallback(() => {
    const nodes = getNodes()
    if (nodes.length === 0) return
    const name = typeof window !== "undefined"
      ? window.prompt("Name this view", `View ${views.length + 1}`)
      : null
    if (!name) return
    const next: SavedView = {
      id: `view-${Date.now()}`,
      name,
      created: Date.now(),
      nodeCount: nodes.length,
      nodes,
      edges: getEdges(),
    }
    const updated = [next, ...views]
    setViews(updated)
    persistSavedViews(updated)
    addSessionEvent({ type: "save", label: `Saved view "${name}"`, detail: `${nodes.length} nodes` })
  }, [getNodes, getEdges, views, addSessionEvent])

  const loadView = useCallback(
    (view: SavedView) => {
      setNodes(view.nodes)
      setEdges(view.edges)
      setActiveView("canvas")
      setTimeout(() => fitView({ padding: 0.2 }), 200)
      addSessionEvent({ type: "save", label: `Loaded view "${view.name}"` })
    },
    [setNodes, setEdges, setActiveView, fitView, addSessionEvent]
  )

  const deleteView = useCallback(
    (id: string) => {
      const updated = views.filter((v) => v.id !== id)
      setViews(updated)
      persistSavedViews(updated)
    },
    [views]
  )

  const startPathway = useCallback(
    (pathwayId: string, name: string) => {
      startTour(pathwayId, "guided")
      addSessionEvent({ type: "tour", label: `Started tour: ${name}` })
    },
    [startTour, addSessionEvent]
  )

  const filteredViews = views.filter((view) =>
    view.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-[420px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Saved Views & Pathways</h3>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search saved views..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-4 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
        </div>
      </header>

      <Tabs defaultValue="saved" className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          <TabsTrigger
            value="saved"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Saved Views
          </TabsTrigger>
          <TabsTrigger
            value="pathways"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Guided Tours
          </TabsTrigger>
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-80">
          <TabsContent value="saved" className="space-y-2 mt-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Your Saved Views</h4>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={saveCurrent}>
                <PlusIcon className="mr-1" />
                Save Current
              </Button>
            </div>

            {filteredViews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-500">
                <Bookmark size={20} className="mb-2 opacity-50" strokeWidth={2} />
                <p className="text-sm">No saved views</p>
                <p className="text-xs">Save the current canvas to revisit it later</p>
              </div>
            ) : (
              filteredViews.map((view) => (
                <div
                  key={view.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedView === view.id
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-neutral-700/30 border-neutral-600/30 hover:bg-neutral-700/50"
                  }`}
                  onClick={() => setSelectedView(view.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium truncate">{view.name}</h5>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{view.nodeCount} nodes</span>
                    <div className="flex items-center gap-1">
                      <Clock size={10} strokeWidth={2} />
                      <span>{formatDate(view.created)}</span>
                    </div>
                  </div>

                  {selectedView === view.id && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-600">
                      <Button
                        size="sm"
                        className="flex-1 h-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          loadView(view)
                        }}
                      >
                        <Eye size={12} className="mr-1" strokeWidth={2} />
                        Load View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteView(view.id)
                        }}
                      >
                        <Trash2 size={12} strokeWidth={2} />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="pathways" className="space-y-2 mt-0">
            <h4 className="text-sm font-medium mb-3">Curated Exploration Pathways</h4>

            {EXPLORATION_PATHWAYS.map((pathway) => (
              <div
                key={pathway.id}
                className="p-3 rounded-lg bg-neutral-700/30 border border-neutral-600/30 hover:bg-neutral-700/50 transition-colors"
              >
                <h5 className="text-sm font-medium mb-1">{pathway.name}</h5>
                <p className="text-xs text-gray-400 line-clamp-2">{pathway.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 my-3">
                  <span>{pathway.steps} steps</span>
                  <span>{pathway.duration}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full h-7"
                  onClick={() => startPathway(pathway.id, pathway.name)}
                >
                  <Compass size={12} className="mr-1" strokeWidth={2} />
                  Start Guided Tour
                </Button>
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
