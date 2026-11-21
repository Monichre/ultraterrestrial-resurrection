import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { debugLog } from '@/utils/logger'

// Spatial clustering for performance optimization
export interface SpatialCluster {
  id: string
  centerLat: number
  centerLng: number
  radius: number
  sightings: ValidatedUAPSighting[]
  count: number
  priority: number
}

// Performance metrics tracking
export interface PerformanceMetrics {
  renderTime: number
  dataProcessingTime: number
  memoryUsage: number
  fps: number
  visiblePoints: number
  clusteredPoints: number
}

// LOD (Level of Detail) system for globe rendering
export type LODLevel = 'high' | 'medium' | 'low' | 'minimal'

export interface LODConfig {
  level: LODLevel
  maxPoints: number
  clusterThreshold: number
  pointSize: number
  animationEnabled: boolean
}

const LOD_CONFIGS: Record<LODLevel, LODConfig> = {
  high: {
    level: 'high',
    maxPoints: 2000,
    clusterThreshold: 50,
    pointSize: 4,
    animationEnabled: true,
  },
  medium: {
    level: 'medium',
    maxPoints: 1000,
    clusterThreshold: 25,
    pointSize: 3,
    animationEnabled: true,
  },
  low: {
    level: 'low',
    maxPoints: 500,
    clusterThreshold: 15,
    pointSize: 2,
    animationEnabled: false,
  },
  minimal: {
    level: 'minimal',
    maxPoints: 200,
    clusterThreshold: 10,
    pointSize: 2,
    animationEnabled: false,
  },
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Spatial clustering algorithm (k-means inspired)
export function createSpatialClusters(
  sightings: ValidatedUAPSighting[],
  clusterThreshold: number = 25
): SpatialCluster[] {
  const startTime = performance.now()
  
  // Filter sightings with valid coordinates
  const validSightings = sightings.filter(
    s => s.location?.coordinates?.lat && s.location?.coordinates?.lng
  )

  if (validSightings.length === 0) {
    return []
  }

  debugLog('🎯 Creating spatial clusters:', {
    totalSightings: sightings.length,
    validSightings: validSightings.length,
    clusterThreshold,
  })

  const clusters: SpatialCluster[] = []
  const processed = new Set<string>()

  for (const sighting of validSightings) {
    if (processed.has(sighting.id)) continue

    const coords = sighting.location!.coordinates!
    const clusterSightings = [sighting]
    processed.add(sighting.id)

    // Find nearby sightings
    for (const otherSighting of validSightings) {
      if (processed.has(otherSighting.id)) continue

      const otherCoords = otherSighting.location!.coordinates!
      const distance = calculateDistance(
        coords.lat, coords.lng,
        otherCoords.lat, otherCoords.lng
      )

      // If within clustering distance (25km default)
      if (distance <= clusterThreshold) {
        clusterSightings.push(otherSighting)
        processed.add(otherSighting.id)
      }
    }

    // Calculate cluster center (weighted by recency)
    let totalLat = 0
    let totalLng = 0
    let totalWeight = 0
    let maxPriority = 0

    for (const s of clusterSightings) {
      const weight = (s as any)._realtimeScore || 1
      const coords = s.location!.coordinates!
      
      totalLat += coords.lat * weight
      totalLng += coords.lng * weight
      totalWeight += weight
      
      maxPriority = Math.max(maxPriority, (s as any)._realtimeScore || 0)
    }

    const cluster: SpatialCluster = {
      id: `cluster-${clusters.length}`,
      centerLat: totalLat / totalWeight,
      centerLng: totalLng / totalWeight,
      radius: clusterSightings.length > 1 ? clusterThreshold / 2 : 0,
      sightings: clusterSightings,
      count: clusterSightings.length,
      priority: maxPriority,
    }

    clusters.push(cluster)
  }

  const processingTime = performance.now() - startTime
  
  debugLog('✅ Spatial clustering complete:', {
    clusters: clusters.length,
    processingTime: `${processingTime.toFixed(2)}ms`,
    avgClusterSize: (validSightings.length / clusters.length).toFixed(1),
    largestCluster: Math.max(...clusters.map(c => c.count)),
  })

  return clusters.sort((a, b) => b.priority - a.priority)
}

// Adaptive LOD system based on performance
export class AdaptiveLODManager {
  private currentLOD: LODLevel = 'high'
  private performanceHistory: number[] = []
  private readonly maxHistorySize = 10
  private readonly targetFPS = 30
  private readonly adjustmentCooldown = 2000 // 2 seconds
  private lastAdjustment = 0

  constructor(private onLODChange?: (config: LODConfig) => void) {}

  updatePerformance(metrics: Partial<PerformanceMetrics>) {
    const now = performance.now()
    
    // Add FPS to history
    if (metrics.fps !== undefined) {
      this.performanceHistory.push(metrics.fps)
      if (this.performanceHistory.length > this.maxHistorySize) {
        this.performanceHistory.shift()
      }
    }

    // Check if we need to adjust LOD
    if (now - this.lastAdjustment > this.adjustmentCooldown) {
      this.adjustLODIfNeeded()
    }
  }

  private adjustLODIfNeeded() {
    if (this.performanceHistory.length < 3) return

    const avgFPS = this.performanceHistory.reduce((a, b) => a + b) / this.performanceHistory.length
    const currentConfig = this.getCurrentConfig()
    
    debugLog('📊 LOD Performance check:', {
      currentLOD: this.currentLOD,
      avgFPS: avgFPS.toFixed(1),
      targetFPS: this.targetFPS,
    })

    // Reduce quality if performance is poor
    if (avgFPS < this.targetFPS * 0.8) {
      const newLOD = this.getLowerLOD(this.currentLOD)
      if (newLOD !== this.currentLOD) {
        this.setLOD(newLOD)
        debugLog('⬇️ Reducing LOD due to poor performance:', { from: this.currentLOD, to: newLOD })
      }
    }
    // Increase quality if performance is good
    else if (avgFPS > this.targetFPS * 1.2) {
      const newLOD = this.getHigherLOD(this.currentLOD)
      if (newLOD !== this.currentLOD) {
        this.setLOD(newLOD)
        debugLog('⬆️ Increasing LOD due to good performance:', { from: this.currentLOD, to: newLOD })
      }
    }
  }

  private getLowerLOD(current: LODLevel): LODLevel {
    const levels: LODLevel[] = ['high', 'medium', 'low', 'minimal']
    const index = levels.indexOf(current)
    return index < levels.length - 1 ? levels[index + 1] : current
  }

  private getHigherLOD(current: LODLevel): LODLevel {
    const levels: LODLevel[] = ['high', 'medium', 'low', 'minimal']
    const index = levels.indexOf(current)
    return index > 0 ? levels[index - 1] : current
  }

  setLOD(level: LODLevel) {
    if (this.currentLOD !== level) {
      this.currentLOD = level
      this.lastAdjustment = performance.now()
      this.onLODChange?.(this.getCurrentConfig())
    }
  }

  getCurrentConfig(): LODConfig {
    return LOD_CONFIGS[this.currentLOD]
  }

  getCurrentLOD(): LODLevel {
    return this.currentLOD
  }

  // Manual override for user preference
  setManualLOD(level: LODLevel) {
    this.setLOD(level)
    // Clear performance history to prevent automatic adjustments for a while
    this.performanceHistory = []
  }
}

// Data virtualization for large lists
export function virtualizeList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  overscan: number = 5
): {
  visibleItems: T[]
  startIndex: number
  endIndex: number
  totalHeight: number
  offsetY: number
} {
  const totalHeight = items.length * itemHeight
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)
  
  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight
  
  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  }
}

