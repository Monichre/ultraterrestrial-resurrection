import type {Meta, StoryObj} from '@storybook/react'
import {Video} from './video'

const meta = {
  title: 'Components/Video',
  component: Video,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Video>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    video: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  },
}
