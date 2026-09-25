import type {Meta, StoryObj} from '@storybook/react'
import {IconDashboard, IconListDetails, IconChartBar, IconFolder, IconUsers} from '@tabler/icons-react'
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar'
import {NavMain} from './nav-main'

const meta = {
  title: 'Components/AdminDashboard/NavMain',
  component: NavMain,
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
} satisfies Meta<typeof NavMain>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {title: 'Dashboard', url: '#', icon: IconDashboard},
      {title: 'Lifecycle', url: '#', icon: IconListDetails},
      {title: 'Analytics', url: '#', icon: IconChartBar},
      {title: 'Projects', url: '#', icon: IconFolder},
      {title: 'Team', url: '#', icon: IconUsers},
    ],
  },
}
