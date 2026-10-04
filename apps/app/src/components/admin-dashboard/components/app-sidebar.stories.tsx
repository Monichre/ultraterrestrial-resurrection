import type {Meta, StoryObj} from '@storybook/nextjs'
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar'
import {AppSidebar} from './app-sidebar'

const meta = {
  title: 'Components/AdminDashboard/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
        <SidebarInset />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
