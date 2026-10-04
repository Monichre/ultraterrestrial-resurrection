import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MultiStepLoader } from '@/components/multistep-loader/multistep-loader'

const meta = {
  title: 'Components/MultistepLoader',
  component: MultiStepLoader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    loadingStates: [
      {
        text: 'test',
      },
      {
        text: 'test 2',
      },
    ],
  },
} satisfies Meta<typeof MultiStepLoader>

export default meta

type Story = StoryObj<typeof meta>

export const Demo: Story = {
  args: {
    loadingStates: [
      {
        text: 'test',
      },
      {
        text: 'test 2',
      },
    ],
  },
}
