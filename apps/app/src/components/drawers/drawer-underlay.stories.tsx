import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {DemoDrawerUnderlay} from './drawer-underlay'
import {userEvent, within} from '@storybook/test'

const meta = {
  title: 'Components/Drawers/DrawerUnderlay',
  component: DemoDrawerUnderlay,
  parameters: {
    layout: 'centered',
    // Adds more information to the documentation
    docs: {
      description: {
        component: `
## Drawer Underlay Component

A drawer component with animation that can be expanded and collapsed, demonstrating the use of Framer Motion animations and interactive gestures.

### Features
- Smooth animations using Framer Motion
- Responsive design for different viewport sizes
- Interactive drag gesture to expand and collapse
- Gradient overlay for content overflow
- Icon buttons for common actions

### Interactive Behavior
- Drag the handle to resize the drawer
- Click the X button to close the drawer
- Click the chevron button to expand/collapse

This component is ideal for mobile interfaces where space is limited and users need to quickly access actions.
`,
      },
    },
    // Show the component in both light and dark mode
    chromatic: {
      viewports: [375, 768, 1200],
      modes: {
        light: {},
        dark: {theme: 'dark'},
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='dark:bg-neutral-900 bg-white p-6 transition-colors duration-200 rounded-lg'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DemoDrawerUnderlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default drawer underlay with full functionality.',
      },
    },
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Drawer component displayed on a mobile viewport. This is the most common use case for this component.',
      },
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Drawer component displayed on a tablet viewport, showing how it adapts to larger screens.',
      },
    },
  },
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: {default: 'dark'},
    docs: {
      description: {
        story: 'Drawer component displayed in dark mode, showing how it adapts to darker themes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='bg-neutral-900 p-6 rounded-lg'>
        <Story />
      </div>
    ),
  ],
}

export const BottomPositioned: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drawer positioned at the bottom of the viewport, a common pattern for mobile interfaces.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='relative h-[600px] w-full flex items-end justify-center bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 rounded-lg p-4'>
        <Story />
      </div>
    ),
  ],
}

// Interactive demo with a play function
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An interactive demonstration showing the drawer being expanded and collapsed by clicking the action buttons.',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for the component to fully render
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find the close button (X) and click it to collapse the drawer
    const closeButton = canvas.getAllByRole('button')[2] // The X button
    await userEvent.click(closeButton)

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Now find the chevron button and click it to expand the drawer again
    const expandButton = canvas.getAllByRole('button')[0] // The chevron button
    await userEvent.click(expandButton)

    // Wait for the animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Click the "Like" button to demonstrate interacting with actions
    const likeArea = canvas.getByText('Like').parentElement
    if (likeArea) {
      await userEvent.click(likeArea)
    }
  },
}
