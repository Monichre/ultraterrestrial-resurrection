import {useState, useEffect, useRef} from 'react'

interface GlitchySurveillanceUiProps {
  className?: string
}

const GlitchySurveillanceUi = ({className = ''}: GlitchySurveillanceUiProps) => {
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [uptime, setUptime] = useState('23:14:58')
  const [logs, setLogs] = useState<string[]>([
    'SECURITY SYSTEM INITIALIZED',
    'CONNECTED TO MAIN SERVER',
    'WARNING: UNAUTHORIZED ACCESS ATTEMPTS DETECTED',
    'SYSTEM INTEGRITY: 68%',
    'APPLYING SECURITY PROTOCOLS...',
  ])
  const [gridState, setGridState] = useState<'three-per-row' | 'two-per-row' | 'single-column'>(
    'three-per-row'
  )
  const [isColorMode, setIsColorMode] = useState(true)

  const logContentRef = useRef<HTMLDivElement>(null)
  const cameraGridRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scanLineRefs = useRef<(HTMLDivElement | null)[]>([])
  const cameraFeedRefs = useRef<(HTMLDivElement | null)[]>([])
  const glitchOverlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const colorDistortionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Video sources
  const videoSources = [
    'https://mattcannon.games/codepen/glitches/cam1.mp4',
    'https://mattcannon.games/codepen/glitches/cam2.mp4',
    'https://mattcannon.games/codepen/glitches/cam3.mp4',
    'https://mattcannon.games/codepen/glitches/cam4.mp4',
    'https://mattcannon.games/codepen/glitches/cam5.mp4',
    'https://mattcannon.games/codepen/glitches/cam6.mp4',
  ]

  // Check if user prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Log events to terminal
  const logEvent = (message: string) => {
    setLogs((prevLogs) => [`[${currentTime}] ${message}`, ...prevLogs])
  }

  // Update time display
  const updateTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    setCurrentTime(`${hours}:${minutes}:${seconds}`)
  }

  // Randomize scan line speeds and densities
  const randomizeScanLines = () => {
    scanLineRefs.current.forEach((scanLine) => {
      if (scanLine) {
        // Random animation duration between 4 and 12 seconds
        const duration = 4 + Math.random() * 8
        scanLine.style.animationDuration = `${duration}s`

        // Random line density
        const density = 2 + Math.random() * 6
        scanLine.style.backgroundSize = `100% ${density}px`

        // Random delay
        scanLine.style.animationDelay = `-${Math.random() * 10}s`
      }
    })
  }

  // Apply a random glitch effect to a camera
  const applyRandomGlitch = (index: number) => {
    const feed = cameraFeedRefs.current[index]
    const video = videoRefs.current[index]
    const glitchOverlay = glitchOverlayRefs.current[index]
    const colorDistortion = colorDistortionRefs.current[index]

    if (!feed || !video || !glitchOverlay || !colorDistortion) return

    // Use more intense, modern neon-style glitches
    const glitchDuration = Math.random() * 1000 + 300

    // Randomly choose 1-3 effects to apply simultaneously
    const numEffects = Math.floor(Math.random() * 3) + 1
    const possibleEffects = ['slice', 'rgb-split', 'pixel', 'flicker', 'neon', 'distort']

    const selectedEffects: string[] = []

    // Select random unique effects
    while (selectedEffects.length < numEffects) {
      const effect = possibleEffects[Math.floor(Math.random() * possibleEffects.length)]
      if (!selectedEffects.includes(effect)) {
        selectedEffects.push(effect)
      }
    }

    // Apply each selected effect
    selectedEffects.forEach((effect) => {
      switch (effect) {
        case 'slice':
          // Create horizontal slice/tear effect with neon highlights
          const sliceCount = Math.floor(Math.random() * 5) + 1

          for (let i = 0; i < sliceCount; i++) {
            const sliceHeight = Math.random() * 30 + 5 // 5-35px slice
            const yPos = Math.random() * 80 // Position anywhere in the top 80%

            // Create the slice element
            const slice = document.createElement('div')
            slice.style.position = 'absolute'
            slice.style.left = '0'
            slice.style.right = '0'
            slice.style.top = `${yPos}%`
            slice.style.height = `${sliceHeight}px`
            slice.style.backgroundColor = 'transparent'
            slice.style.overflow = 'hidden'
            slice.style.zIndex = '5'

            // Create a clone of the video inside the slice, but offset
            const offsetX = Math.random() * 20 - 10
            slice.style.transform = `translateX(${offsetX}px)`

            // Add a neon border for dramatic effect
            const neonColors = ['#0ff', '#f0f', '#ff0', '#0f0']
            const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)]
            slice.style.boxShadow = `0 0 5px ${neonColor}, inset 0 0 5px ${neonColor}`

            feed.querySelector('.camera-content')?.appendChild(slice)

            setTimeout(() => {
              slice.remove()
            }, glitchDuration - 50)
          }
          break

        case 'rgb-split':
          // Extreme RGB color channel separation with motion
          const rgbAmount = Math.random() * 20 + 10 // 10-30px split

          // Create dramatic RGB shadows with animation
          video.style.boxShadow = `
            ${rgbAmount}px 0 0 rgba(255, 0, 0, 0.8), 
            ${-rgbAmount}px 0 0 rgba(0, 255, 255, 0.8), 
            0 ${rgbAmount / 2}px 0 rgba(0, 255, 0, 0.8)
          `

          // Clear after the glitch duration
          setTimeout(() => {
            video.style.boxShadow = ''
          }, glitchDuration)
          break

        case 'flicker':
          // Make the camera feed flicker
          const flickerKeyframes =
            Math.random() > 0.5
              ? [{opacity: 1}, {opacity: 0.3}, {opacity: 0.8}, {opacity: 0.1}, {opacity: 1}]
              : [
                  {opacity: 1},
                  {opacity: 0.2},
                  {opacity: 0.7},
                  {opacity: 0},
                  {opacity: 0.9},
                  {opacity: 1},
                ]

          video.animate(flickerKeyframes, {
            duration: glitchDuration,
            easing: 'steps(3, end)',
          })
          break

        case 'neon':
          // Add temporary neon glow effect
          const neonColors = ['#0ff', '#f0f', '#f00', '#0f0']
          const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)]

          feed.style.boxShadow = `0 0 15px ${neonColor}, inset 0 0 8px ${neonColor}`
          colorDistortion.style.backgroundColor = neonColor
          colorDistortion.style.opacity = '0.15'
          colorDistortion.style.mixBlendMode = 'overlay'

          setTimeout(() => {
            feed.style.boxShadow = ''
            colorDistortion.style.backgroundColor = ''
            colorDistortion.style.opacity = '0'
          }, glitchDuration)
          break

        case 'distort':
          // Apply CSS transformation distortions
          const skewX = (Math.random() * 20 - 10).toFixed(2)
          const skewY = (Math.random() * 10 - 5).toFixed(2)
          const scale = (0.9 + Math.random() * 0.3).toFixed(2)
          const rotate = (Math.random() * 6 - 3).toFixed(2)

          video.style.transform = `skew(${skewX}deg, ${skewY}deg) scale(${scale}) rotate(${rotate}deg)`

          setTimeout(() => {
            video.style.transform = ''
          }, glitchDuration)
          break
      }
    })

    // Log the glitch occasionally
    if (Math.random() < 0.3) {
      const cameraId = `CAM_0${index + 1}`
      logEvent(`GLITCH DETECTED ON ${cameraId}`)
    }
  }

  // Setup glitch effects for cameras
  const setupGlitchEffects = () => {
    cameraFeedRefs.current.forEach((feed, index) => {
      if (!feed) return

      // Trigger an immediate glitch on startup
      setTimeout(() => {
        applyRandomGlitch(index)
      }, Math.random() * 1000) // Random delay within first second

      // Random glitch intervals for each camera
      const minInterval = 2000 + index * 500
      const maxInterval = 8000 + index * 1000

      const scheduleNextGlitch = () => {
        const nextGlitchDelay = Math.random() * (maxInterval - minInterval) + minInterval

        setTimeout(() => {
          if (Math.random() < 0.85) {
            // 85% chance for a glitch
            applyRandomGlitch(index)
          }
          scheduleNextGlitch()
        }, nextGlitchDelay)
      }

      scheduleNextGlitch()
    })
  }

  // Setup reduced motion effects for accessibility
  const setupReducedMotionEffects = () => {
    // Simplified, less intensive effects for reduced motion preference
    cameraFeedRefs.current.forEach((feed, index) => {
      if (!feed) return

      const scheduleMinimalGlitch = () => {
        const nextGlitchDelay = 8000 + Math.random() * 10000 // Much less frequent

        setTimeout(() => {
          if (Math.random() < 0.3) {
            // Less likely to glitch
            // Just apply a mild color shift or subtle effect
            const video = videoRefs.current[index]
            const colorDistortion = colorDistortionRefs.current[index]

            if (video && colorDistortion) {
              const minimalGlitchDuration = 500 + Math.random() * 500

              if (Math.random() > 0.5) {
                // Mild color shift
                colorDistortion.style.backgroundColor = '#88f'
                colorDistortion.style.opacity = '0.1'
                colorDistortion.style.mixBlendMode = 'overlay'

                setTimeout(() => {
                  colorDistortion.style.backgroundColor = ''
                  colorDistortion.style.opacity = '0'
                }, minimalGlitchDuration)
              } else {
                // Slight brightness change
                video.style.filter = 'brightness(1.1)'

                setTimeout(() => {
                  video.style.filter = ''
                }, minimalGlitchDuration)
              }
            }
          }
          scheduleMinimalGlitch()
        }, nextGlitchDelay)
      }

      scheduleMinimalGlitch()
    })
  }

  // Toggle between color/BW mode
  const toggleFilter = () => {
    setIsColorMode(!isColorMode)
  }

  // Toggle between grid layouts
  const toggleGrid = () => {
    if (gridState === 'three-per-row') {
      setGridState('two-per-row')
    } else if (gridState === 'two-per-row') {
      setGridState('single-column')
    } else {
      setGridState('three-per-row')
    }
  }

  // Reset the system
  const resetSystem = () => {
    logEvent('SYSTEM RESET INITIATED')

    // Visual feedback for reset
    if (cameraGridRef.current) {
      cameraGridRef.current.classList.add('reset-flash')
      setTimeout(() => {
        cameraGridRef.current?.classList.remove('reset-flash')
      }, 500)
    }

    // Reset all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.currentTime = 0
        video.play().catch((error) => {
          console.error('Video playback error:', error)
        })
      }
    })

    // Reset camera styles
    cameraFeedRefs.current.forEach((feed, index) => {
      if (!feed) return

      const video = videoRefs.current[index]
      const colorDistortion = colorDistortionRefs.current[index]

      if (video) {
        video.style.boxShadow = ''
        video.style.transform = ''
        video.style.filter = ''
      }

      if (colorDistortion) {
        colorDistortion.style.backgroundColor = ''
        colorDistortion.style.opacity = '0'
      }

      feed.style.boxShadow = ''
    })

    randomizeScanLines()
    logEvent('SYSTEM RESET COMPLETE')

    // Re-apply offline camera styling
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      if (index === 2 || index === 4) {
        // CAM_03 and CAM_05 are offline
        video.style.opacity = '0.5'
        const feed = cameraFeedRefs.current[index]
        const noiseOverlay = feed?.querySelector('.noise-overlay')
        if (noiseOverlay) {
          ;(noiseOverlay as HTMLElement).style.opacity = '0.15'
        }
      }
    })
  }

  // Force a glitch on all cameras
  const triggerGlitch = () => {
    logEvent('MANUAL GLITCH TRIGGERED')

    cameraFeedRefs.current.forEach((_, index) => {
      applyRandomGlitch(index)
    })
  }

  // Initialize system
  useEffect(() => {
    // Set current time
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    // Randomize scan lines
    setTimeout(randomizeScanLines, 0)

    // Initialize videos
    videoRefs.current.forEach((video, index) => {
      if (!video) return

      // Apply source to video
      const sourceIndex = index % videoSources.length
      video.src = videoSources[sourceIndex]
      video.load()

      // Set up video playback
      video.addEventListener('canplaythrough', () => {
        // Style offline cameras differently
        if (index === 2 || index === 4) {
          // CAM_03 and CAM_05 are offline
          video.style.opacity = '0.5'
          const feed = cameraFeedRefs.current[index]
          const noiseOverlay = feed?.querySelector('.noise-overlay')
          if (noiseOverlay) {
            ;(noiseOverlay as HTMLElement).style.opacity = '0.15'
          }
        }

        // Play all videos
        video.play().catch((error) => {
          console.error('Video playback error:', error)
          logEvent(`ERROR: Camera feed ${index + 1} playback failed`)
        })
      })
    })

    // Set videos to color mode by default
    videoRefs.current.forEach((video) => {
      if (video) {
        video.classList.add('color-mode')
      }
    })

    // Initialize glitch effects
    if (!prefersReducedMotion) {
      setupGlitchEffects()
    } else {
      setupReducedMotionEffects()
    }

    // Log initialization
    logEvent('SECURITY SYSTEM INITIALIZED')
    logEvent('LOADING CAMERA FEEDS...')

    // Simulate system issues
    setTimeout(() => {
      logEvent('WARNING: UNAUTHORIZED ACCESS ATTEMPTS DETECTED')
      setTimeout(() => {
        logEvent('SYSTEM INTEGRITY: 68%')
        setTimeout(() => {
          logEvent('APPLYING EMERGENCY PROTOCOLS...')
          setTimeout(() => {
            logEvent('ENCRYPTION LAYER COMPROMISED')
          }, 3000)
        }, 2000)
      }, 1500)
    }, 1000)

    // Cleanup
    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  // Apply color mode changes
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        if (isColorMode) {
          video.classList.add('color-mode')
          video.classList.remove('bw-mode')
        } else {
          video.classList.add('bw-mode')
          video.classList.remove('color-mode')
        }
      }
    })
  }, [isColorMode])

  // Apply grid layout changes
  useEffect(() => {
    if (!cameraGridRef.current) return

    cameraGridRef.current.className = 'camera-grid'
    cameraGridRef.current.classList.add(gridState)
  }, [gridState])

  const getGridClass = () => {
    switch (gridState) {
      case 'two-per-row':
        return 'grid-cols-2'
      case 'single-column':
        return 'grid-cols-1'
      default:
        return 'grid-cols-3'
    }
  }

  return (
    <div
      className={`security-system bg-[#121212] text-[#e0e0e0] font-mono min-h-screen ${className}`}>
      <header className='system-header flex justify-between items-center p-4 bg-[#0a0a0a] border-b border-[#333]'>
        <div className='system-title'>
          <h1 className='text-2xl text-[#0ff]'>
            <span className="glitch-text relative inline-block before:content-['SENTINEL'] before:absolute before:left-[2px] before:text-[#f0f] before:clip-path-[inset(0_0_0_0)] before:animate-glitch-1 after:content-['SENTINEL'] after:absolute after:left-[-2px] after:text-[#0f0] after:clip-path-[inset(0_0_0_0)] after:animate-glitch-2">
              SENTINEL
            </span>
          </h1>
          <div className='subtitle text-sm text-[#aaa]'>
            ADVANCED SURVEILLANCE SYSTEM / STATUS:{' '}
            <span className='status-alert text-[#f55]'>COMPROMISED</span>
          </div>
        </div>
        <div className='status-panel flex gap-4'>
          <div className='status-item'>
            <span className='status-label text-[#777]'>UPTIME:</span>
            <span className='status-value text-[#0ff]'>{uptime}</span>
          </div>
          <div className='status-item'>
            <span className='status-label text-[#777]'>TIME:</span>
            <span className='status-value text-[#0ff]'>{currentTime}</span>
          </div>
        </div>
      </header>

      <div ref={cameraGridRef} className={`camera-grid grid ${getGridClass()} gap-2 p-4`}>
        {[1, 2, 3, 4, 5, 6].map((camNumber, index) => (
          <div
            key={`camera${camNumber}`}
            id={`camera${camNumber}`}
            ref={(el) => (cameraFeedRefs.current[index] = el)}
            className='camera-feed relative border border-[#333] bg-[#0a0a0a] rounded-sm overflow-hidden'>
            <div className='camera-header flex justify-between items-center p-1 bg-[#161616] text-xs'>
              <span className='camera-id text-[#0ff]'>CAM_0{camNumber}</span>
              <span
                className={`camera-status ${
                  camNumber === 3 || camNumber === 5 ? 'text-[#f55]' : 'text-[#5f5]'
                }`}>
                {camNumber === 3 || camNumber === 5 ? 'OFFLINE' : 'LIVE'}
              </span>
            </div>
            <div className='camera-content relative aspect-video bg-black'>
              <video
                muted
                loop
                playsInline
                className='camera-video w-full h-full object-cover'
                ref={(el) => (videoRefs.current[index] = el)}
              />
              <div
                ref={(el) => (scanLineRefs.current[index] = el)}
                className='scan-line absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-repeat animate-scanline'
              />
              <div className='noise-overlay absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay bg-noise' />
              <div
                ref={(el) => (glitchOverlayRefs.current[index] = el)}
                className='glitch-overlay absolute inset-0 pointer-events-none'
              />
              <div
                ref={(el) => (colorDistortionRefs.current[index] = el)}
                className='color-distortion absolute inset-0 pointer-events-none opacity-0'
              />
            </div>
            <div className='camera-footer p-1 text-center text-xs text-[#777]'>
              {camNumber === 1 && 'MAIN ENTRANCE'}
              {camNumber === 2 && 'RECEPTION'}
              {camNumber === 3 && 'HALLWAY'}
              {camNumber === 4 && 'SERVER ROOM'}
              {camNumber === 5 && 'PARKING'}
              {camNumber === 6 && 'LOBBY'}
            </div>
          </div>
        ))}
      </div>

      <div className='control-panel grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 p-4 bg-[#0a0a0a] border-t border-[#333]'>
        <div className='log-terminal bg-[#0f0f0f] border border-[#333] rounded-sm overflow-hidden'>
          <div className='terminal-header p-2 bg-[#161616] text-[#0ff]'>SYSTEM LOG</div>
          <div
            ref={logContentRef}
            className='terminal-content p-2 h-32 overflow-y-auto text-sm text-[#0ff] font-mono'>
            {logs.map((log, index) => (
              <div key={index}>&gt; {log}</div>
            ))}
          </div>
        </div>
        <div className='controls grid grid-cols-2 gap-2'>
          <button
            onClick={toggleGrid}
            className='control-btn bg-[#161616] border border-[#333] text-[#0ff] p-2 hover:bg-[#222] focus:outline-none focus:ring-1 focus:ring-[#0ff]'>
            GRID VIEW
          </button>
          <button
            onClick={resetSystem}
            className='control-btn bg-[#161616] border border-[#333] text-[#0ff] p-2 hover:bg-[#222] focus:outline-none focus:ring-1 focus:ring-[#0ff]'>
            RESET SYSTEM
          </button>
          <button
            onClick={triggerGlitch}
            className='control-btn bg-[#161616] border border-[#333] text-[#f0f] p-2 hover:bg-[#222] focus:outline-none focus:ring-1 focus:ring-[#f0f]'>
            FORCE GLITCH
          </button>
          <button
            onClick={toggleFilter}
            className='control-btn bg-[#161616] border border-[#333] text-[#0ff] p-2 hover:bg-[#222] focus:outline-none focus:ring-1 focus:ring-[#0ff]'>
            {isColorMode ? 'BW MODE' : 'COLOR MODE'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .color-mode {
          filter: saturate(1.2) contrast(1.1);
        }

        .bw-mode {
          filter: grayscale(1) contrast(1.2);
        }

        @keyframes scanline {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        @keyframes glitch-1 {
          0% {
            clip-path: inset(20% 0 40% 0);
          }
          20% {
            clip-path: inset(60% 0 1% 0);
          }
          40% {
            clip-path: inset(25% 0 58% 0);
          }
          60% {
            clip-path: inset(54% 0 7% 0);
          }
          80% {
            clip-path: inset(70% 0 12% 0);
          }
          100% {
            clip-path: inset(10% 0 75% 0);
          }
        }

        @keyframes glitch-2 {
          0% {
            clip-path: inset(31% 0 40% 0);
          }
          20% {
            clip-path: inset(13% 0 72% 0);
          }
          40% {
            clip-path: inset(11% 0 81% 0);
          }
          60% {
            clip-path: inset(46% 0 28% 0);
          }
          80% {
            clip-path: inset(97% 0 2% 0);
          }
          100% {
            clip-path: inset(67% 0 37% 0);
          }
        }

        .bg-noise {
          background-image: url('data:image/png;base64,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');
        }

        .reset-flash {
          animation: flash 0.5s ease-out;
        }

        @keyframes flash {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(3);
          }
          100% {
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  )
}

export default GlitchySurveillanceUi
