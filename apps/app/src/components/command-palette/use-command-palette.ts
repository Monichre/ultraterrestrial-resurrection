'use client'

import {useEffect, useCallback, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import {useCommandPaletteStore} from './command-palette-store'
import type {CommandAction, CommandCategory, CommandGroup} from './types'
import {COMMAND_GROUPS} from './types'

interface UseCommandPaletteOptions {
  commands?: CommandAction[]
  enableKeyboardShortcut?: boolean
}

export function useCommandPalette(options: UseCommandPaletteOptions = {}) {
  const {commands = [], enableKeyboardShortcut = true} = options
  const router = useRouter()

  const {
    isOpen,
    search,
    selectedIndex,
    activeCategory,
    recentCommands,
    open,
    close,
    toggle,
    setSearch,
    setSelectedIndex,
    setActiveCategory,
    addRecentCommand,
  } = useCommandPaletteStore()

  // Filter commands based on search and category
  const filteredCommands = useMemo(() => {
    let filtered = commands.filter((cmd) => !cmd.hidden && !cmd.disabled)

    // Filter by category if active
    if (activeCategory) {
      filtered = filtered.filter((cmd) => cmd.category === activeCategory)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((cmd) => {
        const labelMatch = cmd.label.toLowerCase().includes(searchLower)
        const descMatch = cmd.description?.toLowerCase().includes(searchLower)
        const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
        return labelMatch || descMatch || keywordMatch
      })
    }

    return filtered
  }, [commands, search, activeCategory])

  // Group filtered commands
  const groupedCommands = useMemo(() => {
    const groups: Record<CommandCategory, CommandAction[]> = {
      recent: [],
      navigation: [],
      search: [],
      ai: [],
      tours: [],
      actions: [],
      settings: [],
    }

    // Add recent commands first if no search
    if (!search && !activeCategory && recentCommands.length > 0) {
      const recentActions = recentCommands
        .map((id) => commands.find((cmd) => cmd.id === id))
        .filter((cmd): cmd is CommandAction => !!cmd && !cmd.hidden && !cmd.disabled)
      groups.recent = recentActions
    }

    // Group remaining commands
    filteredCommands.forEach((cmd) => {
      if (!groups.recent.some((r) => r.id === cmd.id)) {
        groups[cmd.category].push(cmd)
      }
    })

    // Return only non-empty groups, sorted by priority
    return COMMAND_GROUPS.filter((group) => groups[group.id].length > 0).map((group) => ({
      ...group,
      commands: groups[group.id],
    }))
  }, [filteredCommands, recentCommands, commands, search, activeCategory])

  // Flatten for keyboard navigation
  const flatCommands = useMemo(() => {
    return groupedCommands.flatMap((group) => group.commands)
  }, [groupedCommands])

  // Execute selected command
  const executeCommand = useCallback(
    async (command: CommandAction) => {
      addRecentCommand(command.id)
      close()
      await command.onSelect()
    },
    [addRecentCommand, close]
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(Math.min(selectedIndex + 1, flatCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(Math.max(selectedIndex - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            executeCommand(flatCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          if (activeCategory) {
            setActiveCategory(null)
          } else {
            close()
          }
          break
        case 'Backspace':
          if (!search && activeCategory) {
            e.preventDefault()
            setActiveCategory(null)
          }
          break
      }
    },
    [
      isOpen,
      selectedIndex,
      flatCommands,
      activeCategory,
      search,
      setSelectedIndex,
      executeCommand,
      setActiveCategory,
      close,
    ]
  )

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    if (!enableKeyboardShortcut) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [enableKeyboardShortcut, toggle])

  // Navigation keyboard handling when open
  useEffect(() => {
    if (!isOpen) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  return {
    isOpen,
    search,
    selectedIndex,
    activeCategory,
    recentCommands,
    filteredCommands,
    groupedCommands,
    flatCommands,

    open,
    close,
    toggle,
    setSearch,
    setSelectedIndex,
    setActiveCategory,
    executeCommand,
  }
}
