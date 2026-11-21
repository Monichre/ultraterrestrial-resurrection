'use client'

import {useEffect, useRef, useState} from 'react'

interface SoundSystemProps {
  currentSection: number
}

export function SoundSystem({currentSection}: SoundSystemProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollSound1Ref = useRef<HTMLAudioElement>(null)
  const scrollSound2Ref = useRef<HTMLAudioElement>(null)
  const scrollSound3Ref = useRef<HTMLAudioElement>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const hoverSoundRef = useRef<HTMLAudioElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Start background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.play().catch(() => {
        // Handle autoplay restrictions
      })
    }

    // Setup scroll sound handling
    const handleScroll = () => {
      setIsScrolling(true)

      // Stop all scroll sounds first
      stopAllScrollSounds()

      // Play appropriate scroll sound for current section
      const currentScrollSound = getCurrentScrollSound()
      if (currentScrollSound && currentScrollSound.paused) {
        currentScrollSound.currentTime = 0
        currentScrollSound.volume = 0.2
        currentScrollSound.play().catch(() => {})
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Stop sounds after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        stopAllScrollSounds()
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const stopAllScrollSounds = () => {
    ;[scrollSound1Ref.current, scrollSound2Ref.current, scrollSound3Ref.current].forEach(
      (sound) => {
        if (sound && !sound.paused) {
          sound.pause()
          sound.currentTime = 0
        }
      }
    )
  }

  const getCurrentScrollSound = () => {
    switch (currentSection) {
      case 1:
        return scrollSound1Ref.current
      case 2:
        return scrollSound2Ref.current
      case 3:
        return scrollSound3Ref.current
      default:
        return scrollSound1Ref.current
    }
  }

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0
      hoverSoundRef.current.volume = 0.2
      hoverSoundRef.current.play().catch(() => {})
    }
  }

  useEffect(() => {
    // Add hover sound to navigation items
    const navItems = document.querySelectorAll('.cosmic-nav-item')
    navItems.forEach((item) => {
      item.addEventListener('mouseenter', playHoverSound)
    })

    return () => {
      navItems.forEach((item) => {
        item.removeEventListener('mouseenter', playHoverSound)
      })
    }
  }, [])

  return (
    <>
      {/* Background Music */}
      <audio ref={backgroundMusicRef} preload='auto'>
        <source src='/assets/audio/cosmic-ambient.mp3' type='audio/mpeg' />
        <source src='/assets/audio/cosmic-ambient.ogg' type='audio/ogg' />
      </audio>

      {/* Scroll Sounds */}
      <audio ref={scrollSound1Ref} preload='auto'>
        <source src='/assets/audio/scroll-sound-1.mp3' type='audio/mpeg' />
        <source src='/assets/audio/scroll-sound-1.ogg' type='audio/ogg' />
      </audio>

      <audio ref={scrollSound2Ref} preload='auto'>
        <source src='/assets/audio/scroll-sound-2.mp3' type='audio/mpeg' />
        <source src='/assets/audio/scroll-sound-2.ogg' type='audio/ogg' />
      </audio>

      <audio ref={scrollSound3Ref} preload='auto'>
        <source src='/assets/audio/scroll-sound-3.mp3' type='audio/mpeg' />
        <source src='/assets/audio/scroll-sound-3.ogg' type='audio/ogg' />
      </audio>

      {/* Hover Sound */}
      <audio ref={hoverSoundRef} preload='auto'>
        <source src='/assets/audio/hover-sound.mp3' type='audio/mpeg' />
        <source src='/assets/audio/hover-sound.ogg' type='audio/ogg' />
      </audio>

      {/* Sound Control UI */}
      <div className='fixed bottom-4 right-4 z-50'>
        <button
          onClick={() => {
            if (backgroundMusicRef.current) {
              if (backgroundMusicRef.current.paused) {
                backgroundMusicRef.current.play()
              } else {
                backgroundMusicRef.current.pause()
              }
            }
          }}
          className='p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors'
          title='Toggle Background Music'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M15.536 12.293L9.293 6.05c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414L13.122 12.9l-5.243 5.435c-.39.39-.39 1.024 0 1.414s1.024.39 1.414 0l6.243-6.243c.39-.39.39-1.024 0-1.414z'
            />
          </svg>
        </button>
      </div>
    </>
  )
}
