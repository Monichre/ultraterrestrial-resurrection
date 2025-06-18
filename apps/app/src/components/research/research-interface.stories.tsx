import type { Meta, StoryObj } from '@storybook/react'
import { ResearchInterface } from './research-interface'
import { ResearchProvider } from '@/contexts/research/research-context'

const meta: Meta<typeof ResearchInterface> = {
  title: 'Research/ResearchInterface',
  component: ResearchInterface,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' }
      ]
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ResearchProvider>
        <Story />
      </ResearchProvider>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}

export const WithMockData: Story = {
  render: () => {
    // This would normally be handled by the ResearchProvider
    // but for Storybook we can mock the initial state
    return (
      <div className="h-screen bg-slate-900">
        <ResearchInterface />
      </div>
    )
  }
}

export const CompactMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ResearchProvider>
        <div className="h-[600px] max-w-6xl mx-auto border border-slate-700 rounded-lg overflow-hidden">
          <Story />
        </div>
      </ResearchProvider>
    )
  ]
}

export const SplitView: Story = {
  render: () => (
    <div className="h-screen bg-slate-900 flex">
      <div className="w-1/2 border-r border-slate-700">
        <div className="p-4 text-white">
          <h2 className="text-lg font-semibold mb-4">Mindmap View</h2>
          <div className="bg-slate-800 rounded-lg h-full flex items-center justify-center">
            <p className="text-slate-400">Mindmap Component</p>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <ResearchInterface />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <ResearchProvider>
        <Story />
      </ResearchProvider>
    )
  ]
}