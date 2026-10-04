import type {Meta, StoryObj} from '@storybook/react'
import {FolderTabs} from './folder-tabs'

const meta: Meta<typeof FolderTabs> = {
  title: 'Case Files/Folder/FolderTabs',
  component: FolderTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FolderTabs>

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-[600px] p-6 border rounded-lg bg-white dark:bg-gray-900'>
        <Story />
      </div>
    ),
  ],
}
