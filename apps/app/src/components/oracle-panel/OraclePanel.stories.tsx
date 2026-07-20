'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {fn} from '@storybook/test'
import type {ReactNode} from 'react'
import {Toaster} from 'sonner'
import {CircularProgressBar} from './CircularProgressBar'
import {OraclePanel} from './OraclePanel'
import {OraclePanelDemo} from './OraclePanelDemo'
import {OracleTaskItem} from './OracleTaskItem'
import {SAMPLE_PANEL_DATA, SAMPLE_TASKS} from './fixtures'

function StoryShell({children}: {children: ReactNode}) {
  return (
    <div className='min-h-screen bg-[#f4f4f5] px-6 py-10'>
      <Toaster position='top-center' richColors />
      <div className='mx-auto w-full max-w-md'>{children}</div>
    </div>
  )
}

const meta = {
  title: 'Components/OraclePanel',
  component: OraclePanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <StoryShell>
        <Story />
      </StoryShell>
    ),
  ],
  args: {
    data: SAMPLE_PANEL_DATA,
    isGenerating: false,
    progress: 0.45,
    onConfirmRun: fn(),
    onDuplicateRun: fn(),
    onShare: fn(),
    onScrollTasks: fn(),
  },
} satisfies Meta<typeof OraclePanel>

export default meta

type Story = StoryObj<typeof meta>

/** Default viewing state — running recipe with mixed task statuses. */
export const Default: Story = {}

/** Progress fill behind the action bar. */
export const MidProgress: Story = {
  args: {
    progress: 0.68,
  },
}

/** Confirm button shows Generating… and is disabled. */
export const Generating: Story = {
  args: {
    isGenerating: true,
    progress: 0.82,
  },
}

/** Interactive demo with confirm / duplicate handlers and event log. */
export const InteractiveDemo: StoryObj = {
  render: () => <OraclePanelDemo scenario='in-progress' />,
  parameters: {
    docs: {
      description: {
        story:
          'Full component demo: edit recipe, insert steps, mark for removal, confirm or duplicate & re-run.',
      },
    },
  },
}

export const FreshRecipeDemo: StoryObj = {
  name: 'Demo · Fresh recipe',
  render: () => <OraclePanelDemo scenario='fresh' />,
}

export const CompleteRecipeDemo: StoryObj = {
  name: 'Demo · Complete recipe',
  render: () => <OraclePanelDemo scenario='complete' />,
}

/** Isolated task row statuses. */
export const TaskStatuses: StoryObj = {
  render: () => (
    <div className='space-y-3 rounded-[1.25rem] bg-white p-4 shadow'>
      <OracleTaskItem item={SAMPLE_TASKS[0]} status='done' />
      <OracleTaskItem item={SAMPLE_TASKS[2]} status='in_progress' />
      <OracleTaskItem item={SAMPLE_TASKS[4]} status='pending' />
    </div>
  ),
}

/** Circular progress companion used beside the panel. */
export const ProgressRing: StoryObj = {
  render: () => (
    <div className='flex items-center gap-6 rounded-[1.25rem] bg-white p-6 shadow'>
      <CircularProgressBar value={0} />
      <CircularProgressBar value={35} />
      <CircularProgressBar value={72} />
      <CircularProgressBar value={100} />
    </div>
  ),
}
