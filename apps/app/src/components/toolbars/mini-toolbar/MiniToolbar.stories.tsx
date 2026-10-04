import type {Meta, StoryObj} from '@storybook/react'

import {MiniToolbar} from './MiniToolbar'

const meta = {
  title: 'Components/Toolbars/Mini Toolbar',
  component: MiniToolbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MiniToolbar>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
