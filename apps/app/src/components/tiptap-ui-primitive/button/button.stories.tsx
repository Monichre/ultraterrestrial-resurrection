import type {Meta, StoryObj} from '@storybook/react'
import {Button, ButtonGroup} from './button'

const meta = {
  title: 'Components/TiptapUIPrimitive/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    tooltip: 'Click me',
  },
}

export const Ghost: Story = {
  render: () => (
    <Button data-style="ghost" tooltip="Ghost style">
      Ghost Button
    </Button>
  ),
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const Group: Story = {
  render: () => (
    <ButtonGroup orientation="horizontal">
      <Button data-style="ghost">A</Button>
      <Button data-style="ghost">B</Button>
      <Button data-style="ghost">C</Button>
    </ButtonGroup>
  ),
}
