'use client'
// useTextAnimator.js

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTextSplitter } from './useTextSplitter'
import SplitText from 'gsap'
gsap.registerPlugin(SplitText)
const lettersAndSymbols = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '-',
  '_',
  '+',
  '=',
  ';',
  ':',
  '<',
  '>',
  ',',
]

export const useTextAnimator = (textElementRef, options = {}) => {
  const {
    lines,
    words,
    chars,
    revert: revertSplit,
  } = useTextSplitter(textElementRef, options)
  const originalCharsRef: any = useRef([])

  useEffect(() => {
    if (chars.length > 0) {
      originalCharsRef.current = chars.map((char) => char.innerHTML)
    }
  }, [chars])

  const animate = useCallback(() => {
    if (chars.length === 0) return

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML

      gsap.fromTo(
        char,
        {
          opacity: 0,
        },
        {
          duration: 0.03,
          onComplete: () =>
            gsap.set(char, { innerHTML: initialHTML, delay: 0.1 }),
          repeat: 2,
          repeatRefresh: true,
          repeatDelay: 0.05, // delay between repeats
          delay: (position + 1) * 0.06, // delay between chars
          innerHTML: () =>
            lettersAndSymbols[
              Math.floor(Math.random() * lettersAndSymbols.length)
            ],
          opacity: 1,
        }
      )
    })

    gsap.fromTo(
      textElementRef.current,
      {
        '--anim': 0,
      },
      {
        duration: 1,
        ease: 'expo',
        '--anim': 1,
      }
    )
  }, [chars, textElementRef])

  const animateBack = useCallback(() => {
    gsap.killTweensOf(textElementRef.current) // Ensure no ongoing animations
    gsap.to(textElementRef.current, {
      duration: 0.6,
      ease: 'power4',
      '--anim': 0,
    })
  }, [textElementRef])

  const reset = useCallback(() => {
    if (chars.length === 0) return

    chars.forEach((char, index) => {
      gsap.killTweensOf(char) // Ensure no ongoing animations
      char.innerHTML = originalCharsRef.current[index]
    })

    gsap.killTweensOf(textElementRef.current)
    gsap.set(textElementRef.current, { '--anim': 0 })
  }, [chars, textElementRef])

  const revert = useCallback(() => {
    reset()
    revertSplit()
  }, [reset, revertSplit])

  return { animate, animateBack, reset, revert }
}
