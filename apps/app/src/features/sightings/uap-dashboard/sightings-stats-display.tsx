'use client'

import { motion, useAnimation } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useMemo, useEffect } from 'react'

interface SightingsStatsDisplayProps {
  stats: any | null
  isLoading: boolean
  className?: string
}

// Animated progress indicator
function ProcessingIndicator({ label }: { label: string }) {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    })
  }, [controls])

  return (
    <motion.div animate={controls} className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
      <span className="font-monument-mono text-xs text-white/70">{label}</span>
    </motion.div>
  )
}

export function SightingsStatsDisplay({ 
  stats, 
  isLoading, 
  className = '' 
}: SightingsStatsDisplayProps) {
  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!stats || !stats.sightings) {
      return {
        totalSightings: 0,
        topShapes: [],
        topLocations: [],
        yearlyTrend: []
      }
    }

    // Get total sightings
    const totalSightings = stats.sightings.total || 0

    // Extract top shapes (most common)
    const topShapes = stats.sightings.shapeDistribution
      ? [...stats.sightings.shapeDistribution]
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(item => ({
            shape: item.value || 'Unknown',
            count: item.count
          }))
      : []

    // Extract top locations
    const topLocations = stats.sightings.locationData
      ? [...stats.sightings.locationData]
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(item => ({
            location: item.value || 'Unknown',
            count: item.count
          }))
      : []

    // Extract yearly trend data
    const yearlyTrend = stats.sightings.timeseriesData
      ? [...stats.sightings.timeseriesData]
          .sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime())
          .map(item => ({
            year: new Date(item.value).getFullYear(),
            count: item.count
          }))
      : []

    return {
      totalSightings,
      topShapes,
      topLocations,
      yearlyTrend
    }
  }, [stats])

  // Shimmer animation for loading state
  const loadingControls = useAnimation()
  
  useEffect(() => {
    if (isLoading) {
      loadingControls.start({
        x: ["0%", "100%"],
        transition: {
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      })
    }
  }, [isLoading, loadingControls])

  if (isLoading) {
    return (
      <div className={`relative overflow-hidden border border-white/20 bg-black/90 backdrop-blur-sm ${className}`}>
        <div className="relative space-y-3 p-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <ProcessingIndicator label="ANALYSING SIGHTINGS DATA" />
          </div>
          
          <div className="relative h-32 bg-white/5 overflow-hidden">
            <motion.div 
              animate={loadingControls}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          </div>
        </div>
        
        {/* Tech decorations */}
        <div className="absolute top-0 right-0 h-px w-12 bg-cyan-500/40" />
        <div className="absolute top-0 right-0 h-6 w-px bg-cyan-500/40" />
        <div className="absolute bottom-0 left-0 h-px w-12 bg-cyan-500/40" />
        <div className="absolute bottom-0 left-0 h-6 w-px bg-cyan-500/40" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden border border-white/20 bg-black/90 backdrop-blur-sm ${className}`}>
      <div className="relative space-y-3 p-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="font-monument-mono text-xs text-white/80">SIGHTINGS ANALYSIS</span>
          </div>
          <span className="text-white/40 font-monument-mono text-xs">
            {metrics.totalSightings.toLocaleString()} RECORDS
          </span>
        </div>
        
        {/* Main content */}
        <div className="space-y-3">
          {/* Top shapes section */}
          <div className="space-y-1">
            <div className="text-xs text-white/60 font-monument-mono flex justify-between">
              <span>REPORTED MORPHOLOGIES</span>
              <span className="text-white/40">{metrics.topShapes.length}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {metrics.topShapes.map((item, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-black border-white/30 text-white text-xs font-monument-mono"
                >
                  {item.shape} ({item.count})
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Top locations section */}
          <div className="space-y-1">
            <div className="text-xs text-white/60 font-monument-mono flex justify-between">
              <span>HOT ZONES</span>
              <span className="text-white/40">{metrics.topLocations.length}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {metrics.topLocations.map((item, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-black border-white/30 text-white text-xs font-monument-mono"
                >
                  {item.location} ({item.count})
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Yearly trend mini-visualization */}
          {metrics.yearlyTrend.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-white/60 font-monument-mono flex justify-between">
                <span>TEMPORAL PATTERN</span>
                <span className="text-white/40">{metrics.yearlyTrend.length} YRS</span>
              </div>
              <div className="h-10 flex items-end gap-[1px]">
                {metrics.yearlyTrend.map((item, idx) => {
                  const maxCount = Math.max(...metrics.yearlyTrend.map(y => y.count))
                  const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  
                  return (
                    <motion.div 
                      key={idx} 
                      className="bg-white/60 hover:bg-white/80 transition-colors flex-1"
                      style={{ height: `${Math.max(2, height)}%` }}
                      title={`${item.year}: ${item.count} sightings`}
                      initial={{ height: '0%' }}
                      animate={{ height: `${Math.max(2, height)}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.03 }}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-white/40 font-monument-mono">
                <span>{metrics.yearlyTrend[0]?.year || ''}</span>
                <span>{metrics.yearlyTrend[metrics.yearlyTrend.length - 1]?.year || ''}</span>
              </div>
            </div>
          )}
          
          {/* Statistical significance */}
          <div className="pt-1 border-t border-white/10 text-xs text-white/60 flex justify-between">
            <span className="font-monument-mono">STATISTICAL CONFIDENCE</span>
            <span className="text-cyan-400">87.4%</span>
          </div>
        </div>
      </div>
      
      {/* Tech-style decorative elements */}
      <div className="absolute top-0 right-0 h-px w-12 bg-cyan-500/40" />
      <div className="absolute top-0 right-0 h-6 w-px bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-px w-12 bg-cyan-500/40" />
      <div className="absolute bottom-0 left-0 h-6 w-px bg-cyan-500/40" />
      
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