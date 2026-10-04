'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { 
  Filter, 
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
  Building,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  icon: React.ReactNode
  type: 'type' | 'time' | 'location' | 'theme'
  values: string[]
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'type',
    label: 'Entity Type',
    icon: <Users className="w-4 h-4" />,
    type: 'type',
    values: ['events', 'personnel', 'organizations', 'testimonies', 'documents', 'case-files', 'artifacts']
  },
  {
    id: 'time',
    label: 'Time Period',
    icon: <Calendar className="w-4 h-4" />,
    type: 'time',
    values: ['1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
  },
  {
    id: 'location',
    label: 'Location',
    icon: <MapPin className="w-4 h-4" />,
    type: 'location',
    values: ['United States', 'Europe', 'South America', 'Asia', 'Australia', 'Africa', 'Antarctica']
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: <Star className="w-4 h-4" />,
    type: 'theme',
    values: ['military', 'civilian', 'whistleblower', 'crash-retrieval', 'abduction', 'disclosure', 'cover-up']
  }
]

export function FilterPanel() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({})
  const { getNodes, setNodes } = useMindMap()

  const handleFilterToggle = useCallback((filterType: string, value: string) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterType] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [filterType]: newValues
      }
    })
    
    // Apply filters to nodes
    applyFilters()
  }, [])

  const applyFilters = useCallback(() => {
    const nodes = getNodes()
    
    const filteredNodes = nodes.map(node => {
      let isVisible = true
      
      // Apply type filter
      if (activeFilters.type && activeFilters.type.length > 0) {
        const nodeType = node.data?.type || node.type
        isVisible = isVisible && nodeType && typeof nodeType === 'string' && activeFilters.type.includes(nodeType)
      }
      
      // Apply time filter (based on node data)
      if (activeFilters.time && activeFilters.time.length > 0) {
        const nodeYear = node.data?.year || node.data?.date
        if (nodeYear && typeof nodeYear === 'number') {
          const decade = Math.floor(nodeYear / 10) * 10
          const decadeString = `${decade}s`
          isVisible = isVisible && activeFilters.time.includes(decadeString)
        }
      }
      
      // Apply location filter
      if (activeFilters.location && activeFilters.location.length > 0) {
        const nodeLocation = node.data?.location || node.data?.country
        isVisible = isVisible && activeFilters.location.some(loc => 
          nodeLocation && typeof nodeLocation === 'string' && nodeLocation.toLowerCase().includes(loc.toLowerCase())
        )
      }
      
      // Apply theme filter
      if (activeFilters.theme && activeFilters.theme.length > 0) {
        const nodeTheme = node.data?.theme || node.data?.category
        isVisible = isVisible && nodeTheme && typeof nodeTheme === 'string' && activeFilters.theme.includes(nodeTheme)
      }
      
      return {
        ...node,
        hidden: !isVisible
      }
    })
    
    setNodes(filteredNodes)
  }, [activeFilters, getNodes, setNodes])

  const clearAllFilters = useCallback(() => {
    setActiveFilters({})
    const nodes = getNodes()
    const visibleNodes = nodes.map(node => ({ ...node, hidden: false }))
    setNodes(visibleNodes)
  }, [getNodes, setNodes])

  const toggleFilterExpansion = useCallback((filterId: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }))
  }, [])

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((total, filters) => total + filters.length, 0)
  }

  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-lg border border-neutral-700 min-w-[260px]">
      <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filter Panel
        {getActiveFilterCount() > 0 && (
          <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded">
            {getActiveFilterCount()}
          </span>
        )}
      </div>
      
      {/* Clear All Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="w-full text-xs h-7"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Filter Options */}
      <div className="space-y-3">
        {FILTER_OPTIONS.map((filter) => (
          <div key={filter.id} className="border border-neutral-700 rounded-md">
            <button
              onClick={() => toggleFilterExpansion(filter.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 rounded-t-md transition-colors"
            >
              <div className="text-neutral-400">
                {filter.icon}
              </div>
              <span className="font-medium">{filter.label}</span>
              {activeFilters[filter.id] && activeFilters[filter.id].length > 0 && (
                <span className="ml-auto text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">
                  {activeFilters[filter.id].length}
                </span>
              )}
            </button>
            
            {isExpanded[filter.id] && (
              <div className="p-2 space-y-1 border-t border-neutral-700">
                {filter.values.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleFilterToggle(filter.id, value)}
                    className={`w-full flex items-center gap-2 px-2 py-1 text-left text-xs rounded transition-colors ${
                      activeFilters[filter.id]?.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                    <span className="capitalize">{value.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Filter Presets */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <div className="text-xs text-neutral-400 mb-2">Quick Presets</div>
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveFilters({ type: ['events', 'personnel'] })
              applyFilters()
            }}
            className="text-xs h-7"
          >
            Core
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveFilters({ time: ['2010s', '2020s'] })
              applyFilters()
            }}
            className="text-xs h-7"
          >
            Modern
          </Button>
        </div>
      </div>

      {/* Show/Hide Toggle */}
      <div className="mt-4 pt-4 border-t border-neutral-700">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const nodes = getNodes()
              const hiddenNodes = nodes.map(node => ({ ...node, hidden: true }))
              setNodes(hiddenNodes)
            }}
            className="flex-1 text-xs h-7"
          >
            <EyeOff className="w-3 h-3 mr-1" />
            Hide All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const nodes = getNodes()
              const visibleNodes = nodes.map(node => ({ ...node, hidden: false }))
              setNodes(visibleNodes)
            }}
            className="flex-1 text-xs h-7"
          >
            <Eye className="w-3 h-3 mr-1" />
            Show All
          </Button>
        </div>
      </div>
    </div>
  )
}
