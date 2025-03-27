import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CardsPlayerHolo2 from './CardsPlayerHolo2'

const meta = {
  title: 'HUD Interface/CardsPlayerHolo2',
  component: CardsPlayerHolo2,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {control: 'text'},
    cardData: {control: 'object'},
    variant: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'vertical',
    },
  },
} satisfies Meta<typeof CardsPlayerHolo2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const HorizontalVariant: Story = {
  args: {
    variant: 'horizontal',
  },
}

export const VerticalVariant: Story = {
  args: {
    variant: 'vertical',
  },
}

export const CustomCards: Story = {
  args: {
    variant: 'horizontal',
    cardData: [
      {
        id: 1,
        image:
          'https://images.unsplash.com/photo-1579519583711-9a6330202a86?q=80&w=1000&auto=format&fit=crop',
        thumbnail:
          'https://images.unsplash.com/photo-1579519583711-9a6330202a86?q=80&w=200&auto=format&fit=crop',
        music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        artist: 'Nebula Dreams',
        genre: 'Deep Space',
        duration: 185,
      },
      {
        id: 2,
        image:
          'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1000&auto=format&fit=crop',
        thumbnail:
          'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=200&auto=format&fit=crop',
        music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        artist: 'Void Echoes',
        genre: 'Cosmic Ambient',
        duration: 220,
      },
      {
        id: 3,
        image:
          'https://images.unsplash.com/photo-1604077198996-4eb67c32f6a9?q=80&w=1000&auto=format&fit=crop',
        thumbnail:
          'https://images.unsplash.com/photo-1604077198996-4eb67c32f6a9?q=80&w=200&auto=format&fit=crop',
        music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        artist: 'Stardust Protocol',
        genre: 'Futuristic',
        duration: 175,
      },
    ],
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gray-900',
  },
}
