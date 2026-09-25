import type {Meta, StoryObj} from '@storybook/react'
import Dashboard1 from './Dashboard1'

const meta: Meta<typeof Dashboard1> = {
  title: 'HUD/Dashboard1',
  component: Dashboard1,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dashboard1>

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
