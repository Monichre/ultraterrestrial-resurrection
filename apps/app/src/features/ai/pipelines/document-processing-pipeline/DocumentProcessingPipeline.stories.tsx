import type {Meta, StoryObj} from '@storybook/react'
import {DocumentProcessingPipeline} from './DocumentProcessingPipeline'

const meta: Meta<typeof DocumentProcessingPipeline> = {
  title: 'AI/Pipelines/DocumentProcessingPipeline',
  component: DocumentProcessingPipeline,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof DocumentProcessingPipeline>

export const Default: Story = {}
