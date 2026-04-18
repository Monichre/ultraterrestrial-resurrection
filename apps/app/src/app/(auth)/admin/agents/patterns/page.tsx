export const dynamic = 'force-dynamic'

import {AgentExecutionPipeline} from '@/features/ai/pipelines/agent-execution-pipeline/AgentExecutionPipeline'

export const maxDuration = 120 // Applies to the actions

export default function Page() {
  return <AgentExecutionPipeline />
}
