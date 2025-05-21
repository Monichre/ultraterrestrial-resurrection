'use client'

import { EntityCardUtilityMenu } from '@/features/mindmap/components/cards/entity-card'
import { DOMAIN_MODEL_COLORS, truncate } from '@/utils'

import { AnimatePresence, motion } from 'framer-motion'

import { useEffect, useRef, useState } from 'react'

import { ConnectionList } from '@/features/mindmap/components/connection-list'
import { useEntity } from '@/hooks'
import { image } from 'd3'
import { format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { useOnClickOutside } from 'usehooks-ts'

export function TopicCard( { card }: any ) {
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
  const { type, color, photos, name, date: unformattedDate, role } = entity
  const date = unformattedDate ? format( unformattedDate, 'MMMM d, yyyy' ) : ''

  // const [animatedTitle, setAnimatedTitle] = useState<string>('')
  // const [animatedDate, setAnimatedDate] = useState<string>('')
  // const [titleFinished, setTitleFinished] = useState(false)
  // const [t, setT] = useState<number>(0)
  // const [i, setI] = useState<number>(0)

  // useEffect(() => {
  //   const typingEffect = setInterval(() => {
  //     if (t < name.length) {
  //       setAnimatedTitle(name.substring(0, t + 1))
  //       setT(t + 1)
  //     } else {
  //       clearInterval(typingEffect)

  //       setTitleFinished(true)
  //     }
  //   }, 100)

  //   return () => {
  //     clearInterval(typingEffect)
  //   }
  // }, [name, t])

  // useEffect(() => {
  //   const typingEffectTwo = setInterval(() => {
  //     if (titleFinished) {
  //       if (i < date.length) {
  //         setAnimatedDate(date.substring(0, i + 1))
  //         setI(i + 1)
  //       } else {
  //         clearInterval(typingEffectTwo)
  //       }
  //     }
  //   }, 100)

  //   return () => {
  //     clearInterval(typingEffectTwo)
  //   }
  // }, [date, date.length, i, name, t, titleFinished])

  const modelColor = DOMAIN_MODEL_COLORS[type]

  const [activeIndex, setActiveIndex] = useState( 0 )
  const updateActiveIndex = ( index: number ) => {
    setActiveIndex( index )
  }
  const [alignment, setAlignment] = useState<'columns' | 'rows'>( 'rows' )
  const [activeItem, setActiveItem] = useState<ItemType | null>( null )
  const ref = useRef( null )
  useOnClickOutside( ref, () => setActiveItem( null ) )
  useEffect( () => {
    function onKeyDown( event: KeyboardEvent ) {
      if ( event.key === 'Escape' ) {
        setActiveItem( null )
      }
    }

    window.addEventListener( 'keydown', onKeyDown )
    return () => window.removeEventListener( 'keydown', onKeyDown )
  }, [] )

  useEffect( () => {
    if ( activeItem ) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [activeItem] )

  const items = [
    {
      title: 'Details',
      render: () => (
        <div className='mt-4 text-sm text-white font-source'>
          <p>{truncate( card?.description, 400 )}</p>
        </div>
      ),
    },

    {
      button: 'Connections',
      render: () => (
        <ConnectionList originalNode={card} connections={relatedDataPoints} />
      ),

      onClick: () => {
        saveNote()
        setShowMMenu( false )
      },
    },
  ]

  const BaseCard = ( { card }: any ) => {
    return (
      <div
        className={`relative z-50 rounded-[calc(var(--radius)-2px)] p-[1px] bg-black `}
        style={{ border: `1px solid ${color}` }}
      >
        <div className='flex justify-center items-center w-full absolute bg-transparent w-auto top-0 right-0'>
          <EntityCardUtilityMenu
            updateNote={updateNote}
            saveNote={saveNote}
            userNote={userNote}
            bookmarked={bookmarked}
            findConnections={findConnections}
          />
        </div>

        <motion.div
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 24,
          }}
        >
          <motion.div
            style={{
              borderRadius: '4px',
            }}
            className='relative z-50 dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] px-3 py-4'
          >
            <div
              className={`relative w-full h-full pl-3 flex justify-start-center items-center`}
              style={{ borderLeft: `1px solid ${modelColor}` }}
            >
              <motion.img
                src={image.url || image.src}
                alt='What I Talk About When I Talk About Running - book cover'
                className='h-[75px] w-[75px] object-cover object-center p-1 mr-4'
                style={{
                  borderRadius: '4px',
                }}
              />
              <div className={`w-auto relative`}>
                {/* {type === 'personnel' && (
                  <DialogImage
                    src={image.url || image.src}
                    alt='What I Talk About When I Talk About Running - book cover'
                    className='h-[75px] w-[75px] object-cover object-center p-1 mr-4'
                    style={{
                      borderRadius: '4px',
                    }}
                  />
                )} */}

                <motion.div>
                  <h2
                    className='text-white font-bebasNeuePro text-xl whitespace-normal w-fit capitalize '
                    style={{ textWrap: 'pretty' }}
                  >
                    {name}
                  </h2>
                </motion.div>

                <motion.div className=''>
                  <p className='font-source text-white tracking-wider '>
                    {card?.location || truncate( role, 50 )}
                  </p>
                  <p className='date text-1xl text-[#78efff] text-uppercase font-bebasNeuePro tracking-wider w-auto ml-auto mt-1'>
                    {type === 'personnel' && card?.credibility
                      ? `Credibility Score: ${card?.credibility}`
                      : type === 'personnel' && card.rank
                        ? `Platform Ranking: ${card?.rank}`
                        : date}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }
  console.log( { card } )
  return (
    <>
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl'
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {activeItem ? (
          <div className='absolute inset-0 z-10 flex items-start justify-center overflow-scroll pb-20 pt-12'>
            <motion.div
              layoutId={`card-${activeItem.title}`}
              className='relative flex h-fit w-[900px] flex-col items-center justify-center overflow-hidden bg-[#0a0a0b] px-4 py-10'
              style={{ borderRadius: 30 }}
              ref={ref}
            >
              <motion.img
                layoutId={`image-${activeItem.title}`}
                alt='item'
                src={activeItem.image}
                className='-mt-28 h-full w-full bg-[#0a0a0b]'
              />
              <div className='mx-auto -mt-60 flex w-full max-w-[560px] flex-col items-start gap-10'>
                <motion.h2
                  layoutId={`title-${activeItem.title}`}
                  className='text-5xl font-semibold'
                >
                  {activeItem.title}
                </motion.h2>
                <motion.p
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className='text-slate-200'
                >
                  {activeItem.description}
                </motion.p>
              </div>
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className='absolute right-4 top-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-zinc-800 p-2'
                onClick={() => setActiveItem( null )}
              >
                <X className='text-zinc-400' />
              </motion.button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${card.title}`}
        key={card.title}
        onClick={() => setActiveItem( card )}
        style={{ borderRadius: 30 }}
        className='flex h-[360px] w-[336px] cursor-pointer flex-col items-center overflow-hidden bg-[#08090a] px-7 py-8'
      >
        <motion.img
          layoutId={`image-${card.title}`}
          alt='card'
          src={card?.photos[0]?.url || card?.photos[0]?.src}
          className='-mt-10 h-full w-full bg-[#0a0a0b]'
        />
        <div className='flex w-full items-end justify-between'>
          <motion.h2
            layoutId={`title-${card.title}`}
            className='w-full text-left text-xl font-semibold'
          >
            {card.title}
          </motion.h2>
          <motion.button
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-zinc-800 p-2'
          >
            <Plus className='text-zinc-400' />
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
