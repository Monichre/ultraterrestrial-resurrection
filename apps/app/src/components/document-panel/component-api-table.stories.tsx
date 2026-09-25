import type {Meta, StoryObj} from '@storybook/react'
import {ComponentApiTable} from './component-api-table'

const meta = {
  title: 'Components/DocumentPanel/ComponentApiTable',
  component: ComponentApiTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shellgrid w-full max-w-4xl p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComponentApiTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
