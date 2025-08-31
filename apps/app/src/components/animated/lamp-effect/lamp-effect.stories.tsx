import { LampEffect } from '@/components/animated/lamp-effect/lamp-effect'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

const meta = {
  title: 'Components/LampEffect',
  component: LampEffect,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
} satisfies Meta<typeof LampEffect>

export default meta

type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

export const LoggedOut: Story = {}
