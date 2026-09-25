'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {UltraTerrestrialDraftingBoard} from './UltraTerrestrialDraftingBoard'

const meta = {
  title: 'Design System/Lab Prototypes/UltraTerrestrialDraftingBoard',
  component: UltraTerrestrialDraftingBoard,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof UltraTerrestrialDraftingBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
