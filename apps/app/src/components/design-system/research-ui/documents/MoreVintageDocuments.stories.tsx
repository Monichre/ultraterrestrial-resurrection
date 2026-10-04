import type {Meta, StoryObj} from '@storybook/react'
import MoreVintageDocuments from './MoreVintageDocuments'

const meta: Meta<typeof MoreVintageDocuments> = {
  title: 'Documents/MoreVintageDocuments',
  component: MoreVintageDocuments,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MoreVintageDocuments>

export const Default: Story = {}
