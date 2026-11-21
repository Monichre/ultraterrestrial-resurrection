import type {Meta, StoryObj} from '@storybook/react'
import {BackgroundStatic} from './BackgroundStatic'

const meta = {
  title: 'Components/Backgrounds/BackgroundStatic',
  component: BackgroundStatic,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative h-screen w-full overflow-hidden bg-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackgroundStatic>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
