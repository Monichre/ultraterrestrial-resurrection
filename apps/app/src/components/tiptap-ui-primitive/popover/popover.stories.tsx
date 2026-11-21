import type {Meta, StoryObj} from '@storybook/react'
import {Popover, PopoverTrigger, PopoverContent} from './popover'
import {Button} from '../button'

const meta = {
  title: 'Components/TiptapUIPrimitive/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button data-style="ghost">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div style={{padding: '8px'}}>Popover content</div>
      </PopoverContent>
    </Popover>
  ),
}
