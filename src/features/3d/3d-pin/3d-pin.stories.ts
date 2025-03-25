import { ThreeDPinCard } from '@/features/3d/3d-pin/3d-pin-card'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

const meta = {
  title: 'Components/ThreeDPin',
  component: ThreeDPinCard,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ThreeDPinCard>

export default meta

type Story = StoryObj<typeof meta>

export const ThreeDPinDemo: Story = {
  args: {},
}
