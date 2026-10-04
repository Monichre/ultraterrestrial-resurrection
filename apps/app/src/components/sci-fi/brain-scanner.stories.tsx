import type {Meta, StoryObj} from '@storybook/react'
import BrainScanner from './brain-scanner'

const meta: Meta<typeof BrainScanner> = {
  title: 'Sci-Fi/BrainScanner',
  component: BrainScanner,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BrainScanner>

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

export const CustomSize: Story = {
  args: {
    className: 'w-[500px] h-[500px]',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className='bg-black p-8 w-full'>
        <Story />
      </div>
    ),
  ],
}
