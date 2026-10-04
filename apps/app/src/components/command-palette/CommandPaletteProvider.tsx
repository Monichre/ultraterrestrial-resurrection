'use client'

import {useMemo} from 'react'
import {useRouter} from 'next/navigation'
import {CommandPalette} from './CommandPalette'
import {createDefaultCommands} from './default-commands'
import type {CommandAction} from './types'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

interface CommandPaletteProviderProps {
  children: React.ReactNode
  additionalCommands?: CommandAction[]
}

export function CommandPaletteProvider({
  children,
  additionalCommands = [],
}: CommandPaletteProviderProps) {
  const router = useRouter()
  const {startTour} = useMindMapUiStore()

  const commands = useMemo(() => {
    const defaultCommands = createDefaultCommands({
      router: {push: (path: string) => router.push(path)},
      startTour: (tourId: string) => startTour(tourId, 'guided'),
      toggleTheme: () => {
        // TODO: Implement theme toggle
        document.documentElement.classList.toggle('dark')
      },
    })

    return [...defaultCommands, ...additionalCommands]
  }, [router, startTour, additionalCommands])

  return (
    <>
      {children}
      <CommandPalette commands={commands} />
    </>
  )
}
