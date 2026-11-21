import type {Meta, StoryObj} from '@storybook/react'
import PolaroidCard from './PolaroidCard'

const meta: Meta<typeof PolaroidCard> = {
  title: 'Documents/PolaroidCard',
  component: PolaroidCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PolaroidCard>

export const Reference: Story = {
  args: {
    data: {type: 'reference', label: 'Reference Doc', content: 'Recovered memo with annotations.'},
    isConnectable: false,
  } as any,
}

export const EvidenceWithPhoto: Story = {
  args: {
    data: {
      type: 'evidence',
      photo: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600',
      label: 'Evidence',
      content: 'Photographic evidence with marked annotation.',
    },
    isConnectable: false,
  } as any,
}
