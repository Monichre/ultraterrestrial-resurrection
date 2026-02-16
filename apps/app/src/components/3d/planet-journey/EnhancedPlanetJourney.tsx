'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  PerspectiveCamera, 
  useGLTF, 
  Stars, 
  Environment,
  Sparkles,
  Text,
  Float,
  Trail,
  Sphere,
  Ring,
  useTexture
} from '@react-three/drei'
import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Bloom, EffectComposer, ChromaticAberration, Vignette, ToneMapping, Noise } from '@react-three/postprocessing'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Preload assets
useGLTF.preload('/assets/earth2/TERRA.glb')
useGLTF.preload('/assets/moon/moon.glb')

interface Scene3DProps {
  section: number
}

const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `
}

const CameraController: React.FC<{ section: number, earthRef: React.RefObject<THREE.Group>, moonRef: React.RefObject<THREE.Group> }> = ({ section, earthRef, moonRef }) => {
  const { camera } = useThree()
  
  useEffect(() => {
    const tl = gsap.timeline()
    
    switch (section) {
      case 0: // Deep space approach
        tl.to(camera.position, {
          x: 0,
          y: 0,
          z: 80,
          duration: 3,
          ease: "power3.out"
        })
        .to(camera, {
          fov: 60,
          duration: 2,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 1: // Cosmic zoom towards Earth
        tl.to(camera.position, {
          x: -10,
          y: 5,
          z: 30,
          duration: 4,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 45,
          duration: 3,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 2: // Earth close encounter
        tl.to(camera.position, {
          x: 8,
          y: 3,
          z: 12,
          duration: 3,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 35,
          duration: 2,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
      
      case 3: // Dramatic moon entrance
        tl.to(camera.position, {
          x: -12,
          y: 8,
          z: 18,
          duration: 4,
          ease: "power2.out"
        })
        .to(camera, {
          fov: 50,
          duration: 3,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        
        // Epic moon entrance with trail effect
        if (moonRef.current) {
          gsap.fromTo(moonRef.current.position, 
            { x: -80, y: 20, z: -40 },
            { 
              x: -18, 
              y: 6, 
              z: 5, 
              duration: 6, 
              ease: "power3.out",
              delay: 1
            }
          )
          gsap.fromTo(moonRef.current.scale,
            { x: 0.1, y: 0.1, z: 0.1 },
            { 
              x: 1.2, 
              y: 1.2, 
              z: 1.2, 
              duration: 3, 
              ease: "elastic.out(1, 0.5)",
              delay: 2.5
            }
          )
        }
        break
      
      case 4: // Final orbital ballet
        tl.to(camera.position, {
          x: 0,
          y: 15,
          z: 35,
          duration: 4,
          ease: "power2.inOut"
        })
        .to(camera, {
          fov: 65,
          duration: 3,
          onUpdate: () => camera.updateProjectionMatrix()
        }, 0)
        break
    }
    
    // Dynamic camera targeting
    tl.to(camera.rotation, {
      onUpdate: () => {
        if (earthRef.current) {
          const target = section >= 3 && moonRef.current 
            ? new THREE.Vector3().lerpVectors(earthRef.current.position, moonRef.current.position, 0.3)
            : earthRef.current.position
          camera.lookAt(target)
        }
      }
    }, 0)
    
  }, [section, camera, earthRef, moonRef])

  return null
}

const EarthModel: React.FC<{ earthRef: React.RefObject<THREE.Group> }> = ({ earthRef }) => {
  const { scene } = useGLTF('/assets/earth2/TERRA.glb')
  const cloudTexture = useTexture('/assets/earth2/clouds.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  })
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      earthRef.current.scale.setScalar(scale * 3)
    }
  })

  return (
    <group ref={earthRef} position={[0, 0, 0]}>
      {/* Main Earth */}
      <primitive object={scene.clone()} scale={3} />
      
      {/* Atmosphere glow */}
      <Sphere args={[3.1, 50, 50]}>
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          side={THREE.BackSide}
          transparent
          opacity={0.4}
        />
      </Sphere>
      
      {/* Cloud layer */}
      <Sphere args={[3.05, 50, 50]}>
        <meshLambertMaterial 
          map={cloudTexture}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Lighting setup */}
      <pointLight position={[15, 10, 15]} intensity={2} color="#ffffff" />
      <spotLight 
        position={[0, 20, 15]} 
        intensity={3} 
        angle={0.4} 
        penumbra={0.8}
        castShadow
        color="#ffeedd"
      />
    </group>
  )
}

const MoonModel: React.FC<{ moonRef: React.RefObject<THREE.Group> }> = ({ moonRef }) => {
  const { scene } = useGLTF('/assets/moon/moon.glb')
  
  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.03
      // Complex orbital motion
      const time = state.clock.elapsedTime
      const radius = 20
      moonRef.current.position.x = -18 + Math.sin(time * 0.15) * 3
      moonRef.current.position.z = 5 + Math.cos(time * 0.15) * 3
      moonRef.current.position.y = 6 + Math.sin(time * 0.1) * 1
    }
  })

  return (
    <Trail
      width={2}
      length={20}
      color="#c4c4c4"
      attenuation={(t) => t * t}
    >
      <group ref={moonRef} position={[-80, 20, -40]} scale={0.1}>
        <primitive object={scene.clone()} scale={1.2} />
        <pointLight position={[0, 0, 8]} intensity={1.2} color="#e6e6fa" />
        
        {/* Moon glow */}
        <Sphere args={[1.1, 32, 32]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </Sphere>
      </group>
    </Trail>
  )
}

const SpaceParticles: React.FC = () => {
  const points = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = new THREE.Vector3()
    const positions = new Float32Array(10000 * 3)
    
    for (let i = 0; i < 10000; i++) {
      temp.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      )
      temp.toArray(positions, i * 3)
    }
    
    return positions
  }, [])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.001
      points.current.rotation.y += delta * 0.002
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1} color="#ffffff" transparent opacity={0.8} />
    </points>
  )
}

const EnhancedStarField: React.FC = () => {
  return (
    <>
      <Stars 
        radius={500} 
        depth={80} 
        count={12000} 
        factor={8} 
        saturation={0} 
        fade
        speed={0.3}
      />
      <Sparkles 
        count={300} 
        scale={[300, 300, 300]} 
        size={3} 
        speed={0.2}
        opacity={0.8}
        color="#4A90E2"
      />
      <SpaceParticles />
    </>
  )
}

const Scene3D: React.FC<Scene3DProps> = ({ section }) => {
  const earthRef = useRef<THREE.Group>(null)
  const moonRef = useRef<THREE.Group>(null)
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 80], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      <color attach="background" args={['#000008']} />
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.05} color="#1a1a2e" />
      <directionalLight 
        position={[30, 30, 30]} 
        intensity={2.5} 
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      
      {/* Rim lighting */}
      <pointLight position={[-20, 0, -20]} intensity={1.5} color="#4A90E2" />
      <pointLight position={[20, -10, 20]} intensity={1} color="#E24A4A" />
      
      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={['#000008', 80, 300]} />
      
      <Suspense fallback={null}>
        <CameraController section={section} earthRef={earthRef} moonRef={moonRef} />
        <EnhancedStarField />
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
          <EarthModel earthRef={earthRef} />
        </Float>
        <MoonModel moonRef={moonRef} />
      </Suspense>
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          intensity={1.2} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.001, 0.001]} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        <ToneMapping />
        <Noise opacity={0.02} />
      </EffectComposer>
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
      title: "Cosmic Odyssey",
      subtitle: "Journey through the infinite expanse of space",
      description: "Where stars are born and dreams take flight"
    },
    {
      title: "Approaching Terra",
      subtitle: "The pale blue dot emerges from cosmic darkness", 
      description: "A beacon of life in the vast emptiness"
    },
    {
      title: "World of Wonders",
      subtitle: "Our magnificent planet in all its glory",
      description: "Clouds dance, oceans shimmer, continents breathe"
    },
    {
      title: "Luna's Grand Entrance",
      subtitle: "The Moon arrives in spectacular fashion",
      description: "Our eternal companion joins the celestial ballet"
    },
    {
      title: "Eternal Dance",
      subtitle: "Earth and Moon in perfect harmony",
      description: "A cosmic waltz that has enchanted humanity for millennia"
    }
  ]

  useEffect(() => {
    if (textRef.current) {
      const tl = gsap.timeline()
      
      tl.fromTo(textRef.current.querySelectorAll('.text-element'), 
        { 
          opacity: 0, 
          y: 100,
          rotationX: -20,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.8, 
          ease: "power3.out",
          stagger: 0.2,
          delay: 0.3
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
      <div className="text-center text-white max-w-6xl px-8">
        <h1 className="text-element text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {currentContent.title}
        </h1>
        <p className="text-element text-3xl md:text-4xl text-gray-200 leading-relaxed mb-6">
          {currentContent.subtitle}
        </p>
        <p className="text-element text-xl md:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto">
          {currentContent.description}
        </p>
      </div>
    </motion.div>
  )
}

const AdvancedScrollIndicator: React.FC = () => {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrolled / maxHeight)
    }

    const timer = setTimeout(() => setVisible(false), 6000)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.div 
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 text-white z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <span className="text-sm uppercase tracking-widest font-light">
          Scroll to Navigate the Cosmos
        </span>
        <div className="relative">
          <motion.div 
            className="w-8 h-14 border-2 border-white rounded-full flex justify-center backdrop-blur-sm bg-white/10"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1.5 h-3 bg-white rounded-full mt-3" />
          </motion.div>
          {/* Progress indicator */}
          <div className="absolute -right-8 top-0 w-1 h-14 bg-white/20 rounded-full">
            <div 
              className="w-full bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const EnhancedPlanetJourney: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sections = 5
    const sectionHeight = 100

    // Enhanced scroll triggers with more precise control
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
      
      {/* Enhanced Scroll Indicator */}
      <AdvancedScrollIndicator />
      
      {/* Invisible sections for scroll triggers */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-screen w-full relative" />
      ))}
    </div>
  )
}

export default EnhancedPlanetJourney
