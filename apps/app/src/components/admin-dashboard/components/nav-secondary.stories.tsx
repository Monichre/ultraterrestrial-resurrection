import type {Meta, StoryObj} from '@storybook/react'
import {IconSettings, IconHelp, IconSearch} from '@tabler/icons-react'
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar'
import {NavSecondary} from './nav-secondary'

const meta = {
  title: 'Components/AdminDashboard/NavSecondary',
  component: NavSecondary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className='w-64'>
          <Story />
        </div>
        <SidebarInset />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavSecondary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {title: 'Settings', url: '#', icon: IconSettings},
      {title: 'Get Help', url: '#', icon: IconHelp},
      {title: 'Search', url: '#', icon: IconSearch},
    ],
  },
}
