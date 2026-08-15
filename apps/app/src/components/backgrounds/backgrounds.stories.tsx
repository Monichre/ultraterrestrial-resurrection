import type {Meta, StoryObj} from '@storybook/react'
import {FarmUIBackground, FinePrintBackground} from './backgrounds'

const meta = {
  title: 'Components/Backgrounds/Backgrounds',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

export const FarmUI: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden bg-black'>
      <FarmUIBackground />
    </div>
  ),
}

export const FinePrint: Story = {
  render: () => (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden bg-black text-white'>
      <FinePrintBackground />
    </div>
  ),
}
