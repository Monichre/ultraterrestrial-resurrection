'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {fn} from '@storybook/test'
import {EnergyInputHub} from './EnergyInputHub'

const meta = {
  title: 'Design System/Lab Prototypes/EnergyInputHub',
  component: EnergyInputHub,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  args: {
    onSynthesize: fn(),
  },
} satisfies Meta<typeof EnergyInputHub>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPresetPrompt: Story = {
  args: {
    initialPrompt: 'Draft a classified project brief covering scope, risks, and open questions.',
  },
}

export const Resolved: Story = {
  args: {
    initialPrompt: 'Synthesize a Q3 data matrix from the attached corpus.',
    initialState: 'resolved',
  },
}
