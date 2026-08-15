import type { Meta, StoryObj } from '@storybook/react'
import { StarsCard, StarsCardTitle, StarsCardDescription } from './stars-card'

const meta = {
  title: 'Components/Card/StarsCard',
  component: StarsCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component with animated star background that responds to mouse interactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      description: 'Content to display inside the card',
    },
  },
} satisfies Meta<typeof StarsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
      <StarsCardTitle>
      Welcome
      </StarsCardTitle>
      <StarsCardDescription>
          Hover over this card to see the stars animate in the background.
        </StarsCardDescription>
      </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Default stars card with title and description. Hover to see the star animation.',
      },
  },
},
}

export const OnlyTitle: Story = {
  args: {
    children: (
      <StarsCardTitle>
      Stars Animation
      </StarsCardTitle>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with only a title.',
      },
  },
},
}

export const OnlyDescription: Story = {
  args: {
    children: (
      <StarsCardDescription>
      This card features an animated star field that responds to your mouse movements.The stars create a mesmerizing effect when you hover over the card area.
      </StarsCardDescription>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with only a description.',
      },
  },
},
}

export const LongContent: Story = {
  args: {
    children: (
      <>
      <StarsCardTitle>
      Extended Content Example
      </StarsCardTitle>
    <StarsCardDescription>
    This is a longer description to demonstrate how the stars card handles more content.The animated background creates a beautiful effect that works well with various amounts of text.The card maintains its visual appeal regardless of content length while providing an engaging user experience.
        </StarsCardDescription>
      </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with longer content to test layout with more text.',
      },
  },
},
}

export const ShortContent: Story = {
  args: {
    children: (
      <>
      <StarsCardTitle>
      Brief
      </StarsCardTitle>
      <StarsCardDescription>
          Short and sweet.
        </StarsCardDescription>
      </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with minimal content.',
      },
  },
},
}

export const CustomContent: Story = {
  args: {
    children: (
      <>
      <StarsCardTitle>
      Custom Elements
      </StarsCardTitle>
    <div className="space-y-4">
      <StarsCardDescription>
      You can include custom elements alongside the star animation.
          </StarsCardDescription>
        <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Action
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancel
          </button>
          </div>
          </div>
          </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with custom content including buttons.',
      },
  },
},
}

export const WithCustomStyling: Story = {
  args: {
    className: 'border-4 border-blue-500',
    children: (
      <>
      <StarsCardTitle>
      Custom Styled
      </StarsCardTitle>
    <StarsCardDescription>
    This card has custom border styling applied.
        </StarsCardDescription>
      </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Stars card with custom styling via className prop.',
      },
  },
},
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
    <StarsCard>
    <StarsCardTitle>Card One</StarsCardTitle>
  <StarsCardDescription>
  First stars card with its own animation.
        </StarsCardDescription>
    </StarsCard>
    <StarsCard>
    <StarsCardTitle>Card Two</StarsCardTitle>
      <StarsCardDescription>
          Second stars card with independent animation.
        </StarsCardDescription>
  </StarsCard>
  <StarsCard>
  <StarsCardTitle>Card Three</StarsCardTitle>
    <StarsCardDescription>
          Third stars card showing scalability.
        </StarsCardDescription>
  </StarsCard>
  <StarsCard>
  <StarsCardTitle>Card Four</StarsCardTitle>
    <StarsCardDescription>
          Fourth stars card completing the grid.
        </StarsCardDescription>
  </StarsCard>
  </div>
  ),
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Multiple stars cards in a grid layout, each with independent animations.',
      },
  },
},
}
