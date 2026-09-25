import type {Meta, StoryObj} from '@storybook/react'
import GridList01 from './DropdownCard'

const meta = {
  title: 'Components/Blocks/DropdownCard',
  component: GridList01,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof GridList01>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
