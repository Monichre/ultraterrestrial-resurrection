'use client'

import type { Meta, StoryObj } from '@storybook/nextjs'
import { DiagnosticArchitecture } from './DiagnosticArchitecture'

const meta = {
  title: 'Design System/Lab Prototypes/DiagnosticArchitecture',
  component: DiagnosticArchitecture,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DiagnosticArchitecture>

export default meta
type Story = StoryObj<typeof meta>

export const Wireframe: Story = {}

export const Topology: Story = {
  args: { initialMode: 'Topology' },
}

export const Metrics: Story = {
  args: { initialMode: 'Metrics' },
}
