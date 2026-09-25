/**
 * GSAP Animation Utilities
 * 
 * Reusable utility functions and constants for GSAP animations
 * following SOLID principles with single-responsibility functions.
 */

import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { SplitText } from 'gsap/SplitText'

// Register GSAP plugins once
if ( typeof window !== 'undefined' ) {
  gsap.registerPlugin( ScrambleTextPlugin, SplitText )
}

// ============================================================================
// Constants
// ============================================================================

export const ANIMATION_CONSTANTS = {
  SLIDE_EASE: 'cubic-bezier(0.65,0.05,0.36,1)',
  SPECIAL_CHARS: '▪',
  DEFAULT_DURATION: 0.64,
  STAGGER_DELAY: 0.075,
} as const

// ============================================================================
// Type Definitions
// ============================================================================

export interface ScrambleTextConfig {
  text: string
  chars?: string
  revealDelay?: number
  speed?: number
}

export interface StaggerConfig {
  each?: number
  from?: 'start' | 'end' | 'center' | number
}

export interface ClipPathConfig {
  duration?: number
  ease?: string
  direction?: 'top' | 'bottom' | 'left' | 'right'
}

// ============================================================================
// Clip Path Helpers
// ============================================================================

/**
 * Generate clip-path polygon strings for different reveal directions
 */
export const clipPaths = {
  /**
   * Creates a clip path for bottom-to-top reveal
   * @param progress - 0 (hidden) to 1 (fully visible)
   */
  bottomToTop: ( progress: number ) => {
    const visibleHeight = progress * 100
    return `polygon(0% ${100 - visibleHeight}%, 100% ${100 - visibleHeight}%, 100% 100%, 0% 100%)`
  },

  /**
   * Creates a clip path for top-to-bottom reveal
   * @param progress - 0 (hidden) to 1 (fully visible)
   */
  topToBottom: ( progress: number ) => {
    const visibleHeight = progress * 100
    return `polygon(0% 0%, 100% 0%, 100% ${visibleHeight}%, 0% ${visibleHeight}%)`
  },

  /**
   * Preset clip paths for common states
   */
  presets: {
    hidden: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    visible: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    hiddenTop: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
  },
} as const

// ============================================================================
// Animation Factory Functions
// ============================================================================

/**
 * Creates a scramble text animation configuration
 */
export function createScrambleTextAnim(
  config: ScrambleTextConfig
): gsap.TweenVars {
  return {
    scrambleText: {
      text: config.text,
      chars: config.chars || ANIMATION_CONSTANTS.SPECIAL_CHARS,
      revealDelay: config.revealDelay ?? 0,
      speed: config.speed ?? 0.3,
    },
    ease: 'none',
  }
}

/**
 * Creates a clip-path reveal animation
 */
export function createClipPathReveal(
  element: HTMLElement | string,
  config: ClipPathConfig = {}
): gsap.core.Tween {
  const {
    duration = ANIMATION_CONSTANTS.DEFAULT_DURATION,
    ease = ANIMATION_CONSTANTS.SLIDE_EASE,
    direction = 'bottom',
  } = config

  const endClipPath =
    direction === 'top'
      ? clipPaths.presets.hiddenTop
      : clipPaths.presets.hidden

  return gsap.to( element, {
    clipPath: endClipPath,
    duration,
    ease,
  } )
}

/**
 * Creates a staggered fade-out animation for multiple elements
 */
export function createStaggeredFadeOut(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  staggerDelay: number = 0.1
): gsap.core.Timeline {
  const tl = gsap.timeline()
  tl.to( elements, {
    opacity: 0,
    duration: 0.2,
    stagger: staggerDelay,
    ease: 'power1.in',
  } )
  return tl
}

/**
 * Creates a staggered slide animation (y-axis)
 */
