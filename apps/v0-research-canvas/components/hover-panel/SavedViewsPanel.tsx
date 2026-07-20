"use client"

import { useState } from "react"
import { Bookmark, Star, Eye, Share2, Trash2, Plus, Search, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface SavedView {
  id: string
  name: string
  description: string
  type: "exploration" | "pathway" | "tour"
  created: Date
  lastViewed: Date
  isStarred: boolean
  isPublic: boolean
  nodeCount: number
  creator: string
}

const SAVED_VIEWS: SavedView[] = [
  {
    id: "1",
    name: "Roswell & Coverups",
    description: "Comprehensive view of the Roswell incident and related government coverup activities",
    type: "pathway",
    created: new Date(Date.now() - 86400000 * 7),
    lastViewed: new Date(Date.now() - 3600000),
    isStarred: true,
    isPublic: true,
    nodeCount: 127,
    creator: "Dr. Sarah Chen",
  },
  {
    id: "2",
    name: "Modern Military Disclosures",
    description: "Pentagon UAP disclosures from 2017 onwards, including key military witnesses",
    type: "exploration",
    created: new Date(Date.now() - 86400000 * 3),
    lastViewed: new Date(Date.now() - 7200000),
    isStarred: false,
    isPublic: false,
    nodeCount: 89,
    creator: "You",
  },
  {
    id: "3",
    name: "Project Blue Book Network",
    description: "Complete institutional network of Project Blue Book personnel and investigations",
    type: "tour",
    created: new Date(Date.now() - 86400000 * 14),
    lastViewed: new Date(Date.now() - 86400000 * 2),
    isStarred: true,
    isPublic: true,
    nodeCount: 234,
    creator: "Research Team",
  },
  {
    id: "4",
    name: "Civilian Witness Network",
    description: "Network of civilian witnesses and their interconnected sighting reports",
    type: "exploration",
    created: new Date(Date.now() - 86400000 * 21),
    lastViewed: new Date(Date.now() - 86400000 * 5),
    isStarred: false,
    isPublic: true,
    nodeCount: 456,
    creator: "Community",
  },
]

const EXPLORATION_PATHWAYS = [
  {
    id: "p1",
    name: "Government Disclosure Timeline",
    description: "Follow the progression of official UAP disclosures",
    steps: 8,
    duration: "15 min",
  },
  {
    id: "p2",
    name: "Military Encounters Deep Dive",
    description: "Explore military UAP encounters and witness testimonies",
    steps: 12,
    duration: "25 min",
  },
  {
    id: "p3",
    name: "Scientific Investigation Trail",
    description: "Track scientific approaches to UAP research",
    steps: 6,
    duration: "12 min",
  },
]

const VIEW_TYPE_COLORS = {
  exploration: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pathway: "bg-green-500/20 text-green-400 border-green-500/30",
  tour: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

export function SavedViewsPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState<string | null>(null)

  const filteredViews = SAVED_VIEWS.filter(
    (view) =>
      view.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const toggleStar = (id: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle star for view ${id}`)
  }

  return (
    <div className="w-[420px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Saved Views & Pathways</h3>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 -translate-y-1/2 size-4 text-gray-400" strokeWidth={2} />
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
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <Plus size={12} className="mr-1" strokeWidth={2} />
                Save Current
              </Button>
            </div>

            {filteredViews.map((view) => (
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-medium truncate">{view.name}</h5>
                      <Badge className={`text-xs ${VIEW_TYPE_COLORS[view.type]}`}>{view.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{view.description}</p>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(view.id)
                      }}
                      className="size-6 hover:bg-white/10"
                    >
                      <Star
                        size={12}
                        className={view.isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                        strokeWidth={2}
                      />
                    </Button>
                    {view.isPublic && <Share2 size={12} className="text-gray-400" strokeWidth={2} />}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span>{view.nodeCount} nodes</span>
                    <span>by {view.creator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} strokeWidth={2} />
                    <span>{formatDate(view.lastViewed)}</span>
                  </div>
                </div>

                {selectedView === view.id && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-600">
                    <Button size="sm" className="flex-1 h-7">
                      <Eye size={12} className="mr-1" strokeWidth={2} />
                      Load View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <Share2 size={12} strokeWidth={2} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-red-400 hover:text-red-300">
                      <Trash2 size={12} strokeWidth={2} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pathways" className="space-y-2 mt-0">
            <h4 className="text-sm font-medium mb-3">Curated Exploration Pathways</h4>

            {EXPLORATION_PATHWAYS.map((pathway) => (
              <div
                key={pathway.id}
                className="p-3 rounded-lg bg-neutral-700/30 border border-neutral-600/30 hover:bg-neutral-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium mb-1">{pathway.name}</h5>
                    <p className="text-xs text-gray-400 line-clamp-2">{pathway.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>{pathway.steps} steps</span>
                  <span>{pathway.duration}</span>
                </div>

                <Button size="sm" className="w-full h-7">
                  Start Guided Tour
                </Button>
              </div>
            ))}

            <div className="pt-2 border-t border-neutral-700">
              <Button size="sm" variant="ghost" className="w-full h-7">
                <Plus size={12} className="mr-1" strokeWidth={2} />
                Create Custom Pathway
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
