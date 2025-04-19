import type {Meta, StoryObj} from '@storybook/react'
import {DnaVisualization} from './DnaVisualization'

const meta: Meta<typeof DnaVisualization> = {
  title: 'Features/3D/DNA',
  component: DnaVisualization,
}

export default meta

type Story = StoryObj<typeof DnaVisualization>

export const Default: Story = {
  render: () => <DnaVisualization />,
}
