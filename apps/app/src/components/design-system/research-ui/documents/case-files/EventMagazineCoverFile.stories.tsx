import type {Meta, StoryObj} from '@storybook/react'
import {Unior32dDocument as EventMagazineCoverFile} from './EventMagazineCoverFile'

const meta: Meta<typeof EventMagazineCoverFile> = {
  title: 'Documents/Case Files/EventMagazineCoverFile',
  component: EventMagazineCoverFile,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EventMagazineCoverFile>

export const Default: Story = {}
