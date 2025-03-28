'use client'
import React, { useRef, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'

import { ArrowLeft, Search, User } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
}

function Button( {
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
} ) {
  return (
    <button
      className='relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export function RootNodeToolbar( { handleSubmit, type, value, onChange }: any ) {
  const [isOpen, setIsOpen] = useState( false )
  const containerRef = useRef<HTMLDivElement>( null )

  useClickOutside( containerRef, () => {
    setIsOpen( false )
  } )

  return (
    <MotionConfig transition={transition}>
      <div className='' ref={containerRef}>
        <div className='flex justify-end'>
          <motion.div
            animate={{
              // @todo: here I want to remove the width
              width: isOpen ? '100%' : 'min-content',
            }}
            initial={false}
          >
            <div className='overflow-hidden p-2 rounded-xl relative rounded-lg px-4 font-sm transition-[box-shadow] duration-300 ease-in-out hover:shadow'>
              {!isOpen ? (
                <div className='flex'>
                  {/* {children} */}
                  <Button
                    onClick={() => setIsOpen( true )}
                    ariaLabel='Search notes'
                  >
                    <Search className='h-5 w-5' />
                  </Button>
                </div>
              ) : (
                <div className='flex'>
                  <Button onClick={() => setIsOpen( false )} ariaLabel='Back'>
                    <ArrowLeft className='h-5 w-5' />
                  </Button>
                  <div className='relative w-full'>
                    <input
                      className='h-5 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 text-zinc-900 placeholder-zinc-500 focus:outline-none'
                      autoFocus
                      placeholder={`Search ${type}`}
                      value={value}
                      onChange={onChange}
                      onSubmit={handleSubmit}
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
