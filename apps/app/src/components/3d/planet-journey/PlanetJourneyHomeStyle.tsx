'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  useGLTF, 
  Stars, 
  Environment,
  Sparkles,
  Float
} from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Dynamic imports following Home component pattern
const CosmicNav = dynamic(
  () => import('@/components/navbar/cosmic-nav').then((mod) => mod.CosmicNav),
  { ssr: false }
)

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  { ssr: false }
)

const ShootingStars = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.ShootingStars),
  { ssr: false }
)

const StarsBackground = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground),
  { ssr: false }
)

// Preload assets
useGLTF.preload('/assets/earth2/TERRA.glb')
useGLTF.preload('/assets/moon/moon.glb')

// Enhanced camera controller following Home animation patterns
const CameraController: React.FC<{ 
  section: number
  earthRef: React.RefObject<THREE.Group>
  moonRef: React.RefObject<THREE.Group>
}> = ({ section, earthRef, moonRef }) => {
  const { camera } = useThree()
  
  useEffect(() => {
    if (!camera) return

    const tl = gsap.timeline()
    
    switch (section) {
      case 0: // Deep space - following cosmic nav style
        tl.to(camera.position, {
          x: 0, y: 0, z: 100,
          duration: 3,
          ease: "power3.out"
        })
        .to(camera, {
          fov: 75,
          duration: 2,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 1: // Earth approach - smooth like Home Earth component
        tl.to(camera.position, {
          x: -15, y: 10, z: 40,
          duration: 4,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 60,
          duration: 3,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 2: // Earth intimate - like Home close-up
        tl.to(camera.position, {
          x: 12, y: 5, z: 15,
          duration: 3.5,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 45,
          duration: 2.5,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 3: // Moon entrance - dramatic like Home Moon layer
        tl.to(camera.position, {
          x: -20, y: 15, z: 25,
          duration: 4,
          ease: "power2.out"
        })
        .to(camera, {
          fov: 55,
          duration: 3,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        
        // Epic moon entrance with elastic animation like Home
        if (moonRef.current) {
          gsap.fromTo(moonRef.current.position, 
            { x: -120, y: 30, z: -60 },
            { 
              x: -25, y: 8, z: 10,
              duration: 5, 
              ease: "elastic.out(1, 0.6)",
              delay: 1.5
            }
          )
          gsap.fromTo(moonRef.current.scale,
            { x: 0.1, y: 0.1, z: 0.1 },
            { 
              x: 1.5, y: 1.5, z: 1.5,
              duration: 3.5, 
              ease: "back.out(2)",
              delay: 2.5
            }
          )
        }
        break
      
      case 4: // Final cosmic ballet - Home-style layered view
        tl.to(camera.position, {
          x: 0, y: 25, z: 50,
          duration: 4.5,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 70,
          duration: 3.5,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
    }
    
    // Dynamic camera targeting with smooth transitions
    tl.to(camera.rotation, {
      onUpdate: () => {
        if (earthRef.current) {
          const target = section >= 3 && moonRef.current 
            ? new THREE.Vector3().lerpVectors(
                earthRef.current.position, 
                moonRef.current.position, 
                0.4
              )
            : earthRef.current.position
          camera.lookAt(target)
        }
      }
    }, 0)
    
  }, [section, camera, earthRef, moonRef])

  return null
}

// Earth model enhanced like Home Earth component
const EarthModelEnhanced: React.FC<{ earthRef: React.RefObject<THREE.Group> }> = ({ earthRef }) => {
  const { scene } = useGLTF('/assets/earth2/TERRA.glb')
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08
      // Gentle floating motion like Home animations
      const time = state.clock.elapsedTime
      earthRef.current.position.y = Math.sin(time * 0.3) * 0.5
      earthRef.current.rotation.x = Math.sin(time * 0.2) * 0.05
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={earthRef} position={[0, 0, 0]}>
        <primitive object={scene.clone()} scale={4} />
        
        {/* Enhanced lighting like Home */}
        <pointLight position={[20, 15, 20]} intensity={2.5} color="#ffffff" />
        <spotLight 
          position={[0, 25, 20]} 
          intensity={3.5} 
          angle={0.4} 
          penumbra={0.8}
          castShadow
          color="#ffeedd"
        />
        <directionalLight 
          position={[-10, 10, 5]} 
          intensity={1.5} 
          color="#4A90E2" 
        />
      </group>
    </Float>
  )
}

// Moon model enhanced like Home Moon component
const MoonModelEnhanced: React.FC<{ moonRef: React.RefObject<THREE.Group> }> = ({ moonRef }) => {
  const { scene } = useGLTF('/assets/moon/moon.glb')
  
  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.04
      // Complex orbital motion with Home-style smoothness
      const time = state.clock.elapsedTime
      const radius = 25
      moonRef.current.position.x = -25 + Math.sin(time * 0.12) * 4
      moonRef.current.position.z = 10 + Math.cos(time * 0.12) * 4
      moonRef.current.position.y = 8 + Math.sin(time * 0.08) * 1.5
      
      // Subtle rotation variations
      moonRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={moonRef} position={[-120, 30, -60]} scale={0.1}>
        <primitive object={scene.clone()} scale={1.5} />
        
        {/* Moon lighting matching Home style */}
        <pointLight position={[0, 0, 10]} intensity={2} color="#e6e6fa" />
        <spotLight 
          position={[5, 5, 5]} 
          intensity={1.5} 
          angle={0.5} 
          penumbra={1}
          color="#c4c4c4" 
        />
      </group>
    </Float>
  )
}

// Enhanced star field matching Home backgrounds
const CosmicStarField: React.FC = () => {
  return (
    <>
      {/* Main star field like StarsBackground */}
      <Stars 
        radius={500} 
        depth={100} 
        count={15000} 
        factor={8} 
        saturation={0} 
        fade
        speed={0.4}
      />
      
      {/* Sparkles like ShootingStars effect */}
      <Sparkles 
        count={400} 
        scale={[400, 400, 400]} 
        size={3} 
        speed={0.2}
        opacity={0.8}
        color="#4A90E2"
      />
      
      {/* Additional cosmic dust */}
      <Sparkles 
        count={200} 
        scale={[200, 200, 200]} 
        size={1.5} 
        speed={0.1}
        opacity={0.4}
        color="#ffffff"
      />
    </>
  )
}

// 3D Scene following Home component architecture
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
      camera={{ position: [0, 0, 100], fov: 75 }}
      style={{ background: 'transparent' }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      {/* Background matching Home */}
      <color attach="background" args={['#000008']} />
      
      {/* Lighting setup like Home */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      <directionalLight 
        position={[40, 40, 40]} 
        intensity={2.2} 
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        color="#ffffff"
      />
      
      {/* Environment like Home preset */}
      <Environment preset="night" />
      <fog attach="fog" args={['#000008', 100, 400]} />
      
      <Suspense fallback={null}>
        <CameraController section={section} earthRef={earthRef} moonRef={moonRef} />
        <CosmicStarField />
        <EarthModelEnhanced earthRef={earthRef} />
        <MoonModelEnhanced moonRef={moonRef} />
      </Suspense>
    </Canvas>
  )
}

// Text animations following Home TitleAlt patterns
interface TextSectionProps {
  section: number
}

const CosmicTextSection: React.FC<TextSectionProps> = ({ section }) => {
  const textRef = useRef<HTMLDivElement>(null)
  
  const cosmicContent = [
    {
      title: "Cosmic Odyssey",
      subtitle: "Journey through the infinite expanse of space",
      description: "Where stars are born and dreams take flight"
    },
    {
      title: "Terra Emerges",
      subtitle: "The pale blue dot reveals its majesty", 
      description: "A beacon of life in cosmic darkness"
    },
    {
      title: "Living World",
      subtitle: "Our magnificent planet in full glory",
      description: "Clouds dance, oceans shimmer, continents breathe"
    },
    {
      title: "Luna Arrives",
      subtitle: "The Moon makes its grand entrance",
      description: "Our eternal companion joins the dance"
    },
    {
      title: "Celestial Ballet",
      subtitle: "Earth and Moon in perfect harmony",
      description: "A cosmic waltz that has enchanted humanity for millennia"
    }
  ]

  useEffect(() => {
    if (textRef.current) {
      // Home-style letter animation
      const letters = textRef.current.querySelectorAll('.letter')
      const tl = gsap.timeline()
      
      tl.fromTo(letters, 
        { 
          opacity: 0, 
          y: 100,
          rotationX: -90,
          scale: 0.3
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 2, 
          ease: "elastic.out(1, 0.5)",
          stagger: 0.03,
          delay: 0.5
        }
      )
      
      // Continuous floating like Home animations
      tl.to(letters, {
        y: "+=5",
        duration: 3,
        ease: "power1.inOut",
        stagger: 0.02,
        repeat: -1,
        yoyo: true
      }, 1)
    }
  }, [section])

  const currentContent = cosmicContent[section] || cosmicContent[0]

  return (
    <motion.div
      ref={textRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="text-center text-white max-w-6xl px-8">
        <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {currentContent.title.split('').map((letter, i) => (
            <span key={i} className="letter inline-block">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>
        <motion.p 
          className="text-3xl md:text-4xl text-gray-200 leading-relaxed mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          {currentContent.subtitle}
        </motion.p>
        <motion.p 
          className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
        >
          {currentContent.description}
        </motion.p>
      </div>
    </motion.div>
  )
}

// Main component following Home architecture
export const PlanetJourneyHomeStyle: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    const sections = 5
    const sectionHeight = 100

    // ScrollTrigger setup like Home component
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
        },
        scrub: true
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="h-[500vh] w-[100vw] relative overflow-hidden"
    >
      {/* Cosmic Navigation like Home */}
      <div className="cosmic-nav fixed top-0 left-0 right-0 z-50">
        <CosmicNav />
      </div>

      {/* 3D Scene Layer like Home Earth/Moon layers */}
      <div className="absolute top-0 left-0 h-[100vh] w-[100vw] z-[1] fixed">
        <Scene3D section={currentSection} />
      </div>

      {/* Canvas Cursor like Home */}
      <CanvasCursor />

      {/* Text Content like Home TitleAlt */}
      <div className="fixed inset-0">
        <CosmicTextSection section={currentSection} />
      </div>

      {/* Background Effects like Home */}
      <div className="shooting-stars fixed inset-0 z-[0]">
        <ShootingStars />
      </div>
      <div className="stars-background fixed inset-0 z-[0]">
        <StarsBackground />
      </div>

      {/* Invisible sections for scroll triggers */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-screen w-full relative" />
      ))}
    </div>
  )
}

export default PlanetJourneyHomeStyle
