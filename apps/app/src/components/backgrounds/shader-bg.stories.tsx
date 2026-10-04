import type {Meta, StoryObj} from '@storybook/react'
import {ShaderBg} from './shader-bg'

const meta = {
  title: 'Components/Backgrounds/ShaderBg',
  component: ShaderBg,
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
} satisfies Meta<typeof ShaderBg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
