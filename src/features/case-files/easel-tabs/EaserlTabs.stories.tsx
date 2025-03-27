import type {Meta, StoryObj} from '@storybook/react'
import {EaserlTabs} from '@/features/case-files/easel-tabs'

const meta = {
  title: 'Components/EaserlTabs',
  component: EaserlTabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof EaserlTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {},
}
