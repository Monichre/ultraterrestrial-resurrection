import type {Meta, StoryObj} from '@storybook/react'

import {UiLabToolbar} from './ui-lab-toolbar'

const meta = {
  component: UiLabToolbar,
} satisfies Meta<typeof UiLabToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
