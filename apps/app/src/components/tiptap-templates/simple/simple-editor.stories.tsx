import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {SimpleEditor} from './simple-editor'

const meta = {
  title: 'Components/TiptapTemplates/SimpleEditor',
  component: SimpleEditor,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof SimpleEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
