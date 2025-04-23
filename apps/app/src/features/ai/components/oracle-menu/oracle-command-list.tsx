import React from 'react'
import {ChevronRightIcon} from 'lucide-react'
import {cn} from '@/lib/utils'
import type {CommandOption} from '../../types'

interface OracleCommandListProps {
  commandOptions: CommandOption[]
  commandMenuOpen: boolean
  onCommand: (command: string) => void
  setInput: (input: string) => void
  setActiveCommand: (command: CommandOption | null) => void
  setCommandMenuOpen: (open: boolean) => void
  className?: string
}

export const OracleCommandList = ({
  commandOptions,
  commandMenuOpen,
  onCommand,
  setInput,
  setActiveCommand,
  setCommandMenuOpen,
  className,
}: OracleCommandListProps) => {
  if (!commandMenuOpen) return null

  return (
    <div
      className={cn(
        'absolute bottom-full left-0 right-0 mb-2 w-full overflow-hidden rounded-lg border border-muted-foreground/20 bg-background/95 shadow-md backdrop-blur-sm',
        className
      )}>
      <div className='max-h-60 overflow-y-auto p-2'>
        <div className='text-xs font-medium text-muted-foreground px-2 py-1.5'>Commands</div>
        <div className='space-y-1'>
          {commandOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (option.action === 'command') {
                  onCommand(option.value)
                  setCommandMenuOpen(false)
                } else {
                  setInput(`/${option.value} `)
                  setActiveCommand(option)
                  setCommandMenuOpen(false)
                }
              }}
              className='group relative flex w-full cursor-pointer items-center rounded-md py-1.5 pl-2 pr-8 text-sm text-muted-foreground outline-none hover:bg-muted hover:text-primary'>
              <span className='mr-2 flex h-5 w-5 items-center justify-center rounded bg-muted-foreground/10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'>
                {option.icon}
              </span>
              <span className='font-medium'>{option.label}</span>
              <span className='absolute right-2 text-muted-foreground group-hover:text-primary'>
                <ChevronRightIcon className='h-4 w-4' />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
