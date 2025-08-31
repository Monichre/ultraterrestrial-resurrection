import type { Meta, StoryObj } from '@storybook/react'
import { HoverCard } from './hover-card'

const meta = {
  title: 'Components/Card/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive hover card with animated background patterns, gradient overlays, and dynamic text generation on mouse movement.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display in the center of the card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Hover Me',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default hover card with animated background that responds to mouse movement.',
      },
    },
  },
}

export const ShortText: Story = {
  args: {
    text: 'Hi',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover card with short text content.',
      },
    },
  },
}

export const LongText: Story = {
  args: {
    text: 'Interactive Element',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover card with longer text to test text wrapping and layout.',
      },
    },
  },
}

export const NumberText: Story = {
  args: {
    text: '42',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover card displaying numeric content.',
      },
    },
  },
}

export const EmojiText: Story = {
  args: {
    text: '🚀',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover card with emoji content.',
      },
    },
  },
}

export const CustomSize: Story = {
  args: {
    text: 'Custom',
    className: 'w-64 h-64',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover card with custom dimensions using className prop.',
      },
    },
  },
}

export const DarkTheme: Story = {
  args: {
    text: 'Dark Mode',
  },
  decorators: [
    Story => (
      <div className="p-8 bg-gray-900 rounded-lg">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Hover card in dark theme environment.',
      },
  },
},
}

export const InGrid: Story = {
  render: () => (
    <div className= "grid grid-cols-2 gap-4 p-4">
    <HoverCard text="1" />
      <HoverCard text="2" />
      <HoverCard text="3" />
        <HoverCard text="4" />
        </div>
  ),
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Multiple hover cards arranged in a grid layout.',
      },
  },
},
}

export const WithBackground: Story = {
  args: {
    text: 'Styled',
  },
  decorators: [
    Story => (
      <div className= "p-8 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Hover card on a colorful gradient background.',
      },
  },
},
}