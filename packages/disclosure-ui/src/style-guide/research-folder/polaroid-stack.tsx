'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './polaroid-stack.css'

export interface FolderPhotograph {
  id: string
  src: string
  alt: string
  caption: string
}

export interface PolaroidStackProps {
  photos: FolderPhotograph[]
  arrivalStagger?: number
}

/** New data enters the pile; changing tabs alone does not replay arrivals. */
export function PolaroidStack({
  photos,
  arrivalStagger = 0.12,
}: PolaroidStackProps) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<string | null>(null)
  const selectedIndex = photos.findIndex((photo) => photo.id === selected)
  const activeIndex = selectedIndex < 0 ? photos.length - 1 : selectedIndex
  const cycle = (direction: number) => {
    if (!photos.length) return
    const index = (activeIndex + direction + photos.length) % photos.length
    setSelected(photos[index].id)
  }

  return (
    <section className="du-polaroid-stack" aria-label="Record photographs">
      <div className="du-polaroid-pile">
        <AnimatePresence>
          {photos.map((photo, index) => {
            const active = index === activeIndex
            const rotation = [-7, 4, -2, 6][index % 4]
            const depth = photos.length - 1 - index
            return (
              <motion.button
                key={photo.id}
                type="button"
                className="du-polaroid"
                aria-label={`${photo.caption}. Show next photograph`}
                aria-hidden={!active}
                inert={!active}
                tabIndex={active ? 0 : -1}
                data-photo-id={photo.id}
                data-active={active}
                onClick={() => cycle(1)}
                style={{ zIndex: active ? photos.length + 1 : index }}
                initial={
                  reduced
                    ? false
                    : { x: 110, y: -65, rotate: 18, opacity: 0, scale: 1.08 }
                }
                animate={{
                  x: -depth * 7,
                  y: -depth * 6,
                  rotate: rotation,
                  opacity: 1,
                  scale: 1,
                }}
                exit={reduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        type: 'spring',
                        stiffness: 230,
                        damping: 24,
                        delay: index * Math.max(0, arrivalStagger),
                      }
                }
              >
                <img src={photo.src} alt={photo.alt} draggable={false} />
                <span>{photo.caption}</span>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
      <div className="du-polaroid-controls">
        <button
          type="button"
          aria-label="Previous photograph"
          onClick={() => cycle(-1)}
          disabled={photos.length < 2}
        >
          ←
        </button>
        <span role="status" aria-live="polite">
          {photos.length
            ? `${activeIndex + 1} / ${photos.length} photographs`
            : 'Loading photographs…'}
        </span>
        <button
          type="button"
          aria-label="Next photograph"
          onClick={() => cycle(1)}
          disabled={photos.length < 2}
        >
          →
        </button>
      </div>
    </section>
  )
}
