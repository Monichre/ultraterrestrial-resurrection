'use client'

import {cn} from '@/utils/index'
import {ScrollArea} from '@/components/ui/scroll-area'
import {motion} from 'framer-motion'
import {Badge} from '@/components/ui/badge'
import {
  Blocks,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  UserCircle,
  UserCog,
  UserSearch,
} from 'lucide-react'
import Image from 'next/image'
import {Avatar, AvatarFallback} from '@/components/ui/avatar'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Separator} from '@/components/ui/separator'
import {Skeleton} from '@/components/ui/skeleton'
import {CaretSortIcon, PlusIcon, GearIcon} from '@radix-ui/react-icons'

const sidebarVariants = {
  open: {
    width: '20rem',
  },
  closed: {
    width: '3.15rem',
  },
}

const contentVariants = {
  open: {display: 'block', opacity: 1},
  closed: {display: 'block', opacity: 1},
}

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: {stiffness: 1000, velocity: -100},
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: {stiffness: 100},
    },
  },
}

const transitionProps = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
  staggerChildren: 0.1,
}

const staggerVariants = {
  open: {
    transition: {staggerChildren: 0.03, delayChildren: 0.02},
  },
}

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()
  return (
    <motion.div
      className={cn('sidebar fixed left-0 z-50 h-full shrink-0 border-r border-gray-800 border-1')}
      initial={isCollapsed ? 'closed' : 'open'}
      animate={isCollapsed ? 'closed' : 'open'}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}>
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-black transition-all`}
        variants={contentVariants}>
        <motion.ul variants={staggerVariants} className='flex h-full flex-col'>
          <div className='flex grow flex-col items-center'>
            <div className='flex h-full w-full flex-col'>
              <div className='flex grow flex-col gap-4'>
                <ScrollArea className='h-16 grow p-2'>
                  <div className={cn('flex w-full flex-col gap-1')}>
                    <Link
                      href='/dashboard'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5  transition hover:bg-gray-800 hover:text-gray-50',
                        pathname?.includes('dashboard') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <LayoutDashboard className='h-4 w-4' />
                      {''}
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Dashboard</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href='/reports'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hovhover:bg-gray-800 dark:hover:text-gray-50',

                        pathname?.includes('reports') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <FileClock className='h-4 w-4' />
                      {''}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className='flex items-center gap-2'>
                            <p className='ml-2 text-sm font-medium'>Jobs</p>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href='/chat'
                      className={cn(
                        'flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                        pathname?.includes('chat') && 'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <MessagesSquare className='h-4 w-4' />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className='ml-2 flex items-center  gap-2'>
                            <p className='text-sm font-medium'>Chat</p>
                            <Badge
                              className={cn(
                                'flex h-fit w-fit items-center gap-1.5 rounded border-none bg-blue-50 px-1.5 text-blue-600 dark:bg-blue-700 dark:text-blue-300'
                              )}
                              variant='outline'>
                              BETA
                            </Badge>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    <Separator className='w-full' />

                    <Link
                      href='/library/knowledge'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5  transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',

                        pathname?.includes('library') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <GraduationCap className='h-4 w-4' />
                      {''}
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Knowledge Base</p>}
                      </motion.li>
                    </Link>

                    <Link
                      href='/review'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5  transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',

                        pathname?.includes('review') && 'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <FileClock className='h-4 w-4' />
                      {''}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className='ml-2 text-sm font-medium'>Document Review</p>
                        )}
                      </motion.li>
                    </Link>
                    <Separator className='w-full' />
                    {/* Admin Agents Section */}
                    {!isCollapsed && (
                      <div className='px-2 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase'>
                        Admin Agents
                      </div>
                    )}
                    <Link
                      href='/admin/agents'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                        pathname?.includes('/admin/agents') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <Blocks className='h-4 w-4' />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Agents Home</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href='/admin/agents/extraction'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                        pathname?.includes('/admin/agents/extraction') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <Blocks className='h-4 w-4' />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Extraction</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href='/admin/agents/patterns'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                        pathname?.includes('/admin/agents/patterns') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <Blocks className='h-4 w-4' />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Patterns</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href='/admin/agents/processing'
                      className={cn(
                        'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                        pathname?.includes('/admin/agents/processing') &&
                          'bg-gray-100 text-blue-600 dark:bg-gray-800'
                      )}>
                      <Blocks className='h-4 w-4' />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className='ml-2 text-sm font-medium'>Processing</p>}
                      </motion.li>
                    </Link>
                    <Separator className='w-full' />
                    {/* Zeta Tables Section */}
                    {!isCollapsed && (
                      <div className='px-2 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase'>
                        Zeta Tables
                      </div>
                    )}
                    {[
                      {name: 'topics', label: 'Topics'},
                      {name: 'personnel', label: 'Personnel'},
                      {name: 'events', label: 'Events'},
                      {name: 'organizations', label: 'Organizations'},
                      {name: 'sightings', label: 'Sightings'},
                      {name: 'event-subject-matter-experts', label: 'Event Subject Matter Experts'},
                      {name: 'topic-subject-matter-experts', label: 'Topic Subject Matter Experts'},
                      {name: 'organization-members', label: 'Organization Members'},
                      {name: 'testimonies', label: 'Testimonies'},
                      {name: 'topics-testimonies', label: 'Topics Testimonies'},
                      {name: 'documents', label: 'Documents'},
                      {name: 'locations', label: 'Locations'},
                      {
                        name: 'event-topic-subject-matter-experts',
                        label: 'Event Topic Subject Matter Experts',
                      },
                      {name: 'tags', label: 'Tags'},
                      {name: 'theories', label: 'Theories'},
                      {name: 'mindmaps', label: 'Mindmaps'},
                      {name: 'artifacts', label: 'Artifacts'},
                      {name: 'case-files', label: 'Case Files'},
                      {name: 'key-personnel', label: 'Key Personnel'},
                    ].map(({name, label}) => (
                      <Link
                        key={name}
                        href={`/admin/${name}`}
                        className={cn(
                          'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                          pathname?.includes(`/admin/${name}`) &&
                            'bg-gray-100 text-blue-600 dark:bg-gray-800'
                        )}>
                        <Blocks className='h-4 w-4' />
                        <motion.li variants={variants}>
                          {!isCollapsed && <p className='ml-2 text-sm font-medium'>{label}</p>}
                        </motion.li>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div className='flex flex-col p-2'>
                <Link
                  href='/settings/integrations'
                  className='mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5  transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'>
                  <GearIcon className='h-4 w-4 shrink-0' />
                  {''}
                  <motion.li variants={variants}>
                    {!isCollapsed && <p className='ml-2 text-sm font-medium'> Settings</p>}
                  </motion.li>
                </Link>
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className='w-full'>
                      <div className='flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5  transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'>
                        <Avatar className='size-4'>
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <motion.li variants={variants} className='flex w-full items-center gap-2'>
                          {!isCollapsed && (
                            <>
                              <p className='text-sm font-medium'>Account</p>
                              <CaretSortIcon className='ml-auto h-4 w-4 text-gray-500/50 dark:text-gray-400/50' />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5}>
                      <div className='flex flex-row items-center gap-2 p-2'>
                        <Avatar className='size-6'>
                          <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col text-left'>
                          <span className='text-sm font-medium'>{`Andrew Luo`}</span>
                          <span className='line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                            {`andrew@usehindsight.com`}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className='flex items-center gap-2'>
                        <Link href='/settings/profile'>
                          <UserCircle className='h-4 w-4' /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center gap-2'>
                        <LogOut className='h-4 w-4' /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}
