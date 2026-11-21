import type {Meta, StoryObj} from '@storybook/react'
import {GridBackground, GridBackgroundSmall} from './grid-background'

const meta = {
  title: 'Components/Backgrounds/GridBackground',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

export const Default: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden'>
      <GridBackground>
        <div className='relative z-10 flex h-full items-center justify-center text-white'>
          <h1 className='text-4xl font-bold'>Grid Background</h1>
        </div>
      </GridBackground>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden'>
      <GridBackgroundSmall>
        <div className='relative z-10 flex h-full items-center justify-center text-white'>
          <h1 className='text-4xl font-bold'>Small Grid Background</h1>
        </div>
      </GridBackgroundSmall>
    </div>
  ),
}
