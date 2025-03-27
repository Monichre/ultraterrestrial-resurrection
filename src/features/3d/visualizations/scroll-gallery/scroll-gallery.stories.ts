import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ScrollGallery } from './scroll-gallery'

const meta = {
  title: 'Components/Scroll Gallery',
  component: ScrollGallery,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ScrollGallery>

export default meta

type Story = StoryObj<typeof meta>

export const ScrollGalleryDemo = {}
