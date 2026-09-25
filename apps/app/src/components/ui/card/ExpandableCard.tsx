import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const ExpandableCard1 = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClose = (e) => {
    if (e.target.id === 'overlay') {
      setIsExpanded(false)
    }
  }

  return (
    <div className='relative flex justify-center items-center h-96'>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id='overlay'
            className='fixed inset-0 bg-black bg-opacity-50 z-40'
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`bg-white shadow-lg rounded-lg p-6 z-50 mx-6 ${isExpanded ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={!isExpanded ? handleToggle : null}
        initial={false}
        animate={{
          width: isExpanded ? '400px' : '300px',
          height: isExpanded ? '330px' : '120px',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          staggerChildren: 0.05,
        }}
      >
        <div
          className={`flex ${isExpanded ? 'flex-col items-center' : 'items-center'}`}
        >
          <motion.img
            src='https://res.cloudinary.com/dl2adjye7/image/upload/v1714420184/1698251861492_e4wiyn.jpg'
            alt='Avatar'
            className='rounded-full shadow-md'
            initial={false}
            animate={{
              width: isExpanded ? '80px' : '64px',
              height: isExpanded ? '80px' : '64px',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              staggerChildren: 0.05,
            }}
          />
          <motion.div
            className={`${isExpanded ? 'text-center mt-4' : 'text-left'} ${isExpanded ? 'ml-0' : 'ml-4'}`}
          >
            <motion.h2 className='text-lg font-semibold'>
              Alexandre Buée
            </motion.h2>
            <motion.div
              className={`flex items-center ${isExpanded ? 'justify-center' : 'justify-start'} text-gray-600 mt-1`}
            >
              <motion.span>Paris, France</motion.span>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                staggerChildren: 0.05,
              }}
              className='mt-4 w-full'
            >
              <div className='flex flex-col items-center space-y-4'>
                <button className='bg-teal-500 text-white px-4 py-2 w-64 sm:w-full flex items-center justify-center rounded-lg hover:bg-teal-600'>
                  Follow
                </button>
                <button className='bg-slate-900 text-white px-4 py-2 rounded-lg w-64 sm:w-full flex items-center justify-center hover:bg-gray-300 hover:text-slate-900'>
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
