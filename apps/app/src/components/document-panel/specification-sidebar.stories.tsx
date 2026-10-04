import type {Meta, StoryObj} from '@storybook/react'
import {SpecificationSidebar} from './specification-sidebar'

const meta = {
  title: 'Components/DocumentPanel/SpecificationSidebar',
  component: SpecificationSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shellgrid w-full max-w-sm p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SpecificationSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
