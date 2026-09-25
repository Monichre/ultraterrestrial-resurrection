import type {Meta, StoryObj} from '@storybook/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu'
import {Button} from '../button'

const meta = {
  title: 'Components/TiptapUIPrimitive/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-style="ghost">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item One</DropdownMenuItem>
        <DropdownMenuItem>Item Two</DropdownMenuItem>
        <DropdownMenuItem>Item Three</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
