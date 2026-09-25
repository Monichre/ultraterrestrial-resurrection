'use client'

import {
  Search,
  Globe,
  Clock,
  FileText,
  Sparkles,
  Brain,
  Compass,
  Map,
  Users,
  Building2,
  ScrollText,
  Settings,
  Keyboard,
  Moon,
  Sun,
  Zap,
  Play,
  Database,
  MessageSquare,
} from 'lucide-react'
import type {CommandAction} from './types'

type CommandFactory = (deps: {
  router: {push: (path: string) => void}
  toggleTheme?: () => void
  startTour?: (tourId: string) => void
}) => CommandAction[]

export const createNavigationCommands: CommandFactory = ({router}) => [
  {
    id: 'nav-home',
    label: 'Go to Home',
    description: 'Return to the main canvas',
    icon: <Sparkles size={16} />,
    shortcut: ['G', 'H'],
    category: 'navigation',
    keywords: ['home', 'canvas', 'main', 'start'],
    onSelect: () => router.push('/'),
  },
  {
    id: 'nav-sightings',
    label: 'Go to Sightings Globe',
    description: 'Explore worldwide UFO sightings',
    icon: <Globe size={16} />,
    shortcut: ['G', 'S'],
    category: 'navigation',
    keywords: ['globe', 'sightings', 'map', 'world'],
    onSelect: () => router.push('/sightings'),
  },
  {
    id: 'nav-timeline',
    label: 'Go to Timeline',
    description: 'Navigate historical events',
    icon: <Clock size={16} />,
    shortcut: ['G', 'T'],
    category: 'navigation',
    keywords: ['timeline', 'history', 'chronological'],
    onSelect: () => router.push('/timeline'),
  },
  {
    id: 'nav-disclosure',
    label: 'Go to Disclosure Search',
    description: 'Search the disclosure database',
    icon: <Search size={16} />,
    shortcut: ['G', 'D'],
    category: 'navigation',
    keywords: ['search', 'disclosure', 'database', 'find'],
    onSelect: () => router.push('/research-canvas'),
  },
  {
    id: 'nav-key-figures',
    label: 'Go to Key Figures',
    description: 'Explore important personnel',
    icon: <Users size={16} />,
    shortcut: ['G', 'K'],
    category: 'navigation',
    keywords: ['people', 'personnel', 'figures', 'witnesses'],
    onSelect: () => router.push('/key-figures'),
  },
  {
    id: 'nav-prometheus',
    label: 'Go to Prometheus AI',
    description: 'Open the AI research assistant',
    icon: <Brain size={16} />,
    shortcut: ['G', 'P'],
    category: 'navigation',
    keywords: ['ai', 'prometheus', 'assistant', 'chat'],
    onSelect: () => router.push('/prometheus'),
  },
]

export const createSearchCommands: CommandFactory = ({router}) => [
  {
    id: 'search-events',
    label: 'Search Events',
    description: 'Find historical UFO/UAP events',
    icon: <Clock size={16} />,
    category: 'search',
    keywords: ['events', 'incidents', 'sightings', 'historical'],
    onSelect: () => router.push('/research-canvas?type=events'),
  },
  {
    id: 'search-personnel',
    label: 'Search Key Figures',
    description: 'Find witnesses, researchers, officials',
    icon: <Users size={16} />,
    category: 'search',
    keywords: ['people', 'witnesses', 'researchers', 'officials'],
    onSelect: () => router.push('/key-figures'),
  },
  {
    id: 'search-organizations',
    label: 'Search Organizations',
    description: 'Find government agencies, research groups',
    icon: <Building2 size={16} />,
    category: 'search',
    keywords: ['organizations', 'agencies', 'groups', 'government'],
    onSelect: () => router.push('/research-canvas?type=organizations'),
  },
  {
    id: 'search-documents',
    label: 'Search Documents',
    description: 'Find declassified documents and reports',
    icon: <FileText size={16} />,
    category: 'search',
    keywords: ['documents', 'files', 'reports', 'declassified'],
    onSelect: () => router.push('/research-canvas?type=documents'),
  },
  {
    id: 'search-testimonies',
    label: 'Search Testimonies',
    description: 'Find witness accounts and statements',
    icon: <ScrollText size={16} />,
    category: 'search',
    keywords: ['testimonies', 'accounts', 'statements', 'witnesses'],
    onSelect: () => router.push('/research-canvas?type=testimonies'),
  },
]

