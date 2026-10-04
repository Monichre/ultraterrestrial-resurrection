'use client'

import styles from ''
import { motion } from 'framer-motion'
import { FunctionComponent } from 'react'

import ParticleImage, { ParticleOptions } from 'react-particle-image'

const words = 'UltraTerrestrial'

export function FadeUpStagger() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  }
  return (
    <motion.div
      initial='hidden'
      animate='show'
      w
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delay: 1,
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.p
        className='mt-12 text-center md:text-5xl'
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Tracking the State of Disclosure
      </motion.p>
      <motion.div
        className='mx-auto mt-6 flex items-center justify-center space-x-5'
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Striving to document, explore and disseminate the past, present and
        future of the UFO topic and its bearing on humanity, the universe and
        our place within it.
      </motion.div>
    </motion.div>
  )
}

export const WordPullUp = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { delay: 1, type: 'spring' } },
  }
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      initial='hidden'
      animate='show'
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 1,
          },
        },
      }}
    >
      <motion.h1
        variants={container}
        initial='hidden'
        animate='show'
        className='text-center font-display text-9xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-9xl md:leading-[5rem]'
      >
        {words.split(' ').map((word, i) => (
          <motion.span
            key={i}
            variants={item}
            style={{ display: 'inline-block', paddingRight: '15px' }}
          >
            {word === '' ? <span>&nbsp;</span> : word}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className='mt-12 text-center md:text-5xl'
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Tracking the State of Disclosure
      </motion.p>
      <motion.div
        className='mx-auto mt-6 flex items-center justify-center space-x-5'
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Striving to document, explore and disseminate the past, present and
        future of the UFO topic and its bearing on humanity, the universe and
        our place within it.
      </motion.div>
    </motion.div>
  )
}

interface HeroProps {}

interface AnimatedHeroProps {}

export const AnimatedHero: FunctionComponent<AnimatedHeroProps> = () => {
  const particleOptions: ParticleOptions = {
    filter: ({ x, y, image }) => {
      // Get pixel
      const pixel = image.get(x, y)
      // Make a particle for this pixel if blue > 50 (range 0-255)
      return pixel.b > 50
    },
    color: ({ x, y, image }) => '#fff',
  }
  return (
    <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center'>
      <ParticleImage
        src={'/swirl.png'}
        scale={5}
        entropy={20}
        height={700}
        width={700}
        maxParticles={10000}
        backgroundColor='transparent'
        particleOptions={particleOptions}
      />
    </div>
  )
}

export const Hero: FunctionComponent<HeroProps> = () => {
  return (
    <div className=' w-full h-screen relative'>
      <div
        className='absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-opacity-50 flex flex-col justify-center items-center'
        style={{ backgroundImage: 'url(/bg.webp)' }}
      >
        <AnimatedHero />
        <WordPullUp />
      </div>
    </div>
  )
}
