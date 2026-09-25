'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  useGLTF, 
  Stars, 
  Environment,
  Sparkles,
  Text,
  Html,
  useProgress,
  Loader
} from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo, useCallback, ErrorBoundary } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Register GSAP plugins with error handling
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Robust asset preloading with error handling
const preloadAssets = () => {
  try {
    useGLTF.preload('/assets/earth2/TERRA.glb')
    useGLTF.preload('/assets/moon/moon.glb')
  } catch (error) {
    console.warn('Asset preloading failed:', error)
  }
}
preloadAssets()

// Error boundary for 3D content
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="text-center">
            <div className="text-2xl mb-2">🌌</div>
            <p>3D Scene unavailable</p>
            <p className="text-sm text-gray-400">Please refresh or try a different browser</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading progress component
const LoadingProgress: React.FC = () => {
  const { progress } = useProgress()
  
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm">Loading cosmic journey... {Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

// Robust camera controller with error handling
const CameraController: React.FC<{ 
  section: number
  earthRef: React.RefObject<THREE.Group>
  moonRef: React.RefObject<THREE.Group>
}> = ({ section, earthRef, moonRef }) => {
  const { camera } = useThree()
  
  const animateCamera = useCallback(() => {
    if (!camera) return

    try {
      const tl = gsap.timeline()
      
      switch (section) {
        case 0: // Initial space view
          tl.to(camera.position, {
            x: 0, y: 0, z: 50,
            duration: 2,
            ease: "power2.out"
          })
          break
        
        case 1: // Zoom towards Earth
          tl.to(camera.position, {
            x: 0, y: 0, z: 15,
            duration: 3,
            ease: "power2.inOut"
          })
          break
        
        case 2: // Close up on Earth
          tl.to(camera.position, {
            x: 5, y: 2, z: 8,
            duration: 2.5,
            ease: "power2.inOut"
          })
          break
        
        case 3: // Moon enters scene
          tl.to(camera.position, {
            x: -8, y: 3, z: 12,
            duration: 3,
            ease: "power2.out"
          })
          
          // Safe moon animation
          if (moonRef.current) {
            gsap.fromTo(moonRef.current.position, 
              { x: -50, y: 10, z: -20 },
              { 
                x: -15, y: 5, z: 3,
                duration: 4, 
                ease: "power2.out",
                delay: 1
              }
            )
            gsap.fromTo(moonRef.current.scale,
              { x: 0, y: 0, z: 0 },
              { 
                x: 1, y: 1, z: 1,
                duration: 2, 
                ease: "back.out(1.7)",
                delay: 2
              }
            )
          }
          break
        
        case 4: // Final orbital view
          tl.to(camera.position, {
            x: 0, y: 8, z: 25,
            duration: 3,
            ease: "power2.inOut"
          })
          break
      }
      
      // Safe camera targeting
      tl.to(camera.rotation, {
        onUpdate: () => {
          try {
            if (earthRef.current) {
              camera.lookAt(earthRef.current.position)
            }
          } catch (error) {
            console.warn('Camera look-at failed:', error)
          }
        }
      }, 0)
      
    } catch (error) {
      console.error('Camera animation failed:', error)
    }
  }, [section, camera, earthRef, moonRef])

  useEffect(() => {
    animateCamera()
  }, [animateCamera])

  return null
}

// Robust Earth model with fallbacks
const EarthModel: React.FC<{ earthRef: React.RefObject<THREE.Group> }> = ({ earthRef }) => {
  const [modelError, setModelError] = useState(false)
  
  let scene: THREE.Group | null = null
  
  try {
    const gltf = useGLTF('/assets/earth2/TERRA.glb')
    scene = gltf.scene
  } catch (error) {
    console.warn('Earth model loading failed:', error)
    setModelError(true)
  }
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      try {
        earthRef.current.rotation.y += delta * 0.1
      } catch (error) {
        console.warn('Earth rotation failed:', error)
      }
    }
  })

  if (modelError || !scene) {
    // Fallback Earth sphere
    return (
      <group ref={earthRef} position={[0, 0, 0]}>
        <mesh scale={3}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#4A90E2" 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      </group>
    )
  }

  return (
    <group ref={earthRef} position={[0, 0, 0]}>
      <primitive object={scene.clone()} scale={3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <spotLight 
        position={[0, 10, 10]} 
        intensity={2} 
        angle={0.3} 
        penumbra={0.5}
        castShadow
      />
    </group>
  )
}

// Robust Moon model with fallbacks
const MoonModel: React.FC<{ moonRef: React.RefObject<THREE.Group> }> = ({ moonRef }) => {
  const [modelError, setModelError] = useState(false)
  
  let scene: THREE.Group | null = null
  
  try {
    const gltf = useGLTF('/assets/moon/moon.glb')
    scene = gltf.scene
  } catch (error) {
    console.warn('Moon model loading failed:', error)
    setModelError(true)
  }
  
  useFrame((state, delta) => {
    if (moonRef.current) {
      try {
        moonRef.current.rotation.y += delta * 0.05
        // Subtle orbital motion
        const time = state.clock.elapsedTime
        moonRef.current.position.x = -15 + Math.sin(time * 0.2) * 2
        moonRef.current.position.z = 3 + Math.cos(time * 0.2) * 2
      } catch (error) {
        console.warn('Moon animation failed:', error)
      }
    }
  })

  if (modelError || !scene) {
    // Fallback Moon sphere
    return (
      <group ref={moonRef} position={[-50, 10, -20]} scale={0}>
        <mesh scale={0.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#C0C0C0" 
            roughness={1.0}
            metalness={0.1}
          />
        </mesh>
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#c4c4c4" />
      </group>
    )
  }

  return (
    <group ref={moonRef} position={[-50, 10, -20]} scale={0}>
      <primitive object={scene.clone()} scale={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#c4c4c4" />
    </group>
  )
}

// Safe star field with performance optimization
const StarField: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
      
      const handleChange = () => setReducedMotion(mediaQuery.matches)
      mediaQuery.addEventListener('change', handleChange)
      
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <>
      <Stars 
        radius={300} 
        depth={60} 
        count={reducedMotion ? 2000 : 8000}
        factor={7} 
        saturation={0} 
        fade
        speed={reducedMotion ? 0 : 0.5}
      />
      {!reducedMotion && (
        <Sparkles 
          count={100} 
          scale={[200, 200, 200]} 
          size={2} 
          speed={0.3}
          opacity={0.6}
          color="#ffffff"
        />
      )}
    </>
  )
}

