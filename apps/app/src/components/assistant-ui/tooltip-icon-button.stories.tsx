import type {Meta, StoryObj} from '@storybook/react'
import {CopyIcon, RefreshCwIcon} from 'lucide-react'
import {TooltipIconButton} from './tooltip-icon-button'

const meta = {
  title: 'Components/AssistantUI/TooltipIconButton',
  component: TooltipIconButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof TooltipIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tooltip: 'Copy',
    children: <CopyIcon />,
  },
}

export const Refresh: Story = {
  args: {
    tooltip: 'Refresh',
    children: <RefreshCwIcon />,
  },
}
