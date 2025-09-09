import {AddIcon, ThinTwinklyStar} from '@/components/icons'
import {ICON_GREEN} from '@/utils'
import {LightningBoltIcon, MagicWandIcon} from '@radix-ui/react-icons'
import {SearchIcon, Brain} from 'lucide-react'

// Move COMMANDS outside component
export const COMMANDS = [
  {
    id: 'chat',
    label: 'Chat',
    description: 'Start a conversation with Prometheus',
    icon: () => <LightningBoltIcon stroke={ICON_GREEN} />,
    prefix: '/chat',
  },
  {
    id: 'Search',
    label: 'Search',
    description:
      'Search existing records across our database, curated and validated web resources and our own AI knowledge base',
    icon: () => <SearchIcon stroke={ICON_GREEN} />,
    prefix: '/search',
  },
  {
    id: 'Add',
    label: 'Add',
    description: 'Add a new item to the mind map',
    icon: () => <AddIcon stroke={ICON_GREEN} />,
    prefix: '/add',
  },
  {
    id: 'Connect',
    label: 'Connect',
    description: 'Connect to a database',
    icon: () => <ThinTwinklyStar stroke={ICON_GREEN} />,
    prefix: '/connect',
  },
  {
    id: 'analyze',
    label: 'Analyze',
    description: 'Analyze the existing records on your mind map and generate new insights',
    icon: () => <MagicWandIcon stroke={ICON_GREEN} />,
    prefix: '/analyze',
  },
  {
    id: 'scrape',
    label: 'Scrape',
    description: 'Extract data from a URL with entity recognition and analysis',
    icon: () => <Brain stroke={ICON_GREEN} />,
    prefix: '/scrape',
  },
  {
    id: 'deepresearch',
    label: 'Deep Research',
    description: 'Conduct in-depth research',
    icon: () => <Brain stroke={ICON_GREEN} />,
    prefix: '/deepresearch',
  },
] as const
