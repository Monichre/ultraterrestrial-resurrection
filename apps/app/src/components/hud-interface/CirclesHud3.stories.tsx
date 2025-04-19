import type React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import CirclesHud3 from '@/components/hud-interface/CirclesHud3'

// Import the SystemStatus type or define it here to match the component
type SystemStatus = {
  name: string
  status: 'online' | 'offline' | 'warning' | 'critical' | 'standby' | 'primed' | 'charged'
  value?: number
}

// Define custom system statuses for stories with correct typing
const customSystemStatuses: SystemStatus[] = [
  {name: 'weapons', status: 'critical', value: 25},
  {name: 'shields', status: 'warning', value: 45},
  {name: 'engine', status: 'online', value: 92},
  {name: 'comms', status: 'offline', value: 0},
  {name: 'life_support', status: 'online', value: 99},
]

const meta = {
  title: 'HUD Interface/CirclesHud3',
  component: CirclesHud3,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {control: 'text'},
    interactive: {control: 'boolean'},
    systemStatuses: {
      control: 'object',
      description: 'System status data objects',
    },
  },
} satisfies Meta<typeof CirclesHud3>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const NonInteractive: Story = {
  args: {
    interactive: false,
  },
}

export const CustomSystems: Story = {
  args: {
    systemStatuses: customSystemStatuses,
  },
}

export const CustomClassName: Story = {
  args: {
    className: 'bg-gray-800',
  },
}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          height: '800px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
        <Story />
      </div>
    ),
  ],
}
