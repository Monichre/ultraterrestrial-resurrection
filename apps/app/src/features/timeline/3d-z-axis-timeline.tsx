'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Text } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import type { EventsRecord } from '@db'
import type { JSONData } from '@xata.io/client'
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, ExternalLink, Radar, Shield, Eye, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface TimelineEvent extends JSONData<EventsRecord> {
  year: number
  zPosition: number
}

const Z_SPACING = 5
const SCROLL_SENSITIVITY = 0.01
const CAMERA_START_Z = 0

// Classification colors matching the reference design
const getClassificationColor = (category: string[] | undefined) => {
  if (!category || category.length === 0) return 'from-gray-500 to-gray-600'
  
  const cat = category[0]?.toLowerCase() || ''
  const colors: Record<string, string> = {
    'ce1': 'from-cyan-500 to-blue-600',
    'ce2': 'from-blue-500 to-indigo-600',
    'ce3': 'from-purple-500 to-pink-600',
    'ce4': 'from-pink-500 to-red-600',
    'radar': 'from-green-500 to-teal-600',
    'military': 'from-orange-500 to-amber-600',
    'mass': 'from-yellow-500 to-orange-600',
    'historic': 'from-indigo-500 to-purple-600',
  }
  return colors[cat] || 'from-gray-500 to-gray-600'
}

const getClassificationIcon = (category: string[] | undefined) => {
  if (!category || category.length === 0) return <Eye className="w-4 h-4" />
  
  const cat = category[0]?.toLowerCase() || ''
  const icons: Record<string, React.ReactNode> = {
    'ce1': <Eye className="w-4 h-4" />,
    'ce2': <Zap className="w-4 h-4" />,
    'ce3': <Users className="w-4 h-4" />,
    'ce4': <Shield className="w-4 h-4" />,
    'radar': <Radar className="w-4 h-4" />,
    'military': <Shield className="w-4 h-4" />,
    'mass': <Users className="w-4 h-4" />,
  }
  return icons[cat] || <Eye className="w-4 h-4" />
}

// Extract year from date string
const extractYear = (date: string | undefined): number => {
  if (!date) return new Date().getFullYear()
  const yearMatch = date.match(/\d{4}/)
  return yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear()
}

