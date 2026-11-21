import type { Meta, StoryObj } from '@storybook/react'
import { Terminal } from './terminal'

const meta = {
  title: 'Features/Research Canvas/Terminal',
  component: Terminal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A retro-styled terminal interface with animated text output and progress indicators for system operations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't accept props in current implementation
  },
} satisfies Meta<typeof Terminal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default terminal interface with animated text output and system commands.',
      },
    },
  },
}

export const FullscreenTerminal: Story = {
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Terminal in fullscreen layout to show immersive experience.',
      },
    },
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="p-8 bg-gray-900 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">System Console</h2>
      <Story />
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Terminal embedded within a container with header.',
      },
  },
},
}

export const MultipleTerminals: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
    <div>
    <h3 className="text-sm font-semibold mb-2 text-gray-300"> Primary Terminal</h3>
  <Terminal />
  </div>
  <div>
  <h3 className="text-sm font-semibold mb-2 text-gray-300"> Secondary Terminal </h3>
    <Terminal />
    </div>
    </div>
  ),
parameters: {
  layout: 'fullscreen',
    docs: {
    description: {
      story: 'Multiple terminal instances running independently.',
      },
  },
},
}

export const CompactTerminal: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-md">
      <Story />
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Terminal in a compact container to test responsive behavior.',
      },
  },
},
}

export const DashboardIntegration: Story = {
  render: () => (
    <div className="bg-gray-900 p-6 rounded-lg">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h3 className="text-white text-lg font-semibold mb-4"> System Status</h3>
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-green-800/30 border border-green-600 p-4 rounded">
      <div className="text-green-400 text-sm"> System Status </div>
        <div className="text-green-300 text-xl font-bold"> ONLINE </div>
          </div>
          <div className="bg-blue-800/30 border border-blue-600 p-4 rounded">
            <div className="text-blue-400 text-sm"> Active Processes </div>
              <div className="text-blue-300 text-xl font-bold"> 24 </div>
                </div>
                </div>
                <Terminal />
                </div>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-semibold"> Quick Actions </h3>
                    <div className="space-y-2">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                        Start Process
                          </button>
                          <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded">
                            View Logs
                              </button>
                              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                                Emergency Stop
                                  </button>
                                  </div>
                                  </div>
                                  </div>
                                  </div>
  ),
parameters: {
  layout: 'fullscreen',
    docs: {
    description: {
      story: 'Terminal integrated into a system dashboard with status indicators and controls.',
      },
  },
},
}

export const RetroTheme: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="bg-black p-8 rounded-lg border-4 border-green-500" style = {{
      fontFamily: 'Courier New, monospace',
      background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)'
    }}>
  <div className="text-green-400 text-center mb-4 text-sm tracking-wider">
          ◊ RETRO COMPUTING SYSTEM ◊
</div>
  <Story />
  <div className="text-green-600 text-center mt-4 text-xs">
    System ready - Enter commands
      </div>
      </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Terminal with retro computing theme and decorative elements.',
      },
  },
},
}

export const SecurityTheme: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="bg-red-950 p-6 rounded-lg border border-red-500">
      <div className="flex items-center justify-between mb-4 text-red-400">
    <div className="text-sm font-bold">🔒 SECURE TERMINAL ACCESS </div>
    <div className="text-xs"> CLEARANCE LEVEL: CLASSIFIED </div>
    </div>
    <Story />
    <div className="text-red-500 text-center mt-4 text-xs">
          ⚠️ All activities are monitored and logged
  </div>
  </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Terminal with security/classified theme and warning messages.',
      },
  },
},
}

export const ResearchTheme: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="bg-blue-950 p-6 rounded-lg border border-blue-400">
      <div className="flex items-center justify-between mb-4 text-blue-300">
    <div className="text-sm font-bold">🔬 RESEARCH TERMINAL v2.1 </div>
    <div className="text-xs"> LAB-001 | ACTIVE SESSION </div>
    </div>
    <Story />
    <div className="flex justify-between text-blue-400 text-xs mt-4">
    <span> Session time: 00: 42: 15 </span>
    <span> Data processed: 1.2TB </span>
    </div>
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Terminal themed for research and laboratory use with session information.',
      },
  },
},
}
