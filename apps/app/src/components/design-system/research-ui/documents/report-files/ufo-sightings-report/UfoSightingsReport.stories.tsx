import type {Meta, StoryObj} from '@storybook/react'
import UfoSightingReport from './UfoSightingsReport'

const meta: Meta<typeof UfoSightingReport> = {
  title: 'Documents/Report Files/UfoSightingsReport',
  component: UfoSightingReport,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UfoSightingReport>

export const Default: Story = {}
