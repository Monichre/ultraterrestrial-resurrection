import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { useTextAnnotation } from './use-text-annotation'
import { AnnotationMenu } from '@/components/ui/annotation-menu'

const meta: Meta = {
  title: 'TipTap/Hooks/useTextAnnotation',
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' }
      ]
    },
    docs: {
      description: {
        component: 'Hook for handling text selection and annotation in documents. Provides context menu positioning and annotation management for TipTap integration.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Demo component to showcase the hook
function TextAnnotationDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    contextMenu,
    closeContextMenu,
    createAnnotation,
    clearAnnotations,
    annotations
  } = useTextAnnotation({ containerRef })

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-black rounded-lg border border-neutral-800">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#adf0dd] font-mono">CLASSIFIED DOCUMENT - TEXT ANNOTATION DEMO</h2>
        <button
          onClick={clearAnnotations}
          className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-sm text-sm font-mono transition-colors"
       >
          CLEAR ANNOTATIONS ({annotations.length})
        </button>
      </div>

      <div 
        ref={containerRef}
        className="p-6 bg-neutral-900/50 rounded-sm border border-neutral-800"
     >
        <p className="text-neutral-300 leading-relaxed font-mono text-sm">
          <strong className="text-[#adf0dd]">EXECUTIVE SUMMARY:</strong> Analysis of recovered materials from Site 7-Alpha 
          indicates anomalous quantum signatures consistent with non-terrestrial manufacturing processes. 
          The crystalline structures exhibit self-healing properties when exposed to specific electromagnetic frequencies 
          in the 2.4-2.6 GHz range.
        </p>
        
        <p className="text-neutral-300 leading-relaxed font-mono text-sm mt-4">
          <strong className="text-[#adf0dd]">KEY FINDINGS:</strong> Material samples demonstrate temporal distortion effects 
          localized within a 3-meter radius. Field teams reported chronometer discrepancies averaging 4.7 seconds per hour 
          of exposure. These findings corroborate witness testimonies from the Phoenix incident.
        </p>

        <p className="text-neutral-300 leading-relaxed font-mono text-sm mt-4">
          <strong className="text-[#adf0dd]">RECOMMENDATIONS:</strong> Immediate containment protocols should be enacted. 
          Further research requires Level 5 clearance authorization. All personnel exposed to materials must undergo 
          mandatory medical evaluation within 48 hours.
        </p>
      </div>

      {/* Display annotations */}
      {annotations.length> 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-[#adf0dd] font-mono mb-3">ANNOTATIONS:</h3>
          <div className="space-y-2">
            {annotations.map((annotation) => (
              <div 
                key={annotation.id} 
                className="p-3 bg-neutral-900/50 rounded-sm border border-neutral-800"
             >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-[#adf0dd] font-mono">{annotation.type.toUpperCase()}</span>
                    <p className="text-sm text-neutral-300 mt-1 font-mono">"{annotation.text}"</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    {new Date(annotation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Annotation context menu */}
      {contextMenu && (
        <AnnotationMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onAnnotate={createAnnotation}
        />
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <TextAnnotationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Select any text in the document to see the annotation menu appear. Choose highlight, underline, or circle to create annotations.'
      }
    }
  }
}

// Advanced demo with multiple annotation types
function AdvancedAnnotationDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    contextMenu,
    closeContextMenu,
    createAnnotation,
    clearAnnotations,
    annotations
  } = useTextAnnotation({ containerRef })

  // Group annotations by type
  const annotationsByType = annotations.reduce((acc, ann) => {
    if (!acc[ann.type]) acc[ann.type] = []
    acc[ann.type].push(ann)
    return acc
  }, {} as Record<string, typeof annotations>)

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-black rounded-lg border border-neutral-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#adf0dd] font-mono">OPERATION STARDUST - FIELD REPORT</h2>
            <button
              onClick={clearAnnotations}
              className="px-3 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-sm text-xs font-mono transition-colors"
           >
              CLEAR ALL
            </button>
          </div>

          <div 
            ref={containerRef}
            className="p-6 bg-neutral-900/50 rounded-sm border border-neutral-800 space-y-4"
         >
            <div>
              <h3 className="text-[#adf0dd] font-mono text-sm font-bold mb-2">INCIDENT TIMELINE</h3>
              <p className="text-neutral-300 text-sm font-mono leading-relaxed">
                2077-03-14 02:47 UTC - Initial contact established with unidentified aerial phenomenon. 
                Object exhibited non-ballistic movement patterns, achieving velocities exceeding Mach 5 
                without sonic signature.
              </p>
            </div>

            <div>
              <h3 className="text-[#adf0dd] font-mono text-sm font-bold mb-2">SENSOR DATA</h3>
              <p className="text-neutral-300 text-sm font-mono leading-relaxed">
                Electromagnetic anomalies detected across multiple spectrums. Gravitational field 
                distortions measured at 0.3% deviation from baseline. Temporal dilation effects 
                confirmed by atomic clock synchronization failure.
              </p>
            </div>

            <div>
              <h3 className="text-[#adf0dd] font-mono text-sm font-bold mb-2">WITNESS STATEMENTS</h3>
              <p className="text-neutral-300 text-sm font-mono leading-relaxed">
                Multiple personnel reported experiencing missing time phenomena. Subject testimonies 
                remain consistent regarding triangular craft configuration with pulsating amber lights 
                at each vertex.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-neutral-900/50 rounded-sm border border-neutral-800">
            <h3 className="text-sm font-bold text-[#adf0dd] font-mono mb-3">ANNOTATION STATISTICS</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Annotations:</span>
                <span className="text-[#adf0dd]">{annotations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Highlights:</span>
                <span className="text-yellow-400">{annotationsByType.highlight?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Underlines:</span>
                <span className="text-blue-400">{annotationsByType.underline?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Circles:</span>
                <span className="text-red-400">{annotationsByType.circle?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-900/50 rounded-sm border border-neutral-800">
            <h3 className="text-sm font-bold text-[#adf0dd] font-mono mb-3">RECENT ANNOTATIONS</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {annotations.slice(-5).reverse().map((annotation) => (
                <div key={annotation.id} className="text-xs font-mono">
                  <div className="text-neutral-400">
                    {new Date(annotation.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-neutral-300 truncate">
                    <span className={`
                      ${annotation.type === 'highlight' ? 'text-yellow-400' : ''}
                      ${annotation.type === 'underline' ? 'text-blue-400' : ''}
                      ${annotation.type === 'circle' ? 'text-red-400' : ''}
                    `}>
                      [{annotation.type}]
                    </span> {annotation.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <AnnotationMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onAnnotate={createAnnotation}
        />
      )}
    </div>
  )
}

export const AdvancedUsage: Story = {
  render: () => <AdvancedAnnotationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Advanced example showing annotation statistics and recent annotations panel. Demonstrates how the hook can be integrated into a more complex UI.'
      }
    }
  }
}

// Minimal example for integration
function MinimalExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { contextMenu, closeContextMenu, createAnnotation } = useTextAnnotation({ containerRef })

  return (
    <>
      <div 
        ref={containerRef}
        className="p-4 bg-neutral-900 rounded border border-neutral-700 max-w-md"
     >
        <p className="text-neutral-300 text-sm">
          Select this text to annotate it. The hook handles all the selection logic and menu positioning.
        </p>
      </div>

      {contextMenu && (
        <AnnotationMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onAnnotate={createAnnotation}
        />
      )}
    </>
  )
}

export const MinimalIntegration: Story = {
  render: () => <MinimalExample />,
  parameters: {
    docs: {
      description: {
        story: 'Minimal example showing the basic integration pattern for the useTextAnnotation hook.'
      }
    }
  }
}