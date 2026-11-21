'use client'

import {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {Play, Pause, RotateCcw, Zap, MapPin, Clock} from 'lucide-react'
import type {ValidatedUAPSighting} from '@/services/sightings/uap-sighting'
import {debugLog} from '@/utils/logger'
import dynamic from 'next/dynamic'

// Dynamically import heavy 3D components
const ThreeJSGlobe = dynamic(
  () =>
    import('@/features/sightings/components/globes/threejs-globe').then((mod) => mod.ThreeJsGlobe),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full flex items-center justify-center'>
        <Skeleton className='w-[400px] h-[400px] rounded-full bg-gray-800/30' />
      </div>
    ),
  }
)

interface RealtimeGlobeProps {
  sightings: ValidatedUAPSighting[]
  isLoading: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastUpdated: Date | null
  stats: {
    totalSightings: number
    recentCount: number
    avgPerHour: number
  }
  onRefresh?: () => void
  onToggleAutoRefresh?: () => void
  isAutoRefreshActive?: boolean
  className?: string
}

interface GlobePoint {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
  id: string
  title: string
  type: 'sighting' | 'event'
  timestamp: string | Date
  _realtimeScore?: number
  _isRecent?: boolean
  _isVeryRecent?: boolean
}

export function RealtimeGlobe({
  sightings,
  isLoading,
  connectionStatus,
  lastUpdated,
  stats,
  onRefresh,
  onToggleAutoRefresh,
  isAutoRefreshActive,
  className = '',
}: RealtimeGlobeProps) {
  const [selectedSighting, setSelectedSighting] = useState<ValidatedUAPSighting | null>(null)
  const [animationSpeed, setAnimationSpeed] = useState(1.0)
  const [showRecentOnly, setShowRecentOnly] = useState(false)
  const [focusedLocation, setFocusedLocation] = useState<{lat: number; lng: number} | null>(null)
  const previousCountRef = useRef(0)

  // Performance optimization: Memoize globe points with scoring
  const globePoints = useMemo(() => {
    debugLog('🌍 Building optimized globe points:', {
      totalSightings: sightings.length,
      showRecentOnly,
    })

    const filteredSightings = showRecentOnly ? sightings.filter((s: any) => s._isRecent) : sightings

    const points: GlobePoint[] = filteredSightings
      .filter((s) => {
        const coords = s.location?.coordinates
        return coords && typeof coords.lat === 'number' && typeof coords.lng === 'number'
      })
      .map((sighting, index) => {
        const coords = sighting.location!.coordinates!
        const isRecent = (sighting as any)._isRecent
        const isVeryRecent = (sighting as any)._isVeryRecent
        const realtimeScore = (sighting as any)._realtimeScore || 0

        // Color coding based on recency and score
        let color = '#00ff88' // Default green
        if (isVeryRecent) {
          color = '#ff0040' // Bright red for very recent
        } else if (isRecent) {
          color = '#ff6b35' // Orange for recent
        } else if (realtimeScore > 0.7) {
          color = '#00d4ff' // Cyan for high-priority
        }

        return {
          order: index + 1,
          startLat: coords.lat,
          startLng: coords.lng,
          endLat: coords.lat,
          endLng: coords.lng,
          arcAlt: 0.0, // Points, not arcs
          color,
          id: sighting.id,
          title: sighting.title || 'UAP Sighting',
          type: 'sighting',
          timestamp: sighting.timestamp,
          _realtimeScore: realtimeScore,
          _isRecent: isRecent,
          _isVeryRecent: isVeryRecent,
        }
      })
      .sort((a, b) => (b._realtimeScore || 0) - (a._realtimeScore || 0)) // High priority first

    debugLog('🎯 Globe points generated:', {
      total: points.length,
      recent: points.filter((p) => p._isRecent).length,
      veryRecent: points.filter((p) => p._isVeryRecent).length,
      highPriority: points.filter((p) => (p._realtimeScore || 0) > 0.7).length,
    })

    return points
  }, [sightings, showRecentOnly])

  // Detect new sightings for notifications
  useEffect(() => {
    if (sightings.length > previousCountRef.current && previousCountRef.current > 0) {
      const newCount = sightings.length - previousCountRef.current
      debugLog(`🚨 ${newCount} new sightings detected!`)
      // You could trigger a notification here
    }
    previousCountRef.current = sightings.length
  }, [sightings.length])

  // Status color based on connection state
  const getStatusColor = useCallback(() => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500 animate-pulse'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }, [connectionStatus])

  // Handle point selection
  const handlePointClick = useCallback(
    (point: GlobePoint) => {
      const sighting = sightings.find((s) => s.id === point.id)
      if (sighting) {
        setSelectedSighting(sighting)
        setFocusedLocation({lat: point.startLat, lng: point.startLng})
        debugLog('📍 Selected sighting:', sighting.id, sighting.title)
      }
    },
    [sightings]
  )

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp: string | Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Less than 1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Globe Visualization */}
      <div className='absolute inset-0'>
        <ThreeJSGlobe
          globeConfig={{
            globeColor: '#090a10',
            atmosphereColor: '#ffffff',
            polygonColor: 'rgba(255,255,255,0.1)',
            ambientLight: '#ffffff',
            directionalLeftLight: '#ffffff',
            directionalTopLight: '#bbbbbb',
            pointLight: '#ffffff',
            pointSize: 4,
            showAtmosphere: true,
            atmosphereAltitude: 0.15,
            animationSpeed: animationSpeed,
          }}
          data={globePoints}
          onPointClick={handlePointClick}
          focusedLocation={focusedLocation}
        />
      </div>

      {/* Real-time Status Panel - Top Right */}
      <Card className='absolute top-4 right-4 bg-black/90 backdrop-blur border-white/20 p-3 z-20'>
        <div className='space-y-2'>
          {/* Connection Status */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className='text-xs font-mono text-white/90'>
                {connectionStatus.toUpperCase()}
              </span>
            </div>
            <div className='flex space-x-1'>
              <Button
                size='sm'
                variant='ghost'
                onClick={onRefresh}
                disabled={isLoading}
                className='h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10'>
                <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                size='sm'
                variant='ghost'
                onClick={onToggleAutoRefresh}
                className={`h-6 w-6 p-0 hover:bg-white/10 ${
                  isAutoRefreshActive ? 'text-green-400' : 'text-white/60'
                }`}>
                {isAutoRefreshActive ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span className='text-white/60'>Total:</span>
              <span className='text-white font-mono'>{stats.totalSightings}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-white/60'>24h:</span>
              <span className='text-cyan-400 font-mono'>{stats.recentCount}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-white/60'>Rate:</span>
              <span className='text-white/80 font-mono'>{stats.avgPerHour.toFixed(1)}/h</span>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className='text-xs text-white/50 font-mono'>{formatTimestamp(lastUpdated)}</div>
          )}
        </div>
      </Card>

      {/* Filter Controls - Top Left */}
      <Card className='absolute top-4 left-4 bg-black/90 backdrop-blur border-white/20 p-3 z-20'>
        <div className='space-y-2'>
          <div className='text-xs font-mono text-white/90 mb-2'>FILTERS</div>

          <div className='flex items-center space-x-2'>
            <Button
              size='sm'
              variant={showRecentOnly ? 'default' : 'ghost'}
              onClick={() => setShowRecentOnly(!showRecentOnly)}
              className='h-6 text-xs font-mono bg-transparent border border-white/20 text-white hover:bg-white/10'>
              <Clock className='w-3 h-3 mr-1' />
              RECENT
            </Button>
          </div>

          {/* Legend */}
          <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 rounded-full bg-red-500' />
              <span className='text-xs text-white/60 font-mono'>&lt;1h</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 rounded-full bg-orange-500' />
              <span className='text-xs text-white/60 font-mono'>&lt;24h</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 rounded-full bg-cyan-500' />
              <span className='text-xs text-white/60 font-mono'>Priority</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 rounded-full bg-green-500' />
              <span className='text-xs text-white/60 font-mono'>Standard</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selection Detail Panel - Bottom */}
      <AnimatePresence>
        {selectedSighting && (
          <motion.div
            initial={{y: 100, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 100, opacity: 0}}
            transition={{type: 'spring', stiffness: 300, damping: 30}}
            className='absolute bottom-4 left-4 right-4 z-20'>
            <Card className='bg-black/95 backdrop-blur border-white/20 p-4'>
              <div className='flex justify-between items-start mb-2'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-white mb-1'>
                    {selectedSighting.title || 'UAP Sighting'}
                  </h3>
                  <div className='flex items-center space-x-4 text-sm text-white/70'>
                    <div className='flex items-center space-x-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{selectedSighting.location?.city || 'Unknown location'}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Clock className='w-3 h-3' />
                      <span>{formatTimestamp(selectedSighting.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setSelectedSighting(null)}
                  className='text-white/60 hover:text-white hover:bg-white/10'>
                  ×
                </Button>
              </div>

              <p className='text-white/80 text-sm mb-3 line-clamp-3'>
                {selectedSighting.content || 'No description available.'}
              </p>

              <div className='flex items-center justify-between'>
                <div className='flex space-x-2'>
                  <Badge variant='outline' className='text-xs'>
                    {selectedSighting.confidence || 'medium'}
                  </Badge>
                  {selectedSighting.category?.map((cat) => (
                    <Badge key={cat} variant='secondary' className='text-xs'>
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className='flex space-x-1'>
                  {(selectedSighting as any)._isVeryRecent && (
                    <Badge className='bg-red-500/20 text-red-400 border-red-500/30'>
                      <Zap className='w-3 h-3 mr-1' />
                      LIVE
                    </Badge>
                  )}
                  {(selectedSighting as any)._isRecent &&
                    !(selectedSighting as any)._isVeryRecent && (
                      <Badge className='bg-orange-500/20 text-orange-400 border-orange-500/30'>
                        RECENT
                      </Badge>
                    )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-30'>
          <motion.div
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            className='bg-black/90 backdrop-blur border border-white/20 rounded-lg p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin' />
              <span className='text-white font-mono text-sm'>Updating sightings...</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
