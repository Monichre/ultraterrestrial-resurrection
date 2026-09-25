import type {Meta, StoryObj} from '@storybook/react'
import PeopleGrid from './LinkCards'

const meta = {
  title: 'Components/Blocks/LinkCards',
  component: PeopleGrid,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof PeopleGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
