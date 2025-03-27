import type {Meta, StoryObj} from '@storybook/react'
import {StackedCards} from '.'

const DEMO_RECORDS = [
  {
    id: '1',
    name: 'course waitlist',
    domain: 'course.craftofui.com',
    count: 23602,
    prepaid: 16280,
  },
  {
    id: '2',
    name: 'newsletter',
    domain: 'craftofui.com',
    count: 15420,
    prepaid: 12800,
  },
  {
    id: '3',
    name: 'beta access',
    domain: 'beta.craftofui.com',
    count: 8940,
    prepaid: 7200,
  },
]

const meta = {
  title: 'Components/StackedCards',
  component: StackedCards,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='flex min-h-[500px] items-center justify-center bg-neutral-100 p-8'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StackedCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    records: DEMO_RECORDS,
  },
}

export const SingleCard: Story = {
  args: {
    records: [DEMO_RECORDS[0]],
  },
}

export const TwoCards: Story = {
  args: {
    records: DEMO_RECORDS.slice(0, 2),
  },
}
