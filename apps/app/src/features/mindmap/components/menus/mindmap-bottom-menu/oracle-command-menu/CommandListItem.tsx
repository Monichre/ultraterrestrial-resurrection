import {Command} from 'cmdk'
import type {CommandItem} from './OracleCommandMenu'

interface CommandListItemProps {
  command: CommandItem & {
    label?: string
    name?: string
    icon?: (() => JSX.Element) | null
    prefix?: string
  }
  onSelect: (id: string) => void
}

export const CommandListItem = ({command, onSelect}: CommandListItemProps) => {
  // Get display values with fallbacks
  const displayLabel = command.label || command.name || command.id
  const displayPrefix = command.prefix || `/${command.id}`

  const handleSelect = () => {
    // Pass the display label as the command ID for better UI display
    onSelect(displayLabel)
  }

  return (
    <Command.Item
      key={command.id}
      onSelect={handleSelect}
      className='px-3 py-2.5 flex items-center gap-3 text-sm hover:bg-white/10 cursor-pointer group'>
      <div className='w-6 h-6 flex items-center justify-center'>
        {command.icon && command.icon()}
      </div>
      <div className='flex flex-col'>
        <span className='font-medium text-black/70 dark:text-white/70'>{displayLabel}</span>
        <span className='text-xs text-black/50 dark:text-white/50'>{command.description}</span>
      </div>
      <span className='ml-auto text-xs text-black/30 dark:text-white/30'>{displayPrefix}</span>
    </Command.Item>
  )
}
