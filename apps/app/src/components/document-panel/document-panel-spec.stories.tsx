import type {Meta, StoryObj} from '@storybook/react'
import {DocumentPanelSpec} from './document-panel-spec'

const meta = {
  title: 'Components/DocumentPanel/DocumentPanelSpec',
  component: DocumentPanelSpec,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DocumentPanelSpec>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
