import type { Meta, StoryObj } from '@storybook/react'

import { StyleGuide } from '../style-guide'

const meta: Meta<typeof StyleGuide> = {
  title: 'Style Guide',
  component: StyleGuide,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof StyleGuide>

export const Default: Story = {}
