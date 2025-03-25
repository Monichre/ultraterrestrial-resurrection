'use client'
import React, { useRef, useState }
  from 'react'
import useMeasure from 'react-use-measure'
import { motion, MotionConfig } from 'framer-motion'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ArrowLeft, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
}

// function Button({
//   children,
//   onClick,
//   disabled,
//   ariaLabel,
// }: {
//   children: React.ReactNode
//   onClick?: () => void
//   disabled?: boolean
//   ariaLabel?: string
// }) {
//   return (
//     <button
//       className='relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
//       type='button'
//       onClick={onClick}
//       disabled={disabled}
//       aria-label={ariaLabel}
//     >
//       {children}
//     </button>
//   )
// }

export function AnimatedSearchInput( { onChange, onSubmit, type, value }: any ) {
  const [isOpen, setIsOpen] = useState( false )
  const containerRef = useRef<HTMLDivElement>( null )
  const [contentRef, { width, height }] = useMeasure()

  useClickOutside( containerRef, () => {
    setIsOpen( false )
  } )

  return (
    <MotionConfig transition={transition}>
      <div className='' ref={containerRef}>
        <div className='h-full w-full rounded-xl border border-zinc-950/10 bg-black'>
          <motion.div
            animate={{
              // @todo: here I want to remove the width
              width: isOpen ? '300px' : '98px',
            }}
            initial={false}
          >
            <div ref={contentRef} className='overflow-hidden p-2'>
              {!isOpen ? (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen( true )}
                >
                  <Search className='h-5 w-5' />
                </Button>
              ) : (
                <div className='flex space-x-2'>
                  <Button onClick={() => setIsOpen( false )}>
                    <ArrowLeft className='h-5 w-5' />
                  </Button>
                  <div className='relative w-full'>
                    <input
                      className='h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 focus:outline-none'
                      autoFocus
                      value={value}
                      onChange={onChange}
                      placeholder={`Search ${type}`}
                      onKeyDown={( event ) => {
                        if ( event.key === 'Enter' ) {
                          onSubmit()
                        }
                      }}
                    />
                    <div className='absolute right-1 top-0 flex h-full items-center justify-center'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  )
}
