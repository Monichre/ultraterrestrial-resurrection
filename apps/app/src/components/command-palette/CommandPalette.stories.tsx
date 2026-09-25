import type {Meta, StoryObj} from '@storybook/react'
import {CommandPalette} from './CommandPalette'
import {useCommandPaletteStore} from './command-palette-store'
import {createDefaultCommands} from './default-commands'
import {useEffect} from 'react'

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{name: 'dark', value: '#0a0a0a'}],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-950 text-white p-8">
        <div className="text-center text-neutral-500 mb-8">
          <p>Press <kbd className="px-2 py-1 bg-neutral-800 rounded">⌘K</kbd> or <kbd className="px-2 py-1 bg-neutral-800 rounded">Ctrl+K</kbd> to open</p>
        </div>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CommandPalette>

const mockCommands = createDefaultCommands({
  router: {push: (path) => console.log('Navigate to:', path)},
  startTour: (tourId) => console.log('Start tour:', tourId),
  toggleTheme: () => console.log('Toggle theme'),
})

function OpenOnMount({children}: {children: React.ReactNode}) {
  const {open} = useCommandPaletteStore()
  
  useEffect(() => {
    const timer = setTimeout(() => open(), 100)
    return () => clearTimeout(timer)
  }, [open])
  
  return <>{children}</>
}

export const Default: Story = {
  render: () => (
    <OpenOnMount>
      <CommandPalette commands={mockCommands} />
    </OpenOnMount>
  ),
}

export const WithSearch: Story = {
  render: () => {
    const {open, setSearch} = useCommandPaletteStore()
    
    useEffect(() => {
      const timer = setTimeout(() => {
        open()
        setSearch('tour')
      }, 100)
      return () => clearTimeout(timer)
    }, [open, setSearch])
    
    return <CommandPalette commands={mockCommands} />
  },
}

export const NavigationCategory: Story = {
  render: () => {
    const {open, setActiveCategory} = useCommandPaletteStore()
    
    useEffect(() => {
      const timer = setTimeout(() => {
        open()
        setActiveCategory('navigation')
      }, 100)
      return () => clearTimeout(timer)
    }, [open, setActiveCategory])
    
    return <CommandPalette commands={mockCommands} />
  },
}

export const ToursCategory: Story = {
  render: () => {
    const {open, setActiveCategory} = useCommandPaletteStore()
    
    useEffect(() => {
      const timer = setTimeout(() => {
        open()
        setActiveCategory('tours')
      }, 100)
      return () => clearTimeout(timer)
    }, [open, setActiveCategory])
    
    return <CommandPalette commands={mockCommands} />
  },
}

export const EmptySearch: Story = {
  render: () => {
    const {open, setSearch} = useCommandPaletteStore()
    
    useEffect(() => {
      const timer = setTimeout(() => {
        open()
        setSearch('xyznonexistent')
      }, 100)
      return () => clearTimeout(timer)
    }, [open, setSearch])
    
    return <CommandPalette commands={mockCommands} />
  },
}
