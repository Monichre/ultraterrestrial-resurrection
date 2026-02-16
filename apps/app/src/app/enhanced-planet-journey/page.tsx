'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Dynamically import the Enhanced PlanetJourney component
const EnhancedPlanetJourney = dynamic(
  () => import('@/components/3d/planet-journey/EnhancedPlanetJourney'),
  { 
    ssr: false,
    loading: () => <SpectacularLoader />
  }
)

const SpectacularLoader = () => {
  const [loadingPhase, setLoadingPhase] = useState(0)

  useEffect(() => {
    const phases = [
      "Initializing Quantum Engines...",
      "Calibrating Stellar Coordinates...", 
      "Loading Planetary Models...",
      "Preparing Cosmic Journey...",
      "Ready for Launch!"
    ]

    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % phases.length)
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const phases = [
    "Initializing Quantum Engines...",
    "Calibrating Stellar Coordinates...", 
    "Loading Planetary Models...",
    "Preparing Cosmic Journey...",
    "Ready for Launch!"
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-purple-950 to-black relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-white text-center space-y-8 z-10">
        {/* Pulsing cosmic loader */}
        <div className="relative">
          <motion.div 
            className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-blue-500 border-b-purple-500 border-l-pink-500 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-4 w-16 h-16 border-2 border-transparent border-t-cyan-300 border-r-blue-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-8 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <motion.div
          key={loadingPhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-light bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {phases[loadingPhase]}
          </p>
        </motion.div>

        <div className="space-y-2">
          <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Preparing 3D Universe...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EnhancedPlanetJourneyPage() {
  return (
    <div className="bg-black min-h-screen relative overflow-x-hidden">
      {/* Meta tags for better experience */}
      <head>
        <title>Enhanced Cosmic Journey - 3D Planet Animation</title>
        <meta name="description" content="Experience an incredible 3D journey through space with Earth and Moon animations" />
      </head>

      <Suspense fallback={<SpectacularLoader />}>
        <EnhancedPlanetJourney />
      </Suspense>

      {/* Performance optimization script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Optimize performance for 3D content
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                // Preconnect to texture CDNs
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = 'https://example.com'; // Add actual texture CDN
                document.head.appendChild(link);
              });
            }
          `,
        }}
      />
    </div>
  )
}
