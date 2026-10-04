import type {Meta, StoryObj} from '@storybook/react'
import {CustomCursor} from './CustomCursor'

const meta = {
  title: 'Components/Cursors/CustomCursor',
  component: CustomCursor,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof CustomCursor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{width: '100%', height: '400px', position: 'relative'}}>
      <CustomCursor />
      <p className='text-neutral-400 p-8'>
        Move your mouse to see the custom cursor in action.
      </p>
    </div>
  ),
}
