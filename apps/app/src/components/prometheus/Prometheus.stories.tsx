import type {Meta, StoryObj} from '@storybook/react'
import {Prometheus} from './Prometheus'

const ARCHIVE_BACKDROP = {
  backgroundColor: '#040609',
  backgroundImage: [
    'radial-gradient(ellipse at 50% 35%, rgba(164, 212, 255, 0.05), transparent 60%)',
    'linear-gradient(rgba(164, 212, 255, 0.035) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(164, 212, 255, 0.035) 1px, transparent 1px)',
  ].join(', '),
  backgroundSize: '100% 100%, 48px 48px, 48px 48px',
}

const meta = {
  title: 'Components/Prometheus',
  component: Prometheus,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
  args: {quality: 'high', fireIntensity: 1, assemble: true, paused: false},
  argTypes: {
    quality: {control: 'inline-radio', options: ['low', 'high']},
    fireIntensity: {control: {type: 'range', min: 0, max: 2, step: 0.05}},
    assemble: {control: 'boolean'},
    paused: {control: 'boolean'},
    className: {control: 'text'},
  },
  decorators: [
    (Story) => (
      <div
        style={{
          ...ARCHIVE_BACKDROP,
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Prometheus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Assembled: Story = {args: {assemble: false}}

export const LowQuality: Story = {args: {quality: 'low'}}

export const Inferno: Story = {args: {fireIntensity: 2}}

export const Portrait: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          height: '92%',
          aspectRatio: '9 / 16',
          outline: '1px solid rgba(164, 212, 255, 0.12)',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
