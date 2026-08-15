import type { Meta, StoryObj } from '@storybook/react'
import {
  BentoGridThirdDemo,
  BentoCardOne,
  BentoCardTwo,
  BentoCardThree,
  BentoCardImage,
  BentoCardFive
} from './bento-cards'

const meta = {
  title: 'Components/Card/Bento/BentoGrid',
  component: BentoGridThirdDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A collection of animated bento grid cards with various interactive effects and layouts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BentoGridThirdDemo>

export default meta
type Story = StoryObj<typeof meta>

export const FullGrid: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete bento grid with all card types including AI content generation, proofreading, suggestions, sentiment analysis, and text summarization.',
      },
    },
  },
}

export const ResponsiveGrid: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="w-full max-w-6xl mx-auto p-6">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Bento grid in a responsive container to showcase adaptive layout behavior.',
      },
  },
},
}

// Individual Card Stories
const IndividualCardMeta = {
  title: 'Components/Card/Bento/Individual Cards',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual bento card components with unique animations.',
      },
    },
  },
  tags: ['autodocs'],
}

export const CardOne: StoryObj = {
  render: () => <BentoCardOne />,
  parameters: {
    ...IndividualCardMeta.parameters,
    docs: {
      description: {
        story: 'Animated chat bubble card with hover effects and gradient backgrounds.',
      },
    },
  },
}

export const CardTwo: StoryObj = {
  render: () => <BentoCardTwo />,
  parameters: {
    ...IndividualCardMeta.parameters,
    docs: {
      description: {
        story: 'Loading skeleton card with animated width variations.',
      },
    },
  },
}

export const CardThree: StoryObj = {
  render: () => <BentoCardThree />,
  parameters: {
    ...IndividualCardMeta.parameters,
    docs: {
      description: {
        story: 'Gradient background card with infinite color animation.',
      },
    },
  },
}

export const CardImage: StoryObj = {
  render: () => <BentoCardImage children={ undefined } />,
parameters: {
    ...IndividualCardMeta.parameters,
    docs: {
    description: {
      story: 'Interactive card with avatar images and hover rotation effects.',
      },
  },
},
}

export const CardFive: StoryObj = {
  render: () => <BentoCardFive />,
  parameters: {
    ...IndividualCardMeta.parameters,
    docs: {
      description: {
        story: 'Chat interface card with user avatar and message bubbles.',
      },
    },
  },
}
