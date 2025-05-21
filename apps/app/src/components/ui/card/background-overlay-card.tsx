'use client'
import type { MindMapEntityCardProps } from '@/features/mindmap/components/cards/entity-card/entity-card'

export function BackgroundOverlayCard( { data }: MindMapEntityCardProps ) {
  const { photos } = data

  return (
    <div className='max-w-xs w-full'>
      <div>
        <div className='text relative z-50'>
          <h1 className='font-bold text-xl md:text-3xl text-gray-50 relative'>
            Background Overlays
          </h1>
          <p className='font-normal text-base text-gray-50 relative my-4'>
            This card is for some special elements, like displaying background
            gifs on hover only.
          </p>
        </div>
      </div>
    </div>
  )
}
