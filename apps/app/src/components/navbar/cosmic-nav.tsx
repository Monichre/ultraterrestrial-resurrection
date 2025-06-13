'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from '@clerk/nextjs'
import {Button} from '@/components/ui/button'
import {cn} from '@/utils'

interface UserData {
  publicMetadata?: {
    role?: string
  }
}

interface CosmicNavProps {
  className?: string
}

export function CosmicNav({className}: CosmicNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const {user} = useUser() as {user: UserData | null}

  const role = user?.publicMetadata?.role || 'guest'
  const isAdmin = role === 'admin'

  // Hide navigation on admin pages
  if (pathname === '/admin') {
    return null
  }

  const navigationItems = [
    {
      title: 'Explore',
      href: '/explore',
      subItems: [
        {title: 'Explore Home', href: '/explore'},
        {title: 'The State of Disclosure', href: '/explore/disclosure'},
        {title: 'Key Figures', href: '/explore/key-figures'},
        {title: '3D Interactive Timeline', href: '/explore/visualizations'},
        ...(isAdmin
          ? [
              {title: '3D Model Network Graph', href: '/explore/visualizations'},
              {title: '3D Grid', href: '/explore/visualizations/3d-grid'},
              {title: 'Drawing Board', href: '/explore/visualizations/drawing-board'},
              {title: 'Word Cloud', href: '/explore/visualizations/word-cloud'},
            ]
          : []),
      ],
    },
    {
      title: 'History',
      href: '/timeline',
      subItems: [
        {title: 'Timeline', href: '/timeline'},
        {title: 'Team', href: '/history/gallery'},
        {title: 'Historical Events', href: '/history/events'},
        ...(isAdmin ? [{title: 'Scroll Through 3D', href: '/history'}] : []),
      ],
    },
    {
      title: 'Sightings',
      href: '/sightings',
      subItems: [{title: 'UFO Sightings', href: '/sightings'}],
    },
  ]

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.6, delay: 0.3}}
      className={cn('fixed inset-0 z-50 pointer-events-none', className)}>
      {/* Top Left - Project Title */}
      <motion.div
        initial={{opacity: 0, x: -20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.6, delay: 0.5}}
        className='absolute top-6 left-6 pointer-events-auto'>
        <Link href='/' className='group'>
          <div className='backdrop-blur-md bg-black/20 border border-white/10 rounded-lg px-4 py-2 hover:bg-black/30 transition-all duration-300'>
            <span className='text-white/80 group-hover:text-white text-sm font-monumentMono tracking-wider'>
              ULTRATERRESTRIAL
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Top Right - Menu Button Only */}
      <motion.div
        initial={{opacity: 0, x: 20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.6, delay: 0.5}}
        className='absolute top-6 right-6 pointer-events-auto'>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='p-3 hover:bg-black/20 transition-all duration-300 group'>
          <div className='flex flex-col gap-1'>
            <motion.div
              style={{
                width: '20px',
                borderTop: '2px solid #fff',
                transformOrigin: 'center',
              }}
              initial={{translateY: '-3px'}}
              animate={
                isMenuOpen
                  ? {rotate: '45deg', translateY: '1px'}
                  : {translateY: '-3px', rotate: '0deg'}
              }
              transition={{bounce: 0, duration: 0.1}}
            />
            <motion.div
              transition={{bounce: 0, duration: 0.1}}
              style={{
                width: '20px',
                borderTop: '2px solid #fff',
                transformOrigin: 'center',
              }}
              initial={{translateY: '3px'}}
              animate={
                isMenuOpen
                  ? {rotate: '-45deg', translateY: '-1px'}
                  : {translateY: '3px', rotate: '0deg', scaleX: 1}
              }
            />
          </div>
        </button>
      </motion.div>

      {/* Bottom Left - Prometheus */}
      <motion.div
        initial={{opacity: 0, x: -20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.6, delay: 0.7}}
        className='absolute bottom-6 left-6 pointer-events-auto'>
        <div className='backdrop-blur-md bg-black/20 border border-white/10 rounded-lg px-4 py-2'>
          <div className='flex items-center gap-2'>
            <div
              className='w-2 h-2 rounded-full animate-pulse'
              style={{backgroundColor: '#adf0dd'}}
            />
            <span className='text-white/60 text-xs font-monumentMono tracking-wider'>
              PROMETHEUS
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Right - Status Indicator */}
      <motion.div
        initial={{opacity: 0, x: 20}}
        animate={{opacity: 1, x: 0}}
        transition={{duration: 0.6, delay: 0.7}}
        className='absolute bottom-6 right-6 pointer-events-auto'>
        <div className='backdrop-blur-md bg-black/20 border border-white/10 rounded-lg px-4 py-2'>
          <div className='flex items-center gap-2'>
            <div
              className='w-2 h-2 rounded-full animate-pulse'
              style={{backgroundColor: '#adf0dd'}}
            />
            <span className='text-white/60 text-xs font-monumentMono tracking-wider'>
              DIMENSIONAL RIFT IMMINENT
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className='fixed inset-0 backdrop-blur-xl bg-black/60 pointer-events-auto'
            onClick={() => setIsMenuOpen(false)}>
            <div className='flex items-center justify-center min-h-screen'>
              <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.8, opacity: 0}}
                transition={{duration: 0.3, delay: 0.1}}
                className='bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-6'
                onClick={(e) => e.stopPropagation()}>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                  {navigationItems.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{y: 20, opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      transition={{duration: 0.3, delay: 0.2 + index * 0.1}}
                      className='space-y-4'>
                      <h3 className='text-white font-monumentMono text-lg tracking-wider border-b border-white/20 pb-2'>
                        {section.title}
                      </h3>
                      <div className='space-y-2'>
                        {section.subItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className='block text-white/70 hover:text-white transition-colors duration-200 font-monumentMono text-sm tracking-wide'>
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Authentication Section */}
                  <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.3, delay: 0.2 + navigationItems.length * 0.1}}
                    className='space-y-4'>
                    <h3 className='text-white font-monumentMono text-lg tracking-wider border-b border-white/20 pb-2'>
                      Account
                    </h3>
                    <div className='space-y-2'>
                      <SignedOut>
                        <SignInButton>
                          <button
                            className='block text-white/70 hover:text-white transition-colors duration-200 font-monumentMono text-sm tracking-wide w-full text-left'
                            onClick={() => setIsMenuOpen(false)}>
                            SIGN IN
                          </button>
                        </SignInButton>
                      </SignedOut>
                      <SignedIn>
                        <div className='space-y-2'>
                          {isAdmin && (
                            <Link
                              href='/admin'
                              onClick={() => setIsMenuOpen(false)}
                              className='block text-white/70 hover:text-white transition-colors duration-200 font-monumentMono text-sm tracking-wide'>
                              Admin Portal
                            </Link>
                          )}
                          <div className='flex items-center gap-2 pt-2'>
                            <span className='text-white/70 font-monumentMono text-sm tracking-wide'>
                              Profile:
                            </span>
                            <UserButton />
                          </div>
                        </div>
                      </SignedIn>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Info */}
                <motion.div
                  initial={{y: 20, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{duration: 0.3, delay: 0.5}}
                  className='mt-8 pt-6 border-t border-white/20 text-center'>
                  <p className='text-white/50 font-monumentMono text-xs tracking-wider'>
                    BEYOND THE VEIL, ALL SIGNALS FADE
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
