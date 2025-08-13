import type {Meta, StoryObj} from '@storybook/react'
import {DocumentSearch} from '@repo/ai/components'

const meta: Meta<typeof DocumentSearch> = {
  title: 'AI/DocumentSearch',
  component: DocumentSearch,
  tags: ['autodocs'],
  args: {
    documentId: undefined,
  },
}

export default meta
type Story = StoryObj<typeof DocumentSearch>

export const Default: Story = {}
