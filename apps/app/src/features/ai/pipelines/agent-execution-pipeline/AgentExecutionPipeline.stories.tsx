import type {Meta, StoryObj} from '@storybook/react'
import {AgentExecutionPipeline} from './AgentExecutionPipeline'

const meta: Meta<typeof AgentExecutionPipeline> = {
  title: 'AI/Pipelines/AgentExecutionPipeline',
  component: AgentExecutionPipeline,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AgentExecutionPipeline>

export const Default: Story = {}
