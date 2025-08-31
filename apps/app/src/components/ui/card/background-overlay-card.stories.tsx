import type { Meta, StoryObj } from '@storybook/react'
import { BackgroundOverlayCard } from './background-overlay-card'

// Mock data for the component
const mockData = {
  photos: [
    { url: '/sample-bg.gif', name: 'Background Animation' }
  ]
}

const meta = {
  title: 'Components/Card/BackgroundOverlayCard',
  component: BackgroundOverlayCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component with background overlay effects, designed to display special elements like background gifs on hover.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Data object containing photos array for background overlays',
      control: 'object',
    },
  },
} satisfies Meta<typeof BackgroundOverlayCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: mockData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default background overlay card with title and description text.',
      },
    },
  },
}

export const DarkBackground: Story = {
  args: {
    data: mockData,
  },
  decorators: [
    Story => (
      <div className="p-8 bg-black rounded-lg">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Background overlay card on a dark background to showcase the overlay effects.',
      },
  },
},
}

export const WithCustomData: Story = {
  args: {
    data: {
      photos: [
        { url: '/custom-animation.gif', name: 'Custom Background' },
        { url: '/another-bg.gif', name: 'Alternative Background' }
      ]
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Background overlay card with custom photo data.',
      },
    },
  },
}
