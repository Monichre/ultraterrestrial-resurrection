'use client'

import { useState } from 'react'
import { CosmicPortalSequence, useCosmicPortalAnimation } from '@/components/animations/CosmicPortalAnimation'
import { Button } from '@/components/ui/button'

export default function CosmicPortalDemo() {
  const [showAnimation, setShowAnimation] = useState(false)
  
  const handleAnimationComplete = () => {
    console.log('Animation completed!')
    setShowAnimation(false)
  }
  
  const triggerAnimation = () => {
    setShowAnimation(true)
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] bg-clip-text text-transparent">
          Cosmic Portal Animation
        </h1>
        
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Experience a mind-blowing journey through dimensional portals. 
          This animation chains your Midjourney eclipse assets into an epic 3D galactic sequence.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={triggerAnimation}
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#adf0dd] transition-all duration-500"
          >
            Launch Portal Sequence
          </Button>
          
          <p className="text-sm text-white/50">
            Warning: This animation takes over the entire screen
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="space-y-2">
            <div className="aspect-square bg-gradient-to-br from-blue-500 to-orange-500 rounded-full opacity-70"></div>
            <p className="text-sm text-white/50">Eclipse 1</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gradient-to-br from-cyan-400 to-red-500 rounded-full opacity-70"></div>
            <p className="text-sm text-white/50">Eclipse 2</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gradient-to-br from-teal-400 to-orange-600 rounded-full opacity-70"></div>
            <p className="text-sm text-white/50">Eclipse 3</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gradient-to-br from-blue-600 to-orange-400 rounded-full opacity-70"></div>
            <p className="text-sm text-white/50">Eclipse 4</p>
          </div>
        </div>
      </div>
      
      {/* Animation component */}
      {showAnimation && (
        <CosmicPortalSequence
          images={[
            '/assets/cosmic-portals/eclipse-1.jpg',
            '/assets/cosmic-portals/eclipse-2.jpg',
            '/assets/cosmic-portals/eclipse-3.jpg',
            '/assets/cosmic-portals/eclipse-4.jpg'
          ]}
          onComplete={handleAnimationComplete}
          autoPlay={true}
        />
      )}
    </div>
  )
}
