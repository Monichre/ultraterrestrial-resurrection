'use client'

import {LovecraftQuote} from '@/layouts/home/LovecraftQuote'
import {TitleAlt} from '@/layouts/home/TitleAlt'
import {CosmicNav} from '@/components/navbar/cosmic-nav'
import {useUltraterrestrialAnimation} from '@/hooks/useUltraterrestrialAnimation'
// import { Howl } from 'howler'
import {AnimatePresence} from 'framer-motion'
import dynamic from 'next/dynamic'
import {useEffect} from 'react'

const CanvasCursor = dynamic(
  () => import('@/components/ui/canvas-cursor').then((mod) => mod.CanvasCursor),
  {
    ssr: false,
  }
)
// zq
// const BlurAppear = dynamic(() => import('@/components/animated').then(mod => mod.BlurAppear))
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

export const HomeAnimated: React.FC<HomeProps> = () => {
  // Initialize the GSAP animation
  const {pauseAnimation, resumeAnimation, restartAnimation, skipToEnd} =
    useUltraterrestrialAnimation()

  // Optional: Add keyboard shortcuts for testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          pauseAnimation()
          break
        case 'Enter':
          e.preventDefault()
          resumeAnimation()
          break
        case 'r':
          e.preventDefault()
          restartAnimation()
          break
        case 's':
          e.preventDefault()
          skipToEnd()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [pauseAnimation, resumeAnimation, restartAnimation, skipToEnd])

  // console.log( "🚀 ~ file: home.tsx:46 ~ moonInView:", moonInView )

  // useEffect( () => {
  //   console.log( "🚀 ~ file: home.tsx:50 ~ moonInView:", moonInView )
  //   console.log( "🚀 ~ file: home.tsx:51 ~ earthInView:", earthInView )
  // }, [moonInView, earthInView] )

  // const { ref: moonInViewRef, inView: isMoonInView } = useInView({
  //   triggerOnce: true,
  //   threshold: 0.5,
  // })

  // useEffect( () => {
  //   const sound = new Howl( {
  //     src: ['/assets/audio/interstellar-stay.mp3'],
  //     html5: true,
  //     loop: true,
  //     preload: true,
  //     autoplay: true,
  //     volume: 0.5,
  //     onend: function () {
  //       console.log( 'Finished!' )
  //     },
  //   } )

  //   sound.play()
  // } )

  return (
    <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
      {/* Cosmic Navigation - add class for animation targeting */}
      <div className='cosmic-nav'>
        <CosmicNav />
      </div>

      <div className='absolute top-0 left-0 h-[100vh] w-[100vw] z-1'>
        <Moon />
        {/* <DoubleHelixScene /> */}
      </div>
      <div className='absolute top-0 left-0 right-0 bottom-0  h-full w-full !z-1 flex flex-col justify-center items-center'>
        <Earth activeLocation={null} />
      </div>
      {/* 
      <Profiler id="Earth" onRender={onRenderCallback}>
        <Earth />
      </Profiler> */}

      <CanvasCursor />
      <div className='astronaut h-[100vh] w-full absolute top-0 left-0 flex flex-col justify-center align-middle relative overflow-hidden items-center z-40'>
        {/* @ts-ignore */}
        {/* <AnimatePresence> */}
        {/* <div className='w-full'> */}
        {/* <SiteTitle /> */}
        <TitleAlt />
        {/* <LovecraftQuote /> */}
        {/* </AnimatePresence> */}
        {/* </div> */}
      </div>
      <div className='shooting-stars'>
        <ShootingStars />
      </div>
      <div className='stars-background'>
        <StarsBackground />
      </div>
    </div>
  )
}