export const createAICommands: CommandFactory = ({router}) => [
  {
    id: 'ai-chat',
    label: 'Chat with Prometheus',
    description: 'Start a conversation with the AI assistant',
    icon: <MessageSquare size={16} />,
    shortcut: ['/', 'C'],
    category: 'ai',
    keywords: ['chat', 'ai', 'prometheus', 'assistant', 'ask'],
    onSelect: () => router.push('/prometheus'),
  },
  {
    id: 'ai-analyze',
    label: 'Analyze Current Graph',
    description: 'AI analysis of nodes on your canvas',
    icon: <Brain size={16} />,
    shortcut: ['/', 'A'],
    category: 'ai',
    keywords: ['analyze', 'ai', 'graph', 'insights'],
    onSelect: () => {
      // TODO: Trigger graph analysis
      console.log('Triggering graph analysis')
    },
  },
  {
    id: 'ai-deep-research',
    label: 'Deep Research Mode',
    description: 'Enable comprehensive research with multiple sources',
    icon: <Database size={16} />,
    shortcut: ['/', 'R'],
    category: 'ai',
    keywords: ['research', 'deep', 'comprehensive', 'sources'],
    onSelect: () => {
      // TODO: Enable deep research mode
      console.log('Enabling deep research mode')
    },
  },
]

export const createTourCommands: CommandFactory = ({startTour}) => [
  {
    id: 'tour-roswell',
    label: 'Tour: Roswell & Advanced Propulsion',
    description: 'Explore crash retrieval and reverse engineering',
    icon: <Compass size={16} />,
    category: 'tours',
    keywords: ['roswell', 'propulsion', 'crash', 'technology', 'tour'],
    onSelect: () => startTour?.('roswell-advanced-propulsion'),
  },
  {
    id: 'tour-nukes',
    label: 'Tour: UFOs & Nuclear Facilities',
    description: 'Investigate UFO activity near nuclear sites',
    icon: <Zap size={16} />,
    category: 'tours',
    keywords: ['nuclear', 'nukes', 'malmstrom', 'weapons', 'tour'],
    onSelect: () => startTour?.('ufos-and-nukes'),
  },
  {
    id: 'tour-zeta',
    label: 'Tour: Zeta Reticuli Connection',
    description: "From Betty Hill's star map to modern exoplanets",
    icon: <Map size={16} />,
    category: 'tours',
    keywords: ['zeta', 'reticuli', 'hill', 'abduction', 'star', 'tour'],
    onSelect: () => startTour?.('zeta-reticuli'),
  },
  {
    id: 'tour-old-gods',
    label: 'Tour: The Old Gods Are Returning',
    description: 'Ancient astronauts and modern phenomena',
    icon: <Sparkles size={16} />,
    category: 'tours',
    keywords: ['ancient', 'gods', 'mythology', 'vallee', 'tour'],
    onSelect: () => startTour?.('old-gods-returning'),
  },
]

export const createActionCommands: CommandFactory = () => [
  {
    id: 'action-fit-view',
    label: 'Fit View to Nodes',
    description: 'Center and zoom to show all nodes',
    icon: <Sparkles size={16} />,
    shortcut: ['F'],
    category: 'actions',
    keywords: ['fit', 'zoom', 'center', 'view'],
    onSelect: () => {
      // TODO: Trigger fitView
      console.log('Fitting view')
    },
  },
  {
    id: 'action-clear-canvas',
    label: 'Clear Canvas',
    description: 'Remove all nodes from the canvas',
    icon: <Sparkles size={16} />,
    category: 'actions',
    keywords: ['clear', 'reset', 'remove', 'delete'],
    onSelect: () => {
      // TODO: Clear canvas with confirmation
      console.log('Clearing canvas')
    },
  },
]

export const createSettingsCommands: CommandFactory = ({toggleTheme}) => [
  {
    id: 'settings-toggle-theme',
    label: 'Toggle Dark/Light Mode',
    description: 'Switch between dark and light themes',
    icon: <Moon size={16} />,
    shortcut: ['Cmd', 'Shift', 'D'],
    category: 'settings',
    keywords: ['theme', 'dark', 'light', 'mode', 'toggle'],
    onSelect: () => toggleTheme?.(),
  },
  {
    id: 'settings-keyboard',
    label: 'Keyboard Shortcuts',
    description: 'View all available keyboard shortcuts',
    icon: <Keyboard size={16} />,
    shortcut: ['?'],
    category: 'settings',
    keywords: ['keyboard', 'shortcuts', 'hotkeys', 'help'],
    onSelect: () => {
      // TODO: Show keyboard shortcuts modal
      console.log('Showing keyboard shortcuts')
    },
  },
]

export function createDefaultCommands(deps: Parameters<CommandFactory>[0]): CommandAction[] {
  return [
    ...createNavigationCommands(deps),
    ...createSearchCommands(deps),
    ...createAICommands(deps),
    ...createTourCommands(deps),
    ...createActionCommands(deps),
    ...createSettingsCommands(deps),
  ]
}
