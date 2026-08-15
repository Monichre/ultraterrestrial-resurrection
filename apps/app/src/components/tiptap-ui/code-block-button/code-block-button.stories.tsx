import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {CodeBlockButton} from './code-block-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/CodeBlockButton',
  component: CodeBlockButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof CodeBlockButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TiptapStoryEditor>
      <CodeBlockButton />
    </TiptapStoryEditor>
  ),
}

export const WithText: Story = {
  render: () => (
    <TiptapStoryEditor>
      <CodeBlockButton text="Code" />
    </TiptapStoryEditor>
  ),
}

export const WithShortcut: Story = {
  render: () => (
    <TiptapStoryEditor>
      <CodeBlockButton showShortcut />
    </TiptapStoryEditor>
  ),
}
