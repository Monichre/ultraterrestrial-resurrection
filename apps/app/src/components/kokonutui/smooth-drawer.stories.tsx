import type {Meta, StoryObj} from '@storybook/react'
import SmoothDrawer from './smooth-drawer'

const meta = {
  title: 'Components/KokonutUI/SmoothDrawer',
  component: SmoothDrawer,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof SmoothDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
