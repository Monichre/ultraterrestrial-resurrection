import type {Meta, StoryObj} from '@storybook/react'
import {VerticalProgressUi} from './VerticalProgressUi'

const meta: Meta<typeof VerticalProgressUi> = {
  title: 'Components/VerticalProgressUi',
  component: VerticalProgressUi,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {name: 'light', value: '#fff'},
        {name: 'dark', value: '#1a1a1a'},
      ],
    },
    docs: {
      description: {
        component:
          'A vertical timeline component showing years from 1993 to 2024 with hover and selection interactions.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '3rem',
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #eaeaea',
          borderRadius: '8px',
        }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof VerticalProgressUi>

// Default state, no interaction
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default state of the VerticalProgressUi component showing a vertical timeline of years from 1993 to 2024.',
      },
    },
  },
}

// Demonstrates the component with dark theme
export const DarkTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'The VerticalProgressUi component displayed on a dark background.',
      },
    },
  },
}

// Example of selecting a year in the timeline
export const WithYearSelected: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the selection state of the VerticalProgressUi when a year is clicked.',
      },
    },
  },
}

// Example of hovering over years
export const WithHoverInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows how the component responds to hover interactions, displaying the year label and scaling nearby years.',
      },
    },
  },
}

// Example of selecting and then hovering
export const SelectAndHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how selection and hover states interact in the component.',
      },
    },
  },
}

// Rapid selection changing example
export const MultiSelectionExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component handles multiple selections in sequence.',
      },
    },
  },
}
