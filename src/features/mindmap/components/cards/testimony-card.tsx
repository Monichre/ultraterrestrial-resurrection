'use client'

import { BlurAppear } from '@/components/animated'
import { formatModelWithImage } from '@/utils/image.utils'

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

export const TestimonyCoreNodeBottom = ( { card, children }: any ) => {
  const { photo }: any = formatModelWithImage( card?.witness )
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
            }}
          >
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

export const TestimonyCard = ( { card }: TestimonyCardProps ) => {
  console.log( '🚀 ~ file: testimony-card.tsx:30 ~ TestimonyCard ~ data:', card )
  const source = card?.witness?.name
  const quote = card?.claim
  const { photo }: any = formatModelWithImage( card?.witness )
  // Lot of testimony records dont have dates, would it be worth it to add an internal AI agent to solve problems like this?
  return (
    <BlurAppear>
      <p className='w-full cursor-text select-text whitespace-pre-wrap pr-2 align-middle text-sm leading-6 selection:bg-white/50'>
        {quote}
      </p>
      <button
        className='invisible ring-neutral-950/10 dark:ring-neutral-50/10 absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-neutral-200 p-1 outline-none ring-2 duration-200 md:hover:block md:peer-hover/wrap:block dark:bg-neutral-800'
        data-state='closed'
      >
        <svg
          width='15'
          height='15'
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='rotate-180 h-4 w-4 duration-200'
        >
          <path
            d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z'
            fill='currentColor'
            fillRule='evenodd'
            clipRule='evenodd'
          ></path>
        </svg>
      </button>
    </BlurAppear>
  )
}