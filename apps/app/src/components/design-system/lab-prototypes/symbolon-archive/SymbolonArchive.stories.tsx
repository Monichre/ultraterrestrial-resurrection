'use client'

import type { Meta, StoryObj } from '@storybook/nextjs'
import { SymbolonArchive } from './SymbolonArchive'

const meta = {
  title: 'Design System/Lab Prototypes/SymbolonArchive',
  component: SymbolonArchive,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SymbolonArchive>

export default meta
type Story = StoryObj<typeof meta>

export const Methodology: Story = {}

export const ArchiveIndex: Story = {
  args: { initialNav: 'Idx. Archive' },
}

export const Transmit: Story = {
  args: { initialNav: 'Transmit' },
}
