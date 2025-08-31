import type { Meta, StoryObj } from '@storybook/react'
import { CanvasDrawer } from './canvas-drawer'
import { useState } from 'react'

const meta = {
  title: 'Features/Research Canvas/Canvas/CanvasDrawer',
  component: CanvasDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A sliding drawer component that can be positioned on the left or right side of the screen with smooth animations and optional handle.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Content to display inside the drawer',
    },
    open: {
      control: 'boolean',
      description: 'Whether the drawer is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when drawer open state changes',
    },
    side: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'Which side of the screen the drawer slides from',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    showHandle: {
      control: 'boolean',
      description: 'Whether to show the drawer handle button',
    },
  },
} satisfies Meta<typeof CanvasDrawer>

export default meta
type Story = StoryObj<typeof meta>

const SampleContent = () => (
  <div className="space-y-4">
  <h3 className="text-xl font-semibold"> Evidence Drawer </h3>
    <p className="text-sm text-muted-foreground">
      This drawer contains important case information and evidence files.Use it to access 
      tools and resources while investigating.
    </p>
  <div className="h-[300px] rounded-md bg-primary/10 flex items-center justify-center">
    <span className="text-muted-foreground"> Content Area </span>
      </div>
      <
div className="space-y-2">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Primary Action
            </button>
            <
button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
              Secondary Action
                </button>
                </div>
                </div>
)

export const LeftSide: Story = {
  args: {
    side: 'left',
    open: true,
    showHandle: true,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer sliding in from the left side with handle visible.',
      },
    },
  },
}

export const RightSide: Story = {
  args: {
    side: 'right',
    open: true,
    showHandle: true,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer sliding in from the right side with handle visible.',
      },
    },
  },
}

export const WithoutHandle: Story = {
  args: {
    side: 'right',
    open: true,
    showHandle: false,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer without the handle button - must be controlled programmatically.',
      },
    },
  },
}

export const Interactive: Story = {
  render: ( args ) => {
    const [open, setOpen] = useState( false )

    return (
      <div className="relative h-screen">
      <div className="p-8 h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <button
            onClick={ () => setOpen( true ) }
    className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
     >
      Open Drawer
        </button>
        </div>

        <
CanvasDrawer {...args
} open = { open } onOpenChange = { setOpen }>
  <SampleContent />
  </CanvasDrawer>
  </div>
    )
  },
args: {
  side: 'right',
    showHandle: true,
  },
parameters: {
  docs: {
    description: {
      story: 'Interactive drawer that can be opened with a button and closed using the handle or backdrop.',
      },
  },
},
}

export const ClosedByDefault: Story = {
  args: {
    side: 'left',
    open: false,
    showHandle: true,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer in closed state - click the handle to open it.',
      },
    },
  },
}

export const MinimalContent: Story = {
  args: {
    side: 'right',
    open: true,
    showHandle: true,
    children: (
      <div className="space-y-4">
      <h3 className="text-lg font-semibold"> Quick Tools</h3>
    <div className="space-y-2">
      <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            📋 Notes
  </button>
  <
button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            📁 Files
  </button>
  <
button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            🔍 Search
  </button>
  </div>
  </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Drawer with minimal content showing a simple tool menu.',
      },
  },
},
}

export const RichContent: Story = {
  args: {
    side: 'left',
    open: true,
    showHandle: true,
    children: (
      <div className="space-y-6">
      <div>
      <h3 className="text-xl font-bold mb-2"> Case Analysis</h3>
    <p className="text-sm text-muted-foreground">
      Comprehensive investigation tools and evidence management
    </p>
  </div>

  <
div className="space-y-4">
    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
      <h4 className="font-semibold text-blue-900 dark:text-blue-100"> Active Cases </h4>
        <
p className="text-sm text-blue-700 dark:text-blue-300"> 3 cases in progress </p>
          </div>

          <
div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100"> Evidence Items </h4>
              <
p className="text-sm text-green-700 dark:text-green-300"> 27 items catalogued </p>
                </div>

                <
div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100"> Pending Reviews </h4>
                    <
p className="text-sm text-yellow-700 dark:text-yellow-300"> 5 items awaiting review </p>
                      </div>
                      </div>

                      <
div className="pt-4 border-t">
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700">
                          Generate Report
                            </button>
                            </div>
                            </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Drawer with rich content including statistics cards and gradient buttons.',
      },
  },
},
}

export const FormContent: Story = {
  args: {
    side: 'right',
    open: true,
    showHandle: true,
    children: (
      <div className="space-y-4">
      <h3 className="text-lg font-semibold"> Add Evidence</h3>
    <form className="space-y-4">
      <div>
      <label className="block text-sm font-medium mb-1"> Evidence ID</label>
  <input 
              type="text"
className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
placeholder = "E-001"
  />
  </div>
  <
div>
  <label className="block text-sm font-medium mb-1"> Description </label>
    <
textarea
className="w-full p-2 border rounded h-20 dark:bg-gray-800 dark:border-gray-600"
placeholder = "Enter evidence description..."
  />
  </div>
  <
div>
  <label className="block text-sm font-medium mb-1"> Category </label>
    <
select className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600">
      <option> Physical Evidence </option>
        <
option> Digital Evidence </option>
          <
option> Testimony </option>
          <
option> Documentation </option>
          </select>
          </div>
          <
div className="flex gap-2 pt-4">
            <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Save
              </button>
              <
button type = "button" className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                Cancel
                </button>
                </div>
                </form>
                </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Drawer containing a form for adding evidence to the case.',
      },
  },
},
}

export const CustomStyling: Story = {
  args: {
    side: 'left',
    open: true,
    showHandle: true,
    className: 'bg-gradient-to-b from-purple-900/95 to-blue-900/95 border-purple-500/20',
    children: (
      <div className="space-y-4">
      <h3 className="text-xl font-semibold text-purple-100"> Custom Styled Drawer</h3>
    <p className="text-purple-200/80">
      This drawer has custom gradient background and purple theme styling.
        </p>
        <
div className="bg-purple-800/50 p-4 rounded-lg">
        <p className="text-purple-100"> Custom content area</p>
  </div>
  </div>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Drawer with custom styling using gradient backgrounds and purple theme.',
      },
  },
},
}
