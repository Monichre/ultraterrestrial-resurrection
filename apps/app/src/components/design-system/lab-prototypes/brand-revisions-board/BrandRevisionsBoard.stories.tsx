'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {BrandRevisionsBoard} from './BrandRevisionsBoard'

const meta = {
  title: 'Design System/Lab Prototypes/BrandRevisionsBoard',
  component: BrandRevisionsBoard,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof BrandRevisionsBoard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
