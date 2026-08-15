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
    designs: [
      {
        type: 'figma',
        name: 'Spec (optional)',
        url: 'https://www.figma.com/',
      },
    ],
    designAssets: {
      assets: [
        {name: 'Doc A Main', url: '/images/doc-a-main.png'},
        {name: 'Doc B Abstract', url: '/images/doc-b-abstract.png'},
        {name: 'Textstorm', url: '/images/doc-b-textstorm.png'},
        {name: 'Stamp', url: '/images/doc-b-stamp.png'},
      ],
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Two: Story = {render: () => <CrashRetrievalTwo />}
export const Three: Story = {render: () => <CrashRetrievalThree />}
