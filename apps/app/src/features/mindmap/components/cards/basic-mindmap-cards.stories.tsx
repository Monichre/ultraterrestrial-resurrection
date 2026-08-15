import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BasicCardThree } from './basic-mindmap-cards'


const meta = {
  title: 'Mindmap/cards/basic-mindmap-cards',
  component: BasicCardThree,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BasicCardThree>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
