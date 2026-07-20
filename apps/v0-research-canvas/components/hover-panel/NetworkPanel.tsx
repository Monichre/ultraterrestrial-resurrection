"use client"

import { useState } from "react"
import { Users, MapPin, Calendar, FileText, Eye, EyeOff, Settings2, Grid3X3, List, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const NODE_TYPES = [
  { id: "people", name: "People", icon: <Users size={14} />, color: "bg-blue-500", count: 1247, visible: true },
  {
    id: "institutions",
    name: "Institutions",
    icon: <Settings2 size={14} />,
    color: "bg-green-500",
    count: 342,
    visible: true,
  },
  { id: "events", name: "Events", icon: <Calendar size={14} />, color: "bg-yellow-500", count: 856, visible: true },
  { id: "locations", name: "Locations", icon: <MapPin size={14} />, color: "bg-purple-500", count: 623, visible: true },
  {
    id: "documents",
    name: "Documents",
    icon: <FileText size={14} />,
    color: "bg-red-500",
    count: 2134,
    visible: false,
  },
]

const NETWORK_TEMPLATES = [
  {
    id: "1",
    name: "Government Network",
    description: "Official agencies and personnel",
    nodeCount: 234,
    popular: true,
  },
  {
    id: "2",
    name: "Military Encounters",
    description: "Military witnesses and incidents",
    nodeCount: 156,
    popular: false,
  },
  {
    id: "3",
    name: "Civilian Sightings",
    description: "Public witness network",
    nodeCount: 892,
    popular: true,
  },
  {
    id: "4",
    name: "Research Network",
    description: "Scientists and researchers",
    nodeCount: 67,
    popular: false,
  },
]

export function NetworkPanel() {
  const [nodeTypes, setNodeTypes] = useState(NODE_TYPES)
  const [density, setDensity] = useState([75])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const toggleNodeType = (id: string) => {
    setNodeTypes((prev) => prev.map((type) => (type.id === id ? { ...type, visible: !type.visible } : type)))
  }

  const visibleNodes = nodeTypes.filter((type) => type.visible)
  const totalVisibleCount = visibleNodes.reduce((sum, type) => sum + type.count, 0)

  const filteredTemplates = NETWORK_TEMPLATES.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-[420px] h-auto flex flex-col bg-neutral-900 text-white shadow-xl border border-neutral-800 rounded-2xl overflow-hidden">
      <header className="border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-white">Network Explorer</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`size-8 ${viewMode === "grid" ? "bg-neutral-700" : "hover:bg-neutral-800"}`}
            >
              <Grid3X3 size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`size-8 ${viewMode === "list" ? "bg-neutral-700" : "hover:bg-neutral-800"}`}
            >
              <List size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={2} />
          <Input
            placeholder="Search network..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-9 text-sm bg-neutral-800 border-neutral-700 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 placeholder:text-neutral-500"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 size-5 hover:bg-neutral-700"
            >
              <X size={12} strokeWidth={2} />
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="templates" className="flex-1">
        <TabsList className="w-full bg-transparent p-3 h-auto gap-1 justify-start">
          <TabsTrigger
            value="templates"
            className="text-sm font-medium h-8 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="nodes"
            className="text-sm font-medium h-8 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md"
          >
            Node Types
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-sm font-medium h-8 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="p-4 overflow-y-auto max-h-96">
          <TabsContent value="templates" className="mt-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-neutral-800 rounded-xl p-4 hover:bg-neutral-750 transition-colors cursor-pointer border border-neutral-700"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-3 flex items-center justify-center border border-neutral-700">
                      <Eye size={20} className="text-neutral-400" strokeWidth={2} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-white truncate">{template.name}</h4>
                        {template.popular && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs ml-2">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{template.nodeCount} nodes</p>
                      <p className="text-xs text-neutral-500 line-clamp-2">{template.description}</p>
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-neutral-700 hover:bg-neutral-600 text-white border-none h-8"
                      >
                        Load Network
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded flex items-center justify-center border border-neutral-700">
                      <Eye size={14} className="text-neutral-400" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white">{template.name}</h4>
                        {template.popular && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400">{template.nodeCount} nodes</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4 mt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <span>Visible Node Types</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    {visibleNodes.length}/{nodeTypes.length}
                  </Badge>
                </h4>
              </div>

              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${nodeType.color}`} />
                    <div className="flex items-center gap-2">
                      {nodeType.icon}
                      <span className="text-sm font-medium">{nodeType.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400">{nodeType.count.toLocaleString()}</span>
                    <Switch checked={nodeType.visible} onCheckedChange={() => toggleNodeType(nodeType.id)} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNodeTypes((prev) => prev.map((type) => ({ ...type, visible: true })))}
                  className="text-xs hover:bg-neutral-800"
                >
                  <Eye size={12} className="mr-1" strokeWidth={2} />
                  Show All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNodeTypes((prev) => prev.map((type) => ({ ...type, visible: false })))}
                  className="text-xs hover:bg-neutral-800"
                >
                  <EyeOff size={12} className="mr-1" strokeWidth={2} />
                  Hide All
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Network Density</h4>
                <Badge className="bg-neutral-700 text-white text-xs">{density[0]}%</Badge>
              </div>

              <Slider value={density} onValueChange={setDensity} max={100} min={10} step={5} className="w-full" />

              <p className="text-xs text-neutral-400">Controls connection visibility and visual complexity</p>
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <h4 className="text-sm font-medium mb-3">Connection Types</h4>
              <div className="space-y-3">
                {[
                  { name: "Direct Relationships", enabled: true },
                  { name: "Institutional Links", enabled: true },
                  { name: "Temporal Connections", enabled: false },
                  { name: "Geographic Proximity", enabled: false },
                ].map((connection) => (
                  <div key={connection.name} className="flex items-center justify-between">
                    <span className="text-sm">{connection.name}</span>
                    <Switch checked={connection.enabled} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
