'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip/tooltip'
import { cn } from '@/utils'
import type { Message } from 'ai'
import { MoreHorizontal, SquarePen } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  links: {
    name: string
    messages: Message[]
    avatar: string
    variant: 'grey' | 'ghost'
  }[]
  onClick?: () => void
  isMobile: boolean
}

export function ChatSidebar( { links, isCollapsed, isMobile }: SidebarProps ) {
  return (
    <div
      data-collapsed={isCollapsed}
      className='relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 '
    >
      {!isCollapsed && (
        <div className='flex justify-between p-2 items-center'>
          <div className='flex gap-2 items-center text-2xl'>
            <p className='font-medium'>Chats</p>
            <span className='text-zinc-300'>({links.length})</span>
          </div>

          <div>
            <Button variant='ghost' className={cn( 'h-9 w-9' )}>
              <MoreHorizontal size={20} />
            </Button>

            <Button variant='ghost' className={cn( 'h-9 w-9' )}>
              <SquarePen size={20} />
            </Button>
          </div>
        </div>
      )}
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map( ( link, index ) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    className={cn(
                      'h-11 w-11 md:h-16 md:w-16',
                      link.variant === 'grey' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                    )}
                  >
                    <Avatar className='flex justify-center items-center'>
                      <AvatarImage
                        src={link.avatar}
                        alt={link.avatar}
                        width={6}
                        height={6}
                        className='w-10 h-10 '
                      />
                    </Avatar>{' '}
                    <span className='sr-only'>{link.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='right'
                  className='flex items-center gap-4'
                >
                  {link.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              key={index}
              className={cn(
                'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink',
                'justify-start gap-4'
              )}
            >
              <Avatar className='flex justify-center items-center'>
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  width={6}
                  height={6}
                  className='w-10 h-10 '
                />
              </Avatar>
              <div className='flex flex-col max-w-28'>
                <span>{link.name}</span>
                {link?.messages?.length > 0 && (
                  <span className='text-zinc-300 text-xs truncate '>
                    {
                      link?.messages[link?.messages?.length - 1]?.name?.split(
                        ' '
                      )[0]
                    }
                    {/* @ts-ignore */}:{' '}
                    {link?.messages[link.messages.length - 1]?.message}
                  </span>
                )}
              </div>
            </Button>
          )
        )}
      </nav>
    </div>
  )
}
