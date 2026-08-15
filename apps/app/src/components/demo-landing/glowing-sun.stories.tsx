import type {Meta, StoryObj} from '@storybook/react'
import {GlowingSun} from './glowing-sun'

const meta = {
  title: 'Components/DemoLanding/GlowingSun',
  component: GlowingSun,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative flex h-screen w-full items-center justify-center overflow-hidden bg-black'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GlowingSun>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
