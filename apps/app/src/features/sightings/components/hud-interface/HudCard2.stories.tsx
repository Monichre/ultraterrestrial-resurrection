import type {Meta, StoryObj} from '@storybook/react'
import HudCard2 from './HudCard2'

const meta: Meta<typeof HudCard2> = {
  title: 'HUD/HudCard2',
  component: HudCard2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof HudCard2>

export const Default: Story = {
  args: {
    className: 'w-[600px] h-[500px]',
  },
}

export const Small: Story = {
  args: {
    className: 'w-[400px] h-[300px]',
  },
}

export const Large: Story = {
  args: {
    className: 'w-[800px] h-[600px]',
  },
}
