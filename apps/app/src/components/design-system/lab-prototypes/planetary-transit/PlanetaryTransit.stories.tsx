'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {PlanetaryTransit} from './PlanetaryTransit'

const meta = {
  title: 'Design System/Lab Prototypes/PlanetaryTransit',
  component: PlanetaryTransit,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof PlanetaryTransit>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoDStarfield: Story = {
  args: {preferWebgl: false},
}

export const CustomHouse: Story = {
  args: {
    title: 'Lunar Transit',
    subtitle: 'Observatory // Sector 07',
    activeHouse: 'IV. Cancer',
  },
}
