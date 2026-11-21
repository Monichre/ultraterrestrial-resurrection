import type {Meta, StoryObj} from '@storybook/react'
import Dashboard2 from './Dashboard2'

const meta: Meta<typeof Dashboard2> = {
  title: 'HUD/Dashboard2',
  component: Dashboard2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dashboard2>

export const Default: Story = {
  args: {
    className: '',
  },
}

export const Responsive: Story = {
  args: {
    className: 'max-w-screen-2xl mx-auto',
  },
}
