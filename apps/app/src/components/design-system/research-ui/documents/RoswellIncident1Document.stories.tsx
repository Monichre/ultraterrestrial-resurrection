import type {Meta, StoryObj} from '@storybook/react'
import RoswellIncident1Document from './RoswellIncident1Document'

const meta = {
  title: 'Documents/RoswellIncident1Document',
  component: RoswellIncident1Document,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
} satisfies Meta<typeof RoswellIncident1Document>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
