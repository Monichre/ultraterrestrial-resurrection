import type {Meta, StoryObj} from '@storybook/react'
import {ExplodingStack} from './exploding-stack'

const DEMO_RECORDS = [
  {
    id: '1',
    name: 'course waitlist',
    domain: 'course.craftofui.com',
    count: 23602,
    prepaid: 16280,
  },
  {
    id: '2',
    name: 'newsletter',
    domain: 'craftofui.com',
    count: 15420,
    prepaid: 12800,
  },
  {
    id: '3',
    name: 'beta access',
    domain: 'beta.craftofui.com',
    count: 8940,
    prepaid: 7200,
  },
]

const meta = {
  title: 'Components/ExplodingStack',
  component: ExplodingStack,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
} satisfies Meta<typeof ExplodingStack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    records: DEMO_RECORDS,
  },
}
