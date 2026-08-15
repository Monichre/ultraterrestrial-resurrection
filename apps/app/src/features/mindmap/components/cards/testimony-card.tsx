'use client'

import {BlurAppear} from '@/components/animated'
import {formatModelWithImage} from '@/utils/image.utils'

type TestimonyCardProps = {
  card: {
    claim: string
    documentation: any[]
    witness: any
    event: any
    date?: string
    summary: any
    xata: {
      createdAt: string
      updatedAt: string
      version: number
    }
    color: string
    type: string
    fill: string
    parentId: string
  }
}

export const TestimonyCoreNodeBottom = ({card, children}: any) => {
  const {photo}: any = formatModelWithImage(card?.witness)
  const source = card?.witness?.name
  const quote = card?.claim
  return (
    <>
      <div className='flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'>
        <div className='size-5'>
          <span
            className='relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none'
            data-state='closed'
            style={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              transform: 'translateX(0px)',
            }}>
            <img
              className='aspect-square size-full object-cover'
              src={photo.url}
              alt='User Avatar'
            />
          </span>
        </div>
        <span className='text-neutral-600 dark:text-neutral-400'>{source}</span>
      </div>
      <span>{children}</span>
    </>
  )
}

export const TestimonyCard = ({card}: TestimonyCardProps) => {
  console.log('🚀 ~ file: testimony-card.tsx:30 ~ TestimonyCard ~ data:', card)
  const source = card?.witness?.name
  const quote = card?.claim
  const {photo}: any = formatModelWithImage(card?.witness)
  // Lot of testimony records dont have dates, would it be worth it to add an internal AI agent to solve problems like this?
  return (
    <BlurAppear>
      <blockquote
        className='w-full cursor-text select-text whitespace-pre-wrap pr-2 text-white/90'
        style={{
          lineHeight: 1.5,
          fontSize: 'clamp(0.9rem, 0.6vw + 0.75rem, 1.05rem)',
          maxWidth: 520,
        }}>
        “{quote}”
      </blockquote>

      {/* Display source name and avatar */}
      {source && (
        <div className='flex items-center mt-3 gap-2 text-white/70'>
          {photo ? (
            <div className='h-6 w-6 rounded-full overflow-hidden flex-shrink-0'>
              <img src={photo} alt={source} className='h-full w-full object-cover' />
            </div>
          ) : (
            <div className='h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0'>
              <span className='text-xs text-neutral-200'>{source.charAt(0)}</span>
            </div>
          )}
          <span className='text-xs'>{source}</span>
        </div>
      )}
    </BlurAppear>
  )
}
