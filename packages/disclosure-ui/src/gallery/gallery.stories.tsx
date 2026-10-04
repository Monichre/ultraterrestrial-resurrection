import type { Meta, StoryObj } from '@storybook/react'

import { Gallery } from '../gallery'

const meta: Meta<typeof Gallery> = {
  title: 'Gallery',
  component: Gallery,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Gallery>

export const Default: Story = {}
