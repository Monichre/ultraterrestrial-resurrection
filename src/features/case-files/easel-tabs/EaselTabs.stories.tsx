import type {Meta, StoryObj} from '@storybook/react'
import {EaselTabs} from './EaselTabs'

const meta = {
  title: 'Components/EaselTabs',
  component: EaselTabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof EaselTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {},
}
