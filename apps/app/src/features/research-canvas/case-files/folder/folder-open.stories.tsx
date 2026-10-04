import type {Meta, StoryObj} from '@storybook/react'
import {Folder} from './folder-open'

const meta: Meta<typeof Folder> = {
  title: 'Case Files/Folder/Folder',
  component: Folder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Folder>

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='h-[400px] w-[400px]'>
        <Story />
      </div>
    ),
  ],
}

export const CustomClass: Story = {
  args: {
    className: 'bg-stone-900 p-8 rounded-xl',
  },
  decorators: [
    (Story) => (
      <div className='h-[400px] w-[400px]'>
        <Story />
      </div>
    ),
  ],
}
