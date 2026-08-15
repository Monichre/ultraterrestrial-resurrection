import type {Meta, StoryObj} from '@storybook/react'
import {BlockQuote} from './Blockquote'

const meta = {
  title: 'Components/Blockquote',
  component: BlockQuote,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof BlockQuote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    quote: 'The truth is out there, but so are a lot of other things.',
    author: 'Fox Mulder',
  },
}