export function createStaggeredSlide(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  config: {
    y?: string | number
    duration?: number
    stagger?: number
    ease?: string
    direction?: 'up' | 'down'
  } = {}
): gsap.core.Tween {
  const {
    y = config.direction === 'up' ? '-100%' : '100%',
    duration = ANIMATION_CONSTANTS.DEFAULT_DURATION,
    stagger = ANIMATION_CONSTANTS.STAGGER_DELAY,
    ease = ANIMATION_CONSTANTS.SLIDE_EASE,
  } = config

  return gsap.to( elements, {
    y,
    duration,
    stagger,
    ease,
  } )
}

// ============================================================================
// SplitText Helpers
// ============================================================================

/**
 * Creates and configures a SplitText instance with default settings
 */
export function createSplitText(
  element: HTMLElement | string,
  type: 'chars' | 'words' | 'lines' = 'chars'
): SplitText {
  return new SplitText( element, {
    type,
    charsClass: 'char',
    wordsClass: 'word',
    linesClass: 'line',
    position: 'relative',
  } )
}

/**
 * Creates a hover animation for split text characters
 */
export function createSplitTextHover(
  splitText: SplitText,
  config: {
    xOffset?: number
    duration?: number
    stagger?: number
  } = {}
): {
  onEnter: () => void
  onLeave: () => void
} {
  const {
    xOffset = 0.5,
    duration = ANIMATION_CONSTANTS.DEFAULT_DURATION,
    stagger = 0.015,
  } = config

  return {
    onEnter: () => {
      gsap.to( splitText.chars, {
        x: ( i: number ) => `${xOffset + i * 0.1}em`,
        duration,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        stagger: {
          each: stagger,
          from: 'start',
        },
      } )
    },
    onLeave: () => {
      gsap.to( splitText.chars, {
        x: 0,
        duration,
        ease: ANIMATION_CONSTANTS.SLIDE_EASE,
        stagger: {
          each: 0.01,
          from: 'end',
        },
      } )
    },
  }
}

// ============================================================================
// Timeline Utilities
// ============================================================================

/**
 * Creates a timeline with common configuration
 */
export function createTimeline(
  config: gsap.TimelineVars = {}
): gsap.core.Timeline {
  return gsap.timeline( config )
}

/**
 * Adds a scramble glitch effect to random elements
 */
export function addRandomGlitchEffect(
  timeline: gsap.core.Timeline,
  elements: HTMLElement[],
  config: {
    numToGlitch?: number
    duration?: number
    atTime?: string | number
  } = {}
): void {
  const {
    numToGlitch = 3 + Math.floor( Math.random() * 3 ),
    duration = 0.2,
    atTime = '+=0',
  } = config

  const glitchTl = gsap.timeline()

  // Select random elements
  const randomElements = elements
    .sort( () => Math.random() - 0.5 )
    .slice( 0, numToGlitch )

  randomElements.forEach( ( element ) => {
    const text = element.textContent || element.getAttribute( 'data-original-text' ) || ''

    glitchTl.to(
      element,
      {
        duration,
        ...createScrambleTextAnim( { text, speed: 0.1 } ),
        repeat: 1,
      },
      Math.random() * 0.5
    )
  } )

  timeline.add( glitchTl, atTime )
}

// ============================================================================
// Element State Management
// ============================================================================

/**
 * Sets initial GSAP state for elements
 */
export function setInitialState(
  elements: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
  vars: gsap.TweenVars
): void {
  gsap.set( elements, vars )
}

/**
 * Stores original text content on elements with data attributes
 */
export function storeOriginalText(
  elements: NodeListOf<HTMLElement> | HTMLElement[]
): Map<HTMLElement, string> {
  const originalTexts = new Map<HTMLElement, string>()

  Array.from( elements ).forEach( ( element ) => {
    const originalText = element.textContent || ''
    originalTexts.set( element, originalText )
    element.setAttribute( 'data-original-text', originalText )
    element.textContent = ''
  } )

  return originalTexts
}

/**
 * Restores original text content from data attributes
 */
export function restoreOriginalText(
  elements: NodeListOf<HTMLElement> | HTMLElement[]
): void {
  Array.from( elements ).forEach( ( element ) => {
    const originalText = element.getAttribute( 'data-original-text' )
    if ( originalText ) {
      element.textContent = originalText
    }
  } )
}

