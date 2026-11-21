import type {Meta, StoryObj} from '@storybook/react'
import UfoDocument from './IncidentReportGeometics'

const meta: Meta<typeof UfoDocument> = {
  title: 'Documents/Report Files/IncidentReportGeometics',
  component: UfoDocument,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UfoDocument>

export const Default: Story = {}
