import type {Meta, StoryObj} from '@storybook/react'
import {MarkdownText} from './markdown-text'

const meta = {
  title: 'Components/AssistantUI/MarkdownText',
  component: MarkdownText,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof MarkdownText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='max-w-2xl p-4 text-neutral-200'>
      <MarkdownText />
    </div>
  ),
}
