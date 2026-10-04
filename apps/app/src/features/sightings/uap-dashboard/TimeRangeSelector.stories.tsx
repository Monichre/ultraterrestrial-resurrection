import type {Meta, StoryObj} from '@storybook/react'
import {TimeRangeSelector} from './time-range-selector'

const meta: Meta<typeof TimeRangeSelector> = {
  title: 'Features/UAP Dashboard/TimeRangeSelector',
  component: TimeRangeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    timeRange: {
      startYear: 2018,
      endYear: 2023,
    },
    onChange: (range) => console.log('Time range changed:', range),
  },
}

export const FullRange: Story = {
  args: {
    timeRange: {
      startYear: 1940,
      endYear: new Date().getFullYear(),
    },
    onChange: (range) => console.log('Time range changed:', range),
  },
}
