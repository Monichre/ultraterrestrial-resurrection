import type {Meta, StoryObj} from '@storybook/react'
import {Earth} from './Earth'

const meta = {
  title: 'Components/Earth',
  component: Earth,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  decorators: [
    (Story) => (
      <div style={{width: '100%', height: '500px', position: 'relative'}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Earth>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isIdle: true,
    reduceMotion: false,
  },
}
