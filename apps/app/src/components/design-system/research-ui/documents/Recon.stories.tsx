import type { Meta, StoryObj } from '@storybook/react'
import { Recon } from './Recon'

const meta: Meta<typeof Recon> = {
  title: 'Documents/Recon',
  component: Recon,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Recon>

export const Default: Story = {
  args: { grainOpacity: 0.1, scratchOpacity: 0.05 },
}


