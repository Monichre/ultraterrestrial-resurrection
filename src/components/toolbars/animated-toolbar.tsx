'use client'

import { cn } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MousePointerClick,
  Plus,
  Search,
  Sparkles,
  SunMoon,
  X
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ToolbarProps {
  avatarUrl?: string
}

export function AnimatedToolbar( { avatarUrl = '/astro-3.png' }: ToolbarProps ) {
  const [isExpanded, setIsExpanded] = useState( true )
  const [searchText, setSearchText] = useState( '' )
  const [isSearchActive, setIsSearchActive] = useState( true )
  const [clickedButton, setClickedButton] = useState<string | null>( null )

  const showNotification = ( buttonName: string ) => {
    setClickedButton( buttonName )
    setTimeout( () => setClickedButton( null ), 1000 )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg w-fit relative">
      <AnimatePresence>
        {clickedButton && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-600 font-medium rounded-md text-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative flex flex-col items-center">
              <div>{clickedButton} clicked</div>
              <div className="relative w-24 h-0.5 bg-slate-200 mt-1">
                <motion.div
                  className="absolute left-0 h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 h-10">
        <button
          type="button"
          onClick={() => showNotification( 'Theme toggle' )}
          className="h-10 w-10 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <SunMoon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

        <button
          type="button"
          onClick={() => showNotification( 'Plus' )}
          className="h-10 w-10 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => showNotification( 'Sparkles' )}
          className="h-10 w-10 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <div className="relative flex items-center">
          <AnimatePresence mode="sync">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ width: 40, opacity: 0.8 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{
                  width: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
                  opacity: { duration: 0.2 }
                }}
                className="flex items-center gap-2 rounded-xl px-3 h-10 bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
              >
                <Search className={cn( "w-4 h-4", isSearchActive && "text-[#0C8CE9] dark:text-blue-400" )} />
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="relative flex items-center"
                >
                  <input
                    type="search"
                    value={searchText}
                    placeholder="Try to close me"
                    className="w-[200px] h-7 px-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-none outline-none focus:outline-none text-sm"
                    onChange={( e ) => setSearchText( e.target.value )}
                  />
                  {isSearchActive && searchText.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchText( '' )}
                      className="absolute right-0 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
                <button
                  type="button"
                  onClick={() => setIsExpanded( false )}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ width: 'auto', opacity: 0.8 }}
                animate={{ width: 40, opacity: 1 }}
                exit={{ width: 'auto', opacity: 0 }}
                transition={{
                  width: { type: 'spring', stiffness: 400, damping: 25, mass: 0.5 },
                  opacity: { duration: 0.2 }
                }}
                type="button"
                onClick={() => setIsExpanded( true )}
                className="h-10 w-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors items-center justify-center flex"
              >
                <Search className={cn( "w-4 h-4", isSearchActive ? "text-zinc-900 dark:text-zinc-100" : "text-[#0C8CE9] dark:text-blue-400" )} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => showNotification( 'MousePointerClick' )}
          className="h-10 w-10 md:w-20 flex items-center justify-center gap-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="relative flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hidden md:block">
              Click!
            </span>
            <MousePointerClick className="w-4 h-4" />
          </div>
        </button>

        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

        <button
          type="button"
          onClick={() => showNotification( 'User' )}
          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src={avatarUrl}
              alt="User"
              width={24}
              height={24}
              className="rounded-full min-w-[24px] min-h-[24px] w-6 h-6"
            />
          </div>
        </button>
      </div>
    </div>
  )
}