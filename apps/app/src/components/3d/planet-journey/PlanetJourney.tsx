'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  useGLTF, 
  Stars, 
  Environment,
  Sparkles,
  Text,
  Html
} from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Preload assets
useGLTF.preload('/assets/earth2/TERRA.glb')
useGLTF.preload('/assets/moon/moon.glb')

const CameraController: React.FC<{ section: number, earthRef: React.RefObject<THREE.Group>, moonRef: React.RefObject<THREE.Group> }> = ({ section, earthRef, moonRef }) => {
  const { camera } = useThree()
  
  useEffect(() => {
    const tl = gsap.timeline()
    
    switch (section) {
      case 0: // Initial space view
        tl.to(camera.position, {
          x: 0,
          y: 0,
          z: 50,
          duration: 2,
          ease: "power2.out"
        })
        break
      
      case 1: // Zoom towards Earth
        tl.to(camera.position, {
          x: 0,
          y: 0,
          z: 15,
          duration: 3,
          ease: "power2.inOut"
        })
        break
      
      case 2: // Close up on Earth
        tl.to(camera.position, {
          x: 5,
          y: 2,
          z: 8,
          duration: 2.5,
          ease: "power2.inOut"
        })
        break
      
      case 3: // Moon enters scene
        tl.to(camera.position, {
          x: -8,
          y: 3,
          z: 12,
          duration: 3,
          ease: "power2.out"
        })
        // Animate moon entrance
        if (moonRef.current) {
          gsap.fromTo(moonRef.current.position, 
            { x: -50, y: 10, z: -20 },
            { 
              x: -15, 
              y: 5, 
              z: 3, 
              duration: 4, 
              ease: "power2.out",
              delay: 1
            }
          )
          gsap.fromTo(moonRef.current.scale,
            { x: 0, y: 0, z: 0 },
            { 
              x: 1, 
              y: 1, 
              z: 1, 
              duration: 2, 
              ease: "back.out(1.7)",
              delay: 2
            }
          )
        }
        break
      
      case 4: // Final orbital view
        tl.to(camera.position, {
          x: 0,
          y: 8,
          z: 25,
          duration: 3,
          ease: "power2.inOut"
        })
        break
    }
    
    // Always look at Earth
    tl.to(camera.rotation, {
      onUpdate: () => {
        if (earthRef.current) {
          camera.lookAt(earthRef.current.position)
        }
      }
    }, 0)
    
  }, [section, camera, earthRef, moonRef])

  return null
}

const EarthModel: React.FC<{ earthRef: React.RefObject<THREE.Group> }> = ({ earthRef }) => {
  const { scene } = useGLTF('/assets/earth2/TERRA.glb')
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1
    }
  })

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

const MoonModel: React.FC<{ moonRef: React.RefObject<THREE.Group> }> = ({ moonRef }) => {
  const { scene } = useGLTF('/assets/moon/moon.glb')
  
  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05
      // Subtle orbital motion
      const time = state.clock.elapsedTime
      moonRef.current.position.x = -15 + Math.sin(time * 0.2) * 2
      moonRef.current.position.z = 3 + Math.cos(time * 0.2) * 2
    }
  })

  return (
    <group ref={moonRef} position={[-50, 10, -20]} scale={0}>
      <primitive object={scene.clone()} scale={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#c4c4c4" />
    </group>
  )
}

const StarField: React.FC = () => {
  return (
    <>
      <Stars 
        radius={300} 
        depth={60} 
        count={8000} 
        factor={7} 
        saturation={0} 
        fade
        speed={0.5}
      />
      <Sparkles 
        count={200} 
        scale={[200, 200, 200]} 
        size={2} 
        speed={0.3}
        opacity={0.6}
        color="#ffffff"
      />
    </>
  )
}

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
    >
      <color attach="background" args={['#000014']} />
      
      {/* Lighting */}
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
      
      <Suspense fallback={null}>
        <CameraController section={section} earthRef={earthRef} moonRef={moonRef} />
        <StarField />
        <EarthModel earthRef={earthRef} />
        <MoonModel moonRef={moonRef} />
      </Suspense>
    </Canvas>
  )
}

interface TextSectionProps {
  section: number
}

const TextSection: React.FC<TextSectionProps> = ({ section }) => {
  const textRef = useRef<HTMLDivElement>(null)
  
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
    if (textRef.current) {
      gsap.fromTo(textRef.current, 
        { 
          opacity: 0, 
          y: 50,
          rotationX: -15
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 1.5, 
          ease: "power2.out",
          delay: 0.5
        }
      )
    }
  }, [section])

  const currentContent = textContent[section] || textContent[0]

  return (
    <motion.div
      ref={textRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center text-white max-w-4xl px-8">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {currentContent.title}
        </motion.h1>
        <motion.p 
          className="text-2xl md:text-3xl text-gray-300 leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {currentContent.subtitle}
        </motion.p>
      </div>
    </motion.div>
  )
}

const ScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
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

export const PlanetJourney: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sections = 5
    const sectionHeight = 100

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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500vh] overflow-hidden"
    >
      {/* Fixed 3D Scene */}
      <div className="fixed inset-0 w-full h-full">
        <Scene3D section={currentSection} />
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

export default PlanetJourney
