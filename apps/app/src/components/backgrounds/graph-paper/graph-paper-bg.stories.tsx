import type {Meta, StoryObj} from '@storybook/react'
import {GraphPaperBackground} from './graph-paper-bg'

const meta = {
  title: 'Components/Backgrounds/GraphPaperBackground',
  component: GraphPaperBackground,
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
} satisfies Meta<typeof GraphPaperBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className='relative z-10 flex h-full items-center justify-center text-white'>
        <h1 className='text-4xl font-bold'>Graph Paper Background</h1>
      </div>
    ),
  },
}
