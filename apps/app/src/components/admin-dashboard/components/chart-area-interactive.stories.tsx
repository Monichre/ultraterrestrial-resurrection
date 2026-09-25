import type {Meta, StoryObj} from '@storybook/react'
import {ChartAreaInteractive} from './chart-area-interactive'

const meta = {
  title: 'Components/AdminDashboard/ChartAreaInteractive',
  component: ChartAreaInteractive,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-full max-w-4xl p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartAreaInteractive>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
