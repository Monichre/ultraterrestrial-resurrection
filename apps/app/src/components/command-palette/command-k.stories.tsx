import type {Meta, StoryObj} from '@storybook/nextjs'
import {
  FileText,
  MapPin,
  Search,
  Settings,
  User,
} from 'lucide-react'
import {CommandK} from './command-k'

const SAMPLE_COMMANDS = {
  Navigation: [
    {name: 'Open research canvas', icon: <MapPin />},
    {name: 'Search archive', icon: <Search />},
  ],
  Documents: [
    {name: 'New case file', icon: <FileText />},
    {name: 'Browse personnel', icon: <User />},
  ],
  System: [{name: 'Settings', icon: <Settings />}],
}

const meta = {
  title: 'Components/CommandK',
  component: CommandK,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{name: 'dark', value: '#0a0a0a'}],
    },
    docs: {
      description: {
        component:
          'Decorative ⌘K command menu showcase. Distinct from the live CommandPalette (cmdk + store).',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandK>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    commands: SAMPLE_COMMANDS,
  },
}

export const Empty: Story = {
  args: {
    commands: {},
  },
}
