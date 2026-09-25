import type {Meta, StoryObj} from '@storybook/react'
import {VintageDocumentsDemo} from './VintageDocumentsDemo'
import {
  VintageDocumentCard,
  IncidentReportCard,
  PersonnelFileCard,
  ClassificationBadge,
} from './index'
import type {IncidentReport, PersonnelFile, ClassificationLevel} from './types'

const meta: Meta<typeof VintageDocumentsDemo> = {
  title: 'Documents/VintageDocumentsDemo',
  component: VintageDocumentsDemo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'slate',
      values: [
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
        {name: 'vintage', value: '#2c1810'},
      ],
    },
    docs: {
      description: {
        component:
          'Comprehensive showcase of all vintage document components working together. Demonstrates real-world usage patterns and component combinations for authentic government document aesthetics.',
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
          'Default demonstration showing both IncidentReportCard and PersonnelFileCard components with sample data in a clean layout.',
      },
    },
  },
}

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div className='min-h-screen bg-slate-900 p-8'>
      <div className='max-w-7xl mx-auto space-y-16'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-slate-100 mb-4'>
            Vintage Government Document Components
          </h1>
          <p className='text-lg text-slate-300 max-w-3xl mx-auto'>
            Authentic 1940s-1960s government document styling with classification badges, aged paper
            effects, and period-appropriate typography.
          </p>
        </div>

        {/* Classification Badges Overview */}
        <section>
          <h2 className='text-2xl font-semibold mb-6 text-slate-200'>Classification System</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {(
              ['unclassified', 'confidential', 'secret', 'top-secret'] as ClassificationLevel[]
            ).map((level) => (
              <div key={level} className='bg-slate-800 rounded-lg p-4 text-center'>
                <ClassificationBadge level={level} />
                <p className='text-slate-300 text-sm mt-2 capitalize'>{level.replace('-', ' ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <h2 className='text-2xl font-semibold mb-6 text-slate-200'>Component Features</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-slate-800 rounded-lg p-6'>
              <h3 className='text-lg font-medium mb-4 text-slate-200'>Visual Design</h3>
              <ul className='space-y-2 text-slate-300 text-sm'>
                <li>• Aged paper background effects</li>
                <li>• Vintage typography and spacing</li>
                <li>• Color-coded classification system</li>
                <li>• Paperclip attachment visuals</li>
                <li>• Film grain and vignette effects</li>
              </ul>
            </div>
            <div className='bg-slate-800 rounded-lg p-6'>
              <h3 className='text-lg font-medium mb-4 text-slate-200'>Technical Features</h3>
              <ul className='space-y-2 text-slate-300 text-sm'>
                <li>• Full TypeScript support</li>
                <li>• Responsive design patterns</li>
                <li>• Accessible markup and ARIA</li>
                <li>• Customizable styling props</li>
                <li>• Tree-shakeable exports</li>
              </ul>
            </div>
            <div className='bg-slate-800 rounded-lg p-6'>
              <h3 className='text-lg font-medium mb-4 text-slate-200'>Use Cases</h3>
              <ul className='space-y-2 text-slate-300 text-sm'>
                <li>• Historical documentation</li>
                <li>• Government agency interfaces</li>
                <li>• Retro-themed applications</li>
                <li>• Educational presentations</li>
                <li>• Entertainment and gaming</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section>
          <h2 className='text-2xl font-semibold mb-6 text-slate-200'>Usage Example</h2>
          <div className='bg-slate-800 rounded-lg p-6'>
            <pre className='text-green-400 text-sm overflow-x-auto'>
              {`import { 
  VintageDocumentCard, 
  IncidentReportCard, 
  PersonnelFileCard 
} from '@/components/documents'

// Basic document
<VintageDocumentCard 
  classification="secret"
  title="CLASSIFIED BRIEFING"
  date="JUNE 1952"
  location="Pentagon"
>
  <p>Document content here...</p>
</VintageDocumentCard>

// Incident report
<IncidentReportCard incident={incidentData} />

// Personnel file
<PersonnelFileCard personnel={personnelData} />`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete showcase demonstrating all vintage document components features, usage patterns, and technical capabilities.',
      },
    },
  },
}

export const ComponentComparison: Story = {
  render: () => (
    <div className='min-h-screen bg-slate-900 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-slate-100 mb-8 text-center'>
          Classification Level Comparison
        </h1>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {(['unclassified', 'confidential', 'secret', 'top-secret'] as ClassificationLevel[]).map(
            (classification) => (
              <VintageDocumentCard
                key={classification}
                classification={classification}
                title={`${classification.toUpperCase().replace('-', ' ')} DOCUMENT`}
                date='DEMO DATE'
                location='Test Location'>
                <div className='space-y-3'>
                  <p className='text-gray-800 text-sm'>
                    This is a sample {classification} document showing the visual styling and color
                    scheme for this classification level.
                  </p>
                  <div className='text-xs text-gray-600'>
                    <strong>Classification:</strong>{' '}
                    {classification.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
              </VintageDocumentCard>
            )
          )}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side comparison of all classification levels showing color schemes and styling differences for each security classification.',
      },
    },
  },
}

export const AccessibilityShowcase: Story = {
  render: () => (
    <div className='min-h-screen bg-slate-900 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-slate-100 mb-4'>
            Accessibility Features Demonstration
          </h1>
          <p className='text-slate-300'>
            All components include ARIA labels, semantic markup, and keyboard navigation support.
          </p>
        </div>

        <VintageDocumentCard
          classification='unclassified'
          title='ACCESSIBILITY DEMONSTRATION'
          date='CURRENT DATE'
          location='Storybook Demo'>
          <div className='space-y-4'>
            <p className='text-gray-800'>
              This document demonstrates the accessibility features built into all vintage document
              components:
            </p>
            <ul className='list-disc pl-6 text-gray-800 space-y-2'>
              <li>Semantic HTML structure with proper headings</li>
              <li>ARIA labels for classification badges and status indicators</li>
              <li>High contrast color ratios for readability</li>
              <li>Keyboard navigation support for interactive elements</li>
              <li>Screen reader friendly content organization</li>
            </ul>
            <div className='bg-green-50 border border-green-200 p-3 rounded'>
              <p className='text-green-800 text-sm'>
                <strong>✓ WCAG 2.1 AA Compliant:</strong> All color combinations meet accessibility
                contrast requirements.
              </p>
            </div>
          </div>
        </VintageDocumentCard>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the accessibility features built into the vintage document components, including ARIA labels, semantic markup, and WCAG compliance.',
      },
    },
  },
}
