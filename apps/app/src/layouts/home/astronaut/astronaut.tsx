'use client'
import { FunctionComponent, useEffect, useState } from 'react'
import { useMedia } from 'react-use'

import { VFX } from '@vfx-js/core'
const vfx = new VFX()

import Image from 'next/image'
import { BlurFade } from '@/components/animated'

interface AstronautProps { }

export const Astronaut: FunctionComponent<AstronautProps> = () => {
  const isLargeScreen = useMedia( '(min-width: 1280px)' )
  const size: number = isLargeScreen ? 800 : 400

  useEffect( () => {
    // const img: any = document.getElementById('#astronaut')
    // vfx.add(img, { shader: 'rgbShift' })
    // | "uvGradient"
    // | "rainbow"
    // | "glitch"
    // | "rgbGlitch"
    // | "rgbShift"
    // | "shine"
    // | "blink"
    // | "spring"
    // | "duotone"
    // | "tritone"
    // | "hueShift"
    // | "sinewave"
    // | "pixelate"
    // | "halftone"
    // | "slitScanTransition"
    // | "warpTransition"
    // | "pixelateTransition"
  }, [] )
  // items-center align-bottom self-center
  return (
    <div className=' w-full h-auto absolute bottom-0 left-0'>
      <BlurFade inView delay={1.5} key={'astronaught'}>
        <Image
          className='mx-auto sm:h-[200px] sm:w-[200px] md:h-[300px] md:w-[300px]  lg:h-[300px] lg:w-[300px] 3xl:h-[400px] 3xl:w-[400px] relative z-40'
          height={size}
          width={size}
          alt='astronaut'
          id='#astronaut'
          src={'/astronaut-2.png'}
        />
      </BlurFade>
    </div>
  )
}
