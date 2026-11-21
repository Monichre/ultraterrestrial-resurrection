import type {Meta, StoryObj} from '@storybook/react'
import {ScrollText} from './scroll-text'

const meta = {
  title: 'Components/DemoLanding/ScrollText',
  component: ScrollText,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden bg-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    scrollProgress: 0,
  },
}

export const MidProgress: Story = {
  args: {
    scrollProgress: 0.5,
  },
}

export const NearComplete: Story = {
  args: {
    scrollProgress: 0.96,
  },
}
