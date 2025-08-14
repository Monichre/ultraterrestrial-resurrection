import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ENTITY_TYPES } from './entity-types'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/entity-types',
  component: ENTITY_TYPES,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ENTITY_TYPES>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
