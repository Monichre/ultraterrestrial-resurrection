import type {Meta, StoryObj} from '@storybook/react'
import {ViewSelector} from './view-selector'
import type {ViewMode} from './types'
import {useState} from 'react'

const meta = {
  title: 'Pages/Timeline/ViewSelector',
  component: ViewSelector,
  parameters: {
    layout: 'centered',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['timeline', 'worldmap', 'journey'],
      description: 'Current selected view mode',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when view mode changes',
    },
  },
  decorators: [
    (Story) => (
      <div style={{padding: '2rem'}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ViewSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Timeline: Story = {
  args: {
    value: 'timeline',
  },
}

export const WorldMap: Story = {
  args: {
    value: 'worldmap',
  },
}

export const Journey: Story = {
  args: {
    value: 'journey',
  },
}

// Interactive story with state management
export const Interactive: Story = {
  render: function InteractiveViewSelector(args) {
    const [viewMode, setViewMode] = useState<ViewMode>(args.value || 'timeline')

    return (
      <div className="space-y-4">
        <ViewSelector
          {...args}
          value={viewMode}
          onChange={(value) => {
            setViewMode(value)
            args.onChange?.(value)
          }}
        />
        <div className="text-white text-sm font-mono">Current view: {viewMode}</div>
      </div>
    )
  },
  args: {
    value: 'timeline',
  },
}
