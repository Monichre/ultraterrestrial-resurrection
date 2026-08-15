import type {Meta, StoryObj} from '@storybook/react'
import {Badge} from './badge'

const meta = {
  title: 'Components/TiptapUIPrimitive/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'white', 'gray', 'green', 'default'],
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    appearance: {
      control: 'select',
      options: ['default', 'subdued', 'emphasized'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Variants: Story = {
  render: () => (
    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="white">White</Badge>
      <Badge variant="gray">Gray</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="default">Default</Badge>
    </div>
  ),
}

export const Small: Story = {
  args: {
    children: 'Small Badge',
    size: 'small',
  },
}

export const Subdued: Story = {
  args: {
    children: 'Subdued',
    appearance: 'subdued',
  },
}
