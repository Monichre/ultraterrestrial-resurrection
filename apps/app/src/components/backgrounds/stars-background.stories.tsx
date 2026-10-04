import type {Meta, StoryObj} from '@storybook/react'
import {Illustration, Star, Glow} from './stars-background'

const meta = {
  title: 'Components/Backgrounds/StarsIllustration',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta

export const IllustrationDefault: Story = {
  render: () => (
    <div className='rounded-lg bg-black p-4'>
      <Illustration mouseEnter={false} />
    </div>
  ),
}

export const IllustrationMouseEnter: Story = {
  render: () => (
    <div className='rounded-lg bg-black p-4'>
      <Illustration mouseEnter={true} />
    </div>
  ),
}

export const SingleStar: Story = {
  render: () => (
    <div className='flex items-center justify-center rounded-lg bg-black p-8'>
      <Star isGlowing={true} delay={0.2} />
    </div>
  ),
}

export const SingleGlow: Story = {
  render: () => (
    <div className='flex items-center justify-center rounded-lg bg-black p-8'>
      <Glow delay={0.2} />
    </div>
  ),
}
