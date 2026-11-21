import type {Meta, StoryObj} from '@storybook/react'
import {EnergyPulseOrb, LatticeOrb, AuroraOrb, OrbsShowcase} from './shader-orbs'

const meta = {
  title: 'Features/Mindmap/Components/Shader Orbs',
  component: EnergyPulseOrb,
  parameters: {
    layout: 'centered',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
  },
} satisfies Meta<typeof EnergyPulseOrb>

export default meta
type Story = StoryObj<typeof meta>

export const EnergyPulse: Story = {
  args: {size: 1.2, color: '#65A9FF'},
  render: (args) => (
    <div style={{width: 420, height: 420}}>
      <EnergyPulseOrb {...args} />
    </div>
  ),
}

export const Lattice: Story = {
  args: {size: 1.2, color: '#1B55B6'},
  render: (args) => (
    <div style={{width: 420, height: 420}}>
      <LatticeOrb {...args} />
    </div>
  ),
}

export const Aurora: Story = {
  args: {size: 1.2, color: '#FF3D6E'},
  render: (args) => (
    <div style={{width: 420, height: 420}}>
      <AuroraOrb {...args} />
    </div>
  ),
}

export const Showcase: Story = {
  parameters: {layout: 'fullscreen'},
  render: () => (
    <div className='min-h-screen w-full bg-[radial-gradient(circle_at_center,rgba(255,61,110,0.12)_0,transparent_60%)] from-black to-black text-white flex items-center justify-center p-10'>
      <OrbsShowcase />
    </div>
  ),
}
