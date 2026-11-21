import type {Meta, StoryObj} from '@storybook/react'
import {Spacer} from './spacer'

const meta = {
  title: 'Components/TiptapUIPrimitive/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Spacer>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div style={{width: 400, display: 'flex', border: '1px dashed rgba(255,255,255,0.2)'}}>
      <span>Left</span>
      <Spacer orientation="horizontal" />
      <span>Right</span>
    </div>
  ),
}

export const FixedSize: Story = {
  args: {
    size: '48px',
    orientation: 'horizontal',
  },
}
