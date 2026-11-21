import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import HudCard from './HudCard'

const meta = {
  title: 'HUD Interface/HudCard',
  component: HudCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {control: 'text'},
  },
} satisfies Meta<typeof HudCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomClassName: Story = {
  args: {
    className: 'bg-gray-900',
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{height: '100vh', width: '100vw'}}>
        <Story />
      </div>
    ),
  ],
}
