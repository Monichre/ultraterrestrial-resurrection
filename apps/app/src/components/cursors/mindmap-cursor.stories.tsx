import type {Meta, StoryObj} from '@storybook/react'
import {GooeyCursor} from './mindmap-cursor'

const meta = {
  title: 'Components/Cursors/MindmapCursor',
  component: GooeyCursor,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof GooeyCursor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{width: '100%', height: '400px', position: 'relative'}}>
      <GooeyCursor />
      <p className='text-neutral-400 p-8'>
        Move your mouse to see the gooey cursor effect.
      </p>
    </div>
  ),
}
