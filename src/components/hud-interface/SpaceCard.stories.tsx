import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import SpaceCard from './SpaceCard'

const meta = {
  title: 'HUD Interface/SpaceCard',
  component: SpaceCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {control: 'text'},
    initialActiveIndex: {
      control: {type: 'number', min: 0, max: 4},
      defaultValue: 0,
    },
    cards: {
      control: 'object',
      description: 'Array of card data objects',
    },
  },
} satisfies Meta<typeof SpaceCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomIndex: Story = {
  args: {
    initialActiveIndex: 2,
  },
}

export const CustomCards: Story = {
  args: {
    cards: [
      {
        id: 'PLN-001',
        label: 'P1',
        image:
          'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        music: 'https://assets.codepen.io/21542/howler-demo.mp3',
        trackName: 'STELLAR DRIFT',
      },
      {
        id: 'PLN-002',
        label: 'P2',
        image:
          'https://images.unsplash.com/photo-1650170496638-b2a80d100ec5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        music: 'https://assets.codepen.io/21542/howler-sfx.mp3',
        trackName: 'VOID STORM',
      },
      {
        id: 'PLN-003',
        label: 'P3',
        image:
          'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        music: 'https://assets.codepen.io/21542/howler-spray.mp3',
        trackName: 'NEBULA PULSE',
      },
    ],
  },
}

export const CustomClassName: Story = {
  args: {
    className: 'min-h-[600px]',
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '600px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
        <Story />
      </div>
    ),
  ],
}
