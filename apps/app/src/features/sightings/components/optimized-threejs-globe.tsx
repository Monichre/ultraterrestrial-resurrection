'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, type Object3DNode, useThree, useFrame } from '@react-three/fiber'
import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Color, Fog, PerspectiveCamera, Scene, Vector3, BufferGeometry, BufferAttribute } from 'three'
import ThreeGlobe from 'three-globe'
import countries from './globes/countries.json'
import { debugLog } from '@/utils/logger'
import { 
  createSpatialClusters, 
  AdaptiveLODManager,
  PerformanceMonitor,
  type SpatialCluster,
  type LODLevel 
} from '../utils/performance-optimizations'

declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>
  }
}

extend({ ThreeGlobe })

const RING_PROPAGATION_SPEED = 3
const aspect = 1.2
const cameraZ = 300

export type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
  id?: string
  title?: string
  type?: 'sighting' | 'event'
  timestamp?: string | Date
  _realtimeScore?: number
  _isRecent?: boolean
  _isVeryRecent?: boolean
}

export type OptimizedGlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
  animationSpeed?: number
  enableClustering?: boolean
  lodLevel?: LODLevel
  showHeatmap?: boolean
  showTrails?: boolean
  maxPoints?: number
}

interface OptimizedWorldProps {
  globeConfig: OptimizedGlobeConfig
  data: Position[]
  onPointClick?: (point: Position) => void
  focusedLocation?: { lat: number; lng: number } | null
  onPerformanceUpdate?: (fps: number, renderTime: number) => void
}

interface ProcessedGlobeData {
  size: number
  order: number
  color: (t: number) => string
  lat: number
  lng: number
  id?: string
  priority?: number
  isCluster?: boolean
  clusterSize?: number
}

