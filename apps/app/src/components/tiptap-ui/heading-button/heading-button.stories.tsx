import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {HeadingButton} from './heading-button'
import {TiptapStoryEditor} from '../../../../.storybook/decorators/with-tiptap-editor'

const meta = {
  title: 'Components/TiptapUI/HeadingButton',
  component: HeadingButton,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof HeadingButton>

export default meta
type Story = StoryObj<typeof meta>

export const Heading1: Story = {
  args: {level: 1},
  render: (args) => (
    <TiptapStoryEditor>
      <HeadingButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Heading2: Story = {
  args: {level: 2},
  render: (args) => (
    <TiptapStoryEditor>
      <HeadingButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const Heading3: Story = {
  args: {level: 3},
  render: (args) => (
    <TiptapStoryEditor>
      <HeadingButton {...args} />
    </TiptapStoryEditor>
  ),
}

export const WithText: Story = {
  args: {level: 2, text: 'Heading 2'},
  render: (args) => (
    <TiptapStoryEditor>
      <HeadingButton {...args} />
    </TiptapStoryEditor>
  ),
}
