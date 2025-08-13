import type {Meta, StoryObj} from '@storybook/react'
import {Message} from '@repo/ai/components'
import type {Message as AiMessage} from 'ai'

const baseMessage: AiMessage = {
  id: '1',
  role: 'assistant',
  content: 'Hello, this is a sample assistant message rendered with Markdown.',
}

const meta: Meta<typeof Message> = {
  title: 'AI/Message',
  component: Message,
  tags: ['autodocs'],
  args: {
    data: baseMessage,
  },
}

export default meta
type Story = StoryObj<typeof Message>

export const Assistant: Story = {}

export const User: Story = {
  args: {
    data: {...baseMessage, role: 'user', content: 'User message content'},
  },
}
