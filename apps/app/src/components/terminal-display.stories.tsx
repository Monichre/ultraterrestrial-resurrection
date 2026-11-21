import type {Meta, StoryObj} from '@storybook/react'
import {TerminalDisplay} from './terminal-display'

const meta = {
  title: 'Components/Display/TerminalDisplay',
  component: TerminalDisplay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='relative w-full h-[400px] bg-black rounded-lg overflow-hidden'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TerminalDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
