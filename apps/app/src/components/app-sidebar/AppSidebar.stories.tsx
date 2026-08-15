import type {Meta, StoryObj} from '@storybook/react'
import {HomeIcon, SettingsIcon, UserIcon} from 'lucide-react'
import {AppSidebar, AppSidebarBody, AppSidebarLink} from './AppSidebar'

const meta = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AppSidebar>
      <AppSidebarBody>
        <AppSidebarLink
          label='Home'
          icon={<HomeIcon className='h-4 w-4 text-neutral-400' />}
        />
        <AppSidebarLink
          label='Profile'
          icon={<UserIcon className='h-4 w-4 text-neutral-400' />}
        />
        <AppSidebarLink
          label='Settings'
          icon={<SettingsIcon className='h-4 w-4 text-neutral-400' />}
        />
      </AppSidebarBody>
    </AppSidebar>
  ),
}
