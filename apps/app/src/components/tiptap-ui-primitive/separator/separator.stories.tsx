import type {Meta, StoryObj} from '@storybook/react'
import {Separator} from './separator'

const meta = {
  title: 'Components/TiptapUIPrimitive/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div style={{height: 48, display: 'flex', alignItems: 'center'}}>
      <Separator {...args} />
    </div>
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div style={{width: 200}}>
      <Separator {...args} />
    </div>
  ),
}
