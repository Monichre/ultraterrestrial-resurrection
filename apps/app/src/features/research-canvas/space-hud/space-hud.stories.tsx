import type { Meta, StoryObj } from '@storybook/react'
import { SpaceHud } from './space-hud'

const meta = {
  title: 'Features/Research Canvas/SpaceHud',
  component: SpaceHud,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A futuristic heads-up display (HUD) interface with 3D wireframe animations, orbital elements, and interactive terminals.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't accept props in current implementation
  },
} satisfies Meta<typeof SpaceHud>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default space HUD interface with animated wireframe graphics and terminal windows.',
      },
    },
  },
}

export const InteractiveDemo: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive space HUD - click on elements to see animations and responses.',
      },
    },
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="h-screen bg-black p-4">
      <div className="h-full border border-cyan-500 rounded-lg overflow-hidden">
      <Story />
      </div>
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Space HUD contained within a bordered frame to simulate a screen or monitor.',
      },
  },
},
}

export const MissionControl: Story = {
  render: () => (
    <div className="h-screen bg-gray-900 relative">
    {/* Mission Control Header */ }
    <
div className="absolute top-0 left-0 right-0 z-50 bg-black/80 border-b border-cyan-500 p-4">
    <div className="flex justify-between items-center text-cyan-400">
      <div className="text-lg font-bold"> MISSION CONTROL</div>
  <div className="text-sm"> STATUS: OPERATIONAL </div>
    </div>
    </div>

{/* Main HUD Display */ }
<div className="pt-16 h-full">
  <SpaceHud />
  </div>

{/* Bottom Status Bar */ }
<div className="absolute bottom-0 left-0 right-0 z-50 bg-black/80 border-t border-cyan-500 p-2">
  <div className="flex justify-between text-xs text-cyan-400">
    <span> COMM: ACTIVE </span>
      <
span> POWER: 98 % </span>
        <
span> SIGNAL: STRONG </span>
          <
span> TIME: 14: 32:07 UTC </span>
            </div>
            </div>
            </div>
  ),
parameters: {
  docs: {
    description: {
      story: 'Space HUD integrated into a mission control interface with status bars.',
      },
  },
},
}

export const CompactView: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-4xl mx-auto h-96 bg-black border border-cyan-500 rounded-lg overflow-hidden">
      <Story />
      </div>
    ),
  ],
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Space HUD in a more compact viewing area.',
      },
  },
},
}

export const MultiDisplay: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 h-screen p-4 bg-gray-900">
    <div className="border border-cyan-500 rounded-lg overflow-hidden">
      <div className="bg-black/80 p-2 border-b border-cyan-500">
        <div className="text-cyan-400 text-sm"> PRIMARY DISPLAY</div>
  </div>
  <
div className="h-full">
    <SpaceHud />
    </div>
    </div>
    <
div className="border border-green-500 rounded-lg overflow-hidden">
      <div className="bg-black/80 p-2 border-b border-green-500">
        <div className="text-green-400 text-sm"> SECONDARY DISPLAY </div>
          </div>
          <
div className="h-full">
            <SpaceHud />
            </div>
            </div>
            </div>
  ),
parameters: {
  docs: {
    description: {
      story: 'Multiple space HUD displays side by side for multi-monitor setups.',
      },
  },
},
}

export const AlertMode: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="h-screen bg-red-950 relative">
      {/* Alert Header */ }
      <
div className="absolute top-0 left-0 right-0 z-50 bg-red-900/90 border-b border-red-400 p-4">
      <div className="flex justify-between items-center text-red-200">
    <div className="text-lg font-bold animate-pulse">⚠️ ALERT MODE ACTIVE </div>
    <
div className="text-sm"> THREAT LEVEL: HIGH </div>
    </div>
    </div>

    <
div className="pt-16 h-full">
    <Story />
    </div>
        
        {/* Alert Footer */ }
    <
div className="absolute bottom-0 left-0 right-0 z-50 bg-red-900/90 border-t border-red-400 p-2">
    <div className="text-center text-red-200 text-sm animate-pulse">
    EMERGENCY PROTOCOLS ACTIVATED - ALL PERSONNEL REPORT TO STATIONS
    </div>
    </div>
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Space HUD in alert mode with red theme and warning messages.',
      },
  },
},
}

export const StealthMode: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="h-screen bg-black relative">
      {/* Stealth Header */ }
      <
div className="absolute top-0 left-0 right-0 z-50 bg-black/95 border-b border-gray-600 p-4">
      <div className="flex justify-between items-center text-gray-400">
    <div className="text-lg font-bold">🔇 STEALTH MODE </div>
    <
div className="text-sm"> EMISSIONS: MINIMAL </div>
    </div>
    </div>

    <
div className="pt-16 h-full opacity-70">
    <Story />
    </div>
        
        {/* Stealth Footer */ }
    <
div className="absolute bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-gray-600 p-2">
    <div className="text-center text-gray-500 text-xs">
    PASSIVE SENSORS ONLY - MAINTAIN RADIO SILENCE
    </div>
    </div>
    </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Space HUD in stealth mode with dimmed display and minimal emissions theme.',
      },
  },
},
}

export const RetroSciFi: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="h-screen bg-gradient-to-b from-purple-900 to-black relative">
      {/* Retro Header */ }
      <
div className="absolute top-0 left-0 right-0 z-50 bg-purple-900/80 border-b border-purple-400 p-4">
      <div className="flex justify-between items-center text-purple-200" style = {{ fontFamily: 'Courier New, monospace' }}>
  <div className="text-lg font-bold">◊ QUANTUM INTERFACE v3.7 ◊</div>
    <
div className="text-sm"> YEAR: 2287 </div>
      </div>
      </div>

      <
div className="pt-16 h-full">
        <Story />
        </div>

{/* Retro Footer */ }
<div className="absolute bottom-0 left-0 right-0 z-50 bg-purple-900/80 border-t border-purple-400 p-2">
  <div className="text-center text-purple-300 text-sm" style = {{ fontFamily: 'Courier New, monospace' }}>
            ◊ QUANTUM CORE STABLE ◊ HYPERSPACE DRIVE: READY ◊
</div>
  </div>
  </div>
    ),
  ],
parameters: {
  docs: {
    description: {
      story: 'Space HUD with retro sci-fi aesthetic featuring purple gradients and vintage styling.',
      },
  },
},
}
