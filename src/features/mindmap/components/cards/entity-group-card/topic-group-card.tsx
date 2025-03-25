'use  client'
import { formatNodesForCardDisplay } from '@/features/mindmap/components/cards/card-stack/card-stack'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useMindMap } from '@/contexts'
import { truncate } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsRight, X } from 'lucide-react'

import { Gallery } from '@/components/animated/gallery'
import { Button } from '@/components/ui/button'

import { ConnectionsIcon, TopicsIcon } from '@/components/icons'
import { AddNote } from '@/components/note/AddNote'
import { Separator } from '@/components/ui/separator'
import { useEntity } from '@/hooks/useEntity'
import { format } from 'date-fns'
import Link from 'next/link'
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'
export function TopicAndTestimoniesGroupCard( { card }: any ) {
  const { height, width } = card
  const { getIntersectingNodes, useNodesData, toggleLocationVisualization, screenToFlowPosition } =
    useMindMap()
  const groupNodeData = useNodesData( card.id )
  const { findConnections, updateNote, saveNote, userNote } = useEntity( {
    card: groupNodeData,
  } )

  const [groupCards, setGroupCards]: any = useState(
    formatNodesForCardDisplay( groupNodeData?.data.children )
  )

  console.log(
    '🚀 ~ file: topic-group-card.tsx:42 ~ TopicAndTestimoniesGroupCard ~ groupCards:',
    groupCards
  )

  const [clones, setClones]: any = useState()
  const removeChildCardClone = ( cardId: any ) => {
    const existing = [...groupCards]
    const newCards = existing.filter( ( card ) => card.id !== cardId )
    setGroupCards( newCards )
  }
  useEffect( () => {
    if ( groupNodeData?.data.children ) {
      const formattedCards = formatNodesForCardDisplay( groupNodeData?.data.children )
      setGroupCards( formattedCards )
    }
  }, [groupNodeData] )

  const [alignment, setAlignment] = useState<'columns' | 'rows'>( 'columns' )
  const [activePost, setActivePost] = useState( groupCards[0] )
  const [clickedPost, setClickedPost]: any = useState( null )

  const [isHovered, setIsHovered] = useState<number | null>( null )
  const ref = useRef<HTMLDivElement>( null )
  useOnClickOutside( ref, () => setClickedPost( null ) )

  useEffect( () => {
    const nodes = Array.from( document.querySelectorAll( '.react-flow__node-entityGroupNodeChildTopics' ) )
    nodes.forEach( ( n ) => {
      n.classList.add( 'hide' )
    } )


    function onKeyDown( event: KeyboardEvent ) {
      if ( event.key === 'Escape' ) {
        setClickedPost( null )
      }
    }

    window.addEventListener( 'keydown', onKeyDown )
    return () => window.removeEventListener( 'keydown', onKeyDown )
  }, [] )

  const matches = useMediaQuery( '(max-width: 640px)' )

  useEffect( () => {
    if ( matches ) {
      setAlignment( 'rows' )
    }
  }, [matches] )

  const initialRotation = useMemo( () => {
    return () => `${Math.random() * 10 > 5 ? '-' : ''}${Math.random() * 10 + 10}deg`
  }, [] )

  const clickedImage =
    clickedPost && clickedPost?.photos?.length
      ? clickedPost?.photos[0]
      : { url: '/foofighters.webp', signedUrl: '/foofighters.webp' }
  return (
    <main className='border-2 p-1.5 rounded-3xl duration-200 border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group hover:border-indigo-200 dark:hover:border-indigo-800'>
      <AnimatePresence>
        {clickedPost && !matches && alignment === 'columns' && (
          <motion.div
            className='absolute inset-0 z-50 flex left-0 top-0 h-full w-full items-center justify-center bg-transparent p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className='relative w-full h-full p-6 '
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layoutId='post-detail'
              ref={ref}>
              <Button
                variant='ghost'
                onClick={() => setClickedPost( null )}
                className='absolute right-6 top-6 z-30 transition-transform duration-300 active:scale-95'>
                <X className='w-4 h-4' />
              </Button>
              <motion.div className='relative mb-5 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-white transition-all after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-3xl after:border-[5px] after:border-white/50'>
                {clickedPost.photos?.length ? (
                  <Gallery images={clickedPost.photos} />
                ) : (
                  <Gallery
                    images={[
                      { url: '/foofighters.webp' },
                      { url: '/astro-3.png' },

                      { url: '/DALLE7.webp' },
                      { url: '/DALLE8.webp' },
                      { url: '/DALLE9.webp' },
                    ]}
                  />
                )}
                <motion.img
                  src={clickedImage.url}
                  alt={clickedPost.name}
                  className='aspect-auto h-full w-full object-cover'
                />
              </motion.div>
              <div>
                <h1 className='text-xl text-black font-bebasNeuePro'>{clickedPost.name}</h1>
                <p className='flex items-center text-sm text-black'>
                  <ChevronsRight className='mr-1 w-4' />
                  {clickedPost.date}
                </p>
              </div>
              <p className='mt-4 text-sm text-black font-source'>
                {truncate( clickedPost.summary, 500 )}
              </p>
              <Link
                aria-label='Read more'
                className='group mt-5 flex w-max items-center justify-center gap-2.5 rounded-2xl bg-zinc-700 px-4 py-2.5 text-sm font-[550] text-white active:scale-95 sm:transition-transform'
                href={`/topics/${activePost.id}`}>
                <Button className='py-2 px-4 rounded flex items-center gap-2 ' variant='ghost'>
                  <span>Learn More</span>
                  <motion.svg
                    width='15'
                    height='15'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <motion.path
                      d='M5 12H19'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.path
                      d='M12 5L19 12L12 19'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      initial={{ x: -7 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.svg>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section className='overflow-hidden relative rounded-2xl duration-200 border-2 bg-neutral-50 px-4 py-5 shadow-lg shadow-neutral-200/50 dark:bg-neutral-950 dark:shadow-neutral-800/50 border-neutral-200 dark:border-neutral-800'>
        <div className='relative h-full flex items-start justify-center px-4 pt-10 sm:items-center'>
          <div className='relative flex w-full h-full max-w-lg flex-col items-center justify-around'>
            <div
              className='relative flex w-full h-full items-center justify-center'
              style={{
                flexDirection: alignment === 'rows' ? 'column' : 'row',
                gap: alignment === 'rows' ? '1.5rem' : '0',
              }}>
              {groupCards.map( ( card: any, index: any ) => {
                const image = card?.photos?.length
                  ? card?.photos[0]
                  : { url: '/foofighters.webp', signedUrl: '/foofighters.webp' }
                return (
                  <>
                    <motion.div
                      key={card.id}
                      id={`${card.id}-clone`}
                      whileHover={{
                        zIndex: 5,
                        scale: alignment === 'rows' ? 1 : 1.2,
                      }}
                      style={{
                        marginRight: alignment === 'rows' ? '0' : '-2.5rem',
                        borderRadius: 24,
                      }}
                      // layoutId={`${card.name}-image`}
                      layout>
                      <motion.div
                        className='relative'
                        initial={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.2,
                        }}
                        onMouseEnter={() => setIsHovered( index )}
                        onMouseLeave={() => setIsHovered( null )}
                      // layoutId={`${card.name}-image`}
                      // layout
                      >
                        <motion.div
                          className='ease-bounce group relative shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-black shadow-xl transition-all duration-300 will-change-transform after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-3xl after:border-[5px] after:border-white/50 after:transition-[border] hover:!rotate-0 hover:after:border-8'
                          onMouseEnter={() => setActivePost( card )}
                          onClick={() => setClickedPost( card )}
                          style={{
                            rotate: alignment === 'rows' ? '0' : initialRotation(),
                            width: matches ? 'auto' : alignment === 'rows' ? 512 : 214,
                            height: matches ? 'auto' : alignment === 'rows' ? 288 : 160,
                          }}
                          layoutId={`${card.name}-image`}
                        // layout
                        >
                          {activePost === card && <IndicatorPoint />}
                          <motion.img
                            src={image.url || image.src}
                            alt={card?.name}
                            // layoutId={`${card.name}-image`}
                            // layout
                            className='aspect-auto h-full w-full object-cover'
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    {activePost === card && alignment === 'rows' && (
                      <PostDetail
                        activePost={activePost}
                        findConnections={findConnections}
                        alignment={alignment}
                      />
                    )}
                  </>
                )
              } )}
            </div>
            {alignment === 'columns' && (
              <PostDetail
                activePost={activePost}
                findConnections={findConnections}
                alignment={alignment}
                saveNote={saveNote}
                userNote={userNote}
                updateNote={updateNote}
              />
            )}
          </div>
        </div>
      </section>
      <div className='flex w-full items-center justify-between p-1 font-mono text-[0.65rem]'>
        <div className='flex items-center gap-1 rounded-full bg-neutral-200 py-1 pl-2 pr-2.5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'>
          <div className='size-5'>
            <span
              className='relative flex shrink-0 overflow-hidden rounded-full aspect-square h-full animate-overlayShow cursor-pointer border-2 shadow duration-200 pointer-events-none'
              data-state='closed'
              style={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateX(0px)',
              }}>
              <TopicsIcon className='w-4 h-4' stroke='#fff' />
            </span>
          </div>
          <span className='text-neutral-600 dark:text-neutral-400'>Topics</span>
        </div>
        <span>{format( new Date(), 'MMM d, yyyy' )}</span>
      </div>
    </main>
  )
}

{
  /* <CardCorners type={card.id.split('-')[0]} /> */
}
const PostDetail = ( {
  activePost,
  findConnections,
  alignment,
  saveNote,
  userNote,
  updateNote,
}: {
  activePost: any
  findConnections: any
  alignment: any
  saveNote: any
  userNote: any
  updateNote: any
} ) => {
  return (
    <motion.div
      className={`flex w-full justify-between gap-6`}
      layoutId='post-detail'
      transition={{ staggerChildren: 0.5 }}
      style={{
        marginTop: alignment === 'rows' ? '0' : '5rem',

        height: '200px',
      }}>
      <div className='flex w-2/3 flex-col gap-6'>
        <div>
          <p className='mb-2 font-bold'>Title</p>
          <motion.h3
            className='min-h-10 text-xl text-white font-bebasNeuePro'
            key={activePost.name}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.8 }}>
            {activePost.name}
          </motion.h3>
        </div>
        <div className='w-auto flex'>
          <Button variant='ghost' onClick={findConnections} className='p-0'>
            <ConnectionsIcon className='h-5 w-5 text-white stroke-1' />
          </Button>
          <Separator orientation='vertical' className='ml-4' />
          <AddNote saveNote={saveNote} userNote={userNote} updateNote={updateNote} />
        </div>
      </div>
      <div className='w-full flex flex-col align-end'>
        <div>
          <p className='mb-2 font-bold'>Description</p>
          <motion.p
            className='text-pretty text-sm text-white font-nunito line-clamp-4'
            key={activePost.name}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.8 }}>
            {truncate( activePost.summary, 400 )}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

const IndicatorPoint = () => {
  return (
    <motion.div className='absolute left-0 top-0 z-10 size-12 opacity-0 transition-opacity delay-500 duration-300 ease-in group-hover:opacity-0 group-hover:delay-0 group-hover:duration-100 sm:opacity-100'>
      <div className='absolute left-0 top-0 size-12 bg-black/25 blur-xl'></div>
      <div className='absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white after:absolute after:h-full after:w-full after:animate-ping after:rounded-full after:bg-white'></div>
    </motion.div>
  )
}
