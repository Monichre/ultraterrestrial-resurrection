import type {Meta, StoryObj} from '@storybook/react'
import {SessionNotes} from './session-notes'
import {useEffect, useState} from 'react'
import {within, userEvent} from '@storybook/test'

const meta = {
  title: 'Features/Mindmap/Status UI/SessionNotes',
  component: SessionNotes,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Session Notes Component

A slide-out drawer component built with Vaul Base that displays session notes and provides a nested drawer for note details.

### Features
- Slide-out drawer from the right side of the screen
- Stacked tab design appearance
- Nested drawer for detailed note view
- Pinnable notes for quick access
- Responsive and accessible design
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='h-screen bg-gray-900 p-4 relative overflow-hidden'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl font-bold text-white mb-4'>Session Notes Demo</h1>
          <p className='text-gray-300 mb-8'>
            Click on the tab on the right side of the screen to open the drawer.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SessionNotes>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for the component to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the tab button and hover over it
    const tabButton = document.querySelector('.fixed.right-0.top-\\[130px\\]')
    if (tabButton) {
      await userEvent.hover(tabButton as HTMLElement)

      // Pause to see the hover effect
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  },
}

// A component that forces the drawer to open automatically for demonstration
const AutoOpenSessionNotes = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set a timeout to ensure the component is fully mounted
    const timer = setTimeout(() => {
      setMounted(true)

      // Find and click the tab button to open the drawer
      const tabButton = document.querySelector('.fixed.right-0.top-\\[130px\\]')
      if (tabButton) {
        ;(tabButton as HTMLElement).click()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <SessionNotes />
}

export const OpenDrawer: Story = {
  render: () => <AutoOpenSessionNotes />,
  parameters: {
    docs: {
      description: {
        story: 'The SessionNotes component with the main drawer automatically opened.',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for the drawer to open
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Find and interact with the pin button on the first note
    const pinButton = document.querySelector('button[type="button"].text-\\[\\#adf0dd\\]')
    if (pinButton) {
      await userEvent.click(pinButton as HTMLElement)

      // Pause to see the effect
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  },
}

// A component that forces both drawers to open
const AutoOpenNestedSessionNotes = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set a timeout to ensure the component is fully mounted
    const timer = setTimeout(() => {
      setMounted(true)

      // Find and click the tab button to open the drawer
      const tabButton = document.querySelector('.fixed.right-0.top-\\[130px\\]')
      if (tabButton) {
        ;(tabButton as HTMLElement).click()

        // Wait for the main drawer to open, then click the first note
        setTimeout(() => {
          const firstNote = document.querySelector('button[type="button"].bg-black\\/50.border')
          if (firstNote) {
            ;(firstNote as HTMLElement).click()
          }
        }, 500)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <SessionNotes />
}

export const OpenNestedDrawer: Story = {
  render: () => <AutoOpenNestedSessionNotes />,
  parameters: {
    docs: {
      description: {
        story:
          'The SessionNotes component with both the main drawer and nested detail drawer automatically opened.',
      },
    },
  },
}

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'The SessionNotes component displayed in a mobile viewport to demonstrate its responsive behavior.',
      },
    },
  },
}

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'The SessionNotes component displayed in a tablet viewport.',
      },
    },
  },
}

