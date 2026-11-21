'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {NoteLetter} from './NoteLetter'
import {NoteWidget} from './NoteWidget'

const meta = {
  title: 'Writers Desk/NoteLetter',
  component: NoteLetter,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof NoteLetter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <main className='wd-paper-desk flex min-h-screen items-start justify-center'>
        <Story />
      </main>
    ),
  ],
}

export const Compact: Story = {
  args: {compact: true},
  decorators: [
    (Story) => (
      <div className='wd-paper-desk min-h-screen p-8'>
        <div className='mx-auto max-w-xl'>
          <Story />
        </div>
      </div>
    ),
  ],
}

export const Widget: StoryObj<typeof NoteWidget> = {
  render: () => <NoteWidget />,
  decorators: [
    (Story) => (
      <div className='wd-paper-research min-h-screen p-8'>
        <Story />
      </div>
    ),
  ],
}
