import type {Meta, StoryObj} from '@storybook/react'
import {UltraLogoAlt} from './ut-logo-alt'

const meta = {
  title: 'Components/Navbar/UtLogoAlt',
  component: UltraLogoAlt,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof UltraLogoAlt>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
