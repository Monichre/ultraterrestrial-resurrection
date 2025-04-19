import React from 'react'

export interface ConnectionCardProps { }

export const ConnectionCard: React.FC<ConnectionCardProps> = (
  props: ConnectionCardProps
) => {
  return (
    <div className='border-[0.5px] overflow-hidden rounded-[4px] shadow-sm'>
      <header className='text-[0.55rem] px-2 bg-alternative text-default flex gap-1 items-center h-[22px]'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='12'
          height='12'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1'
          stroke-linecap='round'
          stroke-linejoin='round'
          className='lucide lucide-table2 text-light'
        >
          <path d='M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18'></path>
        </svg>
        testimonies
      </header>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start basis-1/5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-key flex-shrink-0 text-light'
          >
            <circle cx='7.5' cy='15.5' r='5.5'></circle>
            <path d='m21 2-9.6 9.6'></path>
            <path d='m15.5 7.5 3 3L22 7l-3-3'></path>
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            id
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            int4
          </span>
        </div>
        <div
          data-handleid='32917.1'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.1-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.1'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.1-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            claim
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            text
          </span>
        </div>
        <div
          data-handleid='32917.2'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.2-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.2'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.2-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            event_id
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            int4
          </span>
        </div>
        <div
          data-handleid='32917.3'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.3-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.3'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.3-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            summary
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            text
          </span>
        </div>
        <div
          data-handleid='32917.4'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.4-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.4'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.4-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            documentation
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            text
          </span>
        </div>
        <div
          data-handleid='32917.5'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.5-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.5'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.5-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
      <div className='text-[8px] leading-5 relative flex flex-row justify-items-start bg-surface-100 border-t-[0.5px] hover:bg-scale-500 transition cursor-default h-[22px]'>
        <div className='gap-[0.24rem] flex mx-2 align-middle items-center justify-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='8'
            height='8'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            stroke-linecap='round'
            stroke-linejoin='round'
            className='lucide lucide-diamond flex-shrink-0 text-light'
          >
            <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z'></path>
          </svg>
        </div>
        <div className='flex w-full justify-between'>
          <span className='text-ellipsis overflow-hidden whitespace-nowrap max-w-[85px]'>
            witness_id
          </span>
          <span className='px-2 inline-flex justify-end font-mono text-lighter text-[0.4rem]'>
            int4
          </span>
        </div>
        <div
          data-handleid='32917.6'
          data-nodeid='32917'
          data-handlepos='left'
          data-id='32917-32917.6-target'
          className='react-flow__handle react-flow__handle-left nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !left-0 target connectable connectablestart connectableend connectionindicator'
        ></div>
        <div
          data-handleid='32917.6'
          data-nodeid='32917'
          data-handlepos='right'
          data-id='32917-32917.6-source'
          className='react-flow__handle react-flow__handle-right nodrag nopan !h-px !w-px !min-w-0 !min-h-0 !cursor-grab !border-0 !opacity-0 !right-0 source connectable connectablestart connectableend connectionindicator'
        ></div>
      </div>
    </div>
  )
}
