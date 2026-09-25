import type { Meta, StoryObj } from '@storybook/react'
import { ShiftCard } from './shift-card'

const meta = {
  title: 'Components/Card/ShiftCard',
  component: ShiftCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An animated card that shifts content on hover, revealing different sections with smooth transitions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    topContent: {
      description: 'Content for the top section of the card',
    },
    middleContent: {
      description: 'Content that appears in the middle when not hovered',
    },
    topAnimateContent: {
      description: 'Content that animates into the top section on hover',
    },
    bottomContent: {
      description: 'Content that slides up from the bottom on hover',
    },
  },
} satisfies Meta<typeof ShiftCard>

export default meta
type Story = StoryObj<typeof meta>

const sampleTopContent = (
  <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-4 text-center">
  <h3 className="text-lg font-semibold">Header Section</h3>
    </div>
)

const sampleMiddleContent = (
  <div className= "flex items-center justify-center text-gray-600 dark:text-gray-400">
  <div className="text-center">
    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2"> </div>
      <p className="text-sm"> Hover to reveal more </p>
        </div>
        </div>
)

const sampleTopAnimateContent = (
  <div className= "absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
  Active
  </div>
)

const sampleBottomContent = (
  <div className= "space-y-4">
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <h4 className="font-medium mb-2"> Details </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        This content slides up from the bottom when you hover over the card.
      </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Action 1
                </button>
                <button className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                  Action 2
                    </button>
                    </div>
                    </div>
)

export const Default: Story = {
  args: {
    topContent: sampleTopContent,
    middleContent: sampleMiddleContent,
    topAnimateContent: sampleTopAnimateContent,
    bottomContent: sampleBottomContent,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default shift card with all content sections. Hover to see the transition effects.',
      },
    },
  },
}

export const SimpleCard: Story = {
  args: {
    topContent: (
      <div className= "text-center p-4">
      <h3 className="text-lg font-semibold"> Simple Card</ h3>
    </div>
    ),
middleContent: (
  <div className= "text-center text-gray-500">
  <p> Basic content here </p>
    </div>
    ),
bottomContent: (
  <div className= "p-4 bg-gray-50 dark:bg-gray-800 rounded">
  <p className="text-sm"> Additional information appears on hover </p>
    </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Simplified shift card with minimal content.',
      },
  },
},
}

export const ProductCard: Story = {
  args: {
    topContent: (
      <div className= "bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-md">
      <h3 className="text-lg font-semibold"> Premium Plan</ h3>
    </div>
    ),
middleContent: (
  <div className= "text-center py-8">
  <div className="text-3xl font-bold"> $29 </div>
    <div className="text-gray-500"> per month </div>
      </div>
    ),
topAnimateContent: (
  <div className= "absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
  POPULAR
  </div>
    ),
bottomContent: (
  <div className= "space-y-3">
  <ul className="space-y-2 text-sm">
    <li className="flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full"> </span>
            Unlimited projects
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"> </span>
24 / 7 support
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"> </span>
            Advanced analytics
  </li>
  </ul>
  <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
    Get Started
      </button>
      </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Product/pricing card example with features revealed on hover.',
      },
  },
},
}

export const ProfileCard: Story = {
  args: {
    topContent: (
      <div className= "bg-blue-50 dark:bg-blue-900 p-4 rounded-md text-center">
      <h3 className="text-lg font-semibold"> Team Member</ h3>
    </div>
    ),
middleContent: (
  <div className= "text-center py-6">
  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"> </div>
    <h4 className="font-medium"> John Doe </h4>
      <p className="text-sm text-gray-500"> Designer </p>
        </div>
    ),
topAnimateContent: (
  <div className= "absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"> </div>
    ),
bottomContent: (
  <div className= "space-y-3">
  <div className="text-sm space-y-1">
    <p> <strong> Email: </strong> john@example.com</p>
      <p> <strong> Location: </strong> San Francisco</p>
        <p> <strong> Joined: </strong> Jan 2023</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm">
              Message
              </button>
              <button className="flex-1 bg-gray-300 dark:bg-gray-600 py-1 px-3 rounded text-sm">
                Profile
                </button>
                </div>
                </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Profile card example showing contact information on hover.',
      },
  },
},
}

export const WithoutMiddleContent: Story = {
  args: {
    topContent: sampleTopContent,
    topAnimateContent: sampleTopAnimateContent,
    bottomContent: sampleBottomContent,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shift card without middle content to test different layouts.',
      },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    className: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-300',
    topContent: sampleTopContent,
    middleContent: sampleMiddleContent,
    topAnimateContent: sampleTopAnimateContent,
    bottomContent: sampleBottomContent,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shift card with custom styling applied via className.',
      },
    },
  },
}
