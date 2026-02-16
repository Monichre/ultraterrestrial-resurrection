'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the PlanetJourney component to avoid SSR issues with Three.js
const PlanetJourney = dynamic(
  () => import('@/components/3d/planet-journey/PlanetJourney'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
          <p className="text-xl">Loading Cosmic Journey...</p>
        </div>
      </div>
    )
  }
)

export default function PlanetJourneyPage() {
  return (
    <div className="bg-black min-h-screen relative overflow-x-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-white text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto"></div>
            <p className="text-xl">Initializing 3D Universe...</p>
          </div>
        </div>
      }>
        <PlanetJourney />
      </Suspense>
    </div>
  )
}
