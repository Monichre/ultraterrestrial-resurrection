"use client"

import {Clock, LayoutGrid, Map, Settings2, TreePine, Zap} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Slider} from '@/components/ui/slider'
import {Switch} from '@/components/ui/switch'
import {Badge} from '@/components/ui/badge'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useMindMapUiStore, type LayoutSettings} from '@/features/mindmap/store/mindmap-ui-store'

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
  {key: 'nodeSpacing', name: 'Node Spacing', min: 25, max: 150, unit: 'px'},
  {key: 'edgeLength', name: 'Edge Length', min: 50, max: 200, unit: 'px'},
  {key: 'clusterStrength', name: 'Cluster Strength', min: 0, max: 100, unit: '%'},
  {key: 'repulsionForce', name: 'Repulsion Force', min: 20, max: 150, unit: '%'},
]

export function LayoutPanel() {
  const {organizeLayout, fitView, saveMindMap} = useMindMap()
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

  return (
    <div className="w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl">
      <header className="border-b border-b-[#292f35] p-3">
        <div className="flex items-center gap-2 mb-2">
          <LayoutGrid size={16} className="text-blue-400" strokeWidth={2} />
          <h3 className="text-sm font-medium text-white">Layout Algorithms</h3>
        </div>
        <p className="text-xs text-gray-400">Multiple perspectives for deeper context</p>
      </header>

      <div className="p-3 space-y-4 overflow-y-auto max-h-80">
        {/* Active Algorithm */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Layout</h4>
          {activeAlgorithm && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                {activeAlgorithm.icon}
                <span className="text-sm font-medium">{activeAlgorithm.name}</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Active</Badge>
              </div>
              <p className="text-xs text-gray-400">{activeAlgorithm.description}</p>
            </div>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Layouts</h4>
          <div className="space-y-1">
            {LAYOUT_ALGORITHMS.map((algorithm) => (
              <Button
                key={algorithm.id}
                size="sm"
                variant={activeLayoutId === algorithm.id ? "default" : "ghost"}
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

        {/* Layout Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Layout Parameters</h4>
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
          <h4 className="text-sm font-medium">Options</h4>

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
          <h4 className="text-sm font-medium">Quick Actions</h4>
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
    </div>
  )
}
