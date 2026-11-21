import type {Meta, StoryObj} from '@storybook/react'
import ActionGrid from './LinkCardGrid'

const meta = {
  title: 'Components/Blocks/LinkCardGrid',
  component: ActionGrid,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ActionGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
