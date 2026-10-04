import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { FolderInteraction } from './FolderInteraction'

const meta = {
  title: 'Components/FolderInteraction',
  component: FolderInteraction,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f0e11' },
        { name: 'mid', value: '#1c1820' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FolderInteraction>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className='flex min-h-[320px] w-[min(28rem,90vw)] items-center justify-center pt-16'>
        <Story />
      </div>
    ),
  ],
}

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
  decorators: [
    (Story) => (
      <div className='flex min-h-[360px] w-[min(28rem,90vw)] items-center justify-center pt-24'>
        <Story />
      </div>
    ),
  ],
}

export const Controlled: Story = {
  render: function ControlledFolder() {
    const [open, setOpen] = useState(false)
    return (
      <div className='flex min-h-[360px] w-[min(28rem,90vw)] flex-col items-center gap-4 pt-16'>
        <p className='text-xs tracking-wide text-white/50'>
          Controlled · {open ? 'open' : 'closed'}
        </p>
        <FolderInteraction open={open} onOpenChange={setOpen} />
        <button
          type='button'
          className='rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80'
          onClick={() => setOpen((v) => !v)}
        >
          Toggle from outside
        </button>
      </div>
    )
  },
}
