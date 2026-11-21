import type {Meta, StoryObj} from '@storybook/react'
import {Input, InputGroup} from './input'

const meta = {
  title: 'Components/TiptapUIPrimitive/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Type something...',
    type: 'text',
  },
}

export const InGroup: Story = {
  render: () => (
    <InputGroup style={{width: 300}}>
      <Input type="url" placeholder="Paste a link..." />
    </InputGroup>
  ),
}
