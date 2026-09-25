import type React from 'react'
import {useState, useEffect, useRef} from 'react'

// Define types for card data
interface CardData {
  id: string
  label: string
  image: string
  music: string
  trackName: string
}

interface SpaceCardProps {
  className?: string
  cards?: CardData[]
  initialActiveIndex?: number
}

// Default card data if none is provided
const defaultCardData: CardData[] = [
  {
    id: 'VMT-18/1',
    label: 'A7',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    music: 'https://assets.codepen.io/21542/howler-demo.mp3',
    trackName: 'COSMIC RADIATION',
  },
  {
    id: 'VMT-22/3',
    label: 'B2',
    image:
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop',
    music: 'https://assets.codepen.io/21542/howler-sfx.mp3',
    trackName: 'QUANTUM RESONANCE',
  },
  {
    id: 'VMT-45/7',
    label: 'C5',
    image:
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000&auto=format&fit=crop',
    music: 'https://assets.codepen.io/21542/howler-spray.mp3',
    trackName: 'NEURAL INTERFACE',
  },
  {
    id: 'VMT-33/9',
    label: 'D1',
    image:
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop',
    music: 'https://assets.codepen.io/21542/howler-push.mp3',
    trackName: 'TEMPORAL FLUX',
  },
  {
    id: 'VMT-56/2',
    label: 'E8',
    image:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop',
    music: 'https://assets.codepen.io/21542/howler-beep.mp3',
    trackName: 'SINGULARITY PULSE',
  },
]

