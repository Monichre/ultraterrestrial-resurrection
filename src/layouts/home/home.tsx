'use client'

import {TitleAlt} from '@/layouts/home/TitleAlt'
import {LovecraftQuoteOverlay} from '@/layouts/home/LovecraftQuoteOverlay'
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

const IntroScene = dynamic(
  () => import('@/components/intro/IntroScene').then((mod) => mod.IntroScene),
  {ssr: false}
)

export type HomeProps = {}

export const Home: React.FC<HomeProps> = () => {
  return (
    <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
      {/* Unified Three.js intro: camera flyby, Earth arrival, Moon orbital pivot,
          UFO flickers, and glitch/ASCII/static end-state — all on one camera. */}
      <div className='absolute inset-0 z-1'>
        <IntroScene />
      </div>

      <CanvasCursor />

      <div className='astronaut h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center align-middle relative overflow-hidden items-center z-40'>
        {/* @ts-ignore */}
        <AnimatePresence>
          <TitleAlt />
        </AnimatePresence>
      </div>

      <LovecraftQuoteOverlay />

      <ShootingStars />
      <StarsBackground />
    </div>
  )
}
