import type {Meta, StoryObj} from '@storybook/react'
import ReportArchiveFile from './ReportArchiveFile'

const meta: Meta<typeof ReportArchiveFile> = {
  title: 'Documents/Report Files/ReportArchiveFile',
  component: ReportArchiveFile,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ReportArchiveFile>

export const Default: Story = {}
