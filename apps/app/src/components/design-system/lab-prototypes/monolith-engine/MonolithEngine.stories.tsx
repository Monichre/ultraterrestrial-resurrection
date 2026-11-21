'use client'

import type { Meta, StoryObj } from '@storybook/nextjs'
import { MonolithEngine } from './MonolithEngine'

const meta = {
  title: 'Design System/Lab Prototypes/MonolithEngine',
  component: MonolithEngine,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MonolithEngine>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutLoader: Story = {
  args: {
    showLoader: false,
  },
}
