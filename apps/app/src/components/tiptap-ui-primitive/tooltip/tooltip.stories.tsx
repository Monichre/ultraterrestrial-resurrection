import type {Meta, StoryObj} from '@storybook/react'
import {Tooltip, TooltipTrigger, TooltipContent} from './tooltip'

function TooltipStory() {
  return (
    <Tooltip delay={200}>
      <TooltipTrigger asChild>
        <button style={{padding: '8px 16px', cursor: 'pointer'}}>
          Hover me
        </button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  )
}

const meta = {
  title: 'Components/TiptapUIPrimitive/Tooltip',
  component: TooltipStory,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof TooltipStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
