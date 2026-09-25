type FlowNode = {
  id: string
  type?: string
  position?: {x: number; y: number}
  data?: Record<string, unknown>
}

type FlowResponse = {
  nodes: FlowNode[]
  edges: Array<Record<string, unknown>>
  xataResponse: {
    answer: string
    records: Array<Record<string, unknown>>
    sessionId: string
    isStreaming?: boolean
  }
}

export const fetchRecords = async (recordIds: string[], table: string) =>
  recordIds.map((id) => ({id, type: table, name: `${table} ${id}`}))

export const askAIAction = async ({question}: {question: string}) => ({
  answer: `Storybook fixture response for: ${question}`,
  records: [],
  sessionId: 'storybook',
})

export const xataToXYFlow = async (): Promise<FlowResponse> => ({
  nodes: [],
  edges: [],
  xataResponse: {
    answer: 'Storybook uses deterministic local graph fixtures.',
    records: [],
    sessionId: 'storybook',
  },
})

export const transformStreamResponse = async (
  streamingText: string,
  records: Array<Record<string, unknown>>,
  sessionId: string
): Promise<FlowResponse> => ({
  nodes: [],
  edges: [],
  xataResponse: {
    answer: streamingText,
    records,
    sessionId,
    isStreaming: false,
  },
})

export type ReactFlowNode = FlowNode
export type ReactFlowEdge = Record<string, unknown>
