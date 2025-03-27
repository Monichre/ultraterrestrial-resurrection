import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CirclesHud2 from './CirclesHud2'

const meta = {
  title: 'HUD Interface/CirclesHud2',
  component: CirclesHud2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {control: 'text'},
    colorScheme: {
      control: 'select',
      options: ['blue', 'green', 'purple'],
      defaultValue: 'blue',
    },
  },
} satisfies Meta<typeof CirclesHud2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const GreenScheme: Story = {
  args: {
    colorScheme: 'green',
  },
}

export const PurpleScheme: Story = {
  args: {
    colorScheme: 'purple',
  },
}

export const CustomClassName: Story = {
  args: {
    className: 'bg-black',
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{height: '100vh', width: '100%'}}>
        <Story />
      </div>
    ),
  ],
}
