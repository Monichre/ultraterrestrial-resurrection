'use client'

import type { Meta, StoryObj } from '@storybook/nextjs'
import { CognitiveRoutingFramework } from './CognitiveRoutingFramework'

const meta = {
  title: 'Design System/Lab Prototypes/CognitiveRoutingFramework',
  component: CognitiveRoutingFramework,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CognitiveRoutingFramework>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
