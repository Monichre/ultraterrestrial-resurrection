import type {Meta, StoryObj} from '@storybook/react'
import {SubtleGraphPaperGrid, DiagonalTexturedPaper, PlushPaper} from './paper-backgrounds'

const meta = {
  title: 'Components/Backgrounds/PaperBackgrounds',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SubtleGraphPaper: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden bg-black'>
      <SubtleGraphPaperGrid />
    </div>
  ),
}

export const DiagonalTextured: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden bg-black'>
      <DiagonalTexturedPaper />
    </div>
  ),
}

export const PlushPaperVariant: Story = {
  render: () => (
    <div className='relative h-screen w-full overflow-hidden bg-black'>
      <PlushPaper />
    </div>
  ),
}
