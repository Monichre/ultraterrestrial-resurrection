'use client'
import { cn } from '@/utils/cn'
import Link, { LinkProps } from 'next/link'
import React, { useState, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon as CloseIcon, MenuIcon } from 'lucide-react'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppSidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
)

export const useAppSidebar = () => {
  const context = useContext( AppSidebarContext )
  if ( !context ) {
    throw new Error( 'useSidebar must be used within a SidebarProvider' )
  }
  return context
}

export const AppSidebarProvider = ( {
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
} ) => {
  const [openState, setOpenState] = useState( false )
  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <AppSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </AppSidebarContext.Provider>
  )
}

export const AppSidebar = ( {
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
} ) => {
  return (
    <AppSidebarProvider open={open} setOpen={setOpen}>
      {children}
    </AppSidebarProvider>
  )
}

export const AppSidebarBody = (
  props: React.ComponentProps<typeof motion.div>
) => {
  const { open, setOpen } = useAppSidebar()
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...( props as React.ComponentProps<'div'> )} />
    </>
  )
}

export const DesktopSidebar = ( {
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> ) => {
  const { open, setOpen } = useAppSidebar()
  return (
    <>
      <motion.div
        className={cn(
          'h-full px-4 py-4 hidden md:flex md:flex-col bg-[#000] opacity-none w-[300px] flex-shrink-0',
          className
        )}
        animate={{
          width: open ? '300px' : '60px',
        }}
        onMouseEnter={() => setOpen( true )}
        onMouseLeave={() => setOpen( false )}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

export const MobileSidebar = ( {
  className,
  children,
  ...props
}: React.ComponentProps<'div'> ) => {
  const { open, setOpen } = useAppSidebar()
  return (
    <>
      <div
        className={cn(
          'h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full'
        )}
        {...props}
      >
        <div className='flex justify-end z-20 w-full'>
          <MenuIcon
            className='text-neutral-800 dark:text-neutral-200'
            onClick={() => setOpen( !open )}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between',
                className
              )}
            >
              <div
                className='absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200'
                onClick={() => setOpen( !open )}
              >
                <CloseIcon />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export const AppSidebarLink = ( {
  label,
  className,
  icon,
  onClick,
  ...props
}: any ) => {
  const { open } = useAppSidebar()
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-2  group/sidebar py-2 pointer cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon}

      <motion.span
        animate={{
          display: open ? 'inline-block' : 'none',
          opacity: open ? 1 : 0,
        }}
        className='text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'
      >
        {label}
      </motion.span>
    </div>
  )
}
