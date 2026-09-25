import type {Meta, StoryObj} from '@storybook/react'
import DeployButton from './DeployButton'

const meta = {
  title: 'Components/DeployButton',
  component: DeployButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DeployButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
