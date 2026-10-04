import type {Meta, StoryObj} from '@storybook/react'
import * as React from 'react'
import {
  Typography,
  Heading,
  SubHeading,
  DataLabel,
  DataValue,
  Code as CodeInline,
  TypewriterText,
  HandwrittenNote,
  ClassifiedStamp,
  GlitchText,
  RedactedText,
} from './Typography'

const VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'heading-main',
  'heading-distorted',
  'heading-classified',
  'subheading',
  'subheading-glitch',
  'body',
  'body-large',
  'body-small',
  'caption',
  'data-label',
  'data-value',
  'coordinates',
  'timestamp',
  'code',
  'button',
  'typewriter',
  'typewriter-animated',
  'handwritten',
  'annotation',
  'stamp',
  'glitch',
  'redacted',
  'scan-line',
  'blurred',
  'faded',
] as const

const COLORS = [
  'default',
  'muted',
  'destructive',
  'primary',
  'secondary',
  'accent',
  'ink-black',
  'ink-faded',
  'fire-orange',
  'classified-red',
  'fire-gradient',
  'glow',
  'hard-shadow',
] as const

const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const
const WEIGHTS = ['light', 'normal', 'medium', 'semibold', 'bold', 'black'] as const
const ALIGNS = ['left', 'center', 'right', 'justify'] as const
const TRANSFORMS = ['none', 'uppercase', 'lowercase', 'capitalize'] as const

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
    },
    color: {
      control: 'select',
      options: COLORS,
    },
    size: {
      control: 'select',
      options: SIZES,
    },
    weight: {
      control: 'select',
      options: WEIGHTS,
    },
    align: {
      control: 'select',
      options: ALIGNS,
    },
    transform: {
      control: 'select',
      options: TRANSFORMS,
    },
    glitch: {control: 'boolean'},
    rotation: {control: {type: 'range', min: -15, max: 15, step: 1}},
    dataText: {control: 'text'},
    as: {control: false},
    className: {control: 'text'},
    style: {control: false},
    children: {control: 'text'},
  },
  args: {
    children: 'Sample typography text',
    variant: 'body',
    color: 'default',
    size: 'base',
    weight: 'normal',
    align: 'left',
    transform: 'none',
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Playground: Story = {}

export const VariantsGallery: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 16,
        maxWidth: 1200,
      }}>
      {VARIANTS.map((v) => (
        <div key={v} style={{padding: 12, border: '1px solid #222', borderRadius: 8}}>
          <Typography variant='caption' color='muted' style={{display: 'block', marginBottom: 6}}>
            variant="{v}"
          </Typography>
          <Typography {...args} variant={v as any}>
            The quick brown fox jumps over the lazy dog.
          </Typography>
        </div>
      ))}
    </div>
  ),
}

export const ColorsShowcase: Story = {
  args: {variant: 'h4'},
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 16,
        maxWidth: 1200,
      }}>
      {COLORS.map((c) => (
        <div key={c} style={{padding: 12, border: '1px solid #222', borderRadius: 8}}>
          <Typography variant='caption' color='muted' style={{display: 'block', marginBottom: 6}}>
            color="{c}"
          </Typography>
          <Typography {...args} color={c as any}>
            Color token: {String(c)}
          </Typography>
        </div>
      ))}
    </div>
  ),
}

export const SizesRow: Story = {
  args: {variant: 'body'},
  render: (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {SIZES.map((s) => (
        <Typography key={s} {...args} size={s as any}>
          size="{s}" — The quick brown fox jumps over the lazy dog.
        </Typography>
      ))}
    </div>
  ),
}

export const WeightsRow: Story = {
  args: {variant: 'body'},
  render: (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {WEIGHTS.map((w) => (
        <Typography key={w} {...args} weight={w as any}>
          weight="{w}" — The quick brown fox jumps over the lazy dog.
        </Typography>
      ))}
    </div>
  ),
}

export const AlignmentAndTransform: Story = {
  args: {variant: 'body-large'},
  render: (args) => (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
      {ALIGNS.map((a) => (
        <div key={a} style={{padding: 12, border: '1px solid #222', borderRadius: 8}}>
          <Typography variant='caption' color='muted' style={{display: 'block', marginBottom: 6}}>
            align="{a}"
          </Typography>
          <Typography {...args} align={a as any}>
            Alignment example for {String(a)} alignment.
          </Typography>
        </div>
      ))}
      {TRANSFORMS.map((t) => (
        <div key={t} style={{padding: 12, border: '1px solid #222', borderRadius: 8}}>
          <Typography variant='caption' color='muted' style={{display: 'block', marginBottom: 6}}>
            transform="{t}"
          </Typography>
          <Typography {...args} transform={t as any}>
            Transform example with {String(t)}
          </Typography>
        </div>
      ))}
    </div>
  ),
}

export const SpecialEffects: Story = {
  render: () => (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
      <GlitchText dataText='GLITCH EFFECT'>GLITCH EFFECT</GlitchText>
      <RedactedText>TOP SECRET INFORMATION REDACTED</RedactedText>
      <Typography variant='scan-line'>Scanning transmission in progress...</Typography>
      <Typography variant='blurred'>Slightly blurred archival note</Typography>
      <Typography variant='faded'>Faded caption from declassified document</Typography>
      <ClassifiedStamp>Operation ULTRATERRESTRIAL</ClassifiedStamp>
    </div>
  ),
}

export const DataDisplay: Story = {
  render: () => (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
      <div>
        <DataLabel>Latitude</DataLabel>
        <br />
        <DataValue>51.4779° N</DataValue>
      </div>
      <div>
        <DataLabel>Longitude</DataLabel>
        <br />
        <DataValue>0.0015° W</DataValue>
      </div>
      <div>
        <Typography variant='coordinates'>51.4779, -0.0015</Typography>
      </div>
      <div>
        <Typography variant='timestamp'>1967-10-04 23:12:45Z</Typography>
      </div>
      <div>
        <Typography as='pre' variant='code'>
          <CodeInline>{`curl -X GET https://api.ultra.dev/sightings?year=1967`}</CodeInline>
        </Typography>
      </div>
    </div>
  ),
}

export const ResearchStyles: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <TypewriterText>Typing declassified transcript...</TypewriterText>
      <Typography variant='typewriter-animated'>Simulating terminal feed...</Typography>
      <HandwrittenNote>Witness margin note: "It moved without sound"</HandwrittenNote>
      <Typography variant='annotation'>Figure 3: anomalous radar return</Typography>
    </div>
  ),
}

export const ConvenienceComponents: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <Heading>Primary Heading</Heading>
      <SubHeading>Section Heading</SubHeading>
      <Typography variant='body'>Standard body copy for articles and notes.</Typography>
      <Typography variant='caption' color='muted'>
        Caption with muted color
      </Typography>
    </div>
  ),
}
