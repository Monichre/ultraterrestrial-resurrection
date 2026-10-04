import type {Meta, StoryObj} from '@storybook/react'
import {DnaVisualization} from './DnaVisualization'

const meta: Meta<typeof DnaVisualization> = {
  title: 'Features/3D/DNA',
  component: DnaVisualization,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#000000' }] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof DnaVisualization>

export const Default: Story = {
  render: () => <DnaVisualization />,
}