// Complex story showing integration with other UI elements
const ComplexUIExample = () => {
  const [selectedSection, setSelectedSection] = useState('overview')

  return (
    <div className='h-screen flex overflow-hidden bg-gray-900'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-800 text-gray-100 p-4 flex flex-col'>
        <h2 className='text-xl font-bold mb-6'>Project Atlas</h2>
        <nav className='space-y-1 flex-1'>
          <button
            type='button'
            className={`w-full text-left p-2 rounded ${
              selectedSection === 'overview' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedSection('overview')}>
            Overview
          </button>
          <button
            type='button'
            className={`w-full text-left p-2 rounded ${
              selectedSection === 'subjects' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedSection('subjects')}>
            Subjects
          </button>
          <button
            type='button'
            className={`w-full text-left p-2 rounded ${
              selectedSection === 'experiments' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedSection('experiments')}>
            Experiments
          </button>
          <button
            type='button'
            className={`w-full text-left p-2 rounded ${
              selectedSection === 'analysis' ? 'bg-gray-700' : 'hover:bg-gray-700/50'
            }`}
            onClick={() => setSelectedSection('analysis')}>
            Analysis
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className='flex-1 overflow-auto'>
        <header className='bg-gray-800 p-4 shadow'>
          <h1 className='text-xl font-bold text-white'>
            {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
          </h1>
        </header>

        <main className='p-6'>
          {selectedSection === 'overview' && (
            <div className='space-y-6'>
              <div className='bg-gray-800 rounded-lg p-4'>
                <h2 className='text-lg font-medium text-white mb-2'>Project Summary</h2>
                <p className='text-gray-300'>
                  Project Atlas is a comprehensive study of temporal anomalies and their effects on
                  cognitive function. The project aims to understand how these anomalies might be
                  harnessed for therapeutic purposes.
                </p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-gray-800 rounded-lg p-4'>
                  <h3 className='text-md font-medium text-white mb-2'>Recent Activity</h3>
                  <ul className='space-y-2 text-sm text-gray-300'>
                    <li>Experiment #42 completed - 2077-03-15</li>
                    <li>New subject onboarded - 2077-03-14</li>
                    <li>Baseline testing initiated - 2077-03-13</li>
                  </ul>
                </div>
                <div className='bg-gray-800 rounded-lg p-4'>
                  <h3 className='text-md font-medium text-white mb-2'>Project Status</h3>
                  <div className='space-y-3'>
                    <div>
                      <div className='flex justify-between text-xs text-gray-400 mb-1'>
                        <span>Phase 1</span>
                        <span>100%</span>
                      </div>
                      <div className='h-2 bg-gray-700 rounded'>
                        <div className='h-full bg-green-500 rounded' style={{width: '100%'}} />
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-between text-xs text-gray-400 mb-1'>
                        <span>Phase 2</span>
                        <span>68%</span>
                      </div>
                      <div className='h-2 bg-gray-700 rounded'>
                        <div className='h-full bg-blue-500 rounded' style={{width: '68%'}} />
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-between text-xs text-gray-400 mb-1'>
                        <span>Phase 3</span>
                        <span>12%</span>
                      </div>
                      <div className='h-2 bg-gray-700 rounded'>
                        <div className='h-full bg-purple-500 rounded' style={{width: '12%'}} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'subjects' && (
            <div className='space-y-6'>
              <div className='bg-gray-800 rounded-lg p-4'>
                <h2 className='text-lg font-medium text-white mb-2'>Subject Registry</h2>
                <p className='text-gray-300 mb-4'>
                  Overview of subjects participating in the temporal anomaly studies.
                </p>
                <table className='w-full text-white'>
                  <thead className='text-xs uppercase bg-gray-700'>
                    <tr>
                      <th className='p-3 text-left'>ID</th>
                      <th className='p-3 text-left'>Age</th>
                      <th className='p-3 text-left'>Gender</th>
                      <th className='p-3 text-left'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b border-gray-700'>
                      <td className='p-3'>A-001</td>
                      <td className='p-3'>34</td>
                      <td className='p-3'>F</td>
                      <td className='p-3'>
                        <span className='bg-green-900 text-green-300 px-2 py-1 text-xs rounded'>
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className='border-b border-gray-700'>
                      <td className='p-3'>A-002</td>
                      <td className='p-3'>29</td>
                      <td className='p-3'>M</td>
                      <td className='p-3'>
                        <span className='bg-green-900 text-green-300 px-2 py-1 text-xs rounded'>
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className='border-b border-gray-700'>
                      <td className='p-3'>A-003</td>
                      <td className='p-3'>42</td>
                      <td className='p-3'>F</td>
                      <td className='p-3'>
                        <span className='bg-red-900 text-red-300 px-2 py-1 text-xs rounded'>
                          Suspended
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(selectedSection === 'experiments' || selectedSection === 'analysis') && (
            <div className='flex items-center justify-center h-64'>
              <p className='text-gray-400 text-xl'>
                Content for {selectedSection} is under development.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Include the SessionNotes component */}
      <SessionNotes />
    </div>
  )
}

export const IntegratedUI: Story = {
  render: () => <ComplexUIExample />,
  parameters: {
    docs: {
      description: {
        story:
          'The SessionNotes component integrated with a complete UI layout, showing how it works alongside other interface elements.',
      },
    },
  },
}
