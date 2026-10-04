'use client'

import { useState, useCallback } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { 
  Eye, 
  EyeOff, 
  Filter, 
  Layers,
  Network,
  Zap
} from 'lucide-react'

interface DensityPreset {
  id: string
  name: string
  description: string
  density: number
  icon: React.ReactNode
}

const DENSITY_PRESETS: DensityPreset[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: '25% - Core entities only',
    density: 25,
    icon: <EyeOff className="w-3 h-3" />
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: '50% - Balanced view',
    density: 50,
    icon: <Filter className="w-3 h-3" />
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: '75% - Rich context',
    density: 75,
    icon: <Layers className="w-3 h-3" />
  },
  {
    id: 'full',
    name: 'Full',
    description: '100% - Complete network',
    density: 100,
    icon: <Network className="w-3 h-3" />
  }
]

export function NetworkDensityPanel() {
  const [density, setDensity] = useState(75)
  const [activePreset, setActivePreset] = useState('balanced')
  const { getNodes, setNodes } = useMindMap()

  const handleDensityChange = useCallback((value: number[]) => {
    const newDensity = value[0]
    setDensity(newDensity)
    
    // Find closest preset
    const closestPreset = DENSITY_PRESETS.reduce((prev, curr) => 
      Math.abs(curr.density - newDensity) < Math.abs(prev.density - newDensity) ? curr : prev
    )
    setActivePreset(closestPreset.id)
    
    // Apply density filtering to nodes
    applyDensityFilter(newDensity)
  }, [])

  const applyDensityFilter = useCallback((densityLevel: number) => {
    const nodes = getNodes()
    const totalNodes = nodes.length
    const visibleCount = Math.floor((totalNodes * densityLevel) / 100)
    
    // Sort nodes by importance (you can customize this logic)
    const sortedNodes = nodes.sort((a, b) => {
      // Priority: user input nodes, then by type importance
      if (a.type === 'userInputNode') return -1
      if (b.type === 'userInputNode') return 1
      
      // Add more sophisticated ranking logic here
      return 0
    })
    
    // Show only the top N nodes based on density
    const visibleNodes = sortedNodes.slice(0, visibleCount)
    
    // Update node visibility
    const updatedNodes = nodes.map(node => ({
      ...node,
      hidden: !visibleNodes.some(visible => visible.id === node.id)
    }))
    
    setNodes(updatedNodes)
  }, [getNodes, setNodes])

  const applyPreset = useCallback((preset: DensityPreset) => {
    setDensity(preset.density)
    setActivePreset(preset.id)
    applyDensityFilter(preset.density)
  }, [applyDensityFilter])

  const getDensityColor = (density: number) => {
    if (density <= 25) return 'text-red-400'
    if (density <= 50) return 'text-yellow-400'
    if (density <= 75) return 'text-blue-400'
    return 'text-green-400'
  }

  const getDensityDescription = (density: number) => {
    if (density <= 25) return 'Minimal complexity'
    if (density <= 50) return 'Moderate complexity'
    if (density <= 75) return 'Balanced complexity'
    return 'Full complexity'
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-lg border border-neutral-700 min-w-[240px]">
      <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Network Density
      </div>
      
      {/* Current Density Display */}
      <div className="text-center mb-4">
        <div className={`text-2xl font-bold ${getDensityColor(density)}`}>
          {density}%
        </div>
        <div className="text-xs text-neutral-400 mt-1">
          {getDensityDescription(density)}
        </div>
      </div>

      {/* Density Slider */}
      <div className="mb-4">
        <Slider
          value={[density]}
          onValueChange={handleDensityChange}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>Minimal</span>
          <span>Full</span>
        </div>
      </div>

      {/* Density Presets */}
      <div className="space-y-2">
        <div className="text-xs text-neutral-400 mb-2">Quick Presets</div>
        {DENSITY_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={`w-full flex items-center gap-2 px-2 py-1 text-left text-xs rounded transition-colors ${
              activePreset === preset.id 
                ? 'bg-neutral-700 text-white' 
                : 'hover:bg-neutral-700/50 text-neutral-300'
            }`}
          >
            <div className="text-neutral-400">
              {preset.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium">{preset.name}</div>
              <div className="text-neutral-500">{preset.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Advanced Controls */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <div className="text-xs text-neutral-400 mb-2">Advanced</div>
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyDensityFilter(100)}
            className="text-xs h-7"
          >
            Show All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyDensityFilter(25)}
            className="text-xs h-7"
          >
            Core Only
          </Button>
        </div>
      </div>
    </div>
  )
}
