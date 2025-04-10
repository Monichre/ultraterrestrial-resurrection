import type {Meta, StoryObj} from '@storybook/react'
import {FilterPanel} from './filter-panel'
import {useState} from 'react'

const meta: Meta<typeof FilterPanel> = {
  title: 'Features/UAP Dashboard/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-96 h-full bg-black p-4'>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  args: {
    filters: {
      shape: undefined,
      location: undefined,
      isSignificantEvent: false,
    },
    onChange: (filters) => console.log('Filters changed:', filters),
  },
}

export const WithActiveFilters: Story = {
  args: {
    filters: {
      shape: 'Triangle',
      location: 'New Jersey',
      isSignificantEvent: true,
    },
    onChange: (filters) => console.log('Filters changed:', filters),
  },
}

export const ShapeFilterActive: Story = {
  args: {
    filters: {
      shape: 'Disc',
      location: undefined,
      isSignificantEvent: false,
    },
    onChange: (filters) => console.log('Filters changed:', filters),
  },
}

export const LocationFilterActive: Story = {
  args: {
    filters: {
      shape: undefined,
      location: 'New York',
      isSignificantEvent: false,
    },
    onChange: (filters) => console.log('Filters changed:', filters),
  },
}

export const SignificanceFilterActive: Story = {
  args: {
    filters: {
      shape: undefined,
      location: undefined,
      isSignificantEvent: true,
    },
    onChange: (filters) => console.log('Filters changed:', filters),
  },
}

// Interactive example showing filters changing in real-time
export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filters, setFilters] = useState({
      shape: undefined,
      location: undefined,
      isSignificantEvent: false,
    })

    return (
      <>
        <FilterPanel filters={filters} onChange={(newFilters: any) => setFilters(newFilters)} />
        <div className='mt-4 p-3 bg-gray-900 rounded text-white text-xs'>
          <div>Current Filters:</div>
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
      </>
    )
  },
}
