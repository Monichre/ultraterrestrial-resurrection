import type {Meta, StoryObj} from '@storybook/react'
import {SettingsIcon} from 'lucide-react'
import {SidePanel} from './side-panel'

const meta = {
  title: 'Components/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof SidePanel>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: {
    panelOpen: false,
    handlePanelOpen: () => {},
    renderButton: (handleToggle) => (
      <button
        onClick={handleToggle}
        className='flex items-center gap-2 text-sm text-neutral-300'
      >
        <SettingsIcon className='h-4 w-4' />
      </button>
    ),
    children: (
      <div className='p-2 text-sm text-neutral-300'>
        Panel content goes here.
      </div>
    ),
  },
}

export const Open: Story = {
  args: {
    panelOpen: true,
    handlePanelOpen: () => {},
    renderButton: (handleToggle) => (
      <button
        onClick={handleToggle}
        className='flex items-center gap-2 text-sm text-neutral-300'
      >
        <SettingsIcon className='h-4 w-4' />
      </button>
    ),
    children: (
      <div className='p-2 text-sm text-neutral-300'>
        Panel content goes here.
      </div>
    ),
  },
}
