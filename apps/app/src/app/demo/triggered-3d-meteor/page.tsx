'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Vector3 } from 'three'
import { Button } from '@/components/ui/button'

// Dynamic import to avoid SSR issues
const Triggered3DMeteor = dynamic(
  () => import('@/components/animations/Triggered3DMeteor').then(mod => ({ 
    default: mod.Triggered3DMeteor 
  })),
  { ssr: false }
)

const useTriggered3DMeteor = dynamic(
  () => import('@/components/animations/Triggered3DMeteor').then(mod => mod.useTriggered3DMeteor),
  { ssr: false }
) as any

interface Meteor3DRef {
  trigger: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export default function Triggered3DMeteorDemo() {
  // Refs for different meteor paths
  const diagonalRef = useRef<Meteor3DRef>(null)
  const spiralRef = useRef<Meteor3DRef>(null)
  const arcRef = useRef<Meteor3DRef>(null)
  const orbitRef = useRef<Meteor3DRef>(null)
  
  const eclipseImages = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg',
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg'
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-[#adf0dd] via-white to-[#ff6b6b] bg-clip-text text-transparent text-center">
          3D Meteor Triggers
        </h1>
        
        <p className="text-xl md:text-2xl text-white/70 mb-12 text-center max-w-3xl">
          React Three Fiber powered meteors with different 3D paths
        </p>
        
        {/* Control Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Diagonal Path */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Diagonal Strike</h2>
            <p className="text-white/60 mb-6">
              Classic diagonal path through 3D space
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => diagonalRef.current?.trigger()}
                className="w-full bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b]"
              >
                Launch Diagonal
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => diagonalRef.current?.pause()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Pause
                </Button>
                <Button
                  onClick={() => diagonalRef.current?.resume()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Resume
                </Button>
                <Button
                  onClick={() => diagonalRef.current?.reset()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          {/* Spiral Path */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Spiral Descent</h2>
            <p className="text-white/60 mb-6">
              Spiraling down through dimensions
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => spiralRef.current?.trigger()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Launch Spiral
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => spiralRef.current?.pause()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Pause
                </Button>
                <Button
                  onClick={() => spiralRef.current?.resume()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Resume
                </Button>
                <Button
                  onClick={() => spiralRef.current?.reset()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          {/* Arc Path */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Cosmic Arc</h2>
            <p className="text-white/60 mb-6">
              Graceful arc through the cosmos
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => arcRef.current?.trigger()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
              >
                Launch Arc
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => arcRef.current?.pause()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Pause
                </Button>
                <Button
                  onClick={() => arcRef.current?.resume()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Resume
                </Button>
                <Button
                  onClick={() => arcRef.current?.reset()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
          
          {/* Orbit Path */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Orbital Loop</h2>
            <p className="text-white/60 mb-6">
              Complete orbital trajectory
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => orbitRef.current?.trigger()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500"
              >
                Launch Orbit
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => orbitRef.current?.pause()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Pause
                </Button>
                <Button
                  onClick={() => orbitRef.current?.resume()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Resume
                </Button>
                <Button
                  onClick={() => orbitRef.current?.reset()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Code Example */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Integration Example</h3>
            <pre className="text-sm text-[#adf0dd] overflow-x-auto">
{`import { Triggered3DMeteor, useTriggered3DMeteor } from '@/animations/Triggered3DMeteor'
import { Vector3 } from 'three'

// Method 1: Using ref
const meteorRef = useRef(null)

<Triggered3DMeteor 
  ref={meteorRef}
  images={eclipseImages}
  duration={8}
  path="spiral"
  onComplete={() => console.log('Complete!')}
/>

<button onClick={() => meteorRef.current?.trigger()}>
  Launch 3D Meteor
</button>

// Method 2: Custom path
const customPath = [
  new Vector3(-10, 5, 0),
  new Vector3(0, 10, -5),
  new Vector3(10, -5, 0)
]

<Triggered3DMeteor 
  path="custom"
  customPath={customPath}
  duration={10}
/>`}
            </pre>
          </div>
        </div>
      </div>
      
      {/* 3D Meteor Components */}
      <Triggered3DMeteor
        ref={diagonalRef}
        images={eclipseImages}
        duration={6}
        path="diagonal"
        onComplete={() => console.log('Diagonal complete!')}
      />
      
      <Triggered3DMeteor
        ref={spiralRef}
        images={eclipseImages}
        duration={8}
        path="spiral"
        onComplete={() => console.log('Spiral complete!')}
      />
      
      <Triggered3DMeteor
        ref={arcRef}
        images={eclipseImages}
        duration={7}
        path="arc"
        startPosition={new Vector3(-15, -5, 0)}
        endPosition={new Vector3(15, -5, 0)}
        onComplete={() => console.log('Arc complete!')}
      />
      
      <Triggered3DMeteor
        ref={orbitRef}
        images={eclipseImages}
        duration={10}
        path="orbit"
        onComplete={() => console.log('Orbit complete!')}
      />
    </div>
  )
}
