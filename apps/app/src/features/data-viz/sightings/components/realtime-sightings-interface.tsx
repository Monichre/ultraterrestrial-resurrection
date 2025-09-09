'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Activity, 
  Globe,
  List,
  TrendingUp,
  Zap,
  MapPin,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useRealtimeSightings } from '../hooks/use-realtime-sightings'
import { RealtimeGlobe } from './realtime-globe'
import { GraphPaperBackground } from '../uap-dashboard/graph-paper-background/graph-paper-background'
import { TechSection } from '../uap-dashboard/tech-section'
import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { debugLog } from '@/utils/logger'

interface RealtimeSightingsInterfaceProps {
  className?: string
}

type ViewMode = 'globe' | 'list' | 'analytics'

export function RealtimeSightingsInterface({
  className = '',
}: RealtimeSightingsInterfaceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('globe')
  const [graphPaperReady, setGraphPaperReady] = useState(false)
  const [filters, setFilters] = useState({
    timeRange: 24, // hours
    shape: 'all',
    confidence: 'any',
    location: '',
  })
  const [newSightingAlert, setNewSightingAlert] = useState<ValidatedUAPSighting | null>(null)

  // Real-time sightings hook
  const {
    sightings,
    isLoading,
    error,
    lastUpdated,
    connectionStatus,
    stats,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshActive,
  } = useRealtimeSightings({
    refreshInterval: 30000, // 30 seconds
    maxSightings: 1000,
    timeWindow: 24,
    enableAutoRefresh: true,
    onNewSighting: (sighting) => {
      setNewSightingAlert(sighting)
      // Auto-clear alert after 5 seconds
      setTimeout(() => setNewSightingAlert(null), 5000)
    },
    onError: (error) => {
      debugLog('❌ Real-time error:', error)
    },
  })

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp: string | Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }, [])

  // Filter sightings based on current filters
  const filteredSightings = useState(() => {
    if (!filters.timeRange) return sightings
    
    const cutoff = new Date(Date.now() - filters.timeRange * 60 * 60 * 1000)
    return sightings.filter((sighting) => {
      const sightingDate = new Date(sighting.timestamp)
      if (sightingDate < cutoff) return false
      
      // Apply other filters
      if (filters.shape !== 'all') {
        const shapes = Array.isArray(sighting.category) 
          ? sighting.category 
          : sighting.category ? [sighting.category] : []
        if (!shapes.some(s => s.toLowerCase().includes(filters.shape.toLowerCase()))) {
          return false
        }
      }
      
      if (filters.confidence !== 'any' && sighting.confidence !== filters.confidence) {
        return false
      }
      
      if (filters.location) {
        const location = (sighting.location?.city || '').toLowerCase()
        if (!location.includes(filters.location.toLowerCase())) {
          return false
        }
      }
      
      return true
    })
  })[0]

  // View mode components
  const renderViewContent = () => {
    switch (viewMode) {
      case 'globe':
        return (
          <RealtimeGlobe
            sightings={filteredSightings}
            isLoading={isLoading}
            connectionStatus={connectionStatus}
            lastUpdated={lastUpdated}
            stats={stats}
            onRefresh={refresh}
            onToggleAutoRefresh={isAutoRefreshActive ? stopAutoRefresh : startAutoRefresh}
            isAutoRefreshActive={isAutoRefreshActive}
            className="w-full h-full"
          />
        )

      case 'list':
        return (
          <div className="p-6 overflow-auto h-full">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Live Sightings Feed</h1>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`${
                      connectionStatus === 'connected' ? 'bg-green-500' :
                      connectionStatus === 'connecting' ? 'bg-yellow-500' :
                      connectionStatus === 'error' ? 'bg-red-500' :
                      'bg-gray-500'
                    } text-white`}
                  >
                    {connectionStatus.toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refresh}
                    disabled={isLoading}
                    className="text-white border-white/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredSightings.map((sighting) => {
                  const isRecent = (sighting as any)._isRecent
                  const isVeryRecent = (sighting as any)._isVeryRecent
                  const score = (sighting as any)._realtimeScore || 0
                  
                  return (
                    <motion.div
                      key={sighting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-card/50 backdrop-blur border rounded-lg p-4 ${
                        isVeryRecent ? 'border-red-500/50 bg-red-500/5' :
                        isRecent ? 'border-orange-500/50 bg-orange-500/5' :
                        score > 0.7 ? 'border-cyan-500/50 bg-cyan-500/5' :
                        'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {sighting.title || 'UAP Sighting'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-white/70">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{sighting.location?.city || 'Unknown location'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(sighting.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {isVeryRecent && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              <Zap className="w-3 h-3 mr-1" />
                              LIVE
                            </Badge>
                          )}
                          {isRecent && !isVeryRecent && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              RECENT
                            </Badge>
                          )}
                          {score > 0.8 && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              HIGH PRIORITY
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm mb-3 line-clamp-3">
                        {sighting.content || 'No description available.'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {sighting.confidence || 'medium'}
                          </Badge>
                          {sighting.category?.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-white/50 font-mono">
                          Score: {score.toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                
                {filteredSightings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-white/60 text-lg mb-2">No sightings found</div>
                    <div className="text-white/40 text-sm">
                      {isLoading ? 'Loading...' : 'Try adjusting your filters or refresh the data'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="p-6 overflow-auto h-full">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-white mb-6">Real-time Analytics</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-card/50 backdrop-blur border-white/10 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalSightings}</div>
                      <div className="text-sm text-white/60">Total Sightings</div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur border-white/10 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.recentCount}</div>
                      <div className="text-sm text-white/60">Last 24 Hours</div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-card/50 backdrop-blur border-white/10 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.avgPerHour.toFixed(1)}</div>
                      <div className="text-sm text-white/60">Avg per Hour</div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Add more analytics components here */}
              <div className="text-center text-white/60">
                Advanced analytics coming soon...
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`relative min-h-screen bg-black text-white ${className}`}>
      {/* Graph Paper Background */}
      <GraphPaperBackground onReady={() => setGraphPaperReady(true)} />

      {/* New Sighting Alert */}
      <AnimatePresence>
        {newSightingAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-red-500/90 backdrop-blur border-red-500/50 p-4">
              <div className="flex items-center space-x-3 text-white">
                <Zap className="w-5 h-5 animate-pulse" />
                <div>
                  <div className="font-bold">New Live Sighting!</div>
                  <div className="text-sm opacity-90">
                    {newSightingAlert.location?.city} - {formatTimestamp(newSightingAlert.timestamp)}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`relative z-10 h-screen flex flex-col transition-opacity duration-1000 ${
          graphPaperReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Header */}
        <div className="border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold font-mono tracking-wide">
                  REAL-TIME UAP MONITORING
                </h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>LIVE FEED</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div>Connected: {filteredSightings.length} sightings</div>
                  <Separator orientation="vertical" className="h-4" />
                  {lastUpdated && (
                    <div>Updated: {formatTimestamp(lastUpdated)}</div>
                  )}
                </div>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center space-x-2">
                <div className="flex bg-white/10 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'globe' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('globe')}
                    className="px-3 py-1 text-xs font-mono"
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    GLOBE
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="px-3 py-1 text-xs font-mono"
                  >
                    <List className="w-3 h-3 mr-1" />
                    LIST
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('analytics')}
                    className="px-3 py-1 text-xs font-mono"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    ANALYTICS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {renderViewContent()}
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <Card className="bg-red-500/90 backdrop-blur border-red-500/50 p-4">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  ⚠
                </div>
                <div>
                  <div className="font-bold">Connection Error</div>
                  <div className="text-sm opacity-90">{error}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refresh}
                  className="ml-auto text-white border-white/30"
                >
                  Retry
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}