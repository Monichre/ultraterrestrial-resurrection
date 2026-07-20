export type TaskStatus = 'done' | 'in_progress' | 'pending'

export type EditorStatus = 'normal' | 'duplicate' | null

export interface OracleTask {
  id: string
  order: number
  task: string
  executed: boolean
  response: string[]
  percentage?: string
}

export interface OracleChain {
  id: string
  requirement: string
  workflow_list: OracleTask[]
}

export interface OraclePanelData {
  oracleChain: OracleChain
  taskStatusMap: Record<string, TaskStatus>
}

export interface ConfirmRunPayload {
  streamId: string
  requirement: string
  workflow_list: OracleTask[]
  no_need_replan: boolean
  user_confirm: true
}

export interface DuplicateRunPayload {
  streamId: string
  requirement: string
  workflow_list: OracleTask[]
  no_need_replan: true
  user_confirm: true
}
