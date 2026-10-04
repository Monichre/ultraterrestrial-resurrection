'use client'

import { Spotlight } from '@/components/animated'
import { g, type d } from '@liveblocks/react/dist/suspense-fYGGJ3D9'
import { svg } from 'd3'
import { motion } from 'framer-motion'
import path from 'path'
import React, { useRef } from 'react'
import type { fill } from 'three/src/extras/TextureUtils'

export function FarmUIBackground() {
  return (
    <div className='relative px-10 mt-10 w-full min-h-full'>
      <Spotlight />

      <div className='absolute -z-1 inset-0  h-[600px] w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>

      <div className='absolute right-0 bottom-0 left-0 mx-auto opacity-20'></div>
    </div>
  )
}


export const FinePrintBackground = () => {
  return (
    <motion.svg width="48" height="48" viewBox="0 0 48 48">
      <motion.g
        opacity="0.25"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 11H11V12H12V11ZM12 23H11V24H12V23ZM11 35H12V36H11V35ZM12 47H11V48H12V47ZM23 11H24V12H23V11ZM24 23H23V24H24V23ZM23 35H24V36H23V35ZM24 47H23V48H24V47ZM35 11H36V12H35V11ZM36 23H35V24H36V23ZM35 35H36V36H35V35ZM36 47H35V48H36V47ZM47 11H48V12H47V11ZM48 23H47V24H48V23ZM47 35H48V36H47V35ZM48 47H47V48H48V47Z" fill="currentColor"></path>
      </motion.g>

      <motion.g
        opacity="0.45"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24 23H23V24H24V23ZM24 47H23V48H24V47ZM47 23H48V24H47V23ZM48 47H47V48H48V47Z" fill="currentColor"></path>
      </motion.g>
    </motion.svg>
  )
}