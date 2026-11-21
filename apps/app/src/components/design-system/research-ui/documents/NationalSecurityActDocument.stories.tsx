import type {Meta, StoryObj} from '@storybook/react'
import NationalSecurityActDocument from './NationalSecurityActDocument'

const meta: Meta<typeof NationalSecurityActDocument> = {
  title: 'Documents/NationalSecurityActDocument',
  component: NationalSecurityActDocument,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NationalSecurityActDocument>

export const Default: Story = {}
