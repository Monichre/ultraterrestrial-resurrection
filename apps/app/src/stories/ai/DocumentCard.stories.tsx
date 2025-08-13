import type {Meta, StoryObj} from '@storybook/react'
import {DocumentCard} from '@repo/ai/components'

const nowIso = new Date().toISOString()

const meta: Meta<typeof DocumentCard> = {
  title: 'AI/DocumentCard',
  component: DocumentCard,
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
    chunks: [],
    entities: [],
  },
}

export default meta
type Story = StoryObj<typeof DocumentCard>

export const Processing: Story = {}

export const ErrorState: Story = {
  args: {
    document: {
      id: 'doc_err',
      title: 'Broken Doc',
      file_type: 'txt',
      file_size: 2048,
      created_at: nowIso,
      status: 'error',
      analysis: null,
      metadata: null,
      error: 'Failed to process',
      extracted_text: '',
    } as any,
    tasks: [],
  },
}
