import type React from 'react'
import {useState, useRef, useEffect, KeyboardEvent} from 'react'
import {SendIcon, Sparkles, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import type {CommandOption} from '../../types'
import {COMMANDS} from '../oracle-menu/commands'
import {cn} from '@/lib/utils'

export interface OracleInputProps {
  onSubmit: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  disabled?: boolean
  commandMenuOpen: boolean
  setCommandMenuOpen: (open: boolean) => void
  activeCommand: CommandOption | null
  setActiveCommand: (command: CommandOption | null) => void
  onCommand: (value: string) => void
  isLoading?: boolean
}

export const OracleInput = ({
  onSubmit,
  placeholder = 'Ask a question or type / for commands...',
  autoFocus = false,
  className,
  disabled = false,
  commandMenuOpen,
  setCommandMenuOpen,
  activeCommand,
  setActiveCommand,
  onCommand,
  isLoading = false,
}: OracleInputProps) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || disabled || isLoading) return

    onSubmit(value)
    setValue('')
    setActiveCommand(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setActiveCommand(null)
      setValue('')
      return
    }

    if (e.key === '/') {
      if (value === '') {
        e.preventDefault()
        setCommandMenuOpen(true)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (newValue.startsWith('/')) {
      const commandText = newValue.substring(1).split(' ')[0].toLowerCase()

      if (commandText) {
        const matchedCommand = COMMANDS.find((cmd) =>
          cmd.value.toLowerCase().startsWith(commandText)
        )

        if (matchedCommand) {
          setActiveCommand(matchedCommand)
        } else {
          setActiveCommand(null)
        }
      } else {
        setCommandMenuOpen(true)
      }
    } else {
      setActiveCommand(null)
    }
  }

  const clearInput = () => {
    setValue('')
    setActiveCommand(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center space-x-2', className)}>
      <div className='relative flex-1'>
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className='pr-10'
        />
        {value && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={clearInput}
            disabled={disabled || isLoading}>
            <X className='h-4 w-4' />
            <span className='sr-only'>Clear input</span>
          </Button>
        )}
      </div>
      <Button type='submit' size='icon' disabled={!value.trim() || disabled || isLoading}>
        {activeCommand ? <Sparkles className='h-4 w-4' /> : <SendIcon className='h-4 w-4' />}
        <span className='sr-only'>Send message</span>
      </Button>
    </form>
  )
}
