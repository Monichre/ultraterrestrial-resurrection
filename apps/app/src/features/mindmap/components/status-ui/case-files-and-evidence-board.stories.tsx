import type { Meta, StoryObj } from '@storybook/react'
import { CaseFilesAndEvidenceBoard } from './case-files-and-evidence-board'

const meta = {
  title: 'Features/Mindmap/Status UI/CaseFilesAndEvidenceBoard',
  component: CaseFilesAndEvidenceBoard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black/90 relative">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CaseFilesAndEvidenceBoard>

export default meta
type Story = StoryObj<typeof meta>

// Default state showing the collapsed tab
export const Default: Story = {}

// Shows the expanded state with evidence cards
export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the case files panel in its expanded state with evidence cards visible.',
      },
    },
  },
  render: () => {
    // Force the component into expanded state for this story
    return (
      <div className="min-h-screen bg-black/90 relative">
        <div className="fixed right-0 top-[40px] z-40" style={{ width: '32rem' }}>
          <div className="w-full h-full bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 rounded-l-md overflow-hidden shadow-[0_0_15px_rgba(173,240,221,0.15)]">
            <CaseFilesAndEvidenceBoard />
          </div>
        </div>
      </div>
    )
  },
}

// Shows interaction with hover states
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates hover and interaction states of the component.',
      },
    },
  },
}

// Shows the component in a layout context
export const InLayout: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-black/90 flex">
        <div className="flex-1 relative">
          <div className="p-8">
            <h1 className="text-white text-2xl mb-4">Main Content Area</h1>
            <p className="text-gray-400">Content goes here...</p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
}