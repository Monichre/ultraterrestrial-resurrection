import { Timeline } from '@/features/3d/3d-timeline-journey/timeline'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ThreeDTimeline',
  component: Timeline,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Timeline>

export default meta

type Story = StoryObj<typeof meta>

export const TimelineDemo: Story = {}
