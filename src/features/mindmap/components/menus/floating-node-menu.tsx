'use client'
import {
  EventsIcon,
  KeyFiguresIcon,
  OrganizationsIcon,
  TestimoniesIcon,
  TopicsIcon,
} from '@/components/icons'
import { useClickOutside } from '@/hooks'
import { useMindMap } from '@/contexts'

import { AnimatePresence, motion } from 'framer-motion'
import { PlusIcon } from 'lucide-react'
import React, { useCallback, useState } from 'react'

export function FloatingNodeMenu() {
  const refMenu = React.useRef<HTMLDivElement>( null )
  const [openMenu, setOpenMenu] = useState( false )

  const duration = 0.2
  const transition = { duration, ease: [0.32, 0.72, 0, 1] }

  const menuVariants = {
    open: {
      opacity: 1,
      width: '320px',
      height: 220,
      borderRadius: '16px',
      bottom: -44,
      transition,
    },
    closed: {
      bottom: 0,
      opacity: 1,
      width: '48px',
      height: 48,
      borderRadius: '50%',
      transition,
    },
  }

  const contentVariants = {
    open: { opacity: 1, scale: 1, transition },
    closed: { opacity: 0, scale: 1, transition },
  }

  const buttonVariants = {
    open: {
      opacity: 0,
      transition: {
        duration: duration / 2,
      },
    },
    closed: {
      opacity: 1,
      transition: {
        duration: duration,
      },
    },
  }
  const { addNextEntitiesToMindMap } = useMindMap()
  const handleLoadingRecords = useCallback(
    async ( rootNodeSim: any ) => {
      // const
      await addNextEntitiesToMindMap( rootNodeSim )
    },
    [addNextEntitiesToMindMap]
  )
  const actions = [
    {
      icon: <EventsIcon className='w-6 h-6' />,
      label: 'Add Events',
      action: async () => {
        await handleLoadingRecords( { data: { type: 'events' } } )
      },
    },
    {
      icon: <TopicsIcon className='w-6 h-6' />,
      label: 'Add Topics',
      action: async () => {
        await handleLoadingRecords( { data: { type: 'topics' } } )
      },
    },
    {
      icon: <KeyFiguresIcon className='w-6 h-6' />,
      label: 'Add KeyFigures',
      action: async () => {
        await handleLoadingRecords( { data: { type: 'personnel' } } )
      },
    },
    {
      icon: <TestimoniesIcon className='w-6 h-6' />,
      label: 'Add Testimonies',
      action: async () => {
        await handleLoadingRecords( { data: { type: 'testimonies' } } )
      },
    },
    {
      icon: <OrganizationsIcon className='w-6 h-6' />,
      label: 'Add Organizations',
      action: async () => {
        await handleLoadingRecords( { data: { type: 'organizations' } } )
      },
    },
  ]
  useClickOutside<HTMLDivElement>( refMenu, () => {
    setOpenMenu( false )
  } )

  return (
    <div
      className='relative mx-6 mb-16 flex h-[300px] w-full items-end justify-start'
      ref={refMenu}
    >
      <AnimatePresence>
        {openMenu && (
          <motion.div
            className='absolute bottom-0 left-0 flex flex-col items-center overflow-hidden bg-mauve-dark-1 p-1 dark:bg-black'
            initial={'closed'}
            animate='open'
            exit='closed'
            variants={menuVariants}
          // onClick={(e) => e.stopPropagation()}
          >
            <motion.ul
              variants={contentVariants}
              className='relative flex w-full flex-col space-y-1'
            >
              {actions.map( ( item, index ) => {
                return (
                  <motion.li
                    key={index}
                    className='w-full select-none rounded-b-[4px] rounded-t-[4px] bg-black transition-transform first:rounded-t-[12px] last:rounded-b-[12px] active:scale-[0.98] dark:bg-black'
                  >
                    <div
                      className='flex items-center py-3'
                      onClick={item.action}
                    >
                      <div className='px-4'>{item.icon}</div>
                      <div>
                        <h3 className='text-base text-mauve-dark-12 dark:text-mauve-light-12'>
                          {item.label}
                        </h3>
                      </div>
                    </div>
                  </motion.li>
                )
              } )}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className='absolute bottom-0 border border-contrast-90 z-50 left-0 flex h-16 w-16 items-center justify-center rounded-full bg-black p-4 text-white outline-none dark:bg-black dark:text-white'
        onClick={() => {
          setOpenMenu( true )
        }}
        variants={buttonVariants}
        initial='closed'
        animate={openMenu ? 'open' : 'closed'}
        whileTap={{ scale: 0.95 }}
      >
        <PlusIcon className='h-6 w-6' />
      </motion.button>
    </div>
  )
}
