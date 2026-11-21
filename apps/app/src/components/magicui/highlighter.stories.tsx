import type {Meta, StoryObj} from '@storybook/react'
import {Highlighter} from './highlighter'

const meta = {
  title: 'Components/MagicUI/Highlighter',
  component: Highlighter,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Highlighter>

export default meta
type Story = StoryObj<typeof meta>

export const Highlight: Story = {
  render: () => (
    <p className='text-lg text-neutral-200'>
      This is a <Highlighter action='highlight' color='#ffd1dc'>highlighted text</Highlighter> example.
    </p>
  ),
}

export const Underline: Story = {
  render: () => (
    <p className='text-lg text-neutral-200'>
      This is an <Highlighter action='underline' color='#009688'>underlined text</Highlighter> example.
    </p>
  ),
}

export const Circle: Story = {
  render: () => (
    <p className='text-lg text-neutral-200'>
      This is a <Highlighter action='circle' color='#ff6b6b'>circled text</Highlighter> example.
    </p>
  ),
}

export const Box: Story = {
  render: () => (
    <p className='text-lg text-neutral-200'>
      This is a <Highlighter action='box' color='#4ecdc4'>boxed text</Highlighter> example.
    </p>
  ),
}
