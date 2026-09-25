import type {Meta, StoryObj} from '@storybook/react'
import {
  SkeletonLoader,
  ApplicationSkeleton,
  CommandSkeleton,
  ModelSelectionSkeleton,
} from './SkeletonLoader'

const meta = {
  title: 'Components/Loaders/SkeletonLoader',
  component: SkeletonLoader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-[400px] space-y-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkeletonLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: 120,
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
  },
}

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
}

export const Card: Story = {
  args: {
    variant: 'card',
    width: '100%',
  },
}

export const MultipleItems: Story = {
  args: {
    variant: 'text',
    count: 5,
  },
}

export const NotAnimated: Story = {
  args: {
    variant: 'rectangular',
    height: 100,
    animated: false,
  },
}

export const ApplicationLoader: Story = {
  render: () => <ApplicationSkeleton />,
}

export const CommandLoader: Story = {
  render: () => <CommandSkeleton />,
}

export const ModelSelectionLoader: Story = {
  render: () => <ModelSelectionSkeleton />,
}
