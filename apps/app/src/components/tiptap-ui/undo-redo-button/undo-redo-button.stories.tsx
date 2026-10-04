import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {UndoRedoButton} from './undo-redo-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/UndoRedoButton',
  component: UndoRedoButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof UndoRedoButton>

export default meta
type Story = StoryObj<typeof meta>

export const Undo: Story = {
  args: {action: 'undo'},
  render: (args) => (
    <TiptapStoryEditor>
      <UndoRedoButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Redo: Story = {
  args: {action: 'redo'},
  render: (args) => (
    <TiptapStoryEditor>
      <UndoRedoButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const WithShortcut: Story = {
  args: {action: 'undo', showShortcut: true},
  render: (args) => (
    <TiptapStoryEditor>
      <UndoRedoButton {...args} />
    </TiptapStoryEditor>
  ),
}
