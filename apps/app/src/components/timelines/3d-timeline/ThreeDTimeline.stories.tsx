// ./src/components/stories/ThreeDTimeline.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ThreeDTimeline } from './ThreeDTimeline'

const meta = {
  title: 'Components/Timelines/OpenAI 3D Timeline',
  component: ThreeDTimeline,
  parameters: {
    layout: 'fullscreen',
  },

} satisfies Meta<typeof ThreeDTimeline>

export default meta
type Story = StoryObj<typeof meta>

const sampleSlides = [
  {
    id: '1',
    image: 'https://source.unsplash.com/random/1200x800?architecture,1',
    title: 'Modern Architecture'
  },
  {
    id: '2',
    image: 'https://source.unsplash.com/random/1200x800?architecture,2',
    title: 'Urban Design'
  },
  {
    id: '3',
    image: 'https://source.unsplash.com/random/1200x800?architecture,3',
    title: 'Contemporary Spaces'
  },
  {
    id: '4',
    image: 'https://source.unsplash.com/random/1200x800?architecture,4',
    title: 'Minimalist Design'
  },
  {
    id: '5',
    image: 'https://source.unsplash.com/random/1200x800?architecture,5',
    title: 'Sustainable Buildings'
  },
  {
    id: '6',
    image: 'https://source.unsplash.com/random/1200x800?architecture,6',
    title: 'Future Cities'
  }
]

export const Default: Story = {
  args: {
    slides: sampleSlides,
    className: 'bg-black',
    showNavigation: true
  }
}

export const WithoutNavigation: Story = {
  args: {
    slides: sampleSlides,
    className: 'bg-black',
    showNavigation: false
  }
}

export const MinimalSlides: Story = {
  args: {
    slides: sampleSlides.slice( 0, 3 ),
    className: 'bg-black',
    showNavigation: true
  }
}

export const WithoutTitles: Story = {
  args: {
    slides: sampleSlides.map( ( { id, image } ) => ( { id, image } ) ),
    className: 'bg-black',
    showNavigation: true
  }
}

export const CustomBackground: Story = {
  args: {
    slides: sampleSlides,
    className: 'bg-gradient-to-b from-indigo-900 to-black',
    showNavigation: true
  }
}
