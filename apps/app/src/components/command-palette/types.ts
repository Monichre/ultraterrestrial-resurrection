import type {ReactNode} from 'react'

export type CommandCategory =
  | 'navigation'
  | 'search'
  | 'actions'
  | 'ai'
  | 'tours'
  | 'settings'
  | 'recent'

export interface CommandAction {
  id: string
  label: string
  description?: string
  icon?: ReactNode | (() => ReactNode)
  shortcut?: string[]
  category: CommandCategory
  keywords?: string[]
  onSelect: () => void | Promise<void>
  disabled?: boolean
  hidden?: boolean
}

export interface CommandGroup {
  id: CommandCategory
  label: string
  priority: number
}

export interface CommandPaletteState {
  isOpen: boolean
  search: string
  selectedIndex: number
  activeCategory: CommandCategory | null
  recentCommands: string[]
}

export interface CommandPaletteActions {
  open: () => void
  close: () => void
  toggle: () => void
  setSearch: (search: string) => void
  setSelectedIndex: (index: number) => void
  setActiveCategory: (category: CommandCategory | null) => void
  addRecentCommand: (commandId: string) => void
  executeCommand: (command: CommandAction) => Promise<void>
}

export const COMMAND_GROUPS: CommandGroup[] = [
  {id: 'recent', label: 'Recent', priority: 0},
  {id: 'navigation', label: 'Navigation', priority: 1},
  {id: 'search', label: 'Search', priority: 2},
  {id: 'ai', label: 'AI & Research', priority: 3},
  {id: 'tours', label: 'Guided Tours', priority: 4},
  {id: 'actions', label: 'Actions', priority: 5},
  {id: 'settings', label: 'Settings', priority: 6},
]
