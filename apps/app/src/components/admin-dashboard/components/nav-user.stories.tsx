import type {Meta, StoryObj} from '@storybook/react'
import {SidebarProvider, SidebarInset, SidebarFooter} from '@/components/ui/sidebar'
import {NavUser} from './nav-user'

const meta = {
  title: 'Components/AdminDashboard/NavUser',
  component: NavUser,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className='w-64'>
          <SidebarFooter>
            <Story />
          </SidebarFooter>
        </div>
        <SidebarInset />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavUser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
  },
}
