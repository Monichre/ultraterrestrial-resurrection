import type {Meta, StoryObj} from '@storybook/react'
import {CosmicLanding} from './cosmic-landing'

const meta = {
  title: 'Components/DemoLanding/CosmicLanding',
  component: CosmicLanding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CosmicLanding>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
