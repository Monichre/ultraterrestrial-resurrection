import type {Meta, StoryObj} from '@storybook/react'
import RoswellIncident2Document from './RoswellIncident2Document'

const meta = {
  title: 'Documents/RoswellIncident2Document',
  component: RoswellIncident2Document,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
} satisfies Meta<typeof RoswellIncident2Document>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
