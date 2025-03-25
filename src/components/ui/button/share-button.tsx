'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export const ShareButton = () => {
  const controls = useAnimation()
  const [isOpen, setIsOpen] = useState( false )

  useEffect( () => {
    // Animate on load
    const timer = setTimeout( () => {
      setIsOpen( true )
      controls.start( 'open' )
    }, 1000 )

    return () => clearTimeout( timer )
  }, [controls] )

  const handleClick = () => {
    setIsOpen( !isOpen )
    controls.start( isOpen ? 'closed' : 'open' )
  }

  return (
    <motion.div
      id='main'
      className='main group'
      animate={controls}
      variants={{
        open: { scale: 1.025 },
        closed: { scale: 1 }
      }}
    >
      <motion.a
        id='share-btn'
        className='relative block h-10 w-10 mx-auto cursor-pointer rounded-full border border-white/50 bg-transparent transition-all duration-500 ease-in-out hover:scale-[1.025] hover:shadow-[0_5px_30px_0_rgba(26,214,253,0.4)] active:scale-[0.975] active:shadow-[0_5px_35px_10px_rgba(26,214,253,0.3)]'
        onClick={handleClick}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.975 }}
      >
        <motion.svg
          className='absolute -left-[3px] -top-[3px] right-0 bottom-0 z-10 opacity-50 group-hover:opacity-100'
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="45"
          height="45"
          viewBox="0 0 45 45"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.circle
            transform="rotate(-90 40 40)"
            className="transition-[stroke-dashoffset] duration-600 ease-in-out"
            cx="57.5"
            cy="22.5"
            r="20.5"
            fill="transparent"
            stroke="#1AD6FD"
            strokeWidth="2.5"
            initial={{ strokeDasharray: 130, strokeDashoffset: 130 }}
            animate={isOpen ? { strokeDashoffset: 0 } : { strokeDashoffset: 130 }}
            transition={{ duration: 0.6 }}
          />
        </motion.svg>
        <motion.span
          className='absolute h-[1px] w-[14px] bg-white transition-all duration-500 ease-in-out top-4 left-2.5 -rotate-[30deg] before:content-[""] before:absolute before:-left-0.5 before:-bottom-0.5 before:block before:h-1 before:w-1 before:rounded-full before:border before:border-white before:bg-black before:transition-all before:duration-500 after:content-[""] after:absolute after:left-3 after:-bottom-0.5 after:block after:h-1 after:w-1 after:rounded-full after:border after:border-white after:bg-black after:transition-all after:duration-500 hover:bg-[#1ad6fd] hover:before:border-[#1ad6fd] hover:after:border-[#1ad6fd]'
          animate={isOpen ? {
            top: '19px',
            left: '11px',
            rotate: 0
          } : {
            top: '16px',
            left: '10px',
            rotate: -30
          }}
        />
        <motion.span
          className='absolute h-[1px] w-[12px] bg-white transition-all duration-500 ease-in-out top-[22px] left-[13px] rotate-[30deg] after:content-[""] after:absolute after:left-[9px] after:-bottom-0.5 after:block after:h-1 after:w-1 after:rounded-full after:border after:border-white after:bg-black after:transition-all after:duration-500 hover:bg-[#1ad6fd] hover:after:border-[#1ad6fd]'
          animate={isOpen ? {
            top: '19px',
            left: '14px',
            rotate: 0
          } : {
            top: '22px',
            left: '13px',
            rotate: 30
          }}
        />
      </motion.a>
    </motion.div>
  )
}
