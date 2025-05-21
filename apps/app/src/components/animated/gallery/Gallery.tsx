'use client'

import { useState, type Key } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Gallery({ images }: any) {
  console.log('images: ', images)
  const [activeItem, setActiveItem] = useState<any | null>(images[0])

  return (
    <main className='relative flex h-auto w-full flex-col items-center justify-center gap-5 overflow-hidden px-4 py-10'>
      <div className='relative flex h-[554px] w-full flex-col items-center justify-end'>
        <AnimatePresence>
          {activeItem && (
            <div className='flex w-full items-center justify-center'>
              <motion.img
                layoutId={`photo-${activeItem.alt}`}
                key={activeItem.alt}
                onClick={() => setActiveItem(null)}
                style={{ borderRadius: 12, width: 592, height: 422 }}
                className='flex cursor-pointer items-center justify-center overflow-hidden bg-slate-100 object-cover'
                src={activeItem.url}
                alt={activeItem.alt || ''}
                transition={{
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                }}
              />
            </div>
          )}
        </AnimatePresence>
        <div className='flex w-full items-center justify-center gap-2 px-4 pt-8'>
          {images
            .filter((item: any) => item.url !== activeItem?.url)
            .map((item: { alt: Key | null | undefined; url: any }) => (
              <motion.img
                key={item.url}
                layoutId={`photo-${item.alt}`}
                onClick={() => setActiveItem(item)}
                style={{ borderRadius: 8, width: 100, height: 100 }}
                className='flex-shrink-0 cursor-pointer overflow-hidden bg-slate-100 object-cover'
                src={item.url}
                alt={item.alt || ''}
                transition={{
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                }}
              />
            ))}
        </div>
      </div>
    </main>
  )
}

type ItemType = {
  src: string
  alt: string
  height: number
}
