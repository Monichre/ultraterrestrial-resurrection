import type {Meta, StoryObj} from '@storybook/react'
import HudDash from './HudDash'

const meta: Meta<typeof HudDash> = {
  title: 'HUD/HudDash',
  component: HudDash,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HudDash>

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

export const Dark: Story = {
  args: {
    className: 'bg-gray-950',
  },
}
