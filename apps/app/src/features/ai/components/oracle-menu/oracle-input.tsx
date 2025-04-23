import type React from 'react'
import {useRef, useState, useEffect} from 'react'
import {SendHorizontalIcon, PlusCircleIcon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'
import {useIsTablet} from '@/hooks/use-is-tablet'
import {cn} from '@/lib/utils'
import {COMMANDS} from '../../constants/commands'
import type {CommandOption} from '../../types'
import {OracleCommandList} from './oracle-command-list'
import {TopCommandMenu} from './top-command-menu'

export interface OracleInputProps {
  onSendMessage: (message: string, command?: CommandOption) => void
  className?: string
}

export const OracleInput = ({onSendMessage, className}: OracleInputProps) => {
  const [input, setInput] = useState('')
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [commandMode, setCommandMode] = useState(false)
  const [activeCommand, setActiveCommand] = useState<CommandOption | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isTablet = useIsTablet()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const updateInput = (value: string) => {
    setInput(value)
    if (value.startsWith('/')) {
      setCommandMode(true)
      setCommandMenuOpen(true)
    } else {
      setCommandMode(false)
      setCommandMenuOpen(false)
      setActiveCommand(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    onSendMessage(input, activeCommand)
    setInput('')
    setCommandMode(false)
    setCommandMenuOpen(false)
    setActiveCommand(null)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleCommand = (commandValue: string) => {
    const command = COMMANDS.find((cmd) => cmd.value === commandValue)
    if (command) {
      setActiveCommand(command)
      updateInput(`/${command.value} `)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* {isTablet ? (
        <TopCommandMenu
          commandOptions={COMMANDS}
          commandMenuOpen={commandMenuOpen}
          setCommandMenuOpen={setCommandMenuOpen}
          onCommand={handleCommand}
          setInput={setInput}
          setActiveCommand={setActiveCommand}
        />
      ) : (
        <OracleCommandList
          commandMode={commandMode}
          input={input}
          onSelectCommand={(command) => {
            setActiveCommand(command)
            updateInput(`/${command.value} `)
            inputRef.current?.focus()
          }}
        />
      )} */}

      <div className='relative flex items-center'>
        <Textarea
          ref={inputRef}
          placeholder='Ask a question or type / for commands...'
          className='min-h-[60px] max-h-[200px] resize-none rounded-lg border border-muted-foreground/20 bg-background/80 pr-16 py-3 shadow-sm backdrop-blur-sm placeholder:text-muted-foreground/50'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className='absolute right-2 bottom-3 flex items-center gap-1'>
          <Button
            type='button'
            size='icon'
            className='h-8 w-8 rounded-full bg-primary/80 hover:bg-primary'
            onClick={() => setCommandMenuOpen(!commandMenuOpen)}>
            <PlusCircleIcon className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            size='icon'
            className='h-8 w-8 rounded-full bg-primary/80 hover:bg-primary'
            onClick={handleSendMessage}>
            <SendHorizontalIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
