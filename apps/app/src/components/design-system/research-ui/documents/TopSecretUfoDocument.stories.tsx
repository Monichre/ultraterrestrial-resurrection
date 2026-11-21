import type {Meta, StoryObj} from '@storybook/react'
import TopSecretUfoDocument from './TopSecretUfoDocument'

const meta: Meta<typeof TopSecretUfoDocument> = {
  title: 'Documents/TopSecretUfoDocument',
  component: TopSecretUfoDocument,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Complete TOP SECRET UFO document layout showcasing the Washington D.C. UFO Wave of July 1952. Demonstrates complex document composition using TypedParagraph, HandwrittenNote, DistressedPhoto, and TopSecretBanner components in an authentic government report layout.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complete TOP SECRET UFO document showing the full layout with all components integrated. Includes typed content, handwritten annotations, photographic evidence, and classification banners.',
      },
    },
  },
}

export const PrintLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Document optimized for print layout, showing how the component appears when printed or exported as a PDF.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: 'white',
          minHeight: '100vh',
          padding: '2rem',
          fontSize: '12pt',
          lineHeight: '1.5',
        }}>
        <Story />
      </div>
    ),
  ],
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Document layout on mobile devices, showing responsive behavior and content adaptation.',
      },
    },
  },
}

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Document layout on tablet-sized screens, demonstrating responsive grid adaptations.',
      },
    },
  },
}

export const HighContrast: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          filter: 'contrast(150%) brightness(120%)',
          backgroundColor: '#f5f5f5',
        }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Document with enhanced contrast for accessibility and clarity, useful for visually impaired users or poor lighting conditions.',
      },
    },
  },
}

export const ComponentBreakdown: Story = {
  render: () => (
    <div className='space-y-8 p-8 bg-amber-50 min-h-screen'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Component Breakdown</h2>
        <p className='text-gray-700 mb-8'>
          Individual components used in the TOP SECRET UFO Document
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='border-2 border-dashed border-gray-400 p-4 bg-white'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>TOP SECRET Banner</h3>
          <div className='flex justify-center'>
            {/* TopSecretBanner component would be imported and used here */}
            <div className='inline-block px-6 py-2 border-4 border-gray-800 bg-amber-100 shadow-md'>
              <span className='text-gray-900 font-black text-lg tracking-widest'>TOP SECRET</span>
            </div>
          </div>
        </div>

        <div className='border-2 border-dashed border-gray-400 p-4 bg-white'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Handwritten Notes</h3>
          <div className='space-y-2'>
            <div
              className='text-blue-900 font-bold text-sm transform -rotate-2'
              style={{fontFamily: "'Brush Script MT', cursive"}}>
              11:30 AM
            </div>
            <div
              className='text-blue-900 font-bold text-sm transform rotate-1'
              style={{fontFamily: "'Brush Script MT', cursive"}}>
              believe
            </div>
            <div
              className='text-blue-900 font-bold text-sm transform -rotate-1'
              style={{fontFamily: "'Brush Script MT', cursive"}}>
              formation
            </div>
          </div>
        </div>

        <div className='border-2 border-dashed border-gray-400 p-4 bg-white'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Typed Paragraphs</h3>
          <div className='space-y-3'>
            <p className='text-gray-900 leading-relaxed tracking-wide font-mono text-sm'>
              ATIC logs recorded fast-moving lights reportedly skirting the Capitol dome before
              vanishing at 1 am.
            </p>
            <p className='text-gray-900 leading-relaxed tracking-wide font-mono text-sm'>
              Examples note: repeated returns near the Washington National Airport paced and
              intervened with interceptor formation for 20 miles.
            </p>
          </div>
        </div>

        <div className='border-2 border-dashed border-gray-400 p-4 bg-white'>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Distressed Photo</h3>
          <div className='flex justify-center'>
            <div className='relative w-48 h-56 bg-gray-900 border-4 border-amber-200 shadow-lg transform rotate-1'>
              <div className='absolute inset-0 bg-gradient-to-br from-transparent to-black/20'></div>
              <div className='absolute top-8 left-12 w-3 h-3 bg-yellow-200 rounded-full blur-sm opacity-80'></div>
              <div className='absolute top-12 left-20 w-2 h-2 bg-white rounded-full blur-sm opacity-90'></div>
              <div className='absolute bottom-4 left-4 px-3 py-1 border-2 border-red-800 bg-red-100/80 transform -rotate-12'>
                <span className='text-red-800 font-bold text-xs tracking-wider'>TOP SECRET</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Breakdown view showing individual components that make up the complete document. Useful for understanding the component composition.',
      },
    },
  },
}

export const ArchivalView: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          filter: 'sepia(50%) brightness(0.9) contrast(1.1)',
          backgroundColor: '#f4f1e8',
        }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Document with archival aging effects, simulating how the document might appear after decades of storage.',
      },
    },
  },
}

export const DocumentationView: Story = {
  decorators: [
    (Story) => (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white border border-gray-300 shadow-lg p-8 mb-8'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Document Analysis: Washington D.C. UFO Wave (1952)
            </h1>
            <p className='text-gray-600'>Historical Analysis and Component Demonstration</p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Document presented in a documentation context with analytical framing, suitable for educational or research purposes.',
      },
    },
  },
}
