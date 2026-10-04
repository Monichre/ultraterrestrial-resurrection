'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {LittleBook} from './LittleBook'

const meta = {
  title: 'Components/LittleBook',
  component: LittleBook,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Port of [jh3y / ExPVzBY](https://codepen.io/jh3y/pen/ExPVzBY) — scroll-driven 3D book with GSAP ScrollTrigger. Click sketches to open the linked pens.',
      },
    },
  },
} satisfies Meta<typeof LittleBook>

export default meta

type Story = StoryObj<typeof meta>

/** Full scroll experience — scroll the canvas to turn pages. */
export const Default: Story = {}

export const CustomHint: Story = {
  args: {
    hint: 'Scroll to turn pages',
  },
}
