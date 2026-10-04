import {useEffect, useRef, useState} from 'react'

interface CardData {
  id: number
  image: string
  thumbnail: string
  music: string
  artist: string
  genre: string
  duration: number
}

interface CardsPlayerHoloProps {
  className?: string
  cardData?: CardData[]
}

const defaultCardData: CardData[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200&auto=format&fit=crop',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artist: 'Cosmic Entity',
    genre: 'Ambient Space',
    duration: 120,
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=200&auto=format&fit=crop',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artist: 'Quantum Flux',
    genre: 'Electronic',
    duration: 180,
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000&auto=format&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=200&auto=format&fit=crop',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artist: 'Neural Sync',
    genre: 'Synthwave',
    duration: 210,
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=200&auto=format&fit=crop',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artist: 'Temporal Wave',
    genre: 'Chillstep',
    duration: 150,
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=200&auto=format&fit=crop',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artist: 'Cae Keys',
    genre: 'Hip Hop',
    duration: 240,
  },
]

const CardsPlayerHolo = ({className = '', cardData = defaultCardData}: CardsPlayerHoloProps) => {
  // State variables
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(0.8)
  const [isDragging, setIsDragging] = useState(false)
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('0:00')
  const [progressPercent, setProgressPercent] = useState(0)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const timelineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  // Format time in minutes:seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Set music track based on active card
  const setMusicTrack = (index: number) => {
    const wasPlaying = isPlaying

    if (audioRef.current) {
      // Update music source
      audioRef.current.src = cardData[index].music

      // If it was playing before, start playing the new track
      if (wasPlaying) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            console.error('Error playing audio:', err)
            setIsPlaying(false)
          })
      }
    }
  }

  // Update cards position
  const updateCards = (animate = true) => {
    if (isAnimating && animate) return

    if (animate) {
      setIsAnimating(true)

      // Change music track for the newly active card
      setMusicTrack(activeIndex)
    }

    const cards = cardRefs.current
    const totalCards = cards.length

    // Apply positions
    cards.forEach((card, index) => {
      if (!card) return

      // Calculate position based on distance from active card
      const distance = index - activeIndex

      // Position cards in a horizontal stack
      let translateY, translateZ, translateX, scale, opacity

      if (distance === 0) {
        // Active card - at the front
        translateY = 0
        translateZ = 0
        translateX = 0
        scale = 1
        opacity = 1
      } else {
        // Cards in stack - position them above the active card
        translateY = -50 * Math.abs(distance) // Stack vertically
        translateZ = -100 * Math.abs(distance) // Move back in 3D space
        translateX = 0
        scale = 1 - 0.05 * Math.abs(distance) // Slightly smaller
        opacity = 1 - 0.15 * Math.abs(distance) // Slightly transparent
      }

      // Apply transform with animation if needed
      if (animate) {
        card.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
      } else {
        card.style.transition = 'none'
      }

      card.style.transform = `translateY(${translateY}px) translateZ(${translateZ}px) translateX(${translateX}px) scale(${scale})`
      card.style.opacity = Math.max(0.4, opacity).toString()
      card.style.zIndex = (totalCards - Math.abs(distance)).toString()

      // Update active state
      if (index === activeIndex) {
        card.classList.add('active')
      } else {
        card.classList.remove('active')
      }
    })

    // Reset animation flag after transition completes
    if (animate) {
      setTimeout(() => {
        setIsAnimating(false)
      }, 800) // Match this with the CSS transition duration
    }
  }

  // Navigate to previous card
  const navigatePrev = () => {
    if (isAnimating) return

    // If at first card, go to last card
    if (activeIndex === 0) {
      setActiveIndex(cardData.length - 1)
    } else {
      setActiveIndex((prevIndex) => prevIndex - 1)
    }
  }

  // Navigate to next card
  const navigateNext = () => {
    if (isAnimating) return

    // If at last card, go to first card
    if (activeIndex === cardData.length - 1) {
      setActiveIndex(0)
    } else {
      setActiveIndex((prevIndex) => prevIndex + 1)
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.error('Error playing audio:', err)
        })
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = currentVolume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value) / 100
    setCurrentVolume(newVolume)

    if (audioRef.current) {
      audioRef.current.volume = newVolume

      if (newVolume > 0 && isMuted) {
        setIsMuted(false)
      }
    }
  }

  // Update progress display
  const updateProgress = () => {
    if (!audioRef.current) return

    const currentTime = audioRef.current.currentTime
    const duration = audioRef.current.duration || cardData[activeIndex].duration
    const percent = (currentTime / duration) * 100

    setCurrentTimeDisplay(formatTime(currentTime))
    setProgressPercent(percent)

    if (progressRef.current) {
      progressRef.current.style.width = `${percent}%`
    }

    if (handleRef.current) {
      handleRef.current.style.left = `${percent}%`
    }
  }

  // Seek track to specific point
  const seekTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !audioRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const seekPos = (e.clientX - rect.left) / rect.width
    const seekTime = seekPos * (audioRef.current.duration || cardData[activeIndex].duration)

    audioRef.current.currentTime = seekTime
    updateProgress()
  }

  // Handle drag start on timeline
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    seekTrack(e)
  }

  // Handle drag on timeline
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      seekTrack(e)
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Mouse events for timeline dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && timelineRef.current && audioRef.current) {
        const rect = timelineRef.current.getBoundingClientRect()
        const seekPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        const seekTime = seekPos * (audioRef.current.duration || cardData[activeIndex].duration)

        audioRef.current.currentTime = seekTime
        updateProgress()
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, activeIndex, cardData])

  // Update cards when active index changes
  useEffect(() => {
    updateCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  // Initial setup
  useEffect(() => {
    // Initialize cards position
    updateCards(false)

    // Set initial music track and volume
    if (audioRef.current) {
      audioRef.current.src = cardData[activeIndex].music
      audioRef.current.volume = currentVolume

      // Add timeupdate event listener for progress tracking
      audioRef.current.addEventListener('timeupdate', updateProgress)
    }

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`bg-black text-[rgba(255,255,255,0.9)] font-mono overflow-hidden h-screen w-screen ${className}`}>
      <div className='relative w-full h-full overflow-hidden perspective-[1500px]'>
        {/* Grid lines */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute left-0 right-0 bottom-[30%] border-b border-[rgba(255,255,255,0.1)] transform [transform:rotateX(60deg)_translateZ(-100px)] shadow-[0_0_20px_rgba(255,255,255,0.1)]'></div>
        </div>

        {/* Holographic elements */}
        <div className='absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]'>
          {/* Cards container */}
          <div
            ref={cardsContainerRef}
            className='absolute top-0 left-0 right-0 bottom-[clamp(6rem,10vh,6rem)] flex items-center justify-center perspective-[10%] [transform-style:preserve-3d]'>
            {cardData.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`absolute w-[clamp(300px,90%,1000px)] h-[70vh] rounded-xl overflow-hidden transition-all duration-800 
                  cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-[rgba(17,17,17,0.7)] border border-[rgba(255,255,255,0.2)] 
                  backdrop-blur-sm [transform-style:preserve-3d] ${
                    index === activeIndex ? 'active' : ''
                  }`}
                onClick={() => {
                  if (index !== activeIndex && !isAnimating) {
                    setActiveIndex(index)
                  }
                }}>
                <img
                  src={card.image}
                  alt={card.artist}
                  className='absolute inset-0 w-full h-full object-cover opacity-70 z-0'
                />
                <div className='absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.6)] z-1'></div>
                <div className='absolute top-[clamp(1rem,2vw,1.5rem)] left-[clamp(1rem,2vw,1.5rem)] text-[clamp(1.5rem,3vw,2rem)] font-bold text-[rgba(255,255,255,0.7)] z-2 shadow-[0_0_10px_rgba(255,255,255,0.3)]'>
                  {card.id}
                </div>
                <div className='absolute top-[clamp(1rem,2vw,1.5rem)] right-[clamp(1rem,2vw,1.5rem)] text-[clamp(1.5rem,3vw,2rem)] font-bold text-[rgba(255,255,255,0.7)] z-2 shadow-[0_0_10px_rgba(255,255,255,0.3)]'>
                  {formatTime(card.duration)}
                </div>
                <div className='absolute bottom-0 left-0 right-0 p-[clamp(1rem,2vw,1.5rem)] z-2 flex items-center bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0)]'>
                  <div className='w-[clamp(60px,8vw,100px)] h-[clamp(60px,8vw,100px)] rounded-sm overflow-hidden mr-[clamp(1rem,2vw,1.5rem)] border border-[rgba(255,255,255,0.2)] bg-black z-2 shadow-[0_0_10px_rgba(255,255,255,0.2)]'>
                    <img
                      src={card.thumbnail}
                      alt={card.artist}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='flex-1 z-2'>
                    <div className='text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-1 shadow-[0_0_10px_rgba(255,255,255,0.3)]'>
                      {card.artist}
                    </div>
                    <div className='text-[clamp(1.25rem,2.5vw,1.5rem)] text-[rgba(255,255,255,0.7)] shadow-[0_0_5px_rgba(255,255,255,0.2)]'>
                      {card.genre}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sample label */}
          <div className='absolute bottom-[20%] right-[10%] text-[rgba(255,255,255,0.7)] text-[clamp(0.7rem,1.5vw,0.8rem)] py-1 px-3 border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.5)]'>
            SAMPLE: 4/5
          </div>

          {/* Ambient glow */}
          <div className='absolute inset-0 bg-radial-gradient-subtle opacity-30 z-[1]'></div>
        </div>

        {/* Media Player */}
        <div className='absolute bottom-0 left-0 right-0 h-[clamp(6rem,10vh,6rem)] bg-[rgba(0,0,0,0.7)] backdrop-blur-md border-t border-[rgba(255,255,255,0.1)] px-[clamp(1rem,2vw,1.5rem)] flex items-center justify-between z-10'>
          <div className='flex items-center'>
            <div className='w-[clamp(2.5rem,5vh,3rem)] h-[clamp(2.5rem,5vh,3rem)] rounded-sm overflow-hidden mr-[clamp(0.5rem,1vw,0.75rem)] border border-[rgba(255,255,255,0.2)] bg-black'>
              <img
                id='playerThumbnail'
                src={cardData[activeIndex].thumbnail}
                alt='Thumbnail'
                className='w-full h-full object-cover'
              />
            </div>
            <div>
              <div className='text-[clamp(0.8rem,1.8vw,1rem)] font-bold text-[rgba(255,140,0,0.9)] mb-1'>
                {cardData[activeIndex].artist}
              </div>
              <div className='text-[clamp(0.7rem,1.5vw,0.8rem)] text-[rgba(255,255,255,0.7)]'>
                {cardData[activeIndex].genre}
              </div>
            </div>
          </div>

          <div className='flex-1 flex flex-col items-center justify-center px-[clamp(1rem,2vw,1.5rem)]'>
            <div className='flex items-center justify-center mb-2'>
              <button
                onClick={navigatePrev}
                className='w-[clamp(2.5rem,5vh,3rem)] h-[clamp(2.5rem,5vh,3rem)] flex items-center justify-center bg-[rgba(0,0,0,0.5)] rounded-full border border-[rgba(255,255,255,0.2)] text-white text-xl opacity-80 hover:opacity-100 focus:outline-none transition-opacity'>
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className='w-[clamp(3rem,6vh,3.5rem)] h-[clamp(3rem,6vh,3.5rem)] flex items-center justify-center bg-[rgba(255,140,0,0.3)] rounded-full border border-[rgba(255,140,0,0.6)] text-[rgba(255,140,0,0.9)] text-2xl mx-4 hover:bg-[rgba(255,140,0,0.4)] focus:outline-none transition-colors'>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={navigateNext}
                className='w-[clamp(2.5rem,5vh,3rem)] h-[clamp(2.5rem,5vh,3rem)] flex items-center justify-center bg-[rgba(0,0,0,0.5)] rounded-full border border-[rgba(255,255,255,0.2)] text-white text-xl opacity-80 hover:opacity-100 focus:outline-none transition-opacity'>
                ⏭
              </button>
            </div>

            <div className='w-full flex items-center'>
              <div className='text-[clamp(0.7rem,1.5vw,0.8rem)] text-[rgba(255,255,255,0.7)] mr-2'>
                {currentTimeDisplay}
              </div>
              <div
                ref={timelineRef}
                className='flex-1 h-1 bg-[rgba(255,255,255,0.2)] rounded-full relative overflow-hidden cursor-pointer'
                onClick={seekTrack}
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}>
                <div
                  ref={progressRef}
                  className='absolute top-0 left-0 h-full bg-[rgba(255,140,0,0.7)] rounded-full'
                  style={{width: `${progressPercent}%`}}></div>
                <div
                  ref={handleRef}
                  className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[rgba(255,140,0,0.9)] rounded-full shadow-[0_0_5px_rgba(255,140,0,0.7)] -ml-1.5'
                  style={{left: `${progressPercent}%`}}></div>
              </div>
              <div className='text-[clamp(0.7rem,1.5vw,0.8rem)] text-[rgba(255,255,255,0.7)] ml-2'>
                {formatTime(cardData[activeIndex].duration)}
              </div>
            </div>
          </div>

          <div className='flex flex-col items-end justify-center'>
            <div className='flex items-center mb-2'>
              <button
                onClick={toggleMute}
                className='w-8 h-8 flex items-center justify-center bg-transparent text-white text-lg opacity-80 hover:opacity-100 focus:outline-none transition-opacity'>
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type='range'
                min='0'
                max='100'
                value={isMuted ? 0 : currentVolume * 100}
                onChange={handleVolumeChange}
                className='w-24 h-2 bg-[rgba(255,255,255,0.2)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[rgba(255,140,0,0.9)] [&::-webkit-slider-thumb]:cursor-pointer'
              />
            </div>
            <div className='w-6 h-6 flex items-center justify-center text-[rgba(255,255,255,0.6)] text-xl cursor-pointer hover:text-white'>
              ✕
            </div>
          </div>
        </div>

        {/* Audio element */}
        <audio ref={audioRef} preload='auto'></audio>

        {/* Scan lines effect */}
        <div className='absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none z-[20] opacity-30'></div>

        {/* Holographic flare */}
        <div className='absolute w-[300%] h-[300%] top-[-100%] left-[-100%] bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.1)_0%,transparent_20%)] rotate-[30deg] opacity-50 animate-[flareAnimation_10s_ease-in-out_infinite] pointer-events-none z-[25]'></div>
      </div>

      <style jsx>{`
        @keyframes flareAnimation {
          0%,
          100% {
            transform: translateY(0) rotate(30deg);
          }
          50% {
            transform: translateY(-30%) rotate(30deg);
          }
        }

        .perspective-\\[1500px\\] {
          perspective: 1500px;
        }

        .perspective-\\[10\\%\\] {
          perspective: 10%;
        }

        .\\[transform\\:rotateX\\(60deg\\)_translateZ\\(-100px\\)\\] {
          transform: rotateX(60deg) translateZ(-100px);
        }

        .\\[transform-style\\:preserve-3d\\] {
          transform-style: preserve-3d;
        }

        .bg-radial-gradient-subtle {
          background: radial-gradient(circle at center, rgba(255, 140, 0, 0.2) 0%, transparent 70%);
        }

        .duration-800 {
          transition-duration: 800ms;
        }

        /* Active card styles */
        .active
          .absolute.top-\\[clamp\\(1rem\\,2vw\\,1\\.5rem\\)\\].left-\\[clamp\\(1rem\\,2vw\\,1\\.5rem\\)\\],
        .active
          .absolute.top-\\[clamp\\(1rem\\,2vw\\,1\\.5rem\\)\\].right-\\[clamp\\(1rem\\,2vw\\,1\\.5rem\\)\\] {
          color: rgba(255, 140, 0, 0.9);
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
        }

        .active img.absolute {
          opacity: 0.9;
        }

        .active .w-\\[clamp\\(60px\\,8vw\\,100px\\)\\] {
          border-color: rgba(255, 140, 0, 0.6);
          box-shadow: 0 0 15px rgba(255, 140, 0, 0.3);
        }

        .active .flex-1.z-2 > div:first-child {
          color: rgba(255, 140, 0, 0.9);
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
        }

        .active .flex-1.z-2 > div:last-child {
          color: rgba(255, 140, 0, 0.7);
        }
      `}</style>
    </div>
  )
}

export default CardsPlayerHolo
