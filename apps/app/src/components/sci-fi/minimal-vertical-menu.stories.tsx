import type {Meta, StoryObj} from '@storybook/react'
import MinimalVerticalMenu from './minimal-vertical-menu'
import {BookIcon, DatabaseIcon, FileIcon, GlobeIcon, HomeIcon, SettingsIcon} from 'lucide-react'

const meta: Meta<typeof MinimalVerticalMenu> = {
  title: 'Sci-Fi/MinimalVerticalMenu',
  component: MinimalVerticalMenu,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MinimalVerticalMenu>

export const Default: Story = {
  args: {
    items: [
      {icon: HomeIcon, label: 'Home', id: 'home'},
      {icon: FileIcon, label: 'Files', id: 'files'},
      {icon: DatabaseIcon, label: 'Database', id: 'database'},
      {icon: GlobeIcon, label: 'Network', id: 'network'},
      {icon: BookIcon, label: 'Documentation', id: 'docs'},
      {icon: SettingsIcon, label: 'Settings', id: 'settings'},
    ],
    activeId: 'home',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 h-[600px] flex items-center'>
        <Story />
      </div>
    ),
  ],
}

export const Expanded: Story = {
  args: {
    items: [
      {icon: HomeIcon, label: 'Home', id: 'home'},
      {icon: FileIcon, label: 'Files', id: 'files'},
      {icon: DatabaseIcon, label: 'Database', id: 'database'},
      {icon: GlobeIcon, label: 'Network', id: 'network'},
      {icon: BookIcon, label: 'Documentation', id: 'docs'},
      {icon: SettingsIcon, label: 'Settings', id: 'settings'},
    ],
    activeId: 'database',
    expanded: true,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 h-[600px] flex items-center'>
        <Story />
      </div>
    ),
  ],
}

export const WithCustomTransition: Story = {
  args: {
    items: [
      {icon: HomeIcon, label: 'Home', id: 'home'},
      {icon: FileIcon, label: 'Files', id: 'files'},
      {icon: DatabaseIcon, label: 'Database', id: 'database'},
      {icon: GlobeIcon, label: 'Network', id: 'network'},
    ],
    activeId: 'files',
    transitionDuration: '0.5s',
    animationType: 'spring',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 h-[600px] flex items-center'>
        <Story />
      </div>
    ),
  ],
}
