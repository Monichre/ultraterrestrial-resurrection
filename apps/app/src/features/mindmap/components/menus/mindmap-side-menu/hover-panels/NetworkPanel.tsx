'use client'

import { useState } from 'react'
import { Users, MapPin, FileText, Eye, EyeOff, Settings2, Grid3X3, List, Clock, LayoutGrid, Map, TreePine, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CalendarIcon, MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons'
import { useMindMapStore } from '@/features/mindmap/store/mindmap-store'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { useMindMapUiStore, type LayoutSettings } from '@/features/mindmap/store/mindmap-ui-store'

const NODE_TYPES = [
  { id: 'people', name: 'People', icon: <Users size={14} />, color: 'bg-blue-500', count: 1247, visible: true },
  {
    id: 'institutions',
    name: 'Institutions',
    icon: <Settings2 size={14} />,
    color: 'bg-green-500',
    count: 342,
    visible: true,
  },
  { id: 'events', name: 'Events', icon: <CalendarIcon size={14} />, color: 'bg-yellow-500', count: 856, visible: true },
  { id: 'locations', name: 'Locations', icon: <MapPin size={14} />, color: 'bg-purple-500', count: 623, visible: true },
  {
    id: 'documents',
    name: 'Documents',
    icon: <FileText size={14} />,
    color: 'bg-red-500',
    count: 2134,
    visible: false,
  },
]

const NETWORK_TEMPLATES = [
  {
    id: '1',
    name: 'Government Network',
    description: 'Official agencies and personnel',
    nodeCount: 234,
    popular: true,
  },
  {
    id: '2',
    name: 'Military Encounters',
    description: 'Military witnesses and incidents',
    nodeCount: 156,
    popular: false,
  },
  {
    id: '3',
    name: 'Civilian Sightings',
    description: 'Public witness network',
    nodeCount: 892,
    popular: true,
  },
  {
    id: '4',
    name: 'Research Network',
    description: 'Scientists and researchers',
    nodeCount: 67,
    popular: false,
  },
]

// Folded in from LayoutPanel — layout-algorithm controls surfaced inside the Network panel
const LAYOUT_ALGORITHMS = [
  {
    id: 'chronological',
    name: 'Chronological',
    icon: <Clock size={16} strokeWidth={2} />,
    description: 'Timeline-based positioning',
    direction: 'horizontal' as const,
  },
  {
    id: 'thematic',
    name: 'Thematic',
    icon: <TreePine size={16} strokeWidth={2} />,
    description: 'Grouped by topic/theme',
    direction: 'radial' as const,
  },
  {
    id: 'geographic',
    name: 'Geographic',
    icon: <Map size={16} strokeWidth={2} />,
    description: 'Location-based clustering',
    direction: 'grid' as const,
  },
  {
    id: 'hierarchical',
    name: 'Hierarchical',
    icon: <Settings2 size={16} strokeWidth={2} />,
    description: 'Institutional relationships',
    direction: 'vertical' as const,
  },
  {
    id: 'force-directed',
    name: 'Force-Directed',
    icon: <Zap size={16} strokeWidth={2} />,
    description: 'Physics-based layout',
    direction: 'radial' as const,
  },
]

const LAYOUT_SETTINGS: Array<{
  key: keyof LayoutSettings
  name: string
  min: number
  max: number
  unit: string
}> = [
  { key: 'nodeSpacing', name: 'Node Spacing', min: 25, max: 150, unit: 'px' },
  { key: 'edgeLength', name: 'Edge Length', min: 50, max: 200, unit: 'px' },
  { key: 'clusterStrength', name: 'Cluster Strength', min: 0, max: 100, unit: '%' },
  { key: 'repulsionForce', name: 'Repulsion Force', min: 20, max: 150, unit: '%' },
]

export function NetworkPanel() {
  const [nodeTypes, setNodeTypes] = useState(NODE_TYPES)
  const [density, setDensity] = useState([75])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Live graph stats
  const storeNodes = useMindMapStore((s) => s.nodes)
  const storeEdges = useMindMapStore((s) => s.edges)

  // Layout controls (folded in from LayoutPanel)
  const { organizeLayout, fitView, saveMindMap } = useMindMap()
  const {
    activeLayoutId,
    layoutSettings,
    autoLayout,
    animateTransitions,
    setActiveLayoutId,
    setLayoutSetting,
    setAutoLayout,
    setAnimateTransitions,
  } = useMindMapUiStore()

  const activeAlgorithm = LAYOUT_ALGORITHMS.find((algo) => algo.id === activeLayoutId)

  const applyLayout = (layoutId: string, overrides?: LayoutSettings) => {
    const algorithm = LAYOUT_ALGORITHMS.find((algo) => algo.id === layoutId)
    if (!algorithm) return

    const settings = overrides ?? layoutSettings

    organizeLayout({
      direction: algorithm.direction,
      centerChildren: true,
      parentChildSpacing: settings.nodeSpacing,
      siblingSpacing: settings.edgeLength,
    })
  }

  const liveNodeCount = storeNodes.length
  const liveEdgeCount = storeEdges.length
  const nodeTypeDistribution = storeNodes.reduce<Record<string, number>>((acc, node) => {
    const type = (node.type || 'default') as string
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const toggleNodeType = (id: string) => {
    setNodeTypes((prev) => prev.map((type) => (type.id === id ? { ...type, visible: !type.visible } : type)))
  }

  const visibleNodes = nodeTypes.filter((type) => type.visible)
  const totalVisibleCount = visibleNodes.reduce((sum, type) => sum + type.count, 0)

  const filteredTemplates = NETWORK_TEMPLATES.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Network Explorer</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`size-8 ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <Grid3X3 size={16} strokeWidth={2} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={`size-8 ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <List size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={2} />
          <Input
            placeholder="Search network..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-8 text-sm bg-neutral-900 border-[#292f35] rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-2 -translate-y-1/2 size-5 hover:bg-white/10"
            >
              <Cross2Icon size={12} strokeWidth={2} />
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="templates" className="flex-1">
        <TabsList className="w-full bg-transparent p-2 h-auto gap-1">
          <TabsTrigger
            value="templates"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="nodes"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Node Types
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="text-sm font-medium h-8 px-3 data-[state=active]:bg-white/10 data-[state=active]:text-white text-[#8c8c8c] hover:bg-white/5 hover:text-white"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="p-3 overflow-y-auto max-h-96">
          <TabsContent value="templates" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-neutral-700/30 rounded-xl p-4 hover:bg-neutral-700/50 transition-colors cursor-pointer border border-white/5"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-3 flex items-center justify-center border border-white/5">
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
                        className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white border-none h-8"
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
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-700/30 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded flex items-center justify-center border border-white/5">
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
                      className="text-[#8c8c8c] hover:text-white hover:bg-white/10"
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nodes" className="space-y-4 mt-0">
            {/* Live Graph Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-400">Total Nodes</p>
                <p className="text-lg font-bold text-white">{liveNodeCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-neutral-400">Total Edges</p>
                <p className="text-lg font-bold text-white">{liveEdgeCount}</p>
              </div>
            </div>

            {Object.keys(nodeTypeDistribution).length > 0 && (
              <div className="space-y-2 mb-3">
                <h4 className="text-sm font-medium">Node Distribution</h4>
                {Object.entries(nodeTypeDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-sm capitalize">{type.replace(/-/g, ' ')}</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">{count}</Badge>
                    </div>
                  ))}
              </div>
            )}

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
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-700/30 transition-colors"
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

            <div className="pt-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNodeTypes((prev) => prev.map((type) => ({ ...type, visible: true })))}
                  className="text-xs hover:bg-white/10"
                >
                  <Eye size={12} className="mr-1" strokeWidth={2} />
                  Show All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNodeTypes((prev) => prev.map((type) => ({ ...type, visible: false })))}
                  className="text-xs hover:bg-white/10"
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
                <Badge className="bg-white/5 text-white text-xs">{density[0]}%</Badge>
              </div>

              <Slider value={density} onValueChange={setDensity} max={100} min={10} step={5} className="w-full" />

              <p className="text-xs text-neutral-400">Controls connection visibility and visual complexity</p>
            </div>

            <div className="pt-3 border-t border-white/5">
              <h4 className="text-sm font-medium mb-3">Connection Types</h4>
              <div className="space-y-3">
                {[
                  { name: 'Direct Relationships', enabled: true },
                  { name: 'Institutional Links', enabled: true },
                  { name: 'Temporal Connections', enabled: false },
                  { name: 'Geographic Proximity', enabled: false },
                ].map((connection) => (
                  <div key={connection.name} className="flex items-center justify-between">
                    <span className="text-sm">{connection.name}</span>
                    <Switch checked={connection.enabled} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Layout — folded in from the former Layout Algorithms panel */}
            <div className="pt-3 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-blue-400" strokeWidth={2} />
                <h4 className="text-sm font-medium">Layout</h4>
              </div>
              <p className="text-xs text-gray-400">Multiple perspectives for deeper context</p>

              {/* Active Algorithm */}
              {activeAlgorithm && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Current Layout</h5>
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      {activeAlgorithm.icon}
                      <span className="text-sm font-medium">{activeAlgorithm.name}</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-400">{activeAlgorithm.description}</p>
                  </div>
                </div>
              )}

              {/* Algorithm Selection */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Available Layouts</h5>
                <div className="space-y-1">
                  {LAYOUT_ALGORITHMS.map((algorithm) => (
                    <Button
                      key={algorithm.id}
                      size="sm"
                      variant={activeLayoutId === algorithm.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setActiveLayoutId(algorithm.id)
                        applyLayout(algorithm.id)
                      }}
                      className="w-full justify-start h-auto py-2"
                    >
                      <div className="flex items-center gap-2">
                        {algorithm.icon}
                        <div className="text-left">
                          <div className="text-xs font-medium">{algorithm.name}</div>
                          <div className="text-xs text-gray-400">{algorithm.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Layout Parameters */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium">Layout Parameters</h5>
                {LAYOUT_SETTINGS.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{setting.name}</span>
                      <span className="text-sm text-gray-400">
                        {layoutSettings[setting.key]}
                        {setting.unit}
                      </span>
                    </div>
                    <Slider
                      value={[layoutSettings[setting.key]]}
                      onValueChange={(value) => {
                        const nextValue = value[0]
                        const nextSettings = {
                          ...layoutSettings,
                          [setting.key]: nextValue,
                        }

                        setLayoutSetting(setting.key, nextValue)
                        applyLayout(activeLayoutId, nextSettings)
                      }}
                      max={setting.max}
                      min={setting.min}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Layout Options */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <h5 className="text-sm font-medium">Options</h5>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">Auto Layout</span>
                    <p className="text-xs text-gray-400">Automatically adjust on data changes</p>
                  </div>
                  <Switch checked={autoLayout} onCheckedChange={setAutoLayout} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">Animate Transitions</span>
                    <p className="text-xs text-gray-400">Smooth layout changes</p>
                  </div>
                  <Switch checked={animateTransitions} onCheckedChange={setAnimateTransitions} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <h5 className="text-sm font-medium">Quick Actions</h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() =>
                      organizeLayout({
                        direction: 'horizontal',
                        centerChildren: true,
                        parentChildSpacing: 120,
                        siblingSpacing: 90,
                      })
                    }
                  >
                    Reset Layout
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={() => fitView()}>
                    Center View
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={() => fitView()}>
                    Fit to Screen
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={() => saveMindMap()}>
                    Save Layout
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
