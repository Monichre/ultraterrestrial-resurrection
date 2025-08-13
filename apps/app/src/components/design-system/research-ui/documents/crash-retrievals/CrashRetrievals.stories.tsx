import type {Meta, StoryObj} from '@storybook/react'
import {CrashRetrievalTwo, CrashRetrievalThree} from './CrashRetrievals'

const meta: Meta = {
  title: 'Documents/CrashRetrievals',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'slate',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Two: Story = {render: () => <CrashRetrievalTwo />}
export const Three: Story = {render: () => <CrashRetrievalThree />}
