import type {Meta, StoryObj} from '@storybook/react'
import {DynamicToolbar} from './DynamicToolbar'

const meta: Meta<typeof DynamicToolbar> = {
  title: 'Documents/Toolbar/DynamicToolbar',
  component: DynamicToolbar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DynamicToolbar>

export const Default: Story = {}
