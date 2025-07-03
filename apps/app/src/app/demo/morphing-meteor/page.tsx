'use client'

import { useState } from 'react'
import { MorphingMeteorSequence } from '@/components/animations/MorphingMeteorAnimation'
import { Button } from '@/components/ui/button'

export default function MorphingMeteorDemo() {
  const [showAnimation, setShowAnimation] = useState(false)
  
  const handleAnimationComplete = () => {
    console.log('Meteor animation completed!')
    setShowAnimation(false)
  }
  
  const triggerAnimation = () => {
    setShowAnimation(true)
  }
  
  // NOTE: You need to save your Midjourney images to these paths
  const meteorImages = [
    '/assets/cosmic-portals/eclipse-1.jpg', // Your first eclipse image
    '/assets/cosmic-portals/eclipse-2.jpg', // Your second eclipse image  
    '/assets/cosmic-portals/eclipse-3.jpg', // Your third eclipse image
    '/assets/cosmic-portals/eclipse-4.jpg'  // Your fourth eclipse image
  ]
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] bg-clip-text text-transparent">
          Morphing Meteor Animation
        </h1>
        
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Watch as a cosmic meteor flies across space, morphing between your eclipse forms.
          The meteor transforms through each of your Midjourney images as it travels.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={triggerAnimation}
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#adf0dd] transition-all duration-500"
          >
            Launch Meteor
          </Button>
          
          <p className="text-sm text-white/50">
            Make sure your images are saved in: /public/assets/cosmic-portals/
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="space-y-2">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src="/assets/cosmic-portals/eclipse-1.jpg" 
                alt="Eclipse 1" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SW1hZ2UgMTwvdGV4dD48L3N2Zz4='
                }}
              />
            </div>
            <p className="text-sm text-white/50">Eclipse Form 1</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src="/assets/cosmic-portals/eclipse-2.jpg" 
                alt="Eclipse 2" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SW1hZ2UgMjwvdGV4dD48L3N2Zz4='
                }}
              />
            </div>
            <p className="text-sm text-white/50">Eclipse Form 2</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src="/assets/cosmic-portals/eclipse-3.jpg" 
                alt="Eclipse 3" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SW1hZ2UgMzwvdGV4dD48L3N2Zz4='
                }}
              />
            </div>
            <p className="text-sm text-white/50">Eclipse Form 3</p>
          </div>
          <div className="space-y-2">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src="/assets/cosmic-portals/eclipse-4.jpg" 
                alt="Eclipse 4" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SW1hZ2UgNDwvdGV4dD48L3N2Zz4='
                }}
              />
            </div>
            <p className="text-sm text-white/50">Eclipse Form 4</p>
          </div>
        </div>
      </div>
      
      {/* Animation component */}
      {showAnimation && (
        <MorphingMeteorSequence
          images={meteorImages}
          onComplete={handleAnimationComplete}
          autoPlay={true}
        />
      )}
    </div>
  )
}
