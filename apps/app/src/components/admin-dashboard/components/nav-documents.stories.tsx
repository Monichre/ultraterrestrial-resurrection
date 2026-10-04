import type {Meta, StoryObj} from '@storybook/react'
import {IconDatabase, IconReport, IconFileWord} from '@tabler/icons-react'
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar'
import {NavDocuments} from './nav-documents'

const meta = {
  title: 'Components/AdminDashboard/NavDocuments',
  component: NavDocuments,
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
} satisfies Meta<typeof NavDocuments>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {name: 'Data Library', url: '#', icon: IconDatabase},
      {name: 'Reports', url: '#', icon: IconReport},
      {name: 'Word Assistant', url: '#', icon: IconFileWord},
    ],
  },
}
