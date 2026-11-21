import type { Meta, StoryObj } from '@storybook/react'
import { DataCard } from './data-card'

const meta = {
  title: 'Components/Card/DataCard',
  component: DataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A retro-styled data card component for displaying UFO sighting information with vintage paper-like design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name or title of the sighting',
    },
    description: {
      control: 'text',
      description: 'Description of the sighting',
    },
    location: {
      control: 'text',
      description: 'Location string',
    },
    city: {
      control: 'text',
      description: 'City name',
    },
    state: {
      control: 'text',
      description: 'State or region',
    },
    country: {
      control: 'text',
      description: 'Country name',
    },
    date: {
      control: 'text',
      description: 'Date of the sighting',
    },
    coordinates: {
      control: 'text',
      description: 'Coordinate string',
    },
    latitude: {
      control: 'number',
      description: 'Latitude coordinate',
    },
    longitude: {
      control: 'number',
      description: 'Longitude coordinate',
    },
    shape: {
      control: 'text',
      description: 'Shape of the UFO',
    },
    duration_hours_min: {
      control: 'text',
      description: 'Duration of the sighting',
    },
    summary: {
      control: 'text',
      description: 'Summary of the incident',
    },
    image: {
      control: 'text',
      description: 'Image URL',
    },
    video: {
      control: 'text',
      description: 'Video URL',
    },
    comments: {
      control: 'text',
      description: 'Additional comments',
    },
  },
} satisfies Meta<typeof DataCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Phoenix Lights',
    description: 'Massive triangular craft seen over Phoenix',
    location: 'Phoenix, Arizona, USA',
    city: 'Phoenix',
    state: 'Arizona',
    country: 'USA',
    date: '1997-03-13',
    coordinates: '33.4484, -112.0740',
    latitude: 33.4484,
    longitude: -112.0740,
    shape: 'Triangle',
    duration_hours_min: '2 hours',
    summary: 'Multiple witnesses reported a large triangular craft',
    image: '',
    video: '',
    comments: 'One of the most famous UFO sightings in history',
  },
  parameters: {
    docs: {
      description: {
        story: 'Classic UFO sighting data card showing the famous Phoenix Lights incident.',
      },
    },
  },
}

export const RoswellIncident: Story = {
  args: {
    name: 'Roswell Incident',
    description: 'Alleged UFO crash and recovery',
    location: 'Roswell, New Mexico, USA',
    city: 'Roswell',
    state: 'New Mexico',
    country: 'USA',
    date: '1947-07-08',
    coordinates: '33.3943, -104.5230',
    latitude: 33.3943,
    longitude: -104.5230,
    shape: 'Disc',
    duration_hours_min: 'Unknown',
    summary: 'Military recovery of unidentified debris',
    image: '',
    video: '',
    comments: 'Weather balloon or extraterrestrial craft?',
  },
  parameters: {
    docs: {
      description: {
        story: 'Data card showing the famous Roswell UFO incident from 1947.',
      },
    },
  },
}

export const RecentSighting: Story = {
  args: {
    name: 'Tic Tac UAP',
    description: 'Navy pilot encounter with unidentified aerial phenomenon',
    location: 'Pacific Ocean, California',
    city: 'Off Coast',
    state: 'California',
    country: 'USA',
    date: '2004-11-14',
    coordinates: '32.0000, -118.0000',
    latitude: 32.0000,
    longitude: -118.0000,
    shape: 'Tic Tac',
    duration_hours_min: '5 minutes',
    summary: 'Fast-moving object with no visible propulsion',
    image: '',
    video: '',
    comments: 'Confirmed by US Navy as genuine UAP encounter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modern UAP sighting reported by military personnel.',
      },
    },
  },
}

export const InternationalSighting: Story = {
  args: {
    name: 'Rendlesham Forest',
    description: 'Multiple night encounters near RAF base',
    location: 'Rendlesham Forest, Suffolk, UK',
    city: 'Rendlesham',
    state: 'Suffolk',
    country: 'United Kingdom',
    date: '1980-12-26',
    coordinates: '52.0833, 1.4167',
    latitude: 52.0833,
    longitude: 1.4167,
    shape: 'Triangular',
    duration_hours_min: '3 nights',
    summary: 'Military personnel witnessed strange lights',
    image: '',
    video: '',
    comments: 'Often called "Britain\'s Roswell"',
  },
  parameters: {
    docs: {
      description: {
        story: 'International UFO sighting from the United Kingdom.',
      },
    },
  },
}

export const WithLongDescription: Story = {
  args: {
    name: 'Belgian UFO Wave',
    description: 'Series of triangular UFO sightings reported by thousands of witnesses across Belgium, including police officers and military personnel. The objects were described as large, silent, and capable of extraordinary maneuvers.',
    location: 'Various locations across Belgium',
    city: 'Brussels',
    state: 'Brussels-Capital',
    country: 'Belgium',
    date: '1989-11-29',
    coordinates: '50.8503, 4.3517',
    latitude: 50.8503,
    longitude: 4.3517,
    shape: 'Triangle',
    duration_hours_min: 'Several months',
    summary: 'Wave of triangular UFO sightings',
    image: '',
    video: '',
    comments: 'Investigated by Belgian Air Force with F-16 interceptors',
  },
  parameters: {
    docs: {
      description: {
        story: 'Data card with longer description to test text wrapping and layout.',
      },
    },
  },
}

export const MinimalData: Story = {
  args: {
    name: 'Unknown Object',
    description: 'Brief sighting',
    location: 'Unknown',
    city: 'Unknown',
    state: 'Unknown',
    country: 'Unknown',
    date: '2023-01-01',
    coordinates: '0.0000, 0.0000',
    latitude: 0,
    longitude: 0,
    shape: 'Unknown',
    duration_hours_min: 'Few seconds',
    summary: 'Minimal information available',
    image: '',
    video: '',
    comments: 'Limited witness testimony',
  },
  parameters: {
    docs: {
      description: {
        story: 'Data card with minimal information to test edge cases.',
      },
    },
  },
}
