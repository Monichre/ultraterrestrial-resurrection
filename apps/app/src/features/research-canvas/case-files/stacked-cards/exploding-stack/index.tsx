'use client'

import {useState, useRef, useEffect} from 'react'

import {gsap} from 'gsap'
import {useGSAP} from '@gsap/react'
import './stack.css'

interface Card {
  id: string
  title: string
  content: string
  color?: string
}

interface ExplodingStackProps {
  cards: Card[]
  spacing?: number
  rotationFactor?: number
  maxRotation?: number
  explodeOnHover?: boolean
}

export const ExplodingStack = ({
  cards,
  spacing = 7,
  rotationFactor = 2.5,
  maxRotation = 15,
  explodeOnHover = true,
}: ExplodingStackProps) => {
  const [isExploded, setIsExploded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])

  const toggleExplode = () => {
    setIsExploded(!isExploded)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExplode()
    }
  }

  // Set up refs array when cards change
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length)
  }, [cards])

  useGSAP(() => {
    if (!containerRef.current || cardRefs.current.length === 0) return

    // Setup initial stack position
    gsap.set(cardRefs.current, {
      position: 'absolute',
      y: (i) => i * spacing,
      rotationZ: (i) => (i - cards.length / 2) * (rotationFactor / 2),
      zIndex: (i) => cards.length - i,
    })

    // Animation when exploding/collapsing
    gsap.to(cardRefs.current, {
      y: (i) => (isExploded ? i * (spacing * 5) : i * spacing),
      rotationZ: (i) =>
        isExploded
          ? (i - cards.length / 2) * rotationFactor
          : (i - cards.length / 2) * (rotationFactor / 2),
      rotationX: isExploded ? maxRotation : 0,
      stagger: 0.05,
      ease: 'back.out(1.2)',
      duration: 0.7,
    })
  }, [isExploded, cards.length, spacing, rotationFactor, maxRotation])

  const setCardRef = (el: HTMLDivElement | null, index: number): void => {
    if (el) {
      cardRefs.current[index] = el
    }
  }

  return (
    <div className='relative w-full flex justify-center items-center py-16' ref={containerRef}>
      <button
        className='relative w-[300px] h-[200px] perspective-[1200px] bg-transparent border-0 p-0'
        onClick={toggleExplode}
        onKeyDown={handleKeyDown}
        type='button'
        aria-label='Toggle card stack'>
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              if (el) cardRefs.current[index] = el
            }}
            className={`
              absolute top-0 left-0 w-full h-full rounded-xl shadow-lg cursor-pointer
              transform-style-preserve-3d backface-visibility-hidden
              transition-shadow duration-300 hover:shadow-xl
              ${isExploded ? 'pointer-events-auto' : 'pointer-events-none'}
            `}
            style={{
              backgroundColor: card.color || `hsl(${index * 20}, 70%, 60%)`,
            }}
            onMouseEnter={() => explodeOnHover && setIsExploded(true)}
            onMouseLeave={() => explodeOnHover && setIsExploded(false)}>
            <div className='absolute inset-0 p-5 flex flex-col justify-between'>
              <h3 className='text-xl font-bold text-white'>{card.title}</h3>
              <p className='text-white/80 text-sm'>{card.content}</p>
            </div>
          </div>
        ))}
      </button>
    </div>
  )
}
