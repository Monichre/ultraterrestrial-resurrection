import type {Meta, StoryObj} from '@storybook/react'
import {TestimonialsBand} from './TestimonialsBand'

const meta = {
  title: 'Marketing/Testimonials Band',
  component: TestimonialsBand,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0B0C0F'}]},
  },
} satisfies Meta<typeof TestimonialsBand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    left: {name: 'Casey', role: 'Engineer'},
    center: {
      quote:
        "Raycast is incrementally turning my Mac into an AI‑native operating system and I'm so here for it.",
    },
    right: {name: 'Morgan', role: 'Designer'},
  },
}
