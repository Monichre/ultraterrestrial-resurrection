import type {Meta, StoryObj} from '@storybook/react'
import {LaunchPadWithSession} from './LaunchPadWithSession'

const meta = {
  title: 'Features/Mindmap/Components/LaunchPad',
  component: LaunchPadWithSession,
  parameters: {
    layout: 'fullscreen',
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
} satisfies Meta<typeof LaunchPadWithSession>

export default meta
type Story = StoryObj<typeof meta>

const mockApplications = [
  {
    id: 1,
    name: 'Case Files',
    icon: '/icons/case-files.png',
    category: 'Research',
  },
  {
    id: 2,
    name: 'Evidence Board',
    icon: '/icons/evidence.png',
    category: 'Research',
  },
  {
    id: 3,
    name: 'Timeline',
    icon: '/icons/timeline.png',
    category: 'Analysis',
  },
  {
    id: 4,
    name: 'Globe View',
    icon: '/icons/globe.png',
    category: 'Analysis',
  },
  {
    id: 5,
    name: 'AI Assistant',
    icon: '/icons/ai.png',
    category: 'Tools',
  },
  {
    id: 6,
    name: 'Settings',
    icon: '/icons/settings.png',
    category: 'System',
  },
]

// Default state showing the launchpad closed
export const Default: Story = {
  args: {
    applications: mockApplications,
  },
}

// Shows the launchpad with search active
export const WithSearch: Story = {
  args: {
    applications: mockApplications,
  },
  parameters: {
    docs: {
      description: {
        story: 'LaunchPad with search functionality active, showing filtered results.',
      },
    },
  },
  render: () => (
    <div className='min-h-screen bg-black/90'>
      <LaunchPadWithSession applications={mockApplications} />
    </div>
  ),
}

// Shows the launchpad with category filter active
export const CategoryFiltered: Story = {
  args: {
    applications: mockApplications,
  },
  parameters: {
    docs: {
      description: {
        story: 'LaunchPad showing applications filtered by category.',
      },
    },
  },
}

// Shows the launchpad with an application selected
export const ApplicationSelected: Story = {
  args: {
    applications: mockApplications,
  },
  parameters: {
    docs: {
      description: {
        story: 'LaunchPad with an application selected, showing detailed view.',
      },
    },
  },
}

// Shows the launchpad in mobile view
export const MobileView: Story = {
  args: {
    applications: mockApplications,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'LaunchPad optimized for mobile devices.',
      },
    },
  },
}
