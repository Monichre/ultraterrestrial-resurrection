import type {Meta, StoryObj} from '@storybook/react'
import {GridBackground} from './grid-background'

const meta = {
  title: 'Components/Backgrounds/GridBackgroundRoot',
  component: GridBackground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='relative w-full h-[400px] bg-black overflow-hidden'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GridBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
