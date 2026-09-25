import type {Meta, StoryObj} from '@storybook/react'
import {Experimental} from './Experimental'

const meta: Meta<typeof Experimental> = {
  title: 'Documents/Experimental',
  component: Experimental,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Experimental>

export const Default: Story = {
  args: {grainOpacity: 0.1, scratchOpacity: 0.05, variant: 'impact'},
}
