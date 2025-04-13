import type {Meta, StoryObj} from '@storybook/react'
import {ModelActionToolbar} from './ModelActionToolbar'

const meta: Meta<typeof ModelActionToolbar> = {
  title: 'Components/Toolbars/Model Action Toolbar v2',
  component: ModelActionToolbar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {name: 'dark', value: '#111'},
        {name: 'light', value: '#fff'},
      ],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ModelActionToolbar>

export const Default: Story = {
  args: {},
}

// This could be enhanced with state mocking if the component exposed controls for this
export const WithSearchExpanded: Story = {
  decorators: [
    (Story) => (
      <div className='relative'>
        <Story />
      </div>
    ),
  ],
}

// Interactive story where each button is clicked
export const InteractiveDemo: Story = {
  play: async ({canvasElement}) => {
    // This is a placeholder for interaction tests
    // With real Storybook testing-library implementation, you could:
    // - Find all buttons and click them in sequence
    // - Check the dropdown
    // - Expand the search and type into it
  },
}

// Demonstration of the button click animation
export const ButtonClickAnimation: Story = {
  play: async ({canvasElement}) => {
    // In a real interaction test, you would:
    // - Find a button
    // - Trigger the animation by clicking it
    // - Verify the animation completed
  },
}

// Example with search box expanded and text entered
export const SearchWithInput: Story = {
  render: () => {
    // We would need to modify the component to accept props for controlling
    // the internal state to properly demonstrate this
    return <ModelActionToolbar />
  },
}
