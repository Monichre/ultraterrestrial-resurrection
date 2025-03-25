'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useState } from 'react'
import { context } from 'shadergradient'
gsap.registerPlugin(useGSAP)

export const NodeMenu = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const detailsRef = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(false)
  const duration = 0.75
  const duration2 = 0.3
  const ease = 'elastic.out(1, 0.5)'

  const { contextSafe } = useGSAP({ scope: containerRef })

  const remove = contextSafe(() => {
    gsap.to('.box', {
      opacity: 0,
      onComplete: () => setActive(false),
    })
  })

  const handleMouseEnter = contextSafe((index: number) => {
    gsap.to(containerRef.current, {
      width: [500, 460, 480][index],
      height: [290, 262, 204][index],
      y: 17,
      borderRadius: 24,
      duration,
      ease,
    })

    gsap.to(detailsRef.current, {
      opacity: (idx: number) => (idx === index ? 1 : 0),
      zIndex: (idx: number) => (idx === index ? 2 : 1),
      duration: duration2,
    })
  })

  const handleMouseLeave = contextSafe(() => {
    const isHover = detailsRef.current.some(
      (detail) => detail && detail.matches(':hover')
    )

    if (!isHover) {
      mouseleaveDetails()
    }
  })

  const mouseleaveDetails = contextSafe(() => {
    gsap.to(containerRef.current, {
      width: 410,
      height: 48,
      y: 0,
      borderRadius: 16,
      duration,
      ease,
    })

    gsap.to(detailsRef.current, {
      opacity: 0,
      duration: 0,
      zIndex: 1,
    })
  })

  return (
    <div className='w-full h-full flex items-center justify-center p-4'>
      <div className='relative w-full h-full rounded-2xl bg-bg-gradient overflow-hidden'>
        <div
          className='flex items-center justify-center gap-2 rounded-2xl bg-transparent w-[410px] absolute -translate-x-1/2 left-1/2 bottom-14 z-[2]'
          ref={containerRef}
        >
          {['Apps', 'Components', 'Notes'].map((label, index) => (
            <button
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className='item flex items-center justify-center gap-2 hover:bg-zinc-950 hover:text-white duration-300 transition-colors py-3 px-4 rounded-2xl'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-6'
              >
                {/* Insert correct paths here based on your icons */}
              </svg>
              <span className='font-bold'>{label}</span>
            </button>
          ))}
        </div>
        <div className='absolute bg-black/5 backdrop-blur-xl w-[410px] h-12 -translate-x-1/2 left-1/2 bottom-14 overflow-hidden rounded-2xl container-block'>
          {['Gather', 'Slack'].map((title, index) => (
            <div
              key={index}
              ref={(el) => (detailsRef.current[index] = el)}
              className='p-4 flex flex-col items-center absolute w-full bottom-16 opacity-0 details'
            >
              <div className='w-[95%] flex items-center gap-3 cursor-pointer hover:bg-black/5 rounded-2xl py-3 hover:px-3 duration-300'>
                <img
                  src={`/${title.toLowerCase()}.svg`}
                  alt={title}
                  className='w-16 rounded-xl object-cover h-16 shrink-0'
                />
                <div className='w-full flex flex-col items-start'>
                  <p className='font-bold'>{title}</p>
                  <p className='opacity-80'>
                    {index === 0 ? 'Virtual Office' : 'Communication App'}
                  </p>
                </div>
                <span className='block shrink-0 py-1 px-2 text-sm rounded-lg opacity-80 border border-black/50'>
                  {index === 0 ? 'Mac' : 'Windows'}
                </span>
              </div>
            </div>
          ))}
          {/* Add other detail blocks here */}
        </div>
      </div>
    </div>
  )
}
