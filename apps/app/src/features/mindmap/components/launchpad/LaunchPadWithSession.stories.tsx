import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LaunchPadWithSession } from './LaunchPadWithSession'


const meta = {
  title: 'Mindmap/launchpad/LaunchPadWithSession',
  component: LaunchPadWithSession,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LaunchPadWithSession>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
