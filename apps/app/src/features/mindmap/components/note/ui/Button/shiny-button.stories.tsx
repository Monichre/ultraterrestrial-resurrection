import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ShinyRotatingBorderButton } from './shiny-button'


const meta = {
  title: 'Mindmap/note/ui/Button/shiny-button',
  component: ShinyRotatingBorderButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ShinyRotatingBorderButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
