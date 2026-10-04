import type {Meta, StoryObj} from '@storybook/react'
import {NewLogo} from './NewLogo'

const meta = {
  title: 'Components/Brand/NewLogo',
  component: NewLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NewLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
