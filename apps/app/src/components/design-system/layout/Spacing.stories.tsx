import type { Meta, StoryObj } from '@storybook/react'
import { SpacingDemo, LayoutGrid, DocumentMargins } from './Spacing'

const meta: Meta<typeof SpacingDemo> = {
  title: 'Design System/Layout & Spacing',
  component: SpacingDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Spacing scale and layout grid system for consistent spacing and alignment throughout the design system.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SpacingDemo>

export const SpacingScale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete spacing scale showing all available padding and margin values.',
      },
    },
  },
}

export const GridLayouts: StoryObj<typeof LayoutGrid> = {
  render: () => <LayoutGrid />,
  parameters: {
    docs: {
      description: {
        story: 'Grid layout examples for documents, data tables, and file folder layouts.',
      },
    },
  },
}

export const DocumentMarginsDemo: StoryObj<typeof DocumentMargins> = {
  render: () => <DocumentMargins />,
  parameters: {
    docs: {
      description: {
        story: 'Document layout examples showing proper margins and padding for different content types.',
      },
    },
  },
}

export const ResponsiveSpacing: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Responsive Spacing Examples</h2>
      
      {/* Mobile-first responsive padding */}
      <div className="bg-blue-50 border border-blue-200 p-4 md:p-8 lg:p-12">
        <div className="text-sm font-mono mb-2">Responsive Padding</div>
        <div className="text-xs text-gray-600">p-4 md:p-8 lg:p-12</div>
        <div className="text-xs mt-2">
          This container has different padding at different breakpoints:
          <br />• Mobile: 16px padding
          <br />• Tablet: 32px padding  
          <br />• Desktop: 48px padding
        </div>
      </div>

      {/* Responsive margins */}
      <div className="space-y-2 md:space-y-4 lg:space-y-6">
        <div className="bg-green-50 border border-green-200 p-4">
          <div className="text-sm font-mono">Item 1</div>
          <div className="text-xs text-gray-600">space-y-2 md:space-y-4 lg:space-y-6</div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4">
          <div className="text-sm font-mono">Item 2</div>
          <div className="text-xs text-gray-600">Responsive vertical spacing</div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4">
          <div className="text-sm font-mono">Item 3</div>
          <div className="text-xs text-gray-600">Adapts to screen size</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive spacing that adapts to different screen sizes using Tailwind responsive prefixes.',
      },
    },
  },
}

export const NestedSpacing: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Nested Spacing Patterns</h2>
      
      {/* Card with nested spacing */}
      <div className="bg-white border border-gray-300 p-6 shadow-lg max-w-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Case File Header</h3>
          <div className="text-xs text-gray-500 uppercase tracking-wide">UFO-1947-001</div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 border border-gray-200">
            <div className="text-sm font-medium mb-2">Classification Details</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Security Level:</span>
                <span className="font-mono text-red-600">TOP SECRET</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Clearance Required:</span>
                <span className="font-mono">COSMIC</span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-3 border border-amber-200">
            <div className="text-sm font-medium mb-2">Location Data</div>
            <div className="text-xs font-mono space-y-1">
              <div>33°23'45"N 106°28'35"W</div>
              <div>Roswell Army Air Field</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Document contains nested spacing patterns for visual hierarchy
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of nested spacing patterns that create visual hierarchy and improve content organization.',
      },
    },
  },
}