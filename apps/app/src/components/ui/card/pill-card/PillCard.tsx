'use client'

import { ConnectionsIcon } from '@/components/icons'
import { ShinyButton } from '@/components/ui/button'
import { useEntity } from '@/hooks'
import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export const PillCard = ( { card }: any ) => {
  const {
    handleHoverLeave,
    entity,
    showMenu,
    setShowMMenu,
    bookmarked,
    setBookmarked,
    relatedDataPoints,
    saveNote,
    updateNote,
    userNote,
    connectionListConnections,
    handleHoverEnter,
    findConnections,
  } = useEntity( { card } )
  console.log( 'personnel card:', card )
  console.log( 'personel entity:', entity )
  const { popularity, rank, photo, name, role }: any = entity
  const statsMap: any = {
    popularity: popularity,
    rank: rank,
    role: role,
  }

  const image: any = entity?.photo && photo[0] ? photo[0] : { url: '/astro-3.png' }
  const [isOpen, setIsOpen] = useState( false )
  const [showContent, setShowContent] = useState( false )

  const presence = {
    enter: {
      opacity: 0,
      scale: 0.9,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    enter: {
      opacity: 0,
      y: 20,
    },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const handleToggle = () => {
    if ( isOpen ) {
      setShowContent( false )
    } else {
      setIsOpen( true )
      setTimeout( () => setShowContent( true ), 50 )
    }
  }

  // 'overflow-hidden relative rounded-2xl  will-change-transform',
  // dark: bg - black dark:border dark: border - white / 60'
  return (
    <div className='h-full center w-full overflow-hidden relative'>
      <motion.div
        className={cn(
          'bg-primary w-[500px] rounded-full h-14 px-4 cursor-pointer duration-200 border-2 border-white bg-neutral-100 dark:bg-black group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all',
          isOpen && 'rounded-3xl'
        )}
        animate={{ height: isOpen ? 240 : 64, width: isOpen ? 500 : 300 }}
        transition={{ duration: 0.2 }}
        onClick={handleToggle}>
        <div className={cn( 'flex items-center justify-between relative h-16', isOpen && 'pt-5' )}>
          <p className='dark:text-white font-nunito'>{name}</p>
          <motion.div
            className='rounded-3xl overflow-hidden relative'
            animate={{
              height: isOpen ? 200 : 40,
              width: isOpen ? 200 : 40,
              y: isOpen ? 75 : 0,
            }}
            transition={{ duration: 0.2 }}>
            <Image
              src={image.url}
              alt={name}
              fill
              className={cn( 'transition-all duration-150 grayscale', isOpen && 'grayscale-0' )}
            />
            <div
              className={cn(
                'absolute opacity-0 bg-black/50 top-0 left-0 flex items-center justify-center text-primary-foreground font-semibold text-2xl h-full w-full transition-all duration-150',
                isOpen && 'hover:opacity-100'
              )}>
              Book a call
            </div>
          </motion.div>
        </div>
        <AnimatePresence onExitComplete={() => setIsOpen( false )}>
          {showContent && (
            <motion.ul
              initial='enter'
              animate='center'
              exit='exit'
              variants={presence}
              transition={{ duration: 0.2 }}
              className='text-primary-foreground mt-6 dark:text-white'
              style={{
                textWrap: 'pretty',

                width: '50%',
              }}>
              {['Rank', 'Popularity', 'Role'].map( ( item, index ) =>
                item === 'Role' ? (
                  <motion.li
                    key={item + index}
                    variants={itemVariants}
                    className='font-nunito line-clamp-2'>
                    {role}
                  </motion.li>
                ) : (
                  <motion.li key={item + index} variants={itemVariants}>
                    {item}: {statsMap[item.toLowerCase()]}
                  </motion.li>
                )
              )}
            </motion.ul>
          )}
          {showContent && (
            <ShinyButton
              onClick={findConnections}
              className='h-10 w-10'
              style={{
                marginTop: '20px',
                display: 'inline-block',
              }}>
              <ConnectionsIcon className='h-6 w-6 text-white' stroke='#fff' />
            </ShinyButton>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
