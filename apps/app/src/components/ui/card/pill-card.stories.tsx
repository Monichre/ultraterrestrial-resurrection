import type { Meta, StoryObj } from '@storybook/react'
import { PillCard } from './pill-card'

// Mock data that matches the expected interface
const mockItems = [
  {
    name: "Design",
    description: "Create beautiful interfaces",
    color: "#3B82F6",
    bg: "#EFF6FF",
    text: "Active"
  },
  {
    name: "Development",
    description: "Build robust applications",
    color: "#10B981",
    bg: "#ECFDF5",
    text: "Coding"
  },
  {
    name: "Marketing",
    description: "Promote your products",
    color: "#F59E0B",
    bg: "#FFFBEB",
    text: "Growth"
  },
  {
    name: "Analytics",
    description: "Track performance metrics",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    text: "Data"
  },
]

const meta = {
  title: 'Components/Card/PillCard',
  component: PillCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive pill-style card component with smooth animations and expandable descriptions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of pill items with name, description, color, background, and text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof PillCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: mockItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default pill card with design, development, marketing, and analytics options.',
      },
    },
  },
}

export const TwoItems: Story = {
  args: {
    items: mockItems.slice( 0, 2 ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with only two items to show simpler navigation.',
      },
    },
  },
}

export const SingleItem: Story = {
  args: {
    items: [mockItems[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with a single item - minimal configuration.',
      },
    },
  },
}

export const ManyItems: Story = {
  args: {
    items: [
      ...mockItems,
      {
        name: "Support",
        description: "Help customers succeed",
        color: "#EF4444",
        bg: "#FEF2F2",
        text: "Help"
      },
      {
        name: "Sales",
        description: "Drive revenue growth",
        color: "#06B6D4",
        bg: "#ECFEFF",
        text: "Sell"
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with many items to test navigation with more options.',
      },
    },
  },
}

export const DarkColors: Story = {
  args: {
    items: [
      {
        name: "Security",
        description: "Protect your data",
        color: "#FFFFFF",
        bg: "#1F2937",
        text: "Secure"
      },
      {
        name: "Performance",
        description: "Optimize speed",
        color: "#FFFFFF",
        bg: "#374151",
        text: "Fast"
      },
      {
        name: "Reliability",
        description: "Always available",
        color: "#FFFFFF",
        bg: "#4B5563",
        text: "Stable"
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with dark color scheme.',
      },
    },
  },
}

export const BrightColors: Story = {
  args: {
    items: [
      {
        name: "Creative",
        description: "Express your ideas",
        color: "#FFFFFF",
        bg: "#EC4899",
        text: "Art"
      },
      {
        name: "Energy",
        description: "Power your projects",
        color: "#FFFFFF",
        bg: "#F97316",
        text: "Power"
      },
      {
        name: "Nature",
        description: "Connect with environment",
        color: "#FFFFFF",
        bg: "#22C55E",
        text: "Green"
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with bright, vibrant colors.',
      },
    },
  },
}

export const LongDescriptions: Story = {
  args: {
    items: [
      {
        name: "Research",
        description: "Conduct in-depth analysis and gather comprehensive insights to make informed decisions",
        color: "#3B82F6",
        bg: "#EFF6FF",
        text: "Study"
      },
      {
        name: "Innovation",
        description: "Develop cutting-edge solutions and breakthrough technologies for tomorrow's challenges",
        color: "#10B981",
        bg: "#ECFDF5",
        text: "Create"
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pill card with longer descriptions to test text wrapping.',
      },
    },
  },
}

export const InContainer: Story = {
  args: {
    items: mockItems,
  },
  decorators: [
    Story => (
      <div className="w-full max-w-2xl p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-center">Department Selection</h2>
      <Story />
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Pill card within a container with header to show real-world usage.',
      },
  },
},
}
