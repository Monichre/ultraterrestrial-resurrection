import type {Meta, StoryObj} from '@storybook/react'
import {PolaroidBasic, PolaroidAlt} from './Polaroid'

const meta: Meta = {
  title: 'Documents/Polaroid',
  parameters: {layout: 'centered'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: () => (
    <PolaroidBasic
      person={{
        id: '1',
        image: {
          url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=300&fit=crop',
        },
        name: 'John Doe',
        role: 'Witness',
        popularity: 'High',
      }}
    />
  ),
}

export const Alt: Story = {
  render: () => (
    <PolaroidAlt
      person={{
        id: '2',
        url: '#',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=300&fit=crop',
        name: 'Jane Smith',
        role: 'Researcher',
      }}
    />
  ),
}
