'use client'

import {useState} from 'react'
import dynamic from 'next/dynamic'
import {Button} from '@/components/ui/button'

// Dynamically import both components to avoid SSR issues and help with debugging
const MorphingMeteorSequence = dynamic(
  () =>
    import('@/components/animations/MorphingMeteorAnimationV2').then(
      (mod) => mod.MorphingMeteorSequence
    ),
  {
    ssr: false,
    loading: () => <div className='text-white'>Loading 2D Animation...</div>,
  }
)

const MorphingMeteor3D = dynamic(
  () => import('@/components/animations/MorphingMeteor3D').then((mod) => mod.MorphingMeteor3D),
  {
    ssr: false,
    loading: () => <div className='text-white'>Loading 3D Animation...</div>,
  }
)

export default function MeteorShowcase() {
  const [show2DAnimation, setShow2DAnimation] = useState(false)
  const [show3DAnimation, setShow3DAnimation] = useState(false)

  // All 7 eclipse images
  const eclipseImages = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg',
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg',
  ]

  const handleAnimationComplete = () => {
    console.log('Animation completed!')
    setShow2DAnimation(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900'>
      {/* Hero Section */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen p-8'>
        <h1 className='text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-[#adf0dd] via-white to-[#ff6b6b] bg-clip-text text-transparent text-center'>
          Eclipse Meteor
        </h1>

        <p className='text-xl md:text-2xl text-white/70 mb-12 text-center max-w-3xl'>
          Experience your Midjourney eclipse assets transformed into stunning animations
        </p>

        {/* Animation Options */}
        <div className='grid md:grid-cols-2 gap-8 max-w-4xl w-full'>
          {/* 2D GSAP Animation */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>2D Cinematic</h2>
            <p className='text-white/60 mb-6'>
              GSAP-powered meteor flying across space, morphing through all 7 eclipse forms with
              particle trails
            </p>
            <Button
              onClick={() => setShow2DAnimation(true)}
              className='w-full bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#adf0dd] transition-all duration-500'>
              Launch 2D Animation
            </Button>
          </div>

          {/* 3D React Three Fiber */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>3D Interactive</h2>
            <p className='text-white/60 mb-6'>
              React Three Fiber scene with orbital controls, real-time texture morphing, and
              particle system
            </p>
            <Button
              onClick={() => setShow3DAnimation(true)}
              className='w-full bg-gradient-to-r from-[#ff6b6b] to-[#adf0dd] hover:from-[#adf0dd] hover:to-[#ff6b6b] transition-all duration-500'>
              Launch 3D Scene
            </Button>
          </div>
        </div>

        {/* Image Preview Grid */}
        <div className='mt-16 w-full max-w-6xl'>
          <h3 className='text-xl text-white/50 mb-6 text-center'>Your 7 Eclipse Forms</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {eclipseImages.map((img, idx) => (
              <div
                key={idx}
                className='aspect-square rounded-lg overflow-hidden border border-white/10'>
                <img
                  src={img}
                  alt={`Eclipse ${idx + 1}`}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    // Fallback gradient if image not found
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.style.background = `linear-gradient(135deg, #adf0dd ${idx * 15}%, #ff6b6b ${100 - idx * 15}%)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2D Animation Overlay */}
      {show2DAnimation && (
        <MorphingMeteorSequence
          images={eclipseImages}
          onComplete={handleAnimationComplete}
          autoPlay={true}
        />
      )}

      {/* 3D Scene Modal */}
      {show3DAnimation && (
        <div className='fixed inset-0 z-50 bg-black'>
          <button
            onClick={() => setShow3DAnimation(false)}
            className='absolute top-8 right-8 z-10 text-white/60 hover:text-white transition-colors'>
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
          <MorphingMeteor3D images={eclipseImages} />
        </div>
      )}
    </div>
  )
}