// Performance-optimized Scene3D
interface Scene3DProps {
  section: number
}

const Scene3D: React.FC<Scene3DProps> = ({ section }) => {
  const earthRef = useRef<THREE.Group>(null)
  const moonRef = useRef<THREE.Group>(null)
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 50], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      onCreated={({ gl }) => {
        // Optimize renderer settings
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.2
      }}
    >
      <color attach="background" args={['#000014']} />
      
      {/* Optimized lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight 
        position={[20, 20, 20]} 
        intensity={1.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={['#000014', 50, 200]} />
      
      <Suspense fallback={<LoadingProgress />}>
        <CameraController section={section} earthRef={earthRef} moonRef={moonRef} />
        <StarField />
        <EarthModel earthRef={earthRef} />
        <MoonModel moonRef={moonRef} />
      </Suspense>
    </Canvas>
  )
}

// Enhanced text section with accessibility
interface TextSectionProps {
  section: number
}

const TextSection: React.FC<TextSectionProps> = ({ section }) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  const textContent = [
    {
      title: "Journey Through Space",
      subtitle: "Embark on an incredible voyage through the cosmos"
    },
    {
      title: "Approaching Earth",
      subtitle: "Our beautiful blue marble comes into view"
    },
    {
      title: "Home Planet",
      subtitle: "A world teeming with life and wonder"
    },
    {
      title: "Lunar Companion",
      subtitle: "The Moon emerges, our faithful celestial guardian"
    },
    {
      title: "Cosmic Dance",
      subtitle: "Witness the eternal waltz of Earth and Moon"
    }
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
    }
  }, [])

  useEffect(() => {
    if (textRef.current && !reducedMotion) {
      try {
        gsap.fromTo(textRef.current, 
          { opacity: 0, y: 50, rotationX: -15 },
          { 
            opacity: 1, 
            y: 0,
            rotationX: 0,
            duration: 1.5, 
            ease: "power2.out",
            delay: 0.5
          }
        )
      } catch (error) {
        console.warn('Text animation failed:', error)
      }
    }
  }, [section, reducedMotion])

  const currentContent = textContent[section] || textContent[0]

  return (
    <motion.div
      ref={textRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.1 : 1 }}
    >
      <div className="text-center text-white max-w-4xl px-8">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ scale: reducedMotion ? 1 : 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.1 : 1.2, delay: reducedMotion ? 0 : 0.3 }}
          aria-label={currentContent.title}
        >
          {currentContent.title}
        </motion.h1>
        <motion.p 
          className="text-2xl md:text-3xl text-gray-300 leading-relaxed"
          initial={{ y: reducedMotion ? 0 : 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.1 : 1, delay: reducedMotion ? 0 : 0.8 }}
          aria-label={currentContent.subtitle}
        >
          {currentContent.subtitle}
        </motion.p>
      </div>
    </motion.div>
  )
}

// Enhanced scroll indicator with accessibility
const ScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)
    }
    
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (reducedMotion) {
    return (
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white z-20">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      role="banner"
      aria-label="Scroll to explore the cosmic journey"
    >
      <div className="flex flex-col items-center space-y-2">
        <span className="text-sm uppercase tracking-wider">Scroll to explore</span>
        <motion.div 
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-2 bg-white rounded-full mt-2" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component with comprehensive error handling
export const PlanetJourneyFixed: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient || typeof window === 'undefined') return

    const sections = 5
    const sectionHeight = 100

    try {
      // Create ScrollTrigger for each section
      for (let i = 0; i < sections; i++) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `${i * sectionHeight}% top`,
          end: `${(i + 1) * sectionHeight}% top`,
          onUpdate: (self) => {
            if (self.isActive) {
              setCurrentSection(i)
            }
          },
          onToggle: (self) => {
            if (self.isActive) {
              setCurrentSection(i)
            }
          }
        })
      }
    } catch (error) {
      console.error('ScrollTrigger setup failed:', error)
    }

    return () => {
      try {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      } catch (error) {
        console.warn('ScrollTrigger cleanup failed:', error)
      }
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">🌌</div>
          <p>Initializing cosmic journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500vh] overflow-hidden"
    >
      {/* Fixed 3D Scene */}
      <div className="fixed inset-0 w-full h-full">
        <ThreeErrorBoundary>
          <Scene3D section={currentSection} />
        </ThreeErrorBoundary>
      </div>
      
      {/* Text Overlay */}
      <div className="fixed inset-0">
        <TextSection section={currentSection} />
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
      
      {/* Invisible sections for scroll triggers */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-screen w-full relative" />
      ))}
    </div>
  )
}

export default PlanetJourneyFixed
