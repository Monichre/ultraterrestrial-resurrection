import type { Meta, StoryObj } from '@storybook/react'
import { RAGSettingsPanel } from './rag-settings'

const meta = {
  title: 'Features/Research Canvas/Admin/RAGSettingsPanel',
  component: RAGSettingsPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Administrative panel for configuring RAG (Retrieval-Augmented Generation) integration settings including local and remote server options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't accept props in current implementation
  },
} satisfies Meta<typeof RAGSettingsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default RAG settings panel with local and remote configuration options.',
      },
    },
  },
}

export const FullscreenLayout: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'RAG settings panel in fullscreen layout to show form behavior in larger space.',
      },
    },
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h1 className="text-2xl font-bold mb-6"> Administration Panel </h1>
      <Story />
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'RAG settings panel within an admin container context.',
      },
  },
},
}
