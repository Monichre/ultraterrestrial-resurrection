import type {Meta, StoryObj} from '@storybook/react'
import {UfoDocument} from './CrashRetrievalPhotoReport'

const meta: Meta<typeof UfoDocument> = {
  title: 'Documents/Crash Retrievals/CrashRetrievalPhotoReport',
  component: UfoDocument,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UfoDocument>

export const Default: Story = {}
