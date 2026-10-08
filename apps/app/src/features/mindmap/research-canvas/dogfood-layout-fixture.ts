import {organizeNodeLayout, type ReactFlowNode} from '@/features/mindmap/layouts/organizeNodeLayout'
import {placeAgentNodeAboveAnswer} from '@/features/mindmap/layouts/place-agent-node'

export const ANSWER_WIDTH = 460
export const ANSWER_HEIGHT = 200
export const RECORD_WIDTH = 340
export const RECORD_HEIGHT = 180
export const AGENT_WIDTH = 180
export const AGENT_HEIGHT = 72

const ANSWER_POSITION = {x: 240, y: 260}
const FIXED_POSITION = {x: 980, y: 80}

export type DogfoodKind = 'answer' | 'record' | 'agent' | 'fixed'

export type DogfoodCard = {
  id: string
  kind: DogfoodKind
  kicker: string
  title: string
  body: string
  position: {x: number; y: number}
  width: number
  height: number
}

export type DogfoodEdge = {id: string; source: string; target: string}

function overlaps(a: DogfoodCard, b: DogfoodCard) {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  )
}

export function buildDogfoodLayout() {
  const answer: ReactFlowNode = {
    id: 'answer',
    type: 'userInputNode',
    position: {...ANSWER_POSITION},
    measured: {width: ANSWER_WIDTH, height: ANSWER_HEIGHT},
    data: {},
  }
  const fixed: ReactFlowNode = {
    id: 'fixed',
    type: 'enhancedEntityNode',
    position: {...FIXED_POSITION},
    measured: {width: RECORD_WIDTH, height: RECORD_HEIGHT},
    data: {},
  }
  const recordTitles = [
    {id: 'debris', title: 'Roswell debris'},
    {id: 'mogul', title: 'Project Mogul'},
    {id: 'ramey', title: 'Ramey memo'},
  ]
  const records: ReactFlowNode[] = recordTitles.map((record) => ({
    id: record.id,
    type: 'enhancedEntityNode',
    position: {x: 0, y: 0},
    data: {title: record.title},
  }))

  const recordEdges = records.map((record) => ({
    id: `edge-answer-${record.id}`,
    source: 'answer',
    target: record.id,
  }))

  const laidOut = organizeNodeLayout([answer, fixed, ...records], recordEdges, {
    direction: 'horizontal',
    parentChildSpacing: 100,
    siblingSpacing: 50,
    centerChildren: true,
    preserveExistingLayout: true,
  })
  const byId = new Map(laidOut.map((node) => [node.id, node]))
  const answerNode = byId.get('answer')
  const fixedNode = byId.get('fixed')
  if (!answerNode || !fixedNode) throw new Error('layout dropped the answer or the fixed record')

  const agents = [
    {id: 'marcel', title: 'Jesse Marcel'},
    {id: 'ramey-agent', title: 'Roger Ramey'},
  ].map((agent, index) => ({
    ...agent,
    position: placeAgentNodeAboveAnswer(index, answerNode.position, ANSWER_WIDTH),
  }))

  const cards: DogfoodCard[] = [
    {
      id: 'answer',
      kind: 'answer',
      kicker: 'Answer',
      title: 'What was claimed about the Roswell debris?',
      body: 'The 1947 release claimed a flying disc. The Army later said the debris was a weather balloon. Neither reading is proof.',
      position: answerNode.position,
      width: ANSWER_WIDTH,
      height: ANSWER_HEIGHT,
    },
    ...records.map((record) => ({
      id: record.id,
      kind: 'record' as const,
      kicker: 'Record',
      title: String(record.data.title),
      body: 'Laid out below the answer. No parentId.',
      position: byId.get(record.id)?.position ?? {x: 0, y: 0},
      width: RECORD_WIDTH,
      height: RECORD_HEIGHT,
    })),
    ...agents.map((agent) => ({
      id: agent.id,
      kind: 'agent' as const,
      kicker: 'Agent node',
      title: agent.title,
      body: 'Row above the answer.',
      position: agent.position,
      width: AGENT_WIDTH,
      height: AGENT_HEIGHT,
    })),
    {
      id: 'fixed',
      kind: 'fixed',
      kicker: 'Already on the canvas',
      title: 'Trinity witness',
      body: 'Preserve mode leaves this position alone.',
      position: fixedNode.position,
      width: RECORD_WIDTH,
      height: RECORD_HEIGHT,
    },
  ]

  let overlapCount = 0
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (overlaps(cards[i], cards[j])) overlapCount += 1
    }
  }

  const answerBottom = answerNode.position.y + ANSWER_HEIGHT
  const recordsBelowAnswer = records.every(
    (record) => (byId.get(record.id)?.position.y ?? 0) >= answerBottom
  )
  const agentsAboveAnswer = agents.every(
    (agent) => agent.position.y + AGENT_HEIGHT <= answerNode.position.y
  )

  const edges: DogfoodEdge[] = [
    ...recordEdges,
    ...agents.map((agent) => ({
      id: `edge-answer-${agent.id}`,
      source: 'answer',
      target: agent.id,
    })),
  ]

  return {
    cards,
    edges,
    overlapCount,
    recordsBelowAnswer,
    agentsAboveAnswer,
    answerStayed:
      answerNode.position.x === ANSWER_POSITION.x && answerNode.position.y === ANSWER_POSITION.y,
    fixedStayed:
      fixedNode.position.x === FIXED_POSITION.x && fixedNode.position.y === FIXED_POSITION.y,
    recordsHaveParent: records.some((record) => Boolean(byId.get(record.id)?.parentId)),
  }
}
