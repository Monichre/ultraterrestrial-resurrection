import type { Meta, StoryObj } from '@storybook/react'

import ToolbarExpandable from './toolbar-expandable'

const meta = {
  title: 'Components/Toolbars/Expandable Toolbar',
  component: ToolbarExpandable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolbarExpandable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}