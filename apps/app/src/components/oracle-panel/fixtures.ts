import type { OraclePanelData, OracleTask } from './types'

export const SAMPLE_TASKS: OracleTask[] = [
  {
    id: 'task-1',
    order: 1,
    task: 'Survey primary-source disclosure timelines from 1947–2024',
    executed: true,
    response: ['Indexed 42 hearings'],
    percentage: '100%',
  },
  {
    id: 'task-2',
    order: 2,
    task: 'Cross-reference witness testimony with radar/sensor events',
    executed: true,
    response: [],
    percentage: '72%',
  },
  {
    id: 'task-3',
    order: 3,
    task: 'Map organizational relationships (AATIP, AAWSAP, UAPTF)',
    executed: false,
    response: [],
    percentage: '41%',
  },
  {
    id: 'task-4',
    order: 4,
    task: 'Draft synthesis memo with evidentiary confidence tags',
    executed: false,
    response: [],
  },
  {
    id: 'task-5',
    order: 5,
    task: 'Propose follow-up queries for the mindmap agent',
    executed: false,
    response: [],
  },
]

export const SAMPLE_PANEL_DATA: OraclePanelData = {
  oracleChain: {
    id: 'stream-roswell-oracle',
    requirement:
      'Build an investigative recipe that reconstructs the Roswell paper trail and surfaces contradictions between official narratives and witness accounts.',
    workflow_list: SAMPLE_TASKS,
  },
  taskStatusMap: {
    'task-1': 'done',
    'task-2': 'done',
    'task-3': 'in_progress',
    'task-4': 'pending',
    'task-5': 'pending',
  },
}

export function cloneTasks( tasks: OracleTask[] ): OracleTask[] {
  return tasks.map( ( task ) => ( { ...task, response: [...task.response] } ) )
}
