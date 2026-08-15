import type {Meta, StoryObj} from '@storybook/react'
import {Prometheus} from './Prometheus'

const meta = {
  title: 'Components/Prometheus',
  component: Prometheus,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  decorators: [
    (Story) => (
      <div style={{width: '100%', height: '500px', position: 'relative'}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Prometheus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
