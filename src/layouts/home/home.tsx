'use client'

import {TitleAlt} from '@/layouts/home/TitleAlt'
import {AnimatePresence} from 'framer-motion'
import dynamic from 'next/dynamic'

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  {
    ssr: false,
  }
)

const ShootingStars = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.ShootingStars),
  {
    ssr: false,
  }
)
const StarsBackground = dynamic(
  () => import('@/components/backgrounds/shooting-stars').then((mod) => mod.StarsBackground),
  {
    ssr: false,
  }
)

const Moon = dynamic(() => import('@/components/moon').then((mod) => mod.Moon), {
  ssr: false,
})

const Earth = dynamic(() => import('@/components/earth').then((mod) => mod.Earth), {
  ssr: false,
})

export type HomeProps = {}

export const Home: React.FC<HomeProps> = () => {
  return (
    <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
      <div className='absolute top-0 left-0 h-[100vh] w-[100vw] z-1'>
        <Moon />
      </div>
      <div className='absolute top-0 left-0 right-0 bottom-0 h-full w-full !z-1 flex flex-col justify-center items-center'>
        <Earth />
      </div>

      <CanvasCursor />
      <div className='astronaut h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center align-middle relative overflow-hidden items-center z-40'>
        {/* @ts-ignore */}
        <AnimatePresence>
          <TitleAlt />
        </AnimatePresence>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  )
}
