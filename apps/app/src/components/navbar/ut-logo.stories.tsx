import type {Meta, StoryObj} from '@storybook/react'
import {UltraterrestrialLogo} from './ut-logo'

const meta = {
  title: 'Components/Navbar/UtLogo',
  component: UltraterrestrialLogo,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof UltraterrestrialLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
