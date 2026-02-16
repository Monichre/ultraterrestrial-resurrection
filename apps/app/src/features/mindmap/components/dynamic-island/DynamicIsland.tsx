'use client'
import Link from 'next/link'
import {
  MessageCircleIcon,
  FileTextIcon,
  SettingsIcon,
  BellIcon,
  ClockIcon,
  TrendingUpIcon,
  ZapIcon,
  ShieldIcon,
} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'
import {toast} from 'sonner'
import {useState} from 'react'

const items = [
  {
    title: 'Messages',
    description: 'Check your latest conversations',
    icon: MessageCircleIcon,
    badge: '3 new',
    color: 'bg-blue-800/20 text-blue-400 border-blue-700/40',
  },
  {
    title: 'Notifications',
    description: 'View recent alerts and updates',
    icon: BellIcon,
    badge: '12 new',
    color: 'bg-orange-800/20 text-orange-400 border-orange-700/40',
  },
  {
    title: 'Documents',
    description: 'Access and manage your files',
    icon: FileTextIcon,
    badge: 'Updated',
    color: 'bg-green-800/20 text-green-400 border-green-700/40',
  },
  {
    title: 'Settings',
    description: 'Customize your preferences',
    icon: SettingsIcon,
    badge: '',
    color: 'bg-purple-800/20 text-purple-400 border-purple-700/40',
  },
  {
    title: '24/7 Support',
    description: 'All time services provided',
    icon: ClockIcon,
    badge: 'Online',
    color: 'bg-emerald-800/20 text-emerald-400 border-emerald-700/40',
  },
]

const stats = [
  {label: 'Active Users', value: '2.4K', icon: TrendingUpIcon, change: '+12%'},
  {label: 'Performance', value: '99.9%', icon: ZapIcon, change: '+0.1%'},
  {label: 'Security Score', value: 'A+', icon: ShieldIcon, change: 'Stable'},
]

export default function Card() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <AnimatePresence>
        <motion.div
          exit={{
            opacity: 0,
            scale: 0.98,
          }}
          className='flex flex-col h-[40rem] border border-neutral-700 shadow-lg bg-neutral-900 p-6 rounded-xl transition-colors relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-transparent to-neutral-900/20 opacity-40' />

          {/* Header */}
          <div className='relative z-10'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <h2 className='text-[22px] font-bold text-white flex items-center gap-2'>
                  Nexui Components Library
                </h2>
                <p className='font-normal text-neutral-400'>
                  Enhanced card component inspired by{' '}
                  <Link
                    className='text-indigo-400 hover:underline transition-colors'
                    href={'https://clerk.com/'}>
                    Clerk
                  </Link>{' '}
                  with modern improvements
                </p>
              </div>

              <motion.button
                whileHover={{scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)'}}
                whileTap={{scale: 0.95}}
                onClick={() => setIsExpanded(!isExpanded)}
                className='p-2.5 rounded-xl border border-neutral-600 bg-neutral-800 hover:bg-white transition-all duration-200 shadow-sm'>
                <motion.div
                  animate={{rotate: isExpanded ? 180 : 0}}
                  transition={{type: 'spring', stiffness: 200, damping: 15}}
                  className='flex items-center justify-center w-5 h-5'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    className='text-white'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M4 6l4 4 4-4' />
                  </svg>
                </motion.div>
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className='relative z-10 grid grid-cols-3 gap-3 mt-4'>
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  whileHover={{scale: 1.02, y: -2}}
                  className='bg-neutral-800 rounded-lg p-3 border border-neutral-700/50'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Icon className='h-4 w-4 text-neutral-400' />
                    <span className='text-xs text-neutral-400'>{stat.label}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-white'>{stat.value}</span>
                    <span className='text-green-400 text-xs'>{stat.change}</span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* List container */}
          <div className='relative h-[380px] mt-4 rounded-xl border border-neutral-700/50 bg-neutral-800/50 transition-colors'>
            <motion.div
              initial={{opacity: 0, scale: 0.98, filter: 'blur(10px)'}}
              whileHover={{scale: 1.01, opacity: 1, filter: 'blur(0px)'}}
              transition={{duration: 0.3, ease: 'easeOut'}}
              className='relative w-full h-full rounded-xl border border-neutral-700 shadow-lg divide-y divide-neutral-700 bg-neutral-900/95 backdrop-blur-sm transition-colors'>
              <AnimatePresence>
                {items.map((item, i) => {
                  const Icon = item.icon
                  const isSelected = selectedItem === i
                  return (
                    <motion.div
                      key={i}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: i * 0.1}}
                      whileHover={{backgroundColor: 'rgba(255,255,255,0.05)'}}
                      onClick={() => {
                        setSelectedItem(isSelected ? null : i)
                        toast.success(`Selected: ${item.title}`)
                      }}
                      className={`flex items-center gap-3 px-4 py-[16px] cursor-pointer rounded-xl transition-all duration-300 ${
                        isSelected ? 'bg-neutral-700/50 shadow-md' : 'hover:bg-neutral-700/20'
                      }`}>
                      {/* Icon */}
                      <motion.div
                        whileHover={{rotate: 5, scale: 1.1}}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border shadow-inner transition-all ${item.color}`}>
                        <Icon className='h-5 w-5' />
                      </motion.div>

                      {/* Text */}
                      <div className='flex flex-col flex-1'>
                        <div className='text-sm font-medium text-white flex items-center gap-2'>
                          {item.title}
                          {item.badge && (
                            <motion.span
                              initial={{scale: 0}}
                              animate={{scale: 1}}
                              className='text-xs px-2 py-1 rounded-full bg-neutral-800/30 text-neutral-400 border border-neutral-700/50'>
                              {item.badge}
                            </motion.span>
                          )}
                        </div>
                        <div className='text-xs text-neutral-400'>{item.description}</div>
                      </div>

                      <motion.div
                        animate={{
                          scale: isSelected ? 1 : 0,
                          rotate: isSelected ? 0 : 180,
                        }}
                        className='w-2 h-2 rounded-full bg-neutral-400'
                      />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: isExpanded ? 1 : 0}}
            className='relative z-10 mt-4 p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50'>
            <div className='flex items-center justify-between text-xs text-neutral-400'>
              <span>Last updated: 2 minutes ago</span>
              <span className='flex items-center gap-1'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                Live
              </span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
