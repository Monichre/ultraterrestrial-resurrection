import type {Meta, StoryObj} from '@storybook/react'
import {Formation} from './Formation'
import {FormationUI} from './FormationUI'

const meta: Meta<typeof Formation> = {
  title: 'Sci-Fi/Formation',
  component: Formation,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Formation>

export const Cellular: Story = {
  args: {surface: 'cellular'},
  decorators: [
    (Story) => (
      <div style={{height: '100vh'}}>
        <Story />
      </div>
    ),
  ],
}

export const Spiral: Story = {
  args: {surface: 'spiral'},
  decorators: Cellular.decorators,
}

export const Network: Story = {
  args: {surface: 'network'},
  decorators: Cellular.decorators,
}

export const FullUI: StoryObj<typeof FormationUI> = {
  render: () => (
    <div style={{height: '100vh'}}>
      <FormationUI />
    </div>
  ),
}
