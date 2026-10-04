import type {Meta, StoryObj} from '@storybook/react'
import EntityAdditionProgress from './EntityAdditionProgress'

const meta = {
  title: 'Components/AI/EntityAdditionProgress',
  component: EntityAdditionProgress,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof EntityAdditionProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isVisible: true,
    queryType: 'personnel',
  },
}