const SpaceCard = ({
  className = '',
  cards = defaultCardData,
  initialActiveIndex = 0,
}: SpaceCardProps) => {
  // State for the component
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(0.8)
  const [currentTime, setCurrentTime] = useState('00:00 / 00:00')
  const [progressPercent, setProgressPercent] = useState(0)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Update player time and progress
  const updatePlayerProgress = () => {
    if (audioRef.current) {
      const currentSeconds = audioRef.current.currentTime
      const totalSeconds = audioRef.current.duration || 0
      const percent = (currentSeconds / totalSeconds) * 100

      setCurrentTime(`${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`)
      setProgressPercent(percent)
    }
  }

  // Set up music track based on active card
  const setMusicTrack = (index: number) => {
    if (!audioRef.current) return

    const wasPlaying = isPlaying

    // Update music source
    audioRef.current.src = cards[index].music

    // If it was playing before, start playing the new track
    if (wasPlaying) {
      audioRef.current.play().catch((error) => console.error('Error playing audio:', error))
      setIsPlaying(true)
    }
  }

  // Navigate to the previous card
  const navigatePrev = () => {
    if (isAnimating) return

    if (activeIndex > 0) {
      setIsAnimating(true)
      setActiveIndex((prevIndex) => prevIndex - 1)
    }
  }

  // Navigate to the next card
  const navigateNext = () => {
    if (isAnimating) return

    if (activeIndex < cards.length - 1) {
      setIsAnimating(true)
      setActiveIndex((prevIndex) => prevIndex + 1)
    }
  }

  // Toggle play/pause for the audio
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => console.error('Error playing audio:', error))
    }

    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Change volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return

    const volume = Number(e.target.value) / 100
    audioRef.current.volume = volume
    setCurrentVolume(volume)

    // If changing from 0 or to 0, update mute state
    if (volume === 0 && !isMuted) {
      setIsMuted(true)
    } else if (volume > 0 && isMuted) {
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }

  // Handle click on progress bar to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percent = clickPosition / rect.width

    audioRef.current.currentTime = percent * audioRef.current.duration
    updatePlayerProgress()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        navigatePrev()
        break
      case 'ArrowRight':
        navigateNext()
        break
      case ' ':
        togglePlay()
        e.preventDefault()
        break
    }
  }

  // Effect to set up initial music track and handle cleanup
  useEffect(() => {
    // Set initial music track
    if (audioRef.current) {
      audioRef.current.src = cards[activeIndex].music
      audioRef.current.volume = currentVolume
    }

    // Set up interval for progress updates
    progressInterval.current = setInterval(updatePlayerProgress, 1000)

    // Cleanup function
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Effect to update when active index changes
  useEffect(() => {
    // Update music track when active index changes
    setMusicTrack(activeIndex)

    // Reset animation after transition completes
    const timeoutId = setTimeout(() => {
      setIsAnimating(false)
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [activeIndex])

  // Effect to handle audio loaded metadata to update duration
  useEffect(() => {
    const handleLoadedMetadata = () => {
      updatePlayerProgress()
    }

    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [])

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}>
      {/* Grid lines */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute left-0 right-0 bottom-[30%] border-b border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] transform rotateX-60 -translate-z-[100px]'></div>
        <div className='absolute top-[30%] bottom-0 left-1/2 border-l border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] transform rotateX-60 -translate-z-[100px]'></div>
      </div>

      {/* Holographic elements */}
      <div className='absolute inset-0 flex items-center justify-center transform-style-preserve-3d'>
        {/* Vertical dotted line */}
        <div className="absolute h-[60%] w-[1px] bg-white/20 left-1/2 top-[20%] transform translate-z-[20px] rotateX-5 -rotateY-5 shadow-[0_0_10px_rgba(255,255,255,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[1px] before:h-full before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-white/30 before:bg-[size:1px_10px]"></div>

        {/* Cards container */}
        <div
          ref={cardsContainerRef}
          className='absolute top-[35%] left-1/2 transform-style-preserve-3d -translate-x-1/2 -translate-y-1/2 rotateX-10 transition-transform duration-500 ease-out'>
          {cards.map((card, index) => {
            // Position the card in 3D space
            const xOffset = (index - activeIndex) * 200
            const zOffset = -Math.abs(index - activeIndex) * 100
            const opacity = 1 - Math.min(0.6, Math.abs(index - activeIndex) * 0.2)
            const isActive = index === activeIndex

            return (
              <div
                key={card.id}
                className={`absolute w-[180px] h-[240px] border border-white/30 rounded-[2px] bg-white/5 backdrop-blur-[4px] transform-style-preserve-3d transition-all duration-800 flex flex-col overflow-hidden ${
                  isActive
                    ? 'border-orange-500/60 shadow-[0_0_20px_rgba(255,140,0,0.3)] bg-orange-500/10'
                    : ''
                }`}
                style={{
                  transform: `translateX(${xOffset}px) translateZ(${zOffset}px)`,
                  opacity,
                }}>
                <div
                  className={`border-b border-white/20 p-2 text-white/80 text-xs z-[2] bg-black/50 backdrop-blur-[4px] ${
                    isActive ? 'text-orange-500/80 border-orange-500/40' : ''
                  }`}>
                  {card.id}
                </div>
                <div className='flex-1 flex items-center justify-center relative'>
                  <img
                    src={card.image}
                    alt={card.label}
                    className={`absolute inset-0 w-full h-full object-cover z-[1] transition-all duration-800 ease-out ${
                      isActive ? 'opacity-90' : 'opacity-70'
                    }`}
                  />
                  <div
                    className={`relative w-16 h-16 rounded-full border flex items-center justify-center z-[2] bg-black/30 backdrop-blur-[2px] ${
                      isActive ? 'border-orange-500/60' : 'border-white/40'
                    }`}>
                    <div
                      className={`absolute inset-0 rounded-full ${
                        isActive ? 'bg-radial-orange' : 'bg-radial-white'
                      }`}></div>
                    <span
                      className={`text-lg ${isActive ? 'text-orange-500/90' : 'text-white/90'}`}>
                      {card.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning message */}
        <div className='absolute bottom-[20%] left-[10%] bg-red-500/20 border border-red-500/40 p-2 px-4 text-orange-500/90 text-xs transform rotateX-60 translate-z-[20px] max-w-[250px]'>
          <div className='font-bold mb-1'>WARNING</div>
          <div>System integrity compromised. Unauthorized access detected.</div>
        </div>

        {/* Sample label */}
        <div className='absolute bottom-[20%] right-[10%] text-white/70 text-xs p-1 px-3 border border-white/20 bg-black/50 transform rotateX-60 translate-z-[20px] text-shadow-[0_0_5px_rgba(255,255,255,0.3)]'>
          SAMPLE: 4/5
        </div>

        {/* Media Player */}
        <div className='absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[300px] bg-black/50 border border-white/20 backdrop-blur-[4px] p-2 transform rotateX-30 translate-z-[30px] shadow-[0_0_15px_rgba(255,255,255,0.2)]'>
          <div className='flex justify-between items-center mb-2'>
            <div className='text-xs text-orange-400 font-bold truncate max-w-[65%]'>
              {cards[activeIndex].trackName}
            </div>
            <div className='text-xs text-white/70'>{currentTime}</div>
          </div>

          <div
            className='h-1 mb-3 bg-white/10 rounded-sm overflow-hidden cursor-pointer'
            onClick={handleProgressClick}>
            <div
              className='h-full bg-orange-400/60 transition-all duration-200'
              style={{width: `${progressPercent}%`}}></div>
          </div>

          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <button
                className='w-6 h-6 flex items-center justify-center bg-transparent border border-white/30 text-white/70 hover:bg-white/10 transition-colors duration-300 text-xs'
                onClick={() => navigatePrev()}
                aria-label='Previous track'>
                ⏮
              </button>

              <button
                className='w-8 h-8 flex items-center justify-center bg-orange-500/20 border border-orange-500/40 text-orange-500 hover:bg-orange-500/30 transition-colors duration-300 text-sm rounded-full'
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                className='w-6 h-6 flex items-center justify-center bg-transparent border border-white/30 text-white/70 hover:bg-white/10 transition-colors duration-300 text-xs'
                onClick={() => navigateNext()}
                aria-label='Next track'>
                ⏭
              </button>
            </div>

            <div className='flex items-center gap-2'>
              <button
                className='w-6 h-6 flex items-center justify-center bg-transparent border border-white/30 text-white/70 hover:bg-white/10 transition-colors duration-300 text-xs'
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? '🔇' : '🔊'}
              </button>

              <input
                type='range'
                min='0'
                max='100'
                value={currentVolume * 100}
                className='w-16 h-1 bg-white/20 accent-orange-400 cursor-pointer'
                onChange={handleVolumeChange}
                aria-label='Volume'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className='absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-5 z-[100]'>
        <button
          className='bg-white/10 border border-white/30 text-white/80 py-2 px-4 hover:bg-white/20 transition-all duration-300'
          onClick={navigatePrev}
          aria-label='Previous card'
          disabled={activeIndex === 0 || isAnimating}>
          ◀ Previous
        </button>

        <button
          className='bg-white/10 border border-white/30 text-white/80 py-2 px-4 hover:bg-white/20 transition-all duration-300'
          onClick={navigateNext}
          aria-label='Next card'
          disabled={activeIndex === cards.length - 1 || isAnimating}>
          Next ▶
        </button>
      </div>

      {/* Ambient glow effect */}
      <div className='absolute inset-0 bg-radial-glow opacity-30 pointer-events-none'></div>

      {/* Scan lines effect */}
      <div className='absolute inset-0 bg-scan-lines opacity-10 pointer-events-none'></div>

      {/* Audio element */}
      <audio ref={audioRef} preload='auto'></audio>

      {/* Global styles */}
      <style jsx>{`
        /* Transform utilities */
        .rotateX-5 {
          transform: rotateX(5deg);
        }
        .rotateX-10 {
          transform: rotateX(10deg);
        }
        .rotateX-30 {
          transform: rotateX(30deg);
        }
        .rotateX-60 {
          transform: rotateX(60deg);
        }
        .-rotateY-5 {
          transform: rotateY(-5deg);
        }
        .translate-z-[20px] {
          transform: translateZ(20px);
        }
        .-translate-z-[100px] {
          transform: translateZ(-100px);
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        /* Background gradients */
        .bg-radial-white {
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 70%
          );
        }
        .bg-radial-orange {
          background: radial-gradient(circle, rgba(255, 140, 0, 0.1) 0%, rgba(255, 140, 0, 0) 70%);
        }
        .bg-radial-glow {
          background: radial-gradient(
            circle at 50% 30%,
            rgba(255, 140, 0, 0.15) 0%,
            rgba(0, 0, 0, 0) 70%
          );
        }
        .bg-scan-lines {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 2px,
            rgba(255, 255, 255, 0.05) 4px
          );
        }
      `}</style>
    </div>
  )
}

export default SpaceCard
