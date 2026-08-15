import type {Meta, StoryObj} from '@storybook/react'
import {NeonCursor} from './neon-cursor'

const meta = {
  title: 'Components/Cursors/NeonCursor',
  component: NeonCursor,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof NeonCursor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{width: '100%', height: '400px', position: 'relative'}}>
      <NeonCursor />
      <p className='text-neutral-400 p-8'>
        Move your mouse to see the neon cursor effect.
      </p>
    </div>
  ),
}
