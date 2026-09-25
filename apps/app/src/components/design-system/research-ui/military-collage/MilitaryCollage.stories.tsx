import type {Meta, StoryObj} from '@storybook/react'
import {MilitaryCollage} from './MilitaryCollage'

const meta: Meta<typeof MilitaryCollage> = {
  title: 'Documents/MilitaryCollage',
  component: MilitaryCollage,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MilitaryCollage>

export const Default: Story = {
  args: {
    data: {
      pageTitle: 'TECHNICAL INCIDENT BRIEFING',
      docId: 'TS-9912',
      classification: 'TOP SECRET',
      timestamp: '1964-04-17T19:55:00Z',
      location: 'Socorro, NM',
    },
  },
}
