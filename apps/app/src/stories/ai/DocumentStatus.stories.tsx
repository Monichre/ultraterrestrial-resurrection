import type {Meta, StoryObj} from '@storybook/react'
import {DocumentStatus} from '@repo/ai/components'

const nowIso = new Date().toISOString()

const meta: Meta<typeof DocumentStatus> = {
  title: 'AI/DocumentStatus',
  component: DocumentStatus,
  tags: ['autodocs'],
  args: {
    document: {
      id: 'doc_1',
      title: 'Sample Document',
      file_type: 'pdf',
      file_size: 1024 * 512,
      created_at: nowIso,
      status: 'processing',
      analysis: null,
      metadata: null,
      error: null,
      extracted_text: '',
    } as any,
    tasks: [
      {
        id: 't1',
        document_id: 'doc_1',
        task_type: 'extract',
        status: 'processed',
        created_at: nowIso,
      } as any,
      {
        id: 't2',
        document_id: 'doc_1',
        task_type: 'analyze',
        status: 'processing',
        created_at: nowIso,
      } as any,
    ],
  },
}

export default meta
type Story = StoryObj<typeof DocumentStatus>

export const Processing: Story = {}

export const Processed: Story = {
  args: {
    document: {status: 'processed'} as any,
  },
}

export const ErrorState: Story = {
  args: {
    document: {status: 'error', error: 'Failed to fetch status'} as any,
  },
}
