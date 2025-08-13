import type {Meta, StoryObj} from '@storybook/react'
import NewlyDeclassifiedDocs from './NewlyDeclassifiedDocs'

const meta: Meta<typeof NewlyDeclassifiedDocs> = {
  title: 'Documents/NewlyDeclassifiedDocs',
  component: NewlyDeclassifiedDocs,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NewlyDeclassifiedDocs>

export const Default: Story = {}
