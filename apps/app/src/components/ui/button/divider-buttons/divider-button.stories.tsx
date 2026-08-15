import type { Meta, StoryObj } from '@storybook/react'
import { DividerButton } from './divider-button'

const meta: Meta<typeof DividerButton> = {
  title: 'UI/Buttons/DividerButton',
  component: DividerButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content'
    },
    className: {
      control: 'text',
      description: 'Additional classes'
    },
    onClick: { action: 'clicked' }
  }
}

export default meta
type Story = StoryObj<typeof DividerButton>

export const Default: Story = {
  args: {
    children: 'Button Text'
  }
}

export const WithCustomClass: Story = {
  args: {
    children: 'Custom Styled Button',
    className: 'bg-blue-500 text-white'
  }
}

export const WithLongText: Story = {
  args: {
    children: 'This is a button with very long text to show overflow behavior'
  }
}