// Performance-optimized Globe component
function OptimizedGlobe({ globeConfig, data, onPointClick, focusedLocation, onPerformanceUpdate }: OptimizedWorldProps) {
  const [globeData, setGlobeData] = useState<ProcessedGlobeData[] | null>(null)
  const [clusters, setClusters] = useState<SpatialCluster[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const globeRef = useRef<ThreeGlobe | null>(null)
  const performanceMonitor = useRef(new PerformanceMonitor())
  const lodManager = useRef(new AdaptiveLODManager())
  const frameCount = useRef(0)
  
  const defaultProps: Required<OptimizedGlobeConfig> = {
    pointSize: 4,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.15,
    polygonColor: 'rgba(255,255,255,0.1)',
    globeColor: '#090a10',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    ambientLight: '#ffffff',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#bbbbbb',
    pointLight: '#ffffff',
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 40, lng: -74 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
    animationSpeed: 1.0,
    enableClustering: true,
    lodLevel: 'high',
    showHeatmap: false,
    showTrails: false,
    maxPoints: 2000,
    ...globeConfig,
  }

  // Performance-optimized data processing
  const processedData = useMemo(() => {
    const startTime = performance.now()
    
    debugLog('🔄 Processing globe data:', {
      totalPoints: data.length,
      enableClustering: defaultProps.enableClustering,
      maxPoints: defaultProps.maxPoints,
    })

    let processedPoints = data
    let currentClusters: SpatialCluster[] = []
    
    // Apply clustering if enabled and we have too many points
    if (defaultProps.enableClustering && data.length > 100) {
      const lodConfig = lodManager.current.getCurrentConfig()
      currentClusters = createSpatialClusters(
        data.map(p => ({
          id: p.id || `point-${p.order}`,
          location: {
            coordinates: {
              lat: p.startLat,
              lng: p.startLng
            }
          },
          timestamp: p.timestamp || new Date(),
          _realtimeScore: p._realtimeScore || 0,
          _isRecent: p._isRecent || false,
          _isVeryRecent: p._isVeryRecent || false,
        } as any)),
        lodConfig.clusterThreshold
      )
      
      setClusters(currentClusters)
      
      // Convert clusters to points
      if (currentClusters.length > 0) {
        processedPoints = currentClusters.flatMap((cluster, index) => {
          if (cluster.count === 1) {
            // Single point - use original
            const originalPoint = data.find(p => 
              Math.abs(p.startLat - cluster.centerLat) < 0.1 && 
              Math.abs(p.startLng - cluster.centerLng) < 0.1
            )
            return originalPoint ? [originalPoint] : []
          } else {
            // Cluster representation
            return [{
              order: index,
              startLat: cluster.centerLat,
              startLng: cluster.centerLng,
              endLat: cluster.centerLat,
              endLng: cluster.centerLng,
              arcAlt: 0,
              color: cluster.priority > 0.7 ? '#ff6b35' : '#00ff88',
              id: cluster.id,
              title: `Cluster of ${cluster.count} sightings`,
              _isCluster: true,
              _clusterSize: cluster.count,
              _realtimeScore: cluster.priority,
            }]
          }
        })
      }
    }

    // Apply LOD limiting
    const maxPoints = Math.min(processedPoints.length, defaultProps.maxPoints)
    if (processedPoints.length > maxPoints) {
      // Sort by priority and take top points
      processedPoints = processedPoints
        .sort((a, b) => (b._realtimeScore || 0) - (a._realtimeScore || 0))
        .slice(0, maxPoints)
    }

    const processingTime = performance.now() - startTime
    
    debugLog('✅ Globe data processed:', {
      originalPoints: data.length,
      clusters: currentClusters.length,
      finalPoints: processedPoints.length,
      processingTime: `${processingTime.toFixed(2)}ms`,
    })

    return processedPoints
  }, [data, defaultProps.enableClustering, defaultProps.maxPoints])

  // Build globe data with performance optimizations
  const buildGlobeData = useCallback(() => {
    if (!processedData || processedData.length === 0) {
      setGlobeData(null)
      return
    }

    const startTime = performanceMonitor.current.startDataProcessing()
    
    const globePointsData = processedData.map((point, index) => {
      const isCluster = (point as any)._isCluster
      const clusterSize = (point as any)._clusterSize || 1
      const priority = point._realtimeScore || 0
      const isRecent = point._isRecent
      const isVeryRecent = point._isVeryRecent

      // Dynamic sizing based on priority and cluster size
      let size = defaultProps.pointSize
      if (isCluster) {
        size = Math.min(defaultProps.pointSize * 2, defaultProps.pointSize + Math.log(clusterSize))
      } else if (isVeryRecent) {
        size = defaultProps.pointSize * 1.5
      } else if (priority > 0.8) {
        size = defaultProps.pointSize * 1.3
      }

      // Dynamic color based on recency and priority
      const getColor = (t: number) => {
        if (isVeryRecent) {
          // Pulsing red for very recent
          const pulse = Math.sin(t * 0.01) * 0.3 + 0.7
          return `rgba(255, 0, 64, ${pulse})`
        } else if (isRecent) {
          return point.color || '#ff6b35'
        } else if (isCluster) {
          // Slightly transparent for clusters
          return `rgba(0, 255, 136, 0.8)`
        } else {
          return point.color || '#00ff88'
        }
      }

      return {
        size,
        order: point.order,
        color: getColor,
        lat: point.startLat,
        lng: point.startLng,
        id: point.id,
        priority,
        isCluster,
        clusterSize,
      }
    })

    performanceMonitor.current.endDataProcessing(startTime)
    performanceMonitor.current.setVisiblePoints(globePointsData.length)
    performanceMonitor.current.setClusteredPoints(clusters.length)
    
    setGlobeData(globePointsData)
  }, [processedData, defaultProps.pointSize, clusters])

  // Initialize globe materials and data
  const buildMaterial = useCallback(() => {
    if (!globeRef.current) return

    const globe = globeRef.current
    
    // Configure globe appearance
    globe
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showGlobe(true)
      .showGraticules(false)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)

    // Configure countries
    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .hexPolygonUseDots(true)
      .hexPolygonColor(() => defaultProps.polygonColor)
      .hexPolygonLabel(({ properties }: any) => `
        <b>${properties.ADMIN}</b><br />
        Population: <i>${properties.POP_EST}</i>
      `)

    debugLog('⚙️ Globe materials configured')
  }, [defaultProps])

  // Handle point interactions with throttling
  const handlePointClick = useCallback((point: any) => {
    if (!onPointClick) return
    
    const originalPoint = processedData.find(p => 
      p.startLat === point.lat && p.startLng === point.lng
    )
    
    if (originalPoint) {
      onPointClick(originalPoint)
      debugLog('📍 Point clicked:', originalPoint.id || 'unknown')
    }
  }, [processedData, onPointClick])

  // Performance monitoring frame loop
  useFrame(() => {
    frameCount.current++
    performanceMonitor.current.updateFPS()
    
    // Report performance every 60 frames (roughly 1 second at 60fps)
    if (frameCount.current % 60 === 0) {
      const metrics = performanceMonitor.current.getMetrics()
      onPerformanceUpdate?.(metrics.fps, metrics.renderTime)
      
      // Update LOD manager
      lodManager.current.updatePerformance(metrics)
      
      // Log metrics every 10 seconds
      if (frameCount.current % 600 === 0) {
        performanceMonitor.current.logMetrics()
      }
    }
  })

  // Update globe data when processed data changes
  useEffect(() => {
    buildGlobeData()
  }, [buildGlobeData])

  // Initialize globe when ref is available
  useEffect(() => {
    if (globeRef.current) {
      buildMaterial()
      buildGlobeData()
    }
  }, [buildMaterial, buildGlobeData])

  // Configure points rendering with performance optimizations
  useEffect(() => {
    if (!globeRef.current || !globeData) return

    const startTime = performanceMonitor.current.startRenderMeasurement()
    const globe = globeRef.current

    // Configure points
    globe
      .pointsData(globeData)
      .pointColor((d: any) => d.color(Date.now()))
      .pointAltitude(0.01)
      .pointRadius((d: any) => d.size)
      .pointsMerge(true) // Optimize rendering
      .pointsTransitionDuration(500)
      .onPointClick(handlePointClick)

    // Add hover effects for clusters
    globe.pointLabel((d: any) => {
      if (d.isCluster) {
        return `<div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white; font-family: monospace; font-size: 12px;">
          <strong>Cluster of ${d.clusterSize} sightings</strong><br/>
          Priority: ${d.priority.toFixed(2)}<br/>
          Click to explore
        </div>`
      } else {
        return `<div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white; font-family: monospace; font-size: 12px;">
          <strong>${processedData.find(p => p.id === d.id)?.title || 'UAP Sighting'}</strong><br/>
          ${processedData.find(p => p.id === d.id)?._isVeryRecent ? 'LIVE' : 
            processedData.find(p => p.id === d.id)?._isRecent ? 'RECENT' : 'ARCHIVED'}
        </div>`
      }
    })

    performanceMonitor.current.endRenderMeasurement(startTime)
    debugLog('🌐 Globe points configured:', globeData.length)
  }, [globeData, handlePointClick, processedData])

  // Handle focused location
  useEffect(() => {
    if (focusedLocation && globeRef.current) {
      const globe = globeRef.current
      globe.pointOfView({
        lat: focusedLocation.lat,
        lng: focusedLocation.lng,
        altitude: 2.5
      }, 1000)
      debugLog('🎯 Focused on location:', focusedLocation)
    }
  }, [focusedLocation])

  return (
    <threeGlobe
      ref={globeRef}
      animateIn={false}
    />
  )
}

