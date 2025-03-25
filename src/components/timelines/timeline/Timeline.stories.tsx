// ./src/components/stories/Timeline.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Timeline } from './Timeline'

const meta = {
  title: 'Components/Timeslines/OpenAI Timeline',
  component: Timeline,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

const sampleEvents = [
  {
    year: '1993',
    title: 'Pablo Honey',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_pablo-honey.webp'
  },
  {
    year: '1995',
    title: 'The Bends',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_the-bends.webp'
  },
  {
    year: '1997',
    title: 'OK Computer',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_ok-computer.webp'
  },
  {
    year: '2000',
    title: 'Kid A',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_kid-a.webp'
  },
  {
    year: '2001',
    title: 'Amnesiac',
    imageUrl: 'https://assets.codepen.io/85648/radiohead_amnesiac.webp'
  }
]

export const Default: Story = {
  args: {
    events: sampleEvents,
    className: 'min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'
  }
}

export const WithCustomColors: Story = {
  args: {
    events: sampleEvents,
    className: 'min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900'
  }
}

export const MinimalEvents: Story = {
  args: {
    events: sampleEvents.slice( 0, 2 ),
    className: 'min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'
  }
}

export const ManyEvents: Story = {
  args: {
    events: [
      ...sampleEvents,
      ...sampleEvents.map( event => ( {
        ...event,
        year: String( Number( event.year ) + 30 ),
        title: `${event.title} (Remastered)`
      } ) )
    ],
    className: 'min-h-screen bg-gradient-to-b from-gray-900 to-gray-800'
  }
}
