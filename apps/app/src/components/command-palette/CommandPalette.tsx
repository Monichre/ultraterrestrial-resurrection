'use client'

import {useEffect, useRef, useCallback} from 'react'
import {Command} from 'cmdk'
import {AnimatePresence, motion} from 'framer-motion'
import {Search, Command as CommandIcon, CornerDownLeft} from 'lucide-react'
import {cn} from '@/utils'
import {useCommandPalette} from './use-command-palette'
import type {CommandAction, CommandCategory} from './types'
import {COMMAND_GROUPS} from './types'

interface CommandPaletteProps {
  commands: CommandAction[]
  className?: string
}

export function CommandPalette({commands, className}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const {
    isOpen,
    search,
    selectedIndex,
    activeCategory,
    groupedCommands,
    flatCommands,
    close,
    setSearch,
    setSelectedIndex,
    setActiveCategory,
    executeCommand,
  } = useCommandPalette({commands})

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && flatCommands[selectedIndex]) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      selectedElement?.scrollIntoView({block: 'nearest'})
    }
  }, [selectedIndex, flatCommands])

  const handleSelect = useCallback(
    (command: CommandAction) => {
      executeCommand(command)
    },
    [executeCommand]
  )

  const renderShortcut = (shortcut?: string[]) => {
    if (!shortcut || shortcut.length === 0) return null
    return (
      <div className="flex items-center gap-1 ml-auto">
        {shortcut.map((key, i) => (
          <kbd
            key={i}
            className="px-1.5 py-0.5 text-[10px] font-medium bg-neutral-800 border border-neutral-700 rounded text-neutral-400">
            {key === 'Cmd' ? '⌘' : key}
          </kbd>
        ))}
      </div>
    )
  }

  let globalIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.15}}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: -20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: -20}}
            transition={{duration: 0.15, ease: 'easeOut'}}
            className={cn(
              'fixed left-1/2 top-[20%] z-50 w-full max-w-[640px] -translate-x-1/2',
              'bg-neutral-900/95 border border-neutral-700/50 rounded-xl shadow-2xl',
              'overflow-hidden backdrop-blur-xl',
              className
            )}>
            <Command
              className="flex flex-col"
              shouldFilter={false}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault()
                  if (activeCategory) {
                    setActiveCategory(null)
                  } else {
                    close()
                  }
                }
              }}>
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
                <Search size={18} className="text-neutral-500 shrink-0" />
                <Command.Input
                  ref={inputRef}
                  value={search}
                  onValueChange={setSearch}
                  placeholder={
                    activeCategory
                      ? `Search ${COMMAND_GROUPS.find((g) => g.id === activeCategory)?.label}...`
                      : 'Type a command or search...'
                  }
                  className="flex-1 bg-transparent text-neutral-100 text-sm placeholder:text-neutral-500 outline-none"
                />
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="px-2 py-0.5 text-xs bg-neutral-800 text-neutral-400 rounded hover:bg-neutral-700 transition-colors">
                    {COMMAND_GROUPS.find((g) => g.id === activeCategory)?.label} ×
                  </button>
                )}
                <div className="flex items-center gap-1 text-neutral-500">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-neutral-800 border border-neutral-700 rounded">
                    esc
                  </kbd>
                </div>
              </div>

              {/* Category filters */}
              {!search && !activeCategory && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 overflow-x-auto">
                  {COMMAND_GROUPS.filter((g) => g.id !== 'recent').map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setActiveCategory(group.id)}
                      className="px-2.5 py-1 text-xs bg-neutral-800/50 text-neutral-400 rounded-md hover:bg-neutral-700/50 hover:text-neutral-200 transition-colors whitespace-nowrap">
                      {group.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Command list */}
              <Command.List
                ref={listRef}
                className="max-h-[400px] overflow-y-auto py-2 scroll-smooth">
                {groupedCommands.length === 0 ? (
                  <Command.Empty className="py-6 text-center text-sm text-neutral-500">
                    No commands found.
                  </Command.Empty>
                ) : (
                  groupedCommands.map((group) => (
                    <Command.Group
                      key={group.id}
                      heading={group.label}
                      className="px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500">
                      {group.commands.map((command) => {
                        const index = globalIndex++
                        const isSelected = index === selectedIndex

                        return (
                          <Command.Item
                            key={command.id}
                            data-index={index}
                            onSelect={() => handleSelect(command)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-colors',
                              isSelected
                                ? 'bg-neutral-800 text-neutral-100'
                                : 'text-neutral-300 hover:bg-neutral-800/50'
                            )}>
                            {/* Icon */}
                            <div
                              className={cn(
                                'w-8 h-8 flex items-center justify-center rounded-md',
                                isSelected ? 'bg-neutral-700' : 'bg-neutral-800/50'
                              )}>
                              {typeof command.icon === 'function' ? command.icon() : command.icon}
                            </div>

                            {/* Label & Description */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{command.label}</div>
                              {command.description && (
                                <div className="text-xs text-neutral-500 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>

                            {/* Shortcut */}
                            {renderShortcut(command.shortcut)}
                          </Command.Item>
                        )
                      })}
                    </Command.Group>
                  ))
                )}
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800 text-xs text-neutral-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">
                      ↵
                    </kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px]">
                      esc
                    </kbd>
                    close
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CommandIcon size={12} />
                  <span>K to open</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
