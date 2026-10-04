'use client'

import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function extractPhotos( event: { photos: any[] } ) {
  if ( event && event.photos && Array.isArray( event.photos ) ) {
    return event.photos.map(
      ( photo: {
        id: any
        name: any
        mediaType: any
        size: any
        url: any
        signedUrl: any
      } ) => {
        return {
          id: photo.id,
          name: photo.name,
          mediaType: photo.mediaType,
          size: photo.size,
          url: photo.url,
          signedUrl: photo.signedUrl,
        }
      }
    )
  } else {
    // Return an empty array if no photos are found
    return []
  }
}

export const TimelineItemPhoto = ( props: {
  item: any
  onClick?: () => void
  isSmall?: boolean
} ) => {
  return (
    <motion.div
      style={{
        width: 250,
        height: 150,
      }}
      className={cn(
        'rounded-2xl cursor-pointer text-3xl center overflow-hidden relative'
      )}
      layoutId={`card-${props.item.id}`}
      onClick={props.onClick}
    >
      <motion.img
        src={props.item.url}
        alt=''
        className='w-full object-cover h-full'
        whileHover={{ scale: 1.05 }}
        transition={{
          duration: 0.3,
        }}
      />
    </motion.div>
  )
}

export const TimelineItemPhotoGallery = ( { event }: any ) => {
  const [activeItem, setActiveItem] = useState<Element | null>( null )

  const allElements = extractPhotos( event )

  const handleItemClick = ( ele: Element ) => {
    setActiveItem( ele )
  }
  if ( !allElements?.length ) {
    return null
  }
  if ( allElements.length === 1 ) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-center gap-5'>
          <TimelineItemPhoto item={allElements[0]} />
        </div>
      </div>
    )
  }
  return (
    <div className='h-full center w-full flex flex-col gap-5 relative'>
      <motion.div
        className={cn( 'flex flex-col gap-5' )}
        layout
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          className={cn( 'flex items-center justify-center gap-5' )}
          animate={{
            opacity: activeItem !== null ? 0 : 1,
            willChange: 'auto',
          }}
        >
          {allElements
            .filter( ( item: any, i: number ) => i % 2 === 0 )
            .map( ( ele: any, index: React.Key | null | undefined ) => (
              <TimelineItemPhoto
                item={ele}
                key={index}
                onClick={() => setActiveItem( ele )}
              />
            ) )}
        </motion.div>
        <motion.div
          className={cn( 'flex items-center justify-center gap-5' )}
          animate={{
            opacity: activeItem !== null ? 0 : 1,
            willChange: 'auto',
          }}
        >
          {allElements
            .filter( ( item: any, i: number ) => i % 2 !== 0 )
            .map( ( ele: any, index: React.Key | null | undefined ) => (
              <TimelineItemPhoto
                item={ele}
                key={index}
                onClick={() => setActiveItem( ele )}
              />
            ) )}
        </motion.div>
      </motion.div>

      {activeItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, willChange: 'auto' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='absolute inset-0 w-full h-full  overflow-hidden'
        >
          <AnimatePresence mode='popLayout'>
            <motion.div
              key={activeItem.id}
              className='w-full h-full flex items-center justify-center gap-10 overflow-hidden '
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              layout
            >
              <motion.div
                layoutId={`card-${activeItem.id}`}
                className='w-[400px] h-[400px] rounded-3xl center font-bold text-5xl cursor-pointer overflow-hidden z-10'
                onClick={() => setActiveItem( null )}
              >
                <img
                  src={activeItem.img}
                  alt=''
                  className='w-full object-cover h-full'
                />
              </motion.div>
              <motion.div
                className='flex flex-col gap-4 justify-center items-center'
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {allElements
                  .filter( ( ele: { id: number } ) => ele.id !== activeItem.id )
                  .map( ( ele: any ) => (
                    <TimelineItemPhoto
                      key={ele.id}
                      item={ele}
                      onClick={() => handleItemClick( ele )}
                      isSmall
                    />
                  ) )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
