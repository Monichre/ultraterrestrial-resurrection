'use client'
import { ChevronDown, SparklesIcon } from 'lucide-react'
import React from 'react'

export function HoverExpandButton({ text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      type='button'
      className='px-2 py-1 group hover:bg-neutral-400/15 active:bg-neutral-400/25 rounded-md items-center flex gap-1 transition-colors'
    >
      <SparklesIcon className='size-4 text-neutral-400' />
      <div className='w-fit group-hover:max-w-20 max-w-0 overflow-hidden transition-all duration-500 '>
        <p className=' whitespace-nowrap opacity-0 group-hover:opacity-100 duration-500 transition-opacity text-sm text-neutral-400'>
          {text}
        </p>
      </div>
      <ChevronDown className='size-4 text-neutral-400' />
    </button>
  )
}
