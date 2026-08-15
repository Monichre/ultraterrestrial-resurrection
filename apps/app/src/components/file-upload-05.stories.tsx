import type {Meta, StoryObj} from '@storybook/react'
import FileUpload05 from './file-upload-05'

const meta = {
  title: 'Components/Upload/FileUpload05',
  component: FileUpload05,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FileUpload05>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
