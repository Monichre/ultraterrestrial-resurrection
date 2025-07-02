'use client'

import {TitleAlt} from '@/layouts/home/TitleAlt'
import {CosmicNav} from '@/components/navbar/cosmic-nav'
import dynamic from 'next/dynamic'
import {useHomeAnimations} from './useHomeAnimations'

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  {ssr: false}
)

const ShootingStars = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.ShootingStars),
  {ssr: false}
)

const StarsBackground = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground),
  {ssr: false}
)

const Moon = dynamic(() => import('@/components/moon').then((mod) => mod.Moon), {
  ssr: false,
})

const Earth = dynamic(() => import('@/components/earth').then((mod) => mod.Earth), {
  ssr: false,
})

export type HomeGSAPProps = {}

export const HomeGSAP: React.FC<HomeGSAPProps> = () => {
  const refs = useHomeAnimations()

  return (
    <div ref={refs.container} className='h-[100vh] w-[100vw] relative overflow-hidden bg-black'>
      {/* Cosmic Navigation */}
      <div ref={refs.nav} className='relative z-50'>
        <CosmicNav />
      </div>

      {/* Moon Container */}
      <div ref={refs.moon} className='absolute top-0 left-0 h-[100vh] w-[100vw] z-10'>
        <Moon />
      </div>

      {/* Earth Container */}
      <div
        ref={refs.earth}
        className='absolute top-0 left-0 right-0 bottom-0 h-full w-full z-10 flex flex-col justify-center items-center'>
        <Earth activeLocation={null} />
      </div>

      {/* Canvas Cursor */}
      <div ref={refs.cursor}>
        <CanvasCursor />
      </div>

      {/* Title Container */}
      <div
        ref={refs.title}
        className='astronaut h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center align-middle relative overflow-hidden items-center z-40'>
        <TitleAlt />
      </div>

      {/* Shooting Stars */}
      <div ref={refs.shootingStars} className='absolute inset-0 z-5'>
        <ShootingStars />
      </div>

      {/* Stars Background */}
      <div ref={refs.stars} className='absolute inset-0 z-0'>
        <StarsBackground />
      </div>
    </div>
  )
}
