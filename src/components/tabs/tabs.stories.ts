import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  argTypes: {
    containerClassName: {
      control: 'text',
      description: 'Custom class for the tabs container'
    },
    activeTabClassName: {
      control: 'text',
      description: 'Custom class for the active tab'
    },
    tabClassName: {
      control: 'text',
      description: 'Custom class for all tabs'
    },
    contentClassName: {
      control: 'text',
      description: 'Custom class for the content container'
    }
  }
} 

export default meta

type Story = StoryObj<typeof Tabs>

// Create sample tab content for our stories
const tabContent = (label: string) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold mb-4">{label} Content</h3>
    <p className="text-gray-600 dark:text-gray-300">
      This is the content for the {label.toLowerCase()} tab.
      You can put any React component here.
    </p>
  </div>
)

export const Default: Story = {
  args: {
    tabs: [
      { title: 'Tab 1', value: 'tab1', content: tabContent('Tab 1') },
      { title: 'Tab 2', value: 'tab2', content: tabContent('Tab 2') },
      { title: 'Tab 3', value: 'tab3', content: tabContent('Tab 3') }
    ]
  }
}

export const WithCustomClasses: Story = {
  args: {
    tabs: [
      { title: 'Home', value: 'home', content: tabContent('Home') },
      { title: 'Profile', value: 'profile', content: tabContent('Profile') },
      { title: 'Settings', value: 'settings', content: tabContent('Settings') },
      { title: 'Notifications', value: 'notifications', content: tabContent('Notifications') }
    ],
    containerClassName: 'gap-2 justify-center',
    activeTabClassName: 'bg-blue-500 dark:bg-blue-700',
    tabClassName: 'font-medium',
    contentClassName: 'mt-16'
  }
}

export const ManyTabs: Story = {
  args: {
    tabs: [
      { title: 'Overview', value: 'overview', content: tabContent('Overview') },
      { title: 'Features', value: 'features', content: tabContent('Features') },
      { title: 'Documentation', value: 'docs', content: tabContent('Documentation') },
      { title: 'Examples', value: 'examples', content: tabContent('Examples') },
      { title: 'Pricing', value: 'pricing', content: tabContent('Pricing') },
      { title: 'Support', value: 'support', content: tabContent('Support') },
      { title: 'Contact', value: 'contact', content: tabContent('Contact') }
    ]
  }
}

export const WithComplexContent: Story = {
  args: {
    tabs: [
      { 
        title: 'Dashboard', 
        value: 'dashboard', 
        content: (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded">
                <h4 className="font-bold">Statistics</h4>
                <p>Viewing performance metrics</p>
              </div>
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded">
                <h4 className="font-bold">Activity</h4>
                <p>Recent user actions</p>
              </div>
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded">
                <h4 className="font-bold">Reports</h4>
                <p>Generated documents</p>
              </div>
              <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded">
                <h4 className="font-bold">Settings</h4>
                <p>Configure dashboard</p>
              </div>
            </div>
          </div>
        ) 
      },
      { 
        title: 'Analytics', 
        value: 'analytics', 
        content: (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Analytics Data</h3>
            <div className="h-40 bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart visualization placeholder</p>
            </div>
          </div>
        ) 
      },
      { 
        title: 'Projects', 
        value: 'projects', 
        content: (
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Project List</h3>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-100 dark:bg-zinc-800 rounded">Project Alpha</li>
              <li className="p-2 bg-gray-100 dark:bg-zinc-800 rounded">Project Beta</li>
              <li className="p-2 bg-gray-100 dark:bg-zinc-800 rounded">Project Gamma</li>
            </ul>
          </div>
        ) 
      }
    ]
  }
}
