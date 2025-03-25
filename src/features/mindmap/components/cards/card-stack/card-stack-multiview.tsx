import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { Minimize2, Maximize2, Layers, Layers3 } from 'lucide-react'

const StackedCollapsibleCards = ({ groupCards }: { groupCards: any[] }) => {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isStacked, setIsStacked] = useState(false)
  const [isHoveredLogo, setIsHoveredLogo] = useState<number | null>(null)
  const itemRefs = useRef<any[]>([])

  const stackedHeight = '400px' // You can adjust this as needed

  return (
    <div className='relative h-full w-full rounded-xl border border-white/10 px-4 py-5'>
      <motion.div
        className='w-full flex items-center justify-center'
        style={{
          flexDirection: isMaximized ? 'column' : 'row',
          gap: isMaximized ? '8px' : '0px',
          height: isStacked ? stackedHeight : 'auto',
        }}
        layout
      >
        {groupCards.map((item, index) => {
          const {
            data: {
              description,
              latitude,
              location,
              longitude,
              date: unformattedDate,
              photos,
              photo,
              name,
              role,
              color,
              type,
              label,
              fill,
            },
          } = item

          const date = dayjs(unformattedDate).format('MMM DD, YYYY')
          const image = photos?.length
            ? photos[0]
            : photo?.length
              ? photo[0]
              : { url: '/foofighters.webp', signedUrl: '/foofighters.webp' }

          return (
            <motion.div
              ref={(el) => (itemRefs.current[index] = el)}
              key={name}
              className='relative flex items-start space-x-4 border p-4 rounded-2xl bg-white'
              layout
              style={{
                position: isStacked ? 'absolute' : 'static',
                width: isStacked ? `calc(100% - ${index * 20}px)` : 'auto',
                zIndex: isMaximized ? groupCards.length - index : 1,
                top: isStacked ? `${index * 10}px` : 'auto',
                border: isMaximized ? '1px solid #f0f0f0' : 'none',
                overflow: isMaximized ? 'hidden' : 'visible',
              }}
            >
              <motion.div
                className='relative flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 shrink-0'
                style={{
                  borderRadius: '14px',
                }}
                layout
                onMouseEnter={() => setIsHoveredLogo(index)}
                onMouseLeave={() => setIsHoveredLogo(null)}
              >
                <motion.img
                  src={image.url}
                  alt={item.name}
                  className='w-full h-full object-cover'
                  style={{
                    borderRadius: '14px',
                  }}
                  layout
                />
                {isHoveredLogo === index && !isMaximized && !isStacked && (
                  <motion.div
                    className='absolute bottom-full mb-1 px-2 py-1.5 text-xs text-white bg-zinc-900 font-medium rounded-lg'
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 10 }}
                  >
                    {name}
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                style={{
                  display: isMaximized ? 'block' : 'none',
                  width: isMaximized ? '100%' : '0',
                  opacity: isMaximized ? 1 : 0,
                  height: isMaximized ? 'auto' : '0',
                }}
                className='overflow-hidden'
              >
                <div className='flex items-center justify-start gap-2'>
                  <h2 className='text-lg sm:text-xl font-semibold'>{name}</h2>
                  <span className='w-1 h-1 rounded-full bg-slate-800 line-clamp-1'></span>
                </div>
                <p className='text-xs sm:text-sm text-gray-500 mt-1 mb-2 line-clamp-2'>
                  {description}
                </p>
                <p className='text-xs text-gray-400 w-full text-right pr-4'>
                  {date}
                </p>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
      <motion.div className='flex items-center gap-4' layout>
        <button
          className='z-10 p-3 bg-zinc-900 text-white rounded-full shadow-md active:scale-90 duration-300 transition-transform disabled:opacity-50'
          disabled={isStacked}
          onClick={() => setIsMaximized((prev) => !prev)}
        >
          {isMaximized ? <Minimize2 /> : <Maximize2 />}
        </button>
        <button
          className='z-10 p-3 bg-zinc-900 text-white rounded-full shadow-md active:scale-90 duration-300 transition-transform disabled:opacity-50'
          disabled={!isMaximized}
          onClick={() => setIsStacked((prev) => !prev)}
        >
          {isStacked ? <Layers3 /> : <Layers />}
        </button>
      </motion.div>
    </div>
  )
}

export default StackedCollapsibleCards
