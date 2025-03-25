'use client'

import { cn } from '@/utils'
import { motion } from 'framer-motion'

interface CoreNodeAvatarProps {
  image: {
    url: string
  }
}
export const OracleMode = ( { image }: CoreNodeAvatarProps ) => {
  return (
    <div
      className='bottom-[3.63rem] box-border text-gray-100 h-7 left-[0.25rem] leading-6 max-w-[calc(100%_-_4px)] px-3 absolute right-[17.00rem] top-[-2.00rem] w-28 flex gap-2 bg-neutral-900 md:pl-0  md:pr-0'
      style={{
        pointerEvents: 'all',
      }}>
      <div className='items-center bg-neutral-800 cursor-pointer text-xs h-6 leading-4 mb-1 py-1 px-2 relative w-fit flex rounded-xl gap-3'>
        <div
          className='items-center bg-neutral-700 h-full justify-center absolute right-[5.38rem] w-6 flex rounded-full overflow-hidden'
          style={{
            pointerEvents: 'none',
          }}>
          <div className='h-4 w-4'>
            <svg
              className='h-4 w-4 overflow-hidden'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'
                fill='none'
                stroke='#edeef0'
              />
              <path d='M5 3v4' fill='none' stroke='#edeef0' />
              <path d='M19 17v4' fill='none' stroke='#edeef0' />
              <path d='M3 5h4' fill='none' stroke='#edeef0' />
              <path d='M17 19h4' fill='none' stroke='#edeef0' />
            </svg>
          </div>
        </div>
        <p
          className='h-4 ml-5 max-w-full text-ellipsis select-none w-20 overflow-hidden'
          style={{
            WebkitLineClamp: '1',
            display: '-webkit-box',
            pointerEvents: 'none',
          }}>
          Oracle Mode
        </p>
      </div>
    </div>
  )
}

interface CoreNodePillProps {
  label: string
}

