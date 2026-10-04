'use client'

import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {CommandCategory, CommandAction} from './types'

interface CommandPaletteStore {
  isOpen: boolean
  search: string
  selectedIndex: number
  activeCategory: CommandCategory | null
  recentCommands: string[]

  open: () => void
  close: () => void
  toggle: () => void
  setSearch: (search: string) => void
  setSelectedIndex: (index: number) => void
  setActiveCategory: (category: CommandCategory | null) => void
  addRecentCommand: (commandId: string) => void
  clearRecentCommands: () => void
  reset: () => void
}

const MAX_RECENT_COMMANDS = 5

export const useCommandPaletteStore = create<CommandPaletteStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      search: '',
      selectedIndex: 0,
      activeCategory: null,
      recentCommands: [],

      open: () => set({isOpen: true, search: '', selectedIndex: 0}),
      close: () => set({isOpen: false, search: '', selectedIndex: 0, activeCategory: null}),
      toggle: () => {
        const {isOpen} = get()
        if (isOpen) {
          set({isOpen: false, search: '', selectedIndex: 0, activeCategory: null})
        } else {
          set({isOpen: true, search: '', selectedIndex: 0})
        }
      },

      setSearch: (search) => set({search, selectedIndex: 0}),
      setSelectedIndex: (selectedIndex) => set({selectedIndex}),
      setActiveCategory: (activeCategory) => set({activeCategory, selectedIndex: 0}),

      addRecentCommand: (commandId) => {
        const {recentCommands} = get()
        const filtered = recentCommands.filter((id) => id !== commandId)
        const updated = [commandId, ...filtered].slice(0, MAX_RECENT_COMMANDS)
        set({recentCommands: updated})
      },

      clearRecentCommands: () => set({recentCommands: []}),

      reset: () =>
        set({
          isOpen: false,
          search: '',
          selectedIndex: 0,
          activeCategory: null,
        }),
    }),
    {
      name: 'command-palette-storage',
      partialize: (state) => ({
        recentCommands: state.recentCommands,
      }),
    }
  )
)
