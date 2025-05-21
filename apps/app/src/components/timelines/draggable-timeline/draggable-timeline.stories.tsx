import type { Meta, StoryObj } from '@storybook/react'


import { DraggableTimeline } from './draggable-timeline'


export const items: any[] = [
  {
    id: 1,
    year: '1993',
    title: 'Pablo Honey',
    image: 'https://assets.codepen.io/85648/radiohead_pablo-honey.jpg'
  },
  {
    id: 2,
    year: '1995',
    title: 'The Bends',
    image: 'https://assets.codepen.io/85648/radiohead_the-bends.webp'
  },
  {
    id: 3,
    year: '1997',
    title: 'OK Computer',
    image: 'https://assets.codepen.io/85648/radiohead_ok-computer.webp'
  },
  {
    id: 4,
    year: '2000',
    title: 'Kid A',
    image: 'https://assets.codepen.io/85648/radiohead_kid-a.webp'
  },
  {
    id: 5,
    year: '2001',
    title: 'Amnesiac',
    image: 'https://assets.codepen.io/85648/radiohead_amnesiac.webp'
  },
  {
    id: 6,
    year: '2003',
    title: 'Hail to the Thief',
    image: 'https://assets.codepen.io/85648/radiohead_hail-to-the-thief.webp'
  },
  {
    id: 7,
    year: '2007',
    title: 'In Rainbows',
    image: 'https://assets.codepen.io/85648/radiohead_in-rainbows.webp'
  },
  {
    id: 8,
    year: '2011',
    title: 'The King of Limbs',
    image: 'https://assets.codepen.io/85648/radiohead_king-of-linbs.webp'
  },
  {
    id: 9,
    year: '2016',
    title: 'A Moon Shaped Pool',
    image: 'https://assets.codepen.io/85648/radiohead_a-moon-shaped-pool.webp'
  }
]



const meta = {
  component: DraggableTimeline,
  title: 'Components/Timelines/Aider Draggable Timeline',

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DraggableTimeline>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: items,
  },
}
