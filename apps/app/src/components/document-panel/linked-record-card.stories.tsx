import type {Meta, StoryObj} from '@storybook/react'
import {FileText} from 'lucide-react'
import {LinkedRecordCard} from './linked-record-card'
import type {LinkedRecord} from './lib/document-panel-data'

const meta = {
  title: 'Components/DocumentPanel/LinkedRecordCard',
  component: LinkedRecordCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-md p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkedRecordCard>

export default meta
type Story = StoryObj<typeof meta>

const sampleRecord: LinkedRecord = {
  id: 'r1',
  title: 'RAAF Press Release',
  type: 'Document',
  date: 'Jul 8, 1947',
  icon: <FileText width={12} height={12} strokeWidth={1.8} aria-hidden />,
}

export const Default: Story = {
  args: {
    record: sampleRecord,
    selected: false,
    onSelect: () => {},
  },
}

export const Selected: Story = {
  args: {
    record: sampleRecord,
    selected: true,
    onSelect: () => {},
  },
}
