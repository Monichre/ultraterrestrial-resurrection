'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Settings,
  Filter,
  Search,
  Clock,
  MapPin,
  Layers,
  Zap,
  Target,
  Globe,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react'
import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { debugLog } from '@/utils/logger'
import type { LODLevel } from '../utils/performance-optimizations'

interface FilterState {
  timeRange: number // hours
  shape: string
  confidence: string
  location: string
  hasMedia: boolean
  minScore: number
  showClusters: boolean
  maxDistance: number // km for clustering
}

interface ViewState {
  followRealtime: boolean
  showHeatmap: boolean
  showTrails: boolean
  animationSpeed: number
  pointSize: number
  lodLevel: LODLevel
}

interface IntuitiveControlsProps {
  sightings: ValidatedUAPSighting[]
  isLoading: boolean
  filters: FilterState
  viewState: ViewState
  onFiltersChange: (filters: FilterState) => void
  onViewStateChange: (viewState: ViewState) => void
  onRefresh: () => void
  onAutoRefreshToggle: () => void
  isAutoRefreshActive: boolean
  className?: string
}

export function IntuitiveControls({
  sightings,
  isLoading,
  filters,
  viewState,
  onFiltersChange,
  onViewStateChange,
  onRefresh,
  onAutoRefreshToggle,
  isAutoRefreshActive,
  className = '',
}: IntuitiveControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'filters' | 'view' | 'performance'>('filters')
  const [searchQuery, setSearchQuery] = useState('')
  const [quickFilters, setQuickFilters] = useState({
    recent: false,
    highPriority: false,
    hasCoords: true,
    verified: false,
  })

  // Get unique shapes from sightings for filter options
  const availableShapes = useState(() => {
    const shapes = new Set<string>()
    sightings.forEach((sighting) => {
      if (Array.isArray(sighting.category)) {
        sighting.category.forEach(shape => shapes.add(shape))
      } else if (sighting.category) {
        shapes.add(sighting.category)
      }
    })
    return Array.from(shapes).sort()
  })[0]

  // Get unique locations for quick selection
  const topLocations = useState(() => {
    const locationCounts = new Map<string, number>()
    sightings.forEach((sighting) => {
      const location = sighting.location?.city
      if (location) {
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1)
      }
    })
    
    return Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([location]) => location)
  })[0]

  // Apply quick filters
  const handleQuickFilter = useCallback((key: keyof typeof quickFilters) => {
    const newQuickFilters = { ...quickFilters, [key]: !quickFilters[key] }
    setQuickFilters(newQuickFilters)

    // Update main filters based on quick filters
    const newFilters = { ...filters }
    
    if (key === 'recent') {
      newFilters.timeRange = newQuickFilters.recent ? 24 : filters.timeRange
    } else if (key === 'highPriority') {
      newFilters.minScore = newQuickFilters.highPriority ? 0.7 : 0
    }

    onFiltersChange(newFilters)
    debugLog('🎯 Quick filter applied:', { key, value: newQuickFilters[key] })
  }, [quickFilters, filters, onFiltersChange])

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    // The search will be applied in the parent component
    debugLog('🔍 Search query:', query)
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      timeRange: 168, // 1 week
      shape: 'all',
      confidence: 'any',
      location: '',
      hasMedia: false,
      minScore: 0,
      showClusters: true,
      maxDistance: 25,
    }
    
    setQuickFilters({
      recent: false,
      highPriority: false,
      hasCoords: true,
      verified: false,
    })
    
    setSearchQuery('')
    onFiltersChange(defaultFilters)
    debugLog('♾️ Filters reset to defaults')
  }, [onFiltersChange])

  // Calculate filtered count for display
  const filteredCount = sightings.length // This would be calculated by parent

  return (
    <TooltipProvider>
      <motion.div
        className={`fixed top-20 right-4 z-40 ${className}`}
        initial={false}
        animate={{ 
          width: isExpanded ? 400 : 60,
          height: isExpanded ? 600 : 60
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card className="w-full h-full bg-black/95 backdrop-blur border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            {isExpanded ? (
              <>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-white/80" />
                  <span className="text-sm font-mono text-white/90">CONTROLS</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(true)}
                    className="w-full h-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Open Controls</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex flex-col"
              >
                {/* Quick Actions */}
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/60">QUICK ACTIONS</span>
                    <div className="flex space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={onRefresh}
                            disabled={isLoading}
                            className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Refresh Data</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={onAutoRefreshToggle}
                            className={`h-6 w-6 p-0 hover:bg-white/10 ${
                              isAutoRefreshActive ? 'text-green-400' : 'text-white/60'
                            }`}
                          >
                            {isAutoRefreshActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isAutoRefreshActive ? 'Pause' : 'Start'} Auto-refresh</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Quick Filter Pills */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries({
                      recent: { icon: Clock, label: '24H', tooltip: 'Last 24 hours' },
                      highPriority: { icon: Zap, label: 'HIGH', tooltip: 'High priority sightings' },
                      hasCoords: { icon: MapPin, label: 'GEO', tooltip: 'Has coordinates' },
                      verified: { icon: Target, label: 'VER', tooltip: 'Verified sightings' },
                    }).map(([key, { icon: Icon, label, tooltip }]) => (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant={quickFilters[key as keyof typeof quickFilters] ? 'default' : 'outline'}
                            onClick={() => handleQuickFilter(key as keyof typeof quickFilters)}
                            className={`h-6 px-2 text-xs font-mono ${
                              quickFilters[key as keyof typeof quickFilters] 
                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                                : 'bg-transparent border-white/20 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/40" />
                    <Input
                      placeholder="Search sightings..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-7 h-8 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/10">
                  <div className="flex">
                    {[
                      { key: 'filters', label: 'FILTERS', icon: Filter },
                      { key: 'view', label: 'VIEW', icon: Eye },
                      { key: 'performance', label: 'PERF', icon: Zap },
                    ].map(({ key, label, icon: Icon }) => (
                      <Button
                        key={key}
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveTab(key as any)}
                        className={`flex-1 h-8 rounded-none text-xs font-mono ${
                          activeTab === key
                            ? 'text-cyan-400 border-b-2 border-cyan-500 bg-cyan-500/5'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-3 overflow-y-auto">
                  {activeTab === 'filters' && (
                    <div className="space-y-4">
                      {/* Time Range */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs font-mono text-white/80">TIME RANGE</Label>
                          <Badge variant="outline" className="text-xs">
                            {filters.timeRange < 24 ? `${filters.timeRange}h` :
                             filters.timeRange < 168 ? `${Math.round(filters.timeRange/24)}d` :
                             `${Math.round(filters.timeRange/168)}w`}
                          </Badge>
                        </div>
                        <Slider
                          value={[filters.timeRange]}
                          onValueChange={([value]) => onFiltersChange({ ...filters, timeRange: value })}
                          min={1}
                          max={8760} // 1 year in hours
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-white/40 mt-1">
                          <span>1h</span>
                          <span>1y</span>
                        </div>
                      </div>

                      {/* Shape Filter */}
                      <div>
                        <Label className="text-xs font-mono text-white/80 mb-2 block">SHAPE</Label>
                        <Select value={filters.shape} onValueChange={(value) => onFiltersChange({ ...filters, shape: value })}>
                          <SelectTrigger className="h-8 bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Shapes</SelectItem>
                            {availableShapes.map((shape) => (
                              <SelectItem key={shape} value={shape}>
                                {shape.charAt(0).toUpperCase() + shape.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location */}
                      <div>
                        <Label className="text-xs font-mono text-white/80 mb-2 block">LOCATION</Label>
                        <Input
                          value={filters.location}
                          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                          placeholder="Filter by location..."
                          className="h-8 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        />
                        {topLocations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {topLocations.map((location) => (
                              <Button
                                key={location}
                                size="sm"
                                variant="outline"
                                onClick={() => onFiltersChange({ ...filters, location })}
                                className="h-6 px-2 text-xs bg-transparent border-white/20 text-white/60 hover:bg-white/10"
                              >
                                {location}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Confidence */}
                      <div>
                        <Label className="text-xs font-mono text-white/80 mb-2 block">CONFIDENCE</Label>
                        <Select value={filters.confidence} onValueChange={(value) => onFiltersChange({ ...filters, confidence: value })}>
                          <SelectTrigger className="h-8 bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="low">Low+</SelectItem>
                            <SelectItem value="medium">Medium+</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority Score */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs font-mono text-white/80">MIN PRIORITY</Label>
                          <Badge variant="outline" className="text-xs">
                            {filters.minScore.toFixed(1)}
                          </Badge>
                        </div>
                        <Slider
                          value={[filters.minScore]}
                          onValueChange={([value]) => onFiltersChange({ ...filters, minScore: value })}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      {/* Toggles */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-mono text-white/80">HAS MEDIA</Label>
                          <Switch
                            checked={filters.hasMedia}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, hasMedia: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-mono text-white/80">SHOW CLUSTERS</Label>
                          <Switch
                            checked={filters.showClusters}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, showClusters: checked })}
                          />
                        </div>
                      </div>

                      {/* Reset Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetFilters}
                        className="w-full h-8 text-xs font-mono bg-transparent border-white/20 text-white/60 hover:bg-white/10"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        RESET FILTERS
                      </Button>
                    </div>
                  )}

                  {activeTab === 'view' && (
                    <div className="space-y-4">
                      {/* View Options */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-mono text-white/80">FOLLOW REALTIME</Label>
                          <Switch
                            checked={viewState.followRealtime}
                            onCheckedChange={(checked) => onViewStateChange({ ...viewState, followRealtime: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-mono text-white/80">SHOW HEATMAP</Label>
                          <Switch
                            checked={viewState.showHeatmap}
                            onCheckedChange={(checked) => onViewStateChange({ ...viewState, showHeatmap: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-mono text-white/80">SHOW TRAILS</Label>
                          <Switch
                            checked={viewState.showTrails}
                            onCheckedChange={(checked) => onViewStateChange({ ...viewState, showTrails: checked })}
                          />
                        </div>
                      </div>

                      {/* Animation Speed */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs font-mono text-white/80">ANIMATION SPEED</Label>
                          <Badge variant="outline" className="text-xs">
                            {viewState.animationSpeed.toFixed(1)}x
                          </Badge>
                        </div>
                        <Slider
                          value={[viewState.animationSpeed]}
                          onValueChange={([value]) => onViewStateChange({ ...viewState, animationSpeed: value })}
                          min={0.1}
                          max={3.0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      {/* Point Size */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-xs font-mono text-white/80">POINT SIZE</Label>
                          <Badge variant="outline" className="text-xs">
                            {viewState.pointSize}px
                          </Badge>
                        </div>
                        <Slider
                          value={[viewState.pointSize]}
                          onValueChange={([value]) => onViewStateChange({ ...viewState, pointSize: value })}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      {/* LOD Level */}
                      <div>
                        <Label className="text-xs font-mono text-white/80 mb-2 block">QUALITY</Label>
                        <Select value={viewState.lodLevel} onValueChange={(value: LODLevel) => onViewStateChange({ ...viewState, lodLevel: value })}>
                          <SelectTrigger className="h-8 bg-white/5 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High (Best)</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="minimal">Minimal (Fastest)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'performance' && (
                    <div className="space-y-4">
                      <div className="text-xs font-mono text-white/60 text-center py-8">
                        Performance metrics will be displayed here.
                        <br /><br />
                        • FPS monitoring
                        <br />
                        • Memory usage
                        <br />
                        • Render times
                        <br />
                        • Data processing
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 text-xs font-mono text-white/50">
                  {filteredCount.toLocaleString()} sightings
                  {isLoading && ' • Updating...'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}