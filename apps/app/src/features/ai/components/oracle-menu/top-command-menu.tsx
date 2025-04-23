import React, {useEffect} from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {COMMANDS} from './commands'
import type {CommandOption} from '../../types'
import {cn} from '@/lib/utils'
import {useRandomColor} from '@/hooks/useRandomColor'
import {hashStringToNumber} from '@/utils/hash'

export interface TopCommandMenuProps {
  commandMenuOpen: boolean
  setCommandMenuOpen: (open: boolean) => void
  onCommand: (command: string) => void
  activeCommand: CommandOption | null
  userNameColors?: Record<string, string>
  isLoading?: boolean
  hasContent?: boolean
}

export function TopCommandMenu({
  commandMenuOpen,
  setCommandMenuOpen,
  onCommand,
  activeCommand,
  userNameColors = {},
  isLoading = false,
  hasContent = false,
}: TopCommandMenuProps) {
  const getRandomColor = useRandomColor()

  const toggleCommandMenu = () => {
    setCommandMenuOpen(!commandMenuOpen)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isLoading) {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault()
          toggleCommandMenu()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [commandMenuOpen, isLoading])

  const handleSelect = (value: string) => {
    onCommand(value)
    setCommandMenuOpen(false)
  }

  return (
    <Command className='rounded-lg border shadow-md w-full max-w-2xl mx-auto' shouldFilter={true}>
      <CommandInput placeholder='Type a command or search...' className='rounded-t-lg' />
      {commandMenuOpen && (
        <CommandList className='h-auto max-h-[300px]'>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading='Commands'>
            {COMMANDS.map((command) => {
              const userColor = command.userName
                ? userNameColors[command.userName] ||
                  getRandomColor(hashStringToNumber(command.userName))
                : undefined

              return (
                <CommandItem
                  key={command.value}
                  value={command.value}
                  onSelect={handleSelect}
                  className={cn(
                    'flex items-center px-2 py-1.5',
                    activeCommand?.value === command.value && 'bg-accent'
                  )}>
                  {command.icon && (
                    <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                      {command.icon}
                    </div>
                  )}
                  <div className='flex-1'>
                    <div className='flex items-center'>
                      <span className='font-medium'>{command.label}</span>
                      {command.userName && (
                        <span
                          className='ml-2 text-xs px-1.5 py-0.5 rounded'
                          style={{backgroundColor: userColor, color: '#fff'}}>
                          @{command.userName}
                        </span>
                      )}
                    </div>
                    {command.description && (
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {command.description}
                      </p>
                    )}
                  </div>
                  {command.shortcut && (
                    <span className='text-xs text-muted-foreground ml-2'>{command.shortcut}</span>
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  )
}
