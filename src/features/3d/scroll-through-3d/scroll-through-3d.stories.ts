import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ScrollThrough3D } from './scroll-through-3d'

const meta = {
  title: 'Components/3D Scroll Through',
  component: ScrollThrough3D,
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
} satisfies Meta<typeof ScrollThrough3D>

export default meta

type Story = StoryObj<typeof meta>

export const ThreeDdScrollThroughDemo: Story = {
  args: {},
}
