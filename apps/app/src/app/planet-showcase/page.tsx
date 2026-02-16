'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PlanetShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Cosmic Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience incredible 3D planet animations featuring Earth zoom-ins, 
            spectacular Moon entrances, and seamless GSAP parallax scrolling with stunning text effects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Standard Version Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-cyan-400 transition-all duration-300 group hover:scale-105"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-4 text-cyan-400">
                Classic Journey
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                A beautiful 3D space experience featuring smooth camera movements, 
                Earth exploration, and elegant moon animations with GSAP scroll triggers.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm mb-6">
                <li>• Smooth camera zoom into Earth</li>
                <li>• Realistic 3D planetary models</li>
                <li>• Moon entrance animation</li>
                <li>• GSAP parallax text effects</li>
                <li>• Star field background</li>
              </ul>
            </div>
            <Link href="/planet-journey">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25"
              >
                Launch Classic Journey
              </motion.button>
            </Link>
          </motion.div>

          {/* Enhanced Version Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8 rounded-2xl border border-purple-700 hover:border-purple-400 transition-all duration-300 group hover:scale-105"
          >
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h2 className="text-3xl font-bold text-purple-400">
                  Enhanced Odyssey
                </h2>
                <span className="ml-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  PREMIUM
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                An incredible cinematic experience with advanced visual effects, 
                atmospheric shaders, particle systems, and spectacular post-processing.
              </p>
              <ul className="space-y-2 text-gray-400 text-sm mb-6">
                <li>• Advanced atmospheric shaders</li>
                <li>• Particle systems & space dust</li>
                <li>• Post-processing bloom effects</li>
                <li>• Trail effects for moon entrance</li>
                <li>• Enhanced lighting & shadows</li>
                <li>• Cloud layers & Earth glow</li>
                <li>• Chromatic aberration effects</li>
              </ul>
            </div>
            <Link href="/enhanced-planet-journey">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25"
              >
                Launch Enhanced Odyssey
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-300">
            Built with Cutting-Edge Technology
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'React Three Fiber',
              'Three.js',
              'GSAP ScrollTrigger',
              'Framer Motion',
              'TypeScript',
              'Next.js 15',
              'Post-processing'
            ].map((tech, i) => (
              <span
                key={tech}
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full border border-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center text-gray-400"
        >
          <p className="text-sm">
            Use your mouse wheel or trackpad to scroll and control the cosmic journey.
            <br />
            Best experienced on desktop with a modern browser.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
