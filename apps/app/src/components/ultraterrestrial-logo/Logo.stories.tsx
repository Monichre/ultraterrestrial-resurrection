import type {Meta, StoryObj} from '@storybook/react'
import PulsatingCircles from './Logo'

const meta = {
  title: 'Components/Logo/UltraterrestrialLogo',
  component: PulsatingCircles,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof PulsatingCircles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