export const CoreNodePill: React.FC<CoreNodePillProps> = ( { label } ) => {
  return (
    <div
      className='bottom-[3.63rem] box-border text-gray-100 h-7 left-[0.25rem] leading-6 max-w-[calc(100%_-_4px)] px-3 absolute right-[17.00rem] top-[-2.00rem] w-28 flex gap-2 bg-neutral-900 md:pl-0  md:pr-0'
      style={{
        pointerEvents: 'all',
      }}>
      <div className='items-center bg-neutral-800 cursor-pointer text-xs h-6 leading-4 mb-1 py-1 px-2 relative w-fit flex rounded-xl gap-3'>
        <div
          className='items-center bg-neutral-700 h-full justify-center absolute right-[5.38rem] w-6 flex rounded-full overflow-hidden'
          style={{
            pointerEvents: 'none',
          }}>
          <div className='h-4 w-4'>
            <motion.svg
              className='w-4 h-4'
              viewBox='0 0 75 75'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <motion.path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M37.7725 38.1035C57.9016 38.0973 74.1008 37.833 74.1008 37.5079C74.1008 37.1878 58.3991 36.9267 38.7043 36.9128C48.417 27.1776 55.9586 19.3752 55.7994 19.2161C55.6377 19.0544 47.5927 26.8355 37.6459 36.7671C37.6396 16.6467 37.3754 0.45752 37.0504 0.45752C36.7253 0.45752 36.461 16.657 36.4548 36.7863C26.4992 26.8456 18.4439 19.0543 18.2822 19.2161C18.123 19.3753 25.6646 27.1777 35.3773 36.9128C15.6914 36.9269 0 37.188 0 37.5079C0 37.8329 16.1889 38.0971 36.309 38.1035C26.1513 48.2685 18.118 56.569 18.2822 56.7333C18.444 56.895 26.4995 49.1036 36.4553 39.1627C36.4692 58.8571 36.7303 74.5583 37.0504 74.5583C37.3703 74.5583 37.6314 58.8673 37.6455 39.1819C47.5924 49.1136 55.6377 56.895 55.7994 56.7333C55.9636 56.5691 47.9302 48.2685 37.7725 38.1035Z'
                fill='currentColor'
              />
              <motion.path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M37.7725 38.1035C57.9016 38.0973 74.1008 37.833 74.1008 37.5079C74.1008 37.1878 58.3991 36.9267 38.7043 36.9128C48.417 27.1776 55.9586 19.3752 55.7994 19.2161C55.6377 19.0544 47.5927 26.8355 37.6459 36.7671C37.6396 16.6467 37.3754 0.45752 37.0504 0.45752C36.7253 0.45752 36.461 16.657 36.4548 36.7863C26.4992 26.8456 18.4439 19.0543 18.2822 19.2161C18.123 19.3753 25.6646 27.1777 35.3773 36.9128C15.6914 36.9269 0 37.188 0 37.5079C0 37.8329 16.1889 38.0971 36.309 38.1035C26.1513 48.2685 18.118 56.569 18.2822 56.7333C18.444 56.895 26.4995 49.1036 36.4553 39.1627C36.4692 58.8571 36.7303 74.5583 37.0504 74.5583C37.3703 74.5583 37.6314 58.8673 37.6455 39.1819C47.5924 49.1136 55.6377 56.895 55.7994 56.7333C55.9636 56.5691 47.9302 48.2685 37.7725 38.1035Z'
                fill='currentColor'
                fill-opacity='0.2'
              />
            </motion.svg>
          </div>
        </div>
        <p
          className='h-4 ml-5 max-w-full text-ellipsis select-none w-20 overflow-hidden'
          style={{
            WebkitLineClamp: '1',
            display: '-webkit-box',
            pointerEvents: 'none',
          }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export const CoreNodeAvatar: React.FC<CoreNodeAvatarProps & { label?: string }> = ( {
  image,
  label,
} ) => {
  return (
    <div className='flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 bg-neutral-800 text-neutral-400'>
      <div className='size-5'>
        <span
          className='relative flex shrink-0 overflow-hidden rounded-full absolute aspect-square h-full animate-overlayShow cursor-pointer border-1 shadow duration-200 pointer-events-none'
          data-state='closed'
          style={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            transform: 'translateX(0px)',
          }}>
          <img
            className='aspect-square size-full object-cover motion-delay-[400ms] motion-ease-spring-bouncier '
            src={image.url}
          />
        </span>
      </div>
      <span className='text-neutral-600 text-neutral-400'>{label}</span>
    </div>
  )
}

interface CoreNodeBottomProps {
  children: React.ReactNode
}

export const CoreNodeBottom: React.FC<CoreNodeBottomProps> = ( { children } ) => {
  return (
    <div className='flex w-full items-center justify-between p-1 font-mono text-[0.65rem]'>
      {children}
    </div>
  )
}
export const CoreNodeTop = CoreNodeBottom

interface CoreNodeContentProps {
  className?: string
  children: React.ReactNode
}

export const CoreNodeContent: React.FC<CoreNodeContentProps> = ( { className = '', children } ) => {
  return (
    <section
      className={cn(
        'overflow-hidden relative rounded-2xl duration-200 border-1 bg-neutral-50 px-2 py-3 bg-neutral-950 shadow-neutral-800/50 border-neutral-200 border-neutral-800 transition-all duration-300 will-change-transform',
        className
      )}>
      {children}
    </section>
  )
}
export const CoreNodeContainer = ( { children, id, className, ref }: any ) => {
  return (
    <div
      ref={ref}
      className={cn( 'overflow-hidden rounded-3xl bg-black relative', className )}
      id={id}>
      <main
        className={`border-1 p-1.5 rounded-3xl duration-200 border-neutral-200 border-neutral-800 bg-neutral-100 bg-neutral-900 group hover:border-indigo-200 hover:border-indigo-800 transition-all duration-300 will-change-transform`}>
        {children}
      </main>
      <button
        className='invisible ring-neutral-950/10 ring-neutral-50/10 absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-neutral-200 p-1 outline-none ring-2 duration-200 md:hover:block md:peer-hover/wrap:block bg-neutral-800'
        data-state='closed'>
        <svg
          width='15'
          height='15'
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='rotate-180 h-4 w-4 duration-200'>
          <path
            d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z'
            fill='currentColor'
            fill-rule='evenodd'
            clip-rule='evenodd'></path>
        </svg>
      </button>
    </div>
  )
}
