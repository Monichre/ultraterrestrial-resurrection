'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, useAnimation } from 'framer-motion'
import { FilterOptions } from '@/hooks/use-sightings-data'

interface FilterPanelProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  className?: string
}

export function FilterPanel({
  filters,
  onChange,
  className = ''
}: FilterPanelProps) {
  const [activeTab, setActiveTab] = useState<'shape' | 'location' | 'significance'>('shape')
  const controls = useAnimation()

  // Common shape types for UFO sightings
  const shapeOptions = [
    'Lights', 'Triangle', 'Disc', 'Sphere', 'Cylinder', 
    'Oval', 'Cigar', 'Formation', 'Other'
  ]

  // Handle shape selection
  const handleShapeSelect = (shape: string) => {
    onChange({
      ...filters,
      shape: filters.shape === shape ? undefined : shape
    })
  }

  // Toggle significance filter
  const toggleSignificance = () => {
    onChange({
      ...filters,
      isSignificantEvent: !filters.isSignificantEvent
    })
  }

  // Reset all filters
  const resetFilters = () => {
    onChange({
      shape: undefined,
      location: undefined,
      isSignificantEvent: false
    })
  }

  // Pulse animation effect
  useEffect(() => {
    controls.start({
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    })
  }, [controls])

  return (
    <div className={`relative overflow-hidden border border-white/20 bg-black/90 backdrop-blur-sm ${className}`}>
      <div className="relative space-y-3 p-3">
        {/* Header with tech-style decorations */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <div className="flex items-center gap-2">
            <motion.div animate={controls} className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="font-monument-mono text-xs text-white/80">FILTER CONTROLS</span>
          </div>
          <button 
            onClick={resetFilters}
            className="text-white/40 hover:text-white/60 text-xs font-monument-mono"
          >
            RESET
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex space-x-1 py-1">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-1 rounded text-xs font-monument-mono ${
              activeTab === 'shape' 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('shape')}
          >
            SHAPE
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-1 rounded text-xs font-monument-mono ${
              activeTab === 'location' 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('location')}
          >
            LOCATION
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 py-1 rounded text-xs font-monument-mono ${
              activeTab === 'significance' 
                ? 'bg-white/10 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setActiveTab('significance')}
          >
            SIGNIFICANCE
          </Button>
        </div>

        {/* Content area with holographic effect */}
        <div className="min-h-[120px] relative backdrop-blur-md border border-white/10 p-2">
          {/* Shape filter content */}
          {activeTab === 'shape' && (
            <div className="flex flex-wrap gap-2">
              {shapeOptions.map(shape => (
                <Badge
                  key={shape}
                  variant="outline"
                  className={`cursor-pointer bg-black border-white/30 text-white text-xs font-monument-mono hover:bg-white/10 ${
                    filters.shape === shape 
                      ? 'bg-white/20 border-white/50' 
                      : ''
                  }`}
                  onClick={() => handleShapeSelect(shape)}
                >
                  {shape}
                </Badge>
              ))}
            </div>
          )}

          {/* Location filter content */}
          {activeTab === 'location' && (
            <div className="space-y-2">
              <p className="text-xs text-white/60 font-monument-mono">
                SELECT LOCATION
              </p>
              <div className="flex flex-wrap gap-2">
                {['New Jersey', 'New York', 'California', 'Florida', 'Texas'].map(location => (
                  <Badge
                    key={location}
                    variant="outline"
                    className={`cursor-pointer bg-black border-white/30 text-white text-xs font-monument-mono hover:bg-white/10 ${
                      filters.location === location 
                        ? 'bg-white/20 border-white/50' 
                        : ''
                    }`}
                    onClick={() => onChange({
                      ...filters,
                      location: filters.location === location ? undefined : location
                    })}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Significance filter content */}
          {activeTab === 'significance' && (
            <div className="space-y-2">
              <p className="text-xs text-white/60 font-monument-mono">
                FILTER BY SIGNIFICANCE LEVEL
              </p>
              <Button
                variant="outline"
                size="sm"
                className={`w-full bg-black border-white/30 text-white hover:bg-white/10 text-xs font-monument-mono ${
                  filters.isSignificantEvent 
                    ? 'bg-white/20 border-white/50' 
                    : ''
                }`}
                onClick={toggleSignificance}
              >
                {filters.isSignificantEvent ? 'MAJOR EVENTS ONLY' : 'SHOW ALL SIGHTINGS'}
              </Button>
            </div>
          )}
        </div>

        {/* Active filters summary */}
        {(filters.shape || filters.location || filters.isSignificantEvent) && (
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs text-white/60 font-monument-mono mb-1">ACTIVE FILTERS:</div>
            <div className="flex flex-wrap gap-1">
              {filters.shape && (
                <Badge className="bg-black border bg-black/70 border-white/30 text-white">
                  {filters.shape}
                  <button 
                    className="ml-1 text-white/60 hover:text-white"
                    onClick={() => onChange({ ...filters, shape: undefined })}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.location && (
                <Badge className="bg-black border bg-black/70 border-white/30 text-white">
                  {filters.location}
                  <button 
                    className="ml-1 text-white/60 hover:text-white"
                    onClick={() => onChange({ ...filters, location: undefined })}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.isSignificantEvent && (
                <Badge className="bg-black border bg-black/70 border-white/30 text-white">
                  Major Events
                  <button 
                    className="ml-1 text-white/60 hover:text-white"
                    onClick={() => onChange({ ...filters, isSignificantEvent: false })}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tech-style decorative elements */}
      <div className="absolute top-0 right-0 h-px w-8 bg-cyan-500/40" />
      <div className="absolute top-0 right-0 h-4 w-px bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-px w-8 bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-4 w-px bg-cyan-500/40" />
      
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "16px",
        }}
      />
    </div>
  )
}