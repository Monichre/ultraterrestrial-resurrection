import type {Meta, StoryObj} from '@storybook/react'
import {Moon} from './Moon'

const meta = {
  title: 'Components/Moon',
  component: Moon,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  decorators: [
    (Story) => (
      <div style={{width: '100%', height: '500px', position: 'relative'}}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Moon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
