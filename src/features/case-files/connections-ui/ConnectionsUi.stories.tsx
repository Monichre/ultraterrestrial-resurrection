import type {Meta, StoryObj} from '@storybook/react'
import {EntityConnectionsFlow} from './EntityConnectionsFlow'

const meta = {
  title: 'Components/ConnectionsUi',
  component: EntityConnectionsFlow,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof EntityConnectionsFlow>

export default meta

type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {},
}
