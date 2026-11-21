'use client'

import {useState} from 'react'
import {Home} from './home'
import {HomeGSAP} from './home-gsap'
import {Button} from '@/components/ui/button'

export const HomeComparison: React.FC = () => {
  const [showAnimated, setShowAnimated] = useState(true)

  return (
    <div className='relative w-full h-screen'>
      {/* Toggle Button */}
      <div className='fixed top-4 right-4 z-[100] bg-black/50 backdrop-blur-md rounded-lg p-2'>
        <div className='flex items-center space-x-2'>
          <Button
            variant={!showAnimated ? 'default' : 'outline'}
            size='sm'
            onClick={() => setShowAnimated(false)}>
            Static
          </Button>
          <Button
            variant={showAnimated ? 'default' : 'outline'}
            size='sm'
            onClick={() => setShowAnimated(true)}>
            Animated (GSAP)
          </Button>
        </div>
        <p className='text-xs text-gray-400 mt-2 text-center'>
          {showAnimated ? 'GSAP Animations Active' : 'Static Version'}
        </p>
      </div>

      {/* Render appropriate version */}
      {showAnimated ? <HomeGSAP /> : <Home />}
    </div>
  )
}
