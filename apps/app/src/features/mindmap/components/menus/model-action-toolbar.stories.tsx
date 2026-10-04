import type {Meta, StoryObj} from '@storybook/react'
import {DynamicToolbar} from './model-action-toolbar'

const meta = {
  title: 'Components/Toolbars/Model Action Toolbar',
  component: DynamicToolbar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className='p-8 flex items-center justify-center'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DynamicToolbar>

export default meta
type Story = StoryObj<typeof meta>

// Default state
export const Default: Story = {}

// Shows the toolbar with search expanded
export const SearchExpanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with search functionality expanded.',
      },
    },
  },
}

// Shows the toolbar with active search
export const ActiveSearch: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with active search and results.',
      },
    },
  },
}

// Shows the toolbar with dropdown open
export const DropdownOpen: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with model selection dropdown open.',
      },
    },
  },
}

// Shows hover and interaction states
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates hover and click interactions with toolbar buttons.',
      },
    },
  },
}

// Shows mobile responsive layout
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Toolbar optimized for mobile devices.',
      },
    },
  },
}
