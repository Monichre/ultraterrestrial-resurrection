"use client"

import { useState } from "react"
import { LayoutGrid, Clock, Map, TreePine, Zap, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const LAYOUT_ALGORITHMS = [
  {
    id: "chronological",
    name: "Chronological",
    icon: <Clock size={16} strokeWidth={2} />,
    description: "Timeline-based positioning",
    active: true,
  },
  {
    id: "thematic",
    name: "Thematic",
    icon: <TreePine size={16} strokeWidth={2} />,
    description: "Grouped by topic/theme",
    active: false,
  },
  {
    id: "geographic",
    name: "Geographic",
    icon: <Map size={16} strokeWidth={2} />,
    description: "Location-based clustering",
    active: false,
  },
  {
    id: "hierarchical",
    name: "Hierarchical",
    icon: <Settings2 size={16} strokeWidth={2} />,
    description: "Institutional relationships",
    active: false,
  },
  {
    id: "force-directed",
    name: "Force-Directed",
    icon: <Zap size={16} strokeWidth={2} />,
    description: "Physics-based layout",
    active: false,
  },
]

const LAYOUT_SETTINGS = [
  { name: "Node Spacing", value: [75], min: 25, max: 150, unit: "px" },
  { name: "Edge Length", value: [100], min: 50, max: 200, unit: "px" },
  { name: "Cluster Strength", value: [60], min: 0, max: 100, unit: "%" },
  { name: "Repulsion Force", value: [80], min: 20, max: 150, unit: "%" },
]

export function LayoutPanel() {
  const [algorithms, setAlgorithms] = useState(LAYOUT_ALGORITHMS)
  const [settings, setSettings] = useState(LAYOUT_SETTINGS)
  const [autoLayout, setAutoLayout] = useState(true)
  const [animateTransitions, setAnimateTransitions] = useState(true)

  const toggleAlgorithm = (id: string) => {
    setAlgorithms((prev) =>
      prev.map((algo) => ({
        ...algo,
        active: algo.id === id ? !algo.active : false,
      })),
    )
  }

  const updateSetting = (index: number, newValue: number[]) => {
    setSettings((prev) => prev.map((setting, i) => (i === index ? { ...setting, value: newValue } : setting)))
  }

  const activeAlgorithm = algorithms.find((algo) => algo.active)

  return (
    <div className="w-[360px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-gray-200 border-white/5 rounded-2xl dark:border-gray-800">
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
            <div className="p-3 rounded-lg bg-blue-500/10 border border-gray-200 border-blue-500/20 dark:border-gray-800">
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
            {algorithms.map((algorithm) => (
              <Button
                key={algorithm.id}
                size="sm"
                variant={algorithm.active ? "default" : "ghost"}
                onClick={() => toggleAlgorithm(algorithm.id)}
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
          {settings.map((setting, index) => (
            <div key={setting.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{setting.name}</span>
                <span className="text-sm text-gray-400">
                  {setting.value[0]}
                  {setting.unit}
                </span>
              </div>
              <Slider
                value={setting.value}
                onValueChange={(value) => updateSetting(index, value)}
                max={setting.max}
                min={setting.min}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Layout Options */}
        <div className="space-y-3 pt-2 border-t border-neutral-700">
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
        <div className="space-y-2 pt-2 border-t border-neutral-700">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="ghost" className="text-xs">
              Reset Layout
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Center View
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Fit to Screen
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Save Layout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