// Event Card Component in 3D Space
function EventCard({ event, zPosition, isActive }: { event: TimelineEvent; zPosition: number; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(Date.now() * 0.001 + zPosition) * 0.1
      
      // Scale based on distance from camera
      const distance = Math.abs(zPosition)
      const scale = isActive ? 1.2 : Math.max(0.5, 1 - distance * 0.1)
      meshRef.current.scale.setScalar(scale)
    }
  })

  const opacity = useMemo(() => {
    const distance = Math.abs(zPosition)
    if (distance < 2) return 1
    if (distance < 5) return 1 - (distance - 2) * 0.2
    return Math.max(0.1, 1 - distance * 0.15)
  }, [zPosition])

  const photoUrl = event.photos?.[0]?.signedUrl || event.photos?.[0]?.enablePublicUrl || null

  return (
    <group position={[0, 0, zPosition]}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial
          transparent
          opacity={opacity}
          color={hovered ? '#ffffff' : '#1a1a2e'}
          emissive={hovered ? '#4f46e5' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      <Html
        position={[0, 0, 0.01]}
        center
        transform
        occlude
        style={{
          pointerEvents: 'auto',
          width: '400px',
          opacity,
        }}
      >
        <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-2xl">
          {photoUrl && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={photoUrl}
                alt={event.name || 'Event'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
          )}

          <div
            className={`px-6 py-3 bg-gradient-to-r ${getClassificationColor(event.category)} flex items-center gap-2`}
          >
            {getClassificationIcon(event.category)}
            <span className="text-sm font-semibold text-white">
              {event.category?.[0] || 'Event'}
            </span>
          </div>

          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <div className="relative px-6 py-2 bg-background/80 backdrop-blur-md border border-primary/50 rounded-full">
                  <span className="text-2xl font-bold text-primary font-mono">
                    {event.year}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {event.name || event.title || 'Untitled Event'}
            </h2>

            {event.description && (
              <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {event.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {event.location.split(',')[0]}
                </div>
              )}
            </div>

            {event.id && (
              <Link
                href={`/content-card-detail-view?id=${event.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm font-medium"
              >
                Explore Case
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}

// Year Label Component
function YearLabel({ year, zPosition, isActive }: { year: number; zPosition: number; isActive: boolean }) {
  const opacity = useMemo(() => {
    const distance = Math.abs(zPosition)
    if (distance < 2) return 1
    if (distance < 5) return 1 - (distance - 2) * 0.3
    return Math.max(0, 1 - distance * 0.2)
  }, [zPosition])

  return (
    <group position={[0, 3, zPosition]}>
      <Html
        position={[0, 0, 0]}
        center
        transform
        style={{ opacity, pointerEvents: 'none' }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
          <div className="relative px-6 py-2 bg-background/80 backdrop-blur-md border border-primary/50 rounded-full">
            <span className={`text-4xl font-bold text-primary font-mono transition-all ${
              isActive ? 'scale-110' : ''
            }`}>
              {year}
            </span>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Camera Controller Component
function CameraController({
  scrollProgress,
  totalEvents,
}: {
  scrollProgress: number
  totalEvents: number
}) {
  const { camera } = useThree()

  useFrame(() => {
    // Calculate camera Z position based on scroll
    const maxZ = (totalEvents - 1) * Z_SPACING
    const targetZ = CAMERA_START_Z - scrollProgress * maxZ
    
    // Smooth camera movement
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1)
    camera.lookAt(0, 0, targetZ)
  })

  return null
}

// Main 3D Scene
function TimelineScene({
  events,
  scrollProgress,
  currentIndex,
}: {
  events: TimelineEvent[]
  scrollProgress: number
  currentIndex: number
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
      <directionalLight position={[0, 5, 5]} intensity={0.5} />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Camera Controller */}
      <CameraController scrollProgress={scrollProgress} totalEvents={events.length} />

      {/* Timeline Events */}
      {events.map((event, index) => {
        const zPosition = index * Z_SPACING
        const isActive = index === currentIndex

        return (
          <group key={event.id || index}>
            {/* Year Label - only show for first event of each year */}
            {index === 0 || events[index - 1].year !== event.year ? (
              <YearLabel year={event.year} zPosition={zPosition} isActive={isActive} />
            ) : null}

            {/* Event Card */}
            <EventCard event={event} zPosition={zPosition} isActive={isActive} />
          </group>
        )
      })}

      {/* Grid helper for depth perception */}
      <gridHelper args={[20, 20, '#4f46e5', '#1e1b4b']} position={[0, -2, 0]} />
    </>
  )
}

// Main Component
export function ZAxisTimeline3D({ events }: { events: JSONData<EventsRecord>[] }) {
  const [scrollY, setScrollY] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Process events: group by year and create timeline events
  const timelineEvents = useMemo(() => {
    if (!events || events.length === 0) return []

    const processed: TimelineEvent[] = events
      .filter((event) => event.date) // Only include events with dates
      .map((event) => ({
        ...event,
        year: extractYear(event.date),
        zPosition: 0, // Will be calculated
      }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
      })
      .map((event, index) => ({
        ...event,
        zPosition: index * Z_SPACING,
      }))

    return processed
  }, [events])

  // Calculate scroll progress (0 to 1)
  const scrollProgress = useMemo(() => {
    if (timelineEvents.length === 0) return 0
    const maxScroll = (timelineEvents.length - 1) * 100 // Approximate scroll height
    return Math.min(1, Math.max(0, scrollY / maxScroll))
  }, [scrollY, timelineEvents.length])

  // Update current index based on scroll
  useEffect(() => {
    const newIndex = Math.round(scrollProgress * (timelineEvents.length - 1))
    setCurrentIndex(newIndex)
  }, [scrollProgress, timelineEvents.length])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        setScrollY(scrollTop)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate total height for scrolling
  const totalHeight = timelineEvents.length > 0 ? timelineEvents.length * 100 + 100 : 100

  const scrollToIndex = (index: number) => {
    if (timelineEvents.length === 0) return
    const targetScroll = (index / Math.max(1, timelineEvents.length - 1)) * (totalHeight - window.innerHeight)
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  const navigateSection = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'prev'
        ? Math.max(0, currentIndex - 1)
        : Math.min(timelineEvents.length - 1, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  // Get unique years for navigation - find first event index for each year
  const yearNavigation = useMemo(() => {
    const yearMap = new Map<number, number>() // year -> event index
    timelineEvents.forEach((event, index) => {
      if (!yearMap.has(event.year)) {
        yearMap.set(event.year, index)
      }
    })
    return Array.from(yearMap.entries())
      .sort((a, b) => b[0] - a[0]) // Sort by year descending
      .map(([year, index]) => ({ year, index }))
  }, [timelineEvents])

  // Show empty state if no events
  if (timelineEvents.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No events available</p>
          <p className="text-sm">Events with dates will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${totalHeight}vh` }}>
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 stars-bg opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <Canvas
          camera={{ position: [0, 0, CAMERA_START_Z], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <TimelineScene
              events={timelineEvents}
              scrollProgress={scrollProgress}
              currentIndex={currentIndex}
            />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            autoRotate={false}
          />
        </Canvas>

        {/* Navigation Controls - Left Side */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          {yearNavigation.map(({ year, index: eventIndex }) => {
            const isActive = eventIndex === currentIndex || 
              (eventIndex >= 0 && Math.abs(eventIndex - currentIndex) <= 2)

            return (
              <button
                key={year}
                onClick={() => {
                  if (eventIndex >= 0) scrollToIndex(eventIndex)
                }}
                className={`group relative flex items-center gap-3 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    isActive
                      ? 'bg-primary shadow-lg shadow-primary/50'
                      : 'bg-muted-foreground/50 group-hover:bg-muted-foreground'
                  }`}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-mono text-primary whitespace-nowrap"
                    >
                      {year}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        {/* Navigation Controls - Right Side */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
          <button
            onClick={() => navigateSection('prev')}
            disabled={currentIndex === 0}
            className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-full hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => navigateSection('next')}
            disabled={currentIndex === timelineEvents.length - 1}
            className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-full hover:bg-card transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Scroll Hint */}
        <AnimatePresence>
          {currentIndex === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50"
            >
              <span className="text-sm text-muted-foreground">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <ChevronDown className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="fixed bottom-8 right-6 z-50">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-2">
            <span className="text-2xl font-bold text-primary font-mono">{currentIndex + 1}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-muted-foreground font-mono">{timelineEvents.length}</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .stars-bg {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 230px 80px, white, transparent),
            radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 370px 200px, white, transparent),
            radial-gradient(2px 2px at 450px 50px, rgba(255,255,255,0.8), transparent);
          background-size: 500px 300px;
          animation: twinkle 8s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
