import type {Meta, StoryObj} from '@storybook/react'
import {TestGSAP} from './TestGSAP'

const meta = {
  title: 'Components/Tests/TestGSAP',
  component: TestGSAP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'TestGSAP injects an animated div directly into the document body via GSAP. The component itself returns null — check the canvas to see the spinning red square.',
      },
    },
  },
} satisfies Meta<typeof TestGSAP>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
