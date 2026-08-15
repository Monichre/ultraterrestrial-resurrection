import type {Meta, StoryObj} from '@storybook/react'
import SpyFilesArchiveViewer from './SpyFilesArchiveViewer'

const meta = {
  title: 'Documents/SpyFilesArchiveViewer',
  component: SpyFilesArchiveViewer,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
} satisfies Meta<typeof SpyFilesArchiveViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
