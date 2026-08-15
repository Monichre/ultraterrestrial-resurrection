import type {Meta, StoryObj} from '@storybook/react'
import {DataTable} from './data-table'
import data from '../data.json'

const meta = {
  title: 'Components/AdminDashboard/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='w-full p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data,
  },
}
