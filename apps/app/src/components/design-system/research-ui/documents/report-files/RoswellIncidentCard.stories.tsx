import type {Meta, StoryObj} from '@storybook/react'
import {RoswellIncidentCard} from './RoswellIncidentCard'
import type {IncidentReport} from '../types'

const meta: Meta<typeof RoswellIncidentCard> = {
  title: 'Documents/Report Files/RoswellIncidentCard',
  component: RoswellIncidentCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RoswellIncidentCard>

const incident: IncidentReport = {
  id: 'roswell-1947',
  type: 'incident',
  title: 'Roswell UFO Incident',
  classification: 'secret',
  date: '1947-07-08',
  location: 'Roswell, New Mexico',
  incidentDescription:
    'A purported UFO crash and subsequent cover-up by the United States military in 1947.',
  witnessReports: [
    {id: 'w1', description: 'Debris field discovered on ranch property.', witness: 'Mac Brazel'},
    {id: 'w2', description: 'Debris exhibited unusual characteristics.'},
  ],
  attachments: [
    {
      id: 'a1',
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
      caption: 'Crash site',
      type: 'photo',
    },
  ],
}

export const Default: Story = {
  args: {
    incident,
  },
}
