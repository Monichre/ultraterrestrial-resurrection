import type { Meta, StoryObj } from '@storybook/react'

import { DynamicToolbar } from './DynamicToolbar'

const meta = {
  component: DynamicToolbar,
  title: "C"
} satisfies Meta<typeof DynamicToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}