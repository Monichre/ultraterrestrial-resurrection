import type {Meta, StoryObj} from '@storybook/react'
import SiriOrb from './SiriOrb'

const meta = {
  title: 'Components/SmoothUI/SiriOrb',
  component: SiriOrb,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof SiriOrb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: '192px',
  },
}

export const Small: Story = {
  args: {
    size: '48px',
  },
}

export const CustomColors: Story = {
  args: {
    size: '192px',
    colors: {
      bg: 'oklch(22.64% 0 0)',
      c1: 'oklch(75% 0.15 350)',
      c2: 'oklch(80% 0.12 200)',
      c3: 'oklch(78% 0.14 280)',
    },
  },
}