// Main component with Canvas wrapper
export function OptimizedThreeJSGlobe({ 
  globeConfig, 
  data, 
  onPointClick, 
  focusedLocation,
  onPerformanceUpdate 
}: OptimizedWorldProps) {
  const [cameraPosition] = useState(() => {
    const initialPos = globeConfig.initialPosition || { lat: 40, lng: -74 }
    return [
      cameraZ * Math.cos(initialPos.lat * Math.PI / 180) * Math.cos(initialPos.lng * Math.PI / 180),
      cameraZ * Math.sin(initialPos.lat * Math.PI / 180),
      cameraZ * Math.cos(initialPos.lat * Math.PI / 180) * Math.sin(initialPos.lng * Math.PI / 180)
    ] as [number, number, number]
  })

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 50,
          aspect,
          near: 1,
          far: 1000,
        }}
        gl={{
          alpha: false,
          antialias: false, // Disable for better performance
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit DPR for performance
        performance={{
          min: 0.2, // Lower minimum for better responsiveness
          max: 1.0,
          debounce: 200,
        }}
      >
        <fog attach="fog" args={[new Color(globeConfig.globeColor || '#090a10'), 400, 2000]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.6} color={globeConfig.ambientLight || '#ffffff'} />
        <directionalLight
          position={[-1, 0, 1]}
          intensity={0.7}
          color={globeConfig.directionalLeftLight || '#ffffff'}
        />
        <directionalLight
          position={[2, 1, 1]}
          intensity={0.5}
          color={globeConfig.directionalTopLight || '#bbbbbb'}
        />
        <pointLight
          position={[5, 3, 5]}
          intensity={0.3}
          color={globeConfig.pointLight || '#ffffff'}
        />
        
        {/* Globe */}
        <OptimizedGlobe
          globeConfig={globeConfig}
          data={data}
          onPointClick={onPointClick}
          focusedLocation={focusedLocation}
          onPerformanceUpdate={onPerformanceUpdate}
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1.0}
          panSpeed={1.0}
          rotateSpeed={1.0}
          minDistance={150}
          maxDistance={500}
          autoRotate={globeConfig.autoRotate !== false}
          autoRotateSpeed={globeConfig.autoRotateSpeed || 0.5}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}

// Export optimized component as default
export { OptimizedThreeJSGlobe as ThreeJsGlobe }