import type { Meta, StoryObj } from '@storybook/nextjs'
import type { ReactNode } from 'react'
import ApprovalCard from './ApprovalCard'
import ChatComposer from './ChatComposer'
import CodeBlock from './CodeBlock'
import ContextCards from './ContextCards'
import DiffTable from './DiffTable'
import FilterTable from './FilterTable'
import FineTuneCard from './FineTuneCard'
import InsightCards from './InsightCards'
import LoadingState from './LoadingState'
import RecommendationCard from './RecommendationCard'
import RecordsTable from './RecordsTable'
import SearchList from './SearchList'
import SidebarNav from './SidebarNav'
import StreamingText from './StreamingText'
import TaskRows from './TaskRows'
import ThinkingState from './ThinkingState'
import ToolChips from './ToolChips'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className='space-y-3'>
      <h3 className='text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3'>{title}</h3>
      <div className='w-full max-w-[720px]'>{children}</div>
    </section>
  )
}

function BeautifulUiGallery() {
  return (
    <div className='mx-auto flex max-w-[760px] flex-col gap-10 py-4'>
      <header className='space-y-1'>
        <p className='text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3'>Beautiful UI</p>
        <h2 className='text-[22px] font-semibold tracking-[-0.02em] text-ink'>
          AI-native primitives (Turbo showcase)
        </h2>
        <p className='text-[13px] text-ink-2'>
          Extracted from{' '}
          <a
            className='text-accent-ink underline-offset-2 hover:underline'
            href='https://beautiful-ui-five.vercel.app/'
            target='_blank'
            rel='noreferrer'
          >
            beautiful-ui-five.vercel.app
          </a>
        </p>
      </header>

      <Section title='01 · Loading State'>
        <div className='flex flex-wrap gap-6'>
          <LoadingState variant='Drive' />
          <LoadingState variant='Dots' />
          <LoadingState variant='Orbit' />
        </div>
      </Section>
      <Section title='02 · Thinking'>
        <div className='grid gap-4 md:grid-cols-2'>
          <ThinkingState variant='Steps' />
          <ThinkingState variant='Reasoning' />
          <ThinkingState variant='Search' />
          <ThinkingState variant='Coding' />
        </div>
      </Section>
      <Section title='03 · Streaming Text'>
        <StreamingText />
      </Section>
      <Section title='04 · Approval Card'>
        <ApprovalCard />
      </Section>
      <Section title='05 · Tool Chips'>
        <ToolChips />
      </Section>
      <Section title='06 · Task Rows'>
        <div className='grid gap-4 md:grid-cols-2'>
          <TaskRows variant='Capsules' />
          <TaskRows variant='List' />
        </div>
      </Section>
      <Section title='07 · Chat'>
        <ChatComposer />
      </Section>
      <Section title='08 · Recommendation Card'>
        <RecommendationCard />
      </Section>
      <Section title='09 · Context Cards'>
        <ContextCards />
      </Section>
      <Section title='10 · Diff Table'>
        <DiffTable />
      </Section>
      <Section title='11 · Records Table'>
        <RecordsTable />
      </Section>
      <Section title='12 · Filter Table'>
        <FilterTable />
      </Section>
      <Section title='13 · Sidebar Nav'>
        <div className='h-[420px] max-w-[260px] overflow-hidden rounded-[10px] shadow-card'>
          <SidebarNav />
        </div>
      </Section>
      <Section title='14 · Search'>
        <SearchList />
      </Section>
      <Section title='15 · Insight Cards'>
        <InsightCards />
      </Section>
      <Section title='16 · Code Block'>
        <CodeBlock />
      </Section>
      <Section title='17 · Fine-tune Card'>
        <FineTuneCard />
      </Section>
    </div>
  )
}

const meta = {
  title: 'Design System/Beautiful UI/Gallery',
  component: BeautifulUiGallery,
  decorators: [withBeautifulUiTheme],
  parameters: {
    ...beautifulUiParameters,
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BeautifulUiGallery>

export default meta
type Story = StoryObj<typeof meta>

export const AllPrimitives: Story = {}

export const Dark: Story = {
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}
