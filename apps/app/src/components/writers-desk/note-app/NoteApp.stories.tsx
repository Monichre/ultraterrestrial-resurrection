'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {NoteApp} from './NoteApp'

const meta = {
  title: 'Writers Desk/NoteApp',
  component: NoteApp,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  decorators: [
    (Story) => (
      <div className='wd-paper-research min-h-screen p-8'>
        <div className='relative mx-auto max-w-6xl'>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof NoteApp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
