import type {Meta, StoryObj} from '@storybook/react'
import SkullScanner from './skull-scan'

const meta: Meta<typeof SkullScanner> = {
  title: 'Sci-Fi/SkullScanner',
  component: SkullScanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SkullScanner>

export const Default: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 w-full'>
        <Story />
      </div>
    ),
  ],
}

export const WithBackgroundColor: Story = {
  args: {},
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-gray-900 p-8 w-full '>
        <Story />
      </div>
    ),
  ],
}
