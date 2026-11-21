import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SubjectMatterExpertCard } from './SubjectMatterExpertCard'


const meta = {
  title: 'Mindmap/cards/subject-matter-expert-card/SubjectMatterExpertCard',
  component: SubjectMatterExpertCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SubjectMatterExpertCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
