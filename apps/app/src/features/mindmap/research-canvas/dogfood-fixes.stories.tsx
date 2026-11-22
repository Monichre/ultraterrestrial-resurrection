import type {Meta, StoryObj} from '@storybook/nextjs'
import {expect, userEvent, waitFor, within} from '@storybook/test'
import {ReactFlow, ReactFlowProvider, type Edge, type Node, type NodeProps} from '@xyflow/react'
import {useEffect, useMemo, useState, type ReactNode} from 'react'

import {AnimatedMarkdown} from '@/features/mindmap/nodes/user-input-node/animated-markdown'
import {SiblingEdge} from '@/features/mindmap/edges/SiblingEdge'
import {waitForStableMeasure} from '@/features/mindmap/layouts/wait-for-stable-measure'
import {stripEmbedding} from '@/services/ai/tools/strip-embedding'
import {TourChips} from '@/features/mindmap/tours/tour-chips'

import {EmptyCanvas} from './EmptyCanvas'
import ResearchCanvasConsole from './research-canvas-console'
import {buildDogfoodLayout, type DogfoodCard} from './dogfood-layout-fixture'
import './canvas-animations.css'

const meta = {
  title: 'Research Canvas/Dogfood Fixes',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark'},
    needsMindMap: true,
    docs: {
      description: {
        component:
          'Demos of the research-canvas dogfood fixes. Prometheus streaming lives under Pages/Prometheus/Agent. The 5-step tool limit and the 30s object timeout are server settings; the prose story is the visible side of the answer-format instruction.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const PROSE =
  'The 1947 press release **claimed** a flying disc.\n\n- The Army later said it was a weather balloon.\n- Both readings stay on the record.'
const RAW_JSON = '{"answer":"disc","analysis_summary":"cover-up"}'

const DATABASE_ROW = {
  id: 'rec_roswell',
  title: 'Roswell debris',
  embedding: Array.from({length: 1536}, () => 0.125),
}

function Frame({width, height, children}: {width: number; height: number; children: ReactNode}) {
  return (
    <div
      className='ut-canvas'
      style={{width, height, background: 'var(--ut-void)', color: 'var(--ut-paper)'}}
    >
      {children}
    </div>
  )
}

async function expectChipsAboveInput(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  const chip = canvas.getByRole('button', {name: 'Nuclear Shadow'})
  const input = canvas.getByRole('textbox')
  const chipBox = chip.getBoundingClientRect()
  const inputBox = input.getBoundingClientRect()
  await expect(chipBox.height).toBeGreaterThan(0)
  await expect(inputBox.height).toBeGreaterThan(0)
  await expect(chipBox.bottom).toBeLessThanOrEqual(inputBox.top + 1)
}

export const EmptyCanvasChips: Story = {
  name: 'Tour chips sit above the empty-canvas input',
  render: () => (
    <Frame width={1280} height={577}>
      <EmptyCanvas chips={<TourChips onStart={() => {}} />} onSubmit={() => {}} />
    </Frame>
  ),
  play: async ({canvasElement}) => {
    await expectChipsAboveInput(canvasElement)
  },
}

export const CompactConsoleChips: Story = {
  name: 'Tour chips sit above the compact console',
  render: () => (
    <Frame width={1280} height={577}>
      <div className='flex h-full w-full items-end px-4 pb-6'>
        <ResearchCanvasConsole
          variant='compact'
          chips={<TourChips onStart={() => {}} />}
          onSubmit={() => {}}
        />
      </div>
    </Frame>
  ),
  play: async ({canvasElement}) => {
    await expectChipsAboveInput(canvasElement)
  },
}

const fixtureNodeTypes = {
  fixture: ({data}: NodeProps) => {
    const card = data as DogfoodCard
    const border =
      card.kind === 'answer'
        ? 'oklch(0.93 0.015 90 / 0.7)'
        : card.kind === 'agent'
          ? 'oklch(0.58 0.19 27 / 0.8)'
          : card.kind === 'fixed'
            ? 'oklch(0.87 0.02 85 / 0.35)'
            : 'oklch(0.87 0.02 85 / 0.55)'
    return (
      <div
        className='h-full w-full overflow-hidden rounded-xl border p-3'
        style={{borderColor: border, background: 'oklch(0.21 0.008 85 / 0.92)'}}
      >
        <div className='text-[10px] uppercase tracking-[0.14em] text-[var(--ut-ink-dim)]'>
          {card.kicker}
        </div>
        <div className='mt-1 text-sm text-[var(--ut-paper)]'>{card.title}</div>
        <div className='mt-2 text-xs leading-relaxed text-[var(--ut-ink-dim)]'>{card.body}</div>
      </div>
    )
  },
}

function LayoutDemo() {
  const layout = useMemo(() => buildDogfoodLayout(), [])
  const nodes: Node[] = layout.cards.map((card) => ({
    id: card.id,
    type: 'fixture',
    position: card.position,
    data: card,
    draggable: false,
    style: {width: card.width, height: card.height},
  }))
  const edges: Edge[] = layout.edges.map((edge) => ({...edge, type: 'smoothstep'}))
  const report = [
    `overlapping pairs ${layout.overlapCount}`,
    `records below ${layout.recordsBelowAnswer}`,
    `agents above ${layout.agentsAboveAnswer}`,
    `answer stayed ${layout.answerStayed}`,
    `fixed stayed ${layout.fixedStayed}`,
    `parentId on records ${layout.recordsHaveParent}`,
  ].join(' · ')

  return (
    <Frame width={1100} height={760}>
      <div className='flex h-full flex-col'>
        <p
          data-testid='layout-report'
          className='px-4 pt-3 font-mono text-xs text-[var(--ut-ink-dim)]'
        >
          {report}
        </p>
        <p className='px-4 pb-3 text-xs text-[var(--ut-ink-faint)]'>
          Agent cards here are 180×72. The row step is a fixed 160px, so a taller personnel card can
          still overlap the answer.
        </p>
        <div className='min-h-0 flex-1'>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={fixtureNodeTypes}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              proOptions={{hideAttribution: true}}
              defaultEdgeOptions={{
                style: {stroke: 'oklch(0.87 0.02 85 / 0.45)', strokeWidth: 1.5},
              }}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </Frame>
  )
}

export const RecordsBelowAnswer: Story = {
  name: 'Records sit below the answer, agent nodes above',
  render: () => <LayoutDemo />,
  play: async ({canvasElement}) => {
    const report = within(canvasElement).getByTestId('layout-report').textContent ?? ''
    await expect(report).toContain('overlapping pairs 0')
    await expect(report).toContain('records below true')
    await expect(report).toContain('agents above true')
    await expect(report).toContain('answer stayed true')
    await expect(report).toContain('fixed stayed true')
    await expect(report).toContain('parentId on records false')
  },
}

function MeasureDemo() {
  const [report, setReport] = useState('measuring')
  useEffect(() => {
    const heights = [40, 120, 200, 200, 200, 200]
    const seen: number[] = []
    let frame = 0
    const getNodes = () => {
      const height = heights[Math.min(frame, heights.length - 1)]
      frame += 1
      seen.push(height)
      return [
        {
          id: 'answer',
          position: {x: 0, y: 0},
          data: {},
          measured: {width: 460, height},
        },
      ] as Node[]
    }
    let cancelled = false
    void waitForStableMeasure(getNodes, 'answer').then((node) => {
      if (cancelled) return
      setReport(`read ${seen.join(', ')} → stable ${node?.measured?.height ?? 'missing'}`)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Frame width={720} height={220}>
      <div className='flex h-full flex-col justify-center gap-3 px-8'>
        <p className='text-xs uppercase tracking-[0.14em] text-[var(--ut-ink-dim)]'>
          waitForStableMeasure
        </p>
        <p data-testid='measure-report' className='font-mono text-sm'>
          {report}
        </p>
        <p className='text-xs text-[var(--ut-ink-dim)]'>
          The first two sizes are ignored. Layout uses the size that holds for three frames.
        </p>
      </div>
    </Frame>
  )
}

export const StableMeasure: Story = {
  name: 'Layout waits until the answer size holds still',
  render: () => <MeasureDemo />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText(/stable 200/)).toBeTruthy()
  },
}

const siblingNodes: Node[] = [
  {
    id: 'answer',
    position: {x: 40, y: 40},
    data: {label: 'Answer', type: 'query'},
    width: 220,
    height: 80,
    measured: {width: 220, height: 80},
    style: {width: 220, height: 80, color: 'white'},
  },
  {
    id: 'record',
    position: {x: 420, y: 220},
    data: {label: 'Roswell debris', type: 'events'},
    width: 220,
    height: 80,
    measured: {width: 220, height: 80},
    style: {width: 220, height: 80, color: 'white'},
  },
]

const siblingEdges: Edge[] = [
  {
    id: 'sibling',
    source: 'answer',
    target: 'record',
    type: 'siblingEdge',
    label: 'Answer::Record',
  },
]

const siblingEdgeTypes = {siblingEdge: SiblingEdge}

export const SiblingEdgeRenders: Story = {
  name: 'Sibling edge draws between the answer and a record',
  parameters: {needsMindMap: true},
  render: () => (
    <Frame width={960} height={560}>
      <ReactFlow
        nodes={siblingNodes}
        edges={siblingEdges}
        edgeTypes={siblingEdgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{hideAttribution: true}}
      />
    </Frame>
  ),
  play: async ({canvasElement}) => {
    await waitFor(() => {
      if (!canvasElement.querySelector('.react-flow__edge-path')) {
        throw new Error('sibling edge did not draw a path')
      }
    })
    await expect(within(canvasElement).queryByText('MindMap Context Error')).toBeNull()
  },
}

function EmbeddingDemo() {
  const slim = stripEmbedding(DATABASE_ROW)
  return (
    <Frame width={720} height={280}>
      <div
        data-testid='embedding-report'
        className='flex h-full flex-col justify-center gap-2 px-8 font-mono text-sm'
      >
        <p>row keys: {Object.keys(DATABASE_ROW).join(', ')}</p>
        <p>shipped keys: {Object.keys(slim).join(', ')}</p>
        <p>row chars: {JSON.stringify(DATABASE_ROW).length}</p>
        <p>shipped chars: {JSON.stringify(slim).length}</p>
      </div>
    </Frame>
  )
}

export const EmbeddingStripped: Story = {
  name: 'Search rows ship without the embedding vector',
  render: () => <EmbeddingDemo />,
  play: async ({canvasElement}) => {
    const report = within(canvasElement).getByTestId('embedding-report').textContent ?? ''
    await expect(report).toContain('row keys: id, title, embedding')
    await expect(report).toContain('shipped keys: id, title')
    await expect(report).not.toContain('shipped keys: id, title, embedding')
    const rowChars = Number(report.match(/row chars: (\d+)/)?.[1])
    const shippedChars = Number(report.match(/shipped chars: (\d+)/)?.[1])
    await expect(shippedChars).toBeLessThan(rowChars)
  },
}

function AnswerCopy({label, text, testId}: {label: string; text: string; testId: string}) {
  return (
    <div
      data-testid={testId}
      className='w-[420px] rounded-xl border p-4'
      style={{borderColor: 'var(--ut-line)', background: 'var(--ut-surface)'}}
    >
      <div className='mb-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ut-ink-dim)]'>
        {label}
      </div>
      <AnimatedMarkdown className='text-sm text-[var(--ut-paper)]'>{text}</AnimatedMarkdown>
    </div>
  )
}

export const ProseAnswer: Story = {
  name: 'The answer renders as prose',
  render: () => (
    <Frame width={980} height={420}>
      <div className='flex h-full items-center justify-center gap-6 px-6'>
        <AnswerCopy label='What the model used to return' text={RAW_JSON} testId='json-answer' />
        <AnswerCopy label='What the route now asks for' text={PROSE} testId='prose-answer' />
      </div>
    </Frame>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('json-answer').textContent).toContain('analysis_summary')
    const claimed = await within(canvas.getByTestId('prose-answer')).findByText('claimed')
    await expect(claimed.tagName).toBe('STRONG')
    await expect(
      within(canvas.getByTestId('prose-answer')).getByText(/weather balloon/)
    ).toBeTruthy()
  },
}

type ConsoleCallsWindow = Window & {__consoleCalls?: string[]}

export const ConsoleRowSubmitsOnce: Story = {
  name: 'A suggestion row submits exactly one canvas action',
  render: () => {
    const win = window as ConsoleCallsWindow
    win.__consoleCalls = []
    return (
      <Frame width={1280} height={577}>
        <div className='flex h-full w-full items-end px-4 pb-6'>
          <ResearchCanvasConsole
            variant='compact'
            onSubmit={(value) => {
              win.__consoleCalls?.push(value)
            }}
          />
        </div>
      </Frame>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const win = window as ConsoleCallsWindow
    // First submit goes through MessageInput ("Send" at this commit, "Ask ↵"
    // in the WIP tree); the enhanced panel mounts after it and only runs its
    // typing animation on a second submit inside it.
    await userEvent.type(canvas.getByRole('textbox'), 'roswell')
    await userEvent.click(canvas.getByRole('button', {name: /ask|send/i}))
    const panelInput = await canvas.findByPlaceholderText('Ask about UFO phenomena...')
    await userEvent.type(panelInput, 'roswell')
    await userEvent.keyboard('{Enter}')
    const row = await canvas.findByText('Guided Tour', {}, {timeout: 15000})
    const clickable = row.closest('div[class*="cursor-pointer"]') ?? row
    await userEvent.click(clickable as Element)
    // Wait for the animation to reach 'complete' — past the deferred-submit
    // window — then the whole call history must be exactly these two submits.
    await canvas.findByText(/Based on your query/, {}, {timeout: 15000})
    await expect(win.__consoleCalls).toEqual(['roswell', 'Start guided tour: The Nuclear Shadow'])
  },
}
