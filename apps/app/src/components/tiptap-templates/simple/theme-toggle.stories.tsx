import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {ThemeToggle} from './theme-toggle'

const meta = {
  title: 'Components/TiptapTemplates/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
