'use client'

import {useUpdateNodeInternals} from '@xyflow/react'
import {useState, useCallback, memo} from 'react'

interface StackedCardRecord {
  id: string
  name: string
  domain: string
  count: number
  prepaid: number
}

interface StackedCardsProps {
  records?: StackedCardRecord[]
  className?: string
}

const DEFAULT_RECORD: StackedCardRecord = {
  id: 'default',
  name: 'course waitlist',
  domain: 'course.craftofui.com',
  count: 23602,
  prepaid: 16280,
}

const EntityNode = memo((node: any) => {
  console.log('node: ', node)

  const updateNodeInternals = useUpdateNodeInternals()
  const [handles, setHandles]: any = useState([])
  const [showAskAI, setShowAskAI] = useState(false)

  const toggleShowAskAI = useCallback(() => {
    setShowAskAI((prev) => !prev)
  }, [])

  console.log('handles: ', handles)
  const nodeData = useNodesData(node.id)
  const type = node.data.type

  // ... rest of the component code ...
})

export function StackedCards({records = [DEFAULT_RECORD], className = ''}: StackedCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleCardInteraction = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className={`relative h-[350px] w-[500px] ${className}`}>
      <div className='relative h-full w-full [perspective:1000px]'>
        {records.map((record, index) => (
          <button
            key={record.id}
            type='button'
            className={`
              absolute left-0 top-0 h-full w-full text-left transition-all duration-500 ease-out
              origin-top focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl
              ${index === 0 ? 'z-30 hover:-translate-y-10' : ''}
              ${index === 1 ? 'z-20 translate-x-6 translate-y-4 rotate-3' : ''}
              ${index === 2 ? 'z-10 translate-x-12 translate-y-8 rotate-6' : ''}
              ${index === 3 ? 'translate-x-16 translate-y-12 rotate-9' : ''}
              ${index > 3 ? 'opacity-0' : ''}
            `}
            onClick={() => handleCardInteraction(index)}
            aria-label={`Card for ${record.name}`}>
            <div className='h-full w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg'>
              {/* Card Header */}
              <div className='flex items-center gap-2.5 border-b border-neutral-200 px-4 py-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded bg-neutral-800'>
                  <svg
                    className='h-4 w-4 text-white'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'>
                    <path d='M12 2L2 19H22L12 2Z' fill='currentColor' />
                  </svg>
                </div>
                <span className='text-sm font-medium'>the craft of ui</span>
              </div>

              {/* Card Content */}
              <div className='px-4 py-3'>
                <div className='mb-4 flex items-center gap-2'>
                  <span className='text-sm'>subscribers</span>
                  <span className='rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-600'>
                    database
                  </span>
                  <div className='ml-auto'>...</div>
                </div>

                {/* Data Fields */}
                <div className='space-y-3'>
                  <div className='flex items-center'>
                    <span className='w-8 text-neutral-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'>
                        <path d='M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2' />
                        <path d='M18 14h-8' />
                        <path d='M15 18h-5' />
                        <path d='M10 6h8v4h-8V6Z' />
                      </svg>
                    </span>
                    <span className='text-sm font-medium'>name</span>
                    <span className='ml-auto text-sm'>{record.name}</span>
                  </div>

                  <div className='flex items-center'>
                    <span className='w-8 text-neutral-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'>
                        <circle cx='12' cy='12' r='10' />
                        <path d='M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' />
                        <path d='M2 12h20' />
                      </svg>
                    </span>
                    <span className='text-sm font-medium'>domain</span>
                    <span className='ml-auto text-sm'>{record.domain}</span>
                  </div>

                  <div className='flex items-center'>
                    <span className='w-8 text-neutral-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'>
                        <path d='M3 3v18h18' />
                        <path d='m19 9-5 5-4-4-3 3' />
                      </svg>
                    </span>
                    <span className='text-sm font-medium'>count</span>
                    <span className='ml-auto text-sm'>{record.count.toLocaleString()}</span>
                  </div>

                  <div className='flex items-center'>
                    <span className='w-8 text-neutral-500'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'>
                        <circle cx='12' cy='12' r='10' />
                        <path d='M12 2v20' />
                        <path d='M12 12h8.5' />
                        <path d='M8 12h.5' />
                        <path d='M3 12h.5' />
                      </svg>
                    </span>
                    <span className='text-sm font-medium'>prepaid</span>
                    <span className='ml-auto text-sm text-green-500'>
                      {record.prepaid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
