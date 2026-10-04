import type {Meta, StoryObj} from '@storybook/react'
import AppDownloadStack from './AppDownloadStack'

const meta = {
  title: 'Components/SmoothUI/AppDownloadStack',
  component: AppDownloadStack,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof AppDownloadStack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
