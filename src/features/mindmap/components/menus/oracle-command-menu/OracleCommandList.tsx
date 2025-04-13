import {Command} from 'cmdk'
import {AnimatePresence, motion} from 'framer-motion'
import {useState, useEffect} from 'react'
import {CommandListItem} from './CommandListItem'

// Define command types that can be passed to this component
export type CommandItem = {
  id: string
  label?: string
  name?: string
  description: string
  icon?: () => JSX.Element
  prefix?: string
}

interface OracleCommandListProps {
  isOpen: boolean
  activeCommand: string | null
  commands: ReadonlyArray<CommandItem> // Original full list of commands
  handleCommandSelect: (commandId: string) => void
  inputValue?: string
  setInputValue?: (value: string) => void
  handleKeyDown?: (e: React.KeyboardEvent) => void
}

export const OracleCommandList = ({
  isOpen,
  activeCommand,
  commands,
  handleCommandSelect,
  inputValue = '',
  setInputValue,
  handleKeyDown,
}: OracleCommandListProps) => {
  // Internal state for filtered commands
  const [filteredCommands, setFilteredCommands] = useState<ReadonlyArray<CommandItem>>(commands)

  // Filter commands based on input value
  useEffect(() => {
    if (inputValue.startsWith('/')) {
      const searchTerm = inputValue.slice(1).toLowerCase()
      const filtered = commands.filter(
        (command) =>
          (command.name?.toLowerCase() || '').includes(searchTerm) ||
          (command.label?.toLowerCase() || '').includes(searchTerm) ||
          command.id.toLowerCase().includes(searchTerm) ||
          (command.prefix?.toLowerCase() || '').includes(searchTerm)
      )
      setFilteredCommands(filtered)
    } else {
      setFilteredCommands(commands)
    }
  }, [inputValue, commands])

  // Function to handle command selection
  const handleItemSelect = (command: CommandItem) => {
    // Clear input when selecting a command
    if (setInputValue) {
      setInputValue('')
    }

    // Use the original ID format if possible for display purposes
    // This ensures commands like "Search" retain their capitalization instead of "search"
    const displayId = command.label || command.name || command.id

    // Call the parent handler with the proper ID
    handleCommandSelect(displayId)
  }

  // Determine if we should show the input-specific style
  const useInputStyle = Boolean(inputValue && inputValue.startsWith('/'))

  // Skip rendering if not open or if a command is already active
  if (!isOpen || activeCommand) {
    return null
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 8}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: 8}}
      transition={{duration: 0.15}}
      className={`absolute ${useInputStyle ? 'bottom-full mb-2' : 'bottom-0'} left-0 w-full h-auto z-40 flex justify-center items-center`}>
      <div
        className={`
          rounded-lg shadow-lg 
          ${
            useInputStyle
              ? 'w-full max-h-[200px] overflow-y-auto bg-neutral-900'
              : 'w-[444px] h-[400px] mt-2'
          } 
          rounded-lg border border-neutral-700/30 text-neutral-500 
          bg-black bg-gradient-to-b from-black relative rounded-tl-lg rounded-tr-lg
        `}>
        {useInputStyle ? (
          // Input-style dropdown (more compact)
          <div className='w-full'>
            {filteredCommands.map((command) => (
              <div
                key={command.id}
                className='flex flex-col p-2 hover:bg-neutral-800 cursor-pointer'
                onClick={() => handleItemSelect(command)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleItemSelect(command)
                  }
                }}
                role='button'
                tabIndex={0}>
                <div className='font-medium text-zinc-200'>
                  {command.name || command.label || command.id}
                </div>
                <div className='text-xs text-zinc-400'>{command.description}</div>
              </div>
            ))}
          </div>
        ) : (
          // Original CommandList style (fuller interface)
          <Command className='w-full'>
            <Command.List className=''>
              {filteredCommands.map((command) => (
                <CommandListItem
                  key={command.id}
                  command={{
                    id: command.id,
                    label: command.label || command.name || command.id,
                    description: command.description,
                    // Fix the typing issue with icon
                    icon: command.icon || (() => null),
                    prefix: command.prefix || `/${command.id}`,
                  }}
                  onSelect={handleCommandSelect}
                />
              ))}
            </Command.List>
          </Command>
        )}
      </div>
    </motion.div>
  )
}
