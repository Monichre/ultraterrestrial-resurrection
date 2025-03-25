import type { Meta, StoryObj } from '@storybook/react'

import { AnimatedToolbar } from './animated-toolbar'


const meta = {
  title: 'Components/Toolbars/Animated Toolbar v1',
  component: AnimatedToolbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatedToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}