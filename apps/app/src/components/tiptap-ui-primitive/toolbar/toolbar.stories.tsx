import type {Meta, StoryObj} from '@storybook/react'
import {Toolbar, ToolbarGroup, ToolbarSeparator} from './toolbar'
import {Button} from '../button'

const meta = {
  title: 'Components/TiptapUIPrimitive/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {
      control: 'select',
      options: ['floating', 'fixed'],
    },
  },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <Button data-style="ghost">A</Button>
        <Button data-style="ghost">B</Button>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <Button data-style="ghost">C</Button>
      </ToolbarGroup>
    </Toolbar>
  ),
}

export const Floating: Story = {
  args: {
    variant: 'floating',
  },
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarGroup>
        <Button data-style="ghost">Bold</Button>
        <Button data-style="ghost">Italic</Button>
        <Button data-style="ghost">Underline</Button>
      </ToolbarGroup>
    </Toolbar>
  ),
}
