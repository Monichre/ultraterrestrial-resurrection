import type { Meta, StoryObj } from '@storybook/react'
import { ColorPalette, ColorSwatch } from './Colors'

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color palette for the dystopian UFO document design system, featuring aged paper, fire effects, and classification colors.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorPalette>

export const FullPalette: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete color palette showing all available colors organized by category.',
      },
    },
  },
}

export const PaperColors: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Paper & Background Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 p-4 rounded" style={{ backgroundColor: '#f4f1e8' }}>
          <div className="text-sm font-mono">bg-paper</div>
          <div className="text-xs text-gray-600">#f4f1e8</div>
          <div className="mt-2 text-xs">Main paper background</div>
        </div>
        <div className="h-32 p-4 rounded" style={{ backgroundColor: '#e8e2d5' }}>
          <div className="text-sm font-mono">bg-paper-aged</div>
          <div className="text-xs text-gray-600">#e8e2d5</div>
          <div className="mt-2 text-xs">Aged document background</div>
        </div>
      </div>
    </div>
  ),
}

export const InkColors: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ink Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 p-4 rounded bg-white border">
          <div className="text-sm font-mono" style={{ color: '#1a1a1a' }}>ink-black</div>
          <div className="text-xs text-gray-600">#1a1a1a</div>
          <div className="mt-2 text-xs">Primary text color</div>
        </div>
        <div className="h-32 p-4 rounded bg-white border">
          <div className="text-sm font-mono" style={{ color: '#4a4a4a' }}>ink-faded</div>
          <div className="text-xs text-gray-600">#4a4a4a</div>
          <div className="mt-2 text-xs">Faded text, annotations</div>
        </div>
      </div>
    </div>
  ),
}

export const FireColors: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Fire & Energy Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 p-4 rounded text-white" style={{ backgroundColor: '#ff6b35' }}>
          <div className="text-sm font-mono">fire-orange</div>
          <div className="text-xs opacity-80">#ff6b35</div>
          <div className="mt-2 text-xs">UFO energy, warning colors</div>
        </div>
        <div className="h-32 p-4 rounded text-black" style={{ backgroundColor: '#ffd23f' }}>
          <div className="text-sm font-mono">fire-yellow</div>
          <div className="text-xs opacity-80">#ffd23f</div>
          <div className="mt-2 text-xs">Highlights, energy cores</div>
        </div>
      </div>
    </div>
  ),
}

export const ClassifiedColors: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Classification Colors</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-32 p-4 rounded text-white" style={{ backgroundColor: '#dc2626' }}>
          <div className="text-sm font-mono">danger-red</div>
          <div className="text-xs opacity-80">#dc2626</div>
          <div className="mt-2 text-xs">Top Secret, Classified</div>
        </div>
        <div className="h-32 p-4 rounded text-black" style={{ backgroundColor: '#f59e0b' }}>
          <div className="text-sm font-mono">warning-amber</div>
          <div className="text-xs opacity-80">#f59e0b</div>
          <div className="mt-2 text-xs">Confidential warnings</div>
        </div>
        <div className="h-32 p-4 rounded text-white bg-black">
          <div className="text-sm font-mono">secret-black</div>
          <div className="text-xs opacity-80">#000000</div>
          <div className="mt-2 text-xs">Redacted information</div>
        </div>
      </div>
    </div>
  ),
}

// Color Swatch Stories
const SwatchMeta: Meta<typeof ColorSwatch> = {
  title: 'Design System/Colors/ColorSwatch',
  component: ColorSwatch,
  parameters: {
    layout: 'centered',
  },
}

export const SingleSwatch: StoryObj<typeof ColorSwatch> = {
  ...SwatchMeta,
  args: {
    color: '#ff6b35',
    name: 'fire-orange',
  },
}

export const SwatchGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <ColorSwatch color="#f4f1e8" name="bg-paper" />
      <ColorSwatch color="#1a1a1a" name="ink-black" />
      <ColorSwatch color="#ff6b35" name="fire-orange" />
      <ColorSwatch color="#ffd23f" name="fire-yellow" />
      <ColorSwatch color="#7d8491" name="smoke-gray" />
      <ColorSwatch color="#dc2626" name="danger-red" />
    </div>
  ),
}