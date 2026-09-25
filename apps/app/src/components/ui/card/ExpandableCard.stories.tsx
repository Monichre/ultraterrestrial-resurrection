import type {Meta, StoryObj} from '@storybook/react'
import {ExpandableCard1} from './ExpandableCard'

const meta = {
  title: 'Components/Card/ExpandableCard',
  component: ExpandableCard1,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An animated expandable card component that transforms from a compact view to a detailed view with user avatar, location, and action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't accept props in current implementation
  },
} satisfies Meta<typeof ExpandableCard1>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default expandable card showing Alexandre Buée from Paris, France. Click to expand and see action buttons.',
      },
    },
  },
}

export const FullscreenDemo: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Expandable card in fullscreen layout to demonstrate the overlay behavior when expanded.',
      },
    },
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-full max-w-lg p-8 bg-gray-50 dark:bg-gray-900 rounded-lg'>
        <h2 className='text-lg font-semibold mb-4 text-center'>Profile Cards</h2>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Expandable card within a container to show how it behaves in different contexts.',
      },
    },
  },
}
