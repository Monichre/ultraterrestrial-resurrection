import type {Meta, StoryObj} from '@storybook/react'
import {DotGridBackground, DotGridBackgroundBlack, DotGridBackgroundWhite} from './dot-grid-background'

const meta = {
  title: 'Components/Backgrounds/DotGridBackground',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

export const Default: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden'>
      <DotGridBackground>
        <div className='relative z-10 flex h-full items-center justify-center text-white'>
          <h1 className='text-4xl font-bold'>Dot Grid Background</h1>
        </div>
      </DotGridBackground>
    </div>
  ),
}

export const Black: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden'>
      <DotGridBackgroundBlack>
        <div className='relative z-10 flex h-full items-center justify-center text-white'>
          <h1 className='text-4xl font-bold'>Dot Grid Black</h1>
        </div>
      </DotGridBackgroundBlack>
    </div>
  ),
}

export const White: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden'>
      <DotGridBackgroundWhite>
        <div className='relative z-10 flex h-full items-center justify-center text-black'>
          <h1 className='text-4xl font-bold'>Dot Grid White</h1>
        </div>
      </DotGridBackgroundWhite>
    </div>
  ),
}
