import type { Meta, StoryObj } from '@storybook/react'
import { CardStack } from './card-stack'

const meta = {
  title: 'Components/Card/CardStack',
  component: CardStack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive card stack component with drag-to-rearrange functionality and configurable animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    randomRotation: {
      control: 'boolean',
      description: 'Enable random rotation for cards',
    },
    sensitivity: {
      control: { type: 'range', min: 50, max: 500, step: 50 },
      description: 'Drag sensitivity threshold',
    },
    cardDimensions: {
      control: 'object',
      description: 'Width and height of cards',
    },
    sendToBackOnClick: {
      control: 'boolean',
      description: 'Send card to back on click',
    },
    cardsData: {
      control: 'object',
      description: 'Array of card data with id and image URL',
    },
    animationConfig: {
      control: 'object',
      description: 'Spring animation configuration',
    },
  },
} satisfies Meta<typeof CardStack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default card stack with landscape images. Drag cards to rearrange them.',
      },
    },
  },
}

export const WithRandomRotation: Story = {
  args: {
    randomRotation: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with random rotation applied to each card for a more organic look.',
      },
    },
  },
}

export const ClickToSendBack: Story = {
  args: {
    sendToBackOnClick: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack where clicking a card sends it to the back of the stack.',
      },
    },
  },
}

export const HighSensitivity: Story = {
  args: {
    sensitivity: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with high sensitivity - requires less drag distance to rearrange.',
      },
    },
  },
}

export const LowSensitivity: Story = {
  args: {
    sensitivity: 400,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with low sensitivity - requires more drag distance to rearrange.',
      },
    },
  },
}

export const SmallCards: Story = {
  args: {
    cardDimensions: { width: 150, height: 150 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with smaller card dimensions.',
      },
    },
  },
}

export const LargeCards: Story = {
  args: {
    cardDimensions: { width: 300, height: 300 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with larger card dimensions.',
      },
    },
  },
}

export const CustomImages: Story = {
  args: {
    cardsData: [
      {
        id: 1,
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format",
      },
      {
        id: 2,
        img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=500&auto=format",
      },
      {
        id: 3,
        img: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=500&auto=format",
      },
      {
        id: 4,
        img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500&auto=format",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with custom nature-themed images.',
      },
    },
  },
}

export const SlowAnimation: Story = {
  args: {
    animationConfig: { stiffness: 100, damping: 30 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with slower, more fluid animation.',
      },
    },
  },
}

export const BouncyAnimation: Story = {
  args: {
    animationConfig: { stiffness: 400, damping: 15 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Card stack with bouncy, energetic animation.',
      },
    },
  },
}
