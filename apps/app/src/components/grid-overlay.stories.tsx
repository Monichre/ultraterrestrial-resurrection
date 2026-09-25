import type {Meta, StoryObj} from '@storybook/react'
import {GridOverlay} from './grid-overlay'

const meta = {
  title: 'Components/Backgrounds/GridOverlay',
  component: GridOverlay,
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
} satisfies Meta<typeof GridOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
