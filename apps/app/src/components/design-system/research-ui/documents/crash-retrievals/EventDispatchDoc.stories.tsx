import type {Meta, StoryObj} from '@storybook/react'
import {EventDispatchDoc} from './EventDispatchDoc'

const meta: Meta<typeof EventDispatchDoc> = {
  title: 'Documents/Crash Retrievals/EventDispatchDoc',
  component: EventDispatchDoc,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EventDispatchDoc>

export const Default: Story = {}
