import type {Meta, StoryObj} from '@storybook/react'
import {CalloutBadge} from './callout-badge'

const meta = {
  title: 'Components/DocumentPanel/CalloutBadge',
  component: CalloutBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='relative flex items-center justify-center p-12'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalloutBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    number: 1,
    top: 0,
  },
}

export const MultipleBadges: Story = {
  render: () => (
    <div className='flex gap-4'>
      <CalloutBadge number={1} top={0} />
      <CalloutBadge number={2} top={0} />
      <CalloutBadge number={3} top={0} />
    </div>
  ),
}