// Memory-efficient data processing
export function processDataInChunks<T, R>(
  data: T[],
  processor: (chunk: T[]) => R[],
  chunkSize: number = 100
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = []
    let currentIndex = 0

    const processChunk = () => {
      const chunk = data.slice(currentIndex, currentIndex + chunkSize)
      if (chunk.length === 0) {
        resolve(results)
        return
      }

      const chunkResults = processor(chunk)
      results.push(...chunkResults)
      currentIndex += chunkSize

      // Use requestIdleCallback or setTimeout to avoid blocking
      if ('requestIdleCallback' in window) {
        requestIdleCallback(processChunk)
      } else {
        setTimeout(processChunk, 0)
      }
    }

    processChunk()
  })
}

// Debounced data updates
export function createDebouncedUpdater<T>(
  updateFn: (data: T) => void,
  delay: number = 100
): (data: T) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let latestData: T

  return (data: T) => {
    latestData = data
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      updateFn(latestData)
      timeoutId = null
    }, delay)
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    dataProcessingTime: 0,
    memoryUsage: 0,
    fps: 0,
    visiblePoints: 0,
    clusteredPoints: 0,
  }
  
  private frameCount = 0
  private lastFrameTime = 0
  private fpsHistory: number[] = []

  startRenderMeasurement() {
    return performance.now()
  }

  endRenderMeasurement(startTime: number) {
    this.metrics.renderTime = performance.now() - startTime
  }

  startDataProcessing() {
    return performance.now()
  }

  endDataProcessing(startTime: number) {
    this.metrics.dataProcessingTime = performance.now() - startTime
  }

  updateFPS() {
    const now = performance.now()
    if (this.lastFrameTime > 0) {
      const fps = 1000 / (now - this.lastFrameTime)
      this.fpsHistory.push(fps)
      if (this.fpsHistory.length > 60) { // Keep last 60 frames
        this.fpsHistory.shift()
      }
      this.metrics.fps = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length
    }
    this.lastFrameTime = now
    this.frameCount++
  }

  updateMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024) // MB
    }
  }

  setVisiblePoints(count: number) {
    this.metrics.visiblePoints = count
  }

  setClusteredPoints(count: number) {
    this.metrics.clusteredPoints = count
  }

  getMetrics(): PerformanceMetrics {
    this.updateMemoryUsage()
    return { ...this.metrics }
  }

  logMetrics() {
    const metrics = this.getMetrics()
    debugLog('📊 Performance Metrics:', {
      fps: `${metrics.fps.toFixed(1)} FPS`,
      renderTime: `${metrics.renderTime.toFixed(2)}ms`,
      dataProcessing: `${metrics.dataProcessingTime.toFixed(2)}ms`,
      memory: `${metrics.memoryUsage.toFixed(1)} MB`,
      visiblePoints: metrics.visiblePoints,
      clusteredPoints: metrics.clusteredPoints,
      frameCount: this.frameCount,
    })
  }

  reset() {
    this.frameCount = 0
    this.lastFrameTime = 0
    this.fpsHistory = []
    this.metrics = {
      renderTime: 0,
      dataProcessingTime: 0,
      memoryUsage: 0,
      fps: 0,
      visiblePoints: 0,
      clusteredPoints: 0,
    }
  }
}