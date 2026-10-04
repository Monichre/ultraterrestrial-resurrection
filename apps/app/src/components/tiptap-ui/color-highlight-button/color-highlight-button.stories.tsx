import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ColorHighlightButton} from './color-highlight-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/ColorHighlightButton',
  component: ColorHighlightButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ColorHighlightButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    highlightColor: 'var(--tt-color-highlight-yellow)',
  },
  render: (args) => (
    <TiptapStoryEditor>
      <ColorHighlightButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Green: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ColorHighlightButton highlightColor="var(--tt-color-highlight-green)" />
    </TiptapStoryEditor>
  ),
}

export const Blue: Story = {
  render: () => (
    <TiptapStoryEditor>
      <ColorHighlightButton highlightColor="var(--tt-color-highlight-blue)" />
    </TiptapStoryEditor>
  ),
}
