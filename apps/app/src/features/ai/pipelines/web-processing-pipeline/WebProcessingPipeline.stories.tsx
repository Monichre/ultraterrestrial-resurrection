import type { Meta, StoryObj } from '@storybook/react'
import WebProcessingPipeline from './WebProcessingPipeline'

const meta: Meta<typeof WebProcessingPipeline> = {
  title: 'AI/Pipelines/WebProcessingPipeline',
  component: WebProcessingPipeline,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WebProcessingPipeline>

export const Default: Story = {}
