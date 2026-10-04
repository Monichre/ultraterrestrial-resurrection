import type {Meta, StoryObj} from '@storybook/react'
import {ClassifiedDocumentPage as EventReport} from './EventReport'

const meta: Meta<typeof EventReport> = {
  title: 'Documents/Report Files/EventReport',
  component: EventReport,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EventReport>

export const Default: Story = {}
