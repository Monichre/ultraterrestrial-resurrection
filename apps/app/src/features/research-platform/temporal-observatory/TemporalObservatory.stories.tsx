import type { Meta, StoryObj } from '@storybook/react'
import { TemporalObservatory } from './TemporalObservatory'

const meta = {
  title: 'Features/Research Platform/Temporal Observatory',
  component: TemporalObservatory,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b0d0e' }],
    },
  },
} satisfies Meta<typeof TemporalObservatory>

export default meta
type Story = StoryObj<typeof meta>

/** Full observatory view with all mockup data: 5 map points, 2 arcs, 2 bubbles, 4 legend items, 6 ticks, 6 markers, brush selection. */
export const Default: Story = {
  render: () => (
    <div style={{ width: '1440px', height: '960px', margin: '0 auto' }}>
      <TemporalObservatory
        map={{
          points: [
            { id: 'p1', x: 375, y: 294, color: '#c98f46', variant: 'amber' },
            { id: 'p2', x: 560, y: 258, color: '#6ca8ad', variant: 'default' },
            { id: 'p3', x: 785, y: 332, color: '#a4534d', variant: 'red' },
            { id: 'p4', x: 945, y: 285, color: '#6ca8ad', variant: 'default' },
            { id: 'p5', x: 665, y: 432, color: '#c98f46', variant: 'amber' },
          ],
          arcs: [
            {
              id: 'a1',
              left: 385,
              top: 303,
              width: 410,
              height: 130,
              rotation: -9,
            },
            {
              id: 'a2',
              left: 595,
              top: 220,
              width: 370,
              height: 120,
              rotation: 14,
              color: 'rgba(164,83,77,.32)',
            },
          ],
          bubbles: [
            {
              id: 'b1',
              x: 410,
              y: 155,
              era: 'Event · 1947',
              title: 'Roswell, New Mexico',
              description:
                'Initial “flying disc” announcement followed by a rapid official reversal.',
              sourceCount: '8 sources',
              status: 'Contested',
            },
            {
              id: 'b2',
              x: 810,
              y: 390,
              era: 'Event cluster · 1967',
              title: 'Malmstrom AFB',
              description:
                'Missile shutdown reports associated with anomalous aerial observations.',
              sourceCount: '12 sources',
              status: 'Corroborated',
            },
          ],
          legend: [
            { id: 'l1', label: 'Corroborated', color: '#6ca8ad' },
            { id: 'l2', label: 'Contested', color: '#c98f46' },
            { id: 'l3', label: 'Contradiction cluster', color: '#a4534d' },
            { id: 'l4', label: 'Hypothesis link', color: '#7a6d9b' },
          ],
        }}
        timeline={{
          ticks: [
            { position: '2%', label: '1945' },
            { position: '20%', label: '1960' },
            { position: '39%', label: '1975' },
            { position: '58%', label: '1990' },
            { position: '77%', label: '2005' },
            { position: '97%', label: '2025' },
          ],
          markers: [
            { id: 'm1', label: 'Trinity', position: '3%' },
            { id: 'm2', label: 'Roswell', position: '6%' },
            {
              id: 'm3',
              label: 'Malmstrom',
              position: '28%',
              color: '#6ca8ad',
            },
            {
              id: 'm4',
              label: 'Rendlesham',
              position: '47%',
              color: '#6ca8ad',
            },
            {
              id: 'm5',
              label: 'Nimitz',
              position: '77%',
              color: '#6ca8ad',
            },
            {
              id: 'm6',
              label: 'Hearings',
              position: '93%',
              color: '#7a6d9b',
            },
          ],
          brush: { left: '36%', right: '13%' },
        }}
      />
    </div>
  ),
}
