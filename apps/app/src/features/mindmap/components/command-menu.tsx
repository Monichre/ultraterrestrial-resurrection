'use client'

import {useState, useEffect, useCallback} from 'react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import {Dialog, DialogContent} from '@/components/ui/dialog'
import {
  Search,
  Plus,
  Compass,
  Shapes,
  History,
  Scan,
  PenSquare,
  MessageSquare,
  HelpCircle,
  Network,
  Database,
  Lightbulb,
  Sparkles,
  ImageIcon,
  MonitorIcon,
} from 'lucide-react'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'

interface CommandItem {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
}

export function MindMapCommandMenu() {
  const [open, setOpen] = useState(false)
  const {addUserInputNode, organizeLayout, fitView} = useMindMap()

  const commands: CommandItem[] = [
    {
      id: 'add-node',
      name: 'Add Node',
      description: 'Add a new node to the mind map',
      icon: <Plus className='h-4 w-4' />,
      action: () => {
        addUserInputNode({input: 'New Node', user: 'command-menu'})
        setOpen(false)
      },
      keywords: ['add', 'create', 'new', 'node'],
    },
    {
      id: 'guided-exploration',
      name: 'Guided Exploration',
      description: 'Start a guided exploration session',
      icon: <Compass className='h-4 w-4' />,
      action: () => {
        // TODO: Implement guided exploration
        console.log('Starting guided exploration')
        setOpen(false)
      },
      keywords: ['guided', 'exploration', 'tour', 'walkthrough'],
    },
    {
      id: 'data-models',
      name: 'Data Models',
      description: 'Access UFO/UAP data models and entities',
      icon: <Database className='h-4 w-4' />,
      action: () => {
        // TODO: Implement data models panel
        console.log('Opening data models panel')
        setOpen(false)
      },
      keywords: ['data', 'models', 'entities', 'database', 'uap', 'ufo'],
    },
    {
      id: 'search-knowledge',
      name: 'Search Knowledge Base',
      description: 'Search the UFO/UAP knowledge base',
      icon: <Database className='h-4 w-4' />,
      action: () => {
        // TODO: Implement knowledge base search
        console.log('Searching knowledge base')
        setOpen(false)
      },
      keywords: ['search', 'knowledge', 'database', 'find'],
    },
    {
      id: 'analyze-sighting',
      name: 'Analyze Sighting',
      description: 'Analyze UAP sighting reports',
      icon: <ImageIcon className='h-4 w-4' />,
      action: () => {
        // TODO: Implement sighting analysis
        console.log('Analyzing sighting')
        setOpen(false)
      },
      keywords: ['analyze', 'sighting', 'uap', 'ufo', 'report'],
    },
    {
      id: 'deep-research',
      name: 'Deep Research',
      description: 'Conduct comprehensive research',
      icon: <Lightbulb className='h-4 w-4' />,
      action: () => {
        // TODO: Implement deep research
        console.log('Starting deep research')
        setOpen(false)
      },
      keywords: ['research', 'deep', 'comprehensive', 'investigate'],
    },
    {
      id: 'connect-dots',
      name: 'Connect Dots',
      description: 'Find connections between entities',
      icon: <Network className='h-4 w-4' />,
      action: () => {
        // TODO: Implement connection finding
        console.log('Finding connections')
        setOpen(false)
      },
      keywords: ['connect', 'relationships', 'links', 'associations'],
    },
    {
      id: 'organize-layout',
      name: 'Organize Layout',
      description: 'Auto-organize the mind map layout',
      icon: <Shapes className='h-4 w-4' />,
      action: () => {
        organizeLayout({
          direction: 'horizontal',
          centerChildren: true,
          parentChildSpacing: 120,
          siblingSpacing: 80,
          preserveExistingLayout: false,
        })
        setOpen(false)
      },
      keywords: ['organize', 'layout', 'arrange', 'auto'],
    },
    {
      id: 'fit-view',
      name: 'Fit to View',
      description: 'Fit all nodes to the current view',
      icon: <MonitorIcon className='h-4 w-4' />,
      action: () => {
        fitView()
        setOpen(false)
      },
      keywords: ['fit', 'view', 'zoom', 'center'],
    },
  ]

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(true)
      }

      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = useCallback((command: CommandItem) => {
    command.action()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-2xl p-0 bg-black border-neutral-700'>
        <Command className='rounded-lg border border-neutral-700 shadow-2xl bg-neutral-900 text-white'>
          <CommandInput
            placeholder='Type a command or search...'
            className='bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-neutral-500'
          />
          <CommandList className='bg-neutral-900'>
            <CommandEmpty className='text-neutral-400'>No results found.</CommandEmpty>
            <CommandGroup heading='Mind Map Actions' className='text-neutral-300'>
              {commands.map((command) => (
                <CommandItem
                  key={command.id}
                  value={`${command.name} ${command.description} ${command.keywords?.join(' ') || ''}`}
                  onSelect={() => handleSelect(command)}
                  className='flex items-center gap-2 px-3 py-2 text-white hover:bg-neutral-800 data-[selected=true]:bg-neutral-700 data-[selected=true]:text-white'>
                  <div className='text-neutral-400'>{command.icon}</div>
                  <div className='flex flex-col'>
                    <span className='font-medium text-white'>{command.name}</span>
                    <span className='text-sm text-neutral-400'>{command.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
