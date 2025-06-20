import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AnnotationMenu } from './annotation-menu'

const meta: Meta<typeof AnnotationMenu> = {
  title: 'TipTap/Components/AnnotationMenu',
  component: AnnotationMenu,
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
        component: 'Context menu component for text annotations. Appears when text is selected and provides options for highlighting, underlining, or circling selected text.'
      }
    }
  },
  tags: ['autodocs'],
  args: {
    x: 400,
    y: 200,
    onClose: () => console.log('Menu closed'),
    onAnnotate: (type: string) => console.log('Annotate:', type)
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positioned: Story = {
  args: {
    x: 300,
    y: 150,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu positioned at specific coordinates. In real usage, coordinates are calculated from text selection bounds.'
      }
    }
  }
}

// Interactive demo showing the menu in different positions
function InteractiveDemo() {
  const [menuPosition, setMenuPosition] = useState({ x: 400, y: 200 })
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)

  const handleClick = (e: React.MouseEvent) => {
    setMenuPosition({ x: e.clientX, y: e.clientY })
    setSelectedAnnotation(null)
  }

  const handleAnnotate = (type: string) => {
    setSelectedAnnotation(type)
    setTimeout(() => setSelectedAnnotation(null), 2000)
  }

  return (
    <div className="relative w-full h-96 bg-black border border-neutral-800 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-[#adf0dd] font-mono text-lg mb-4">INTERACTIVE ANNOTATION MENU DEMO</h3>
        <p className="text-neutral-300 text-sm font-mono mb-6">
          Click anywhere to position the annotation menu at that location.
        </p>
        
        <div 
          className="h-48 bg-neutral-900/50 border border-neutral-800 rounded-sm p-4 cursor-pointer"
          onClick={handleClick}
        >
          <p className="text-neutral-300 text-sm font-mono leading-relaxed">
            <strong className="text-[#adf0dd]">FIELD REPORT 7A-X119:</strong> Anomalous readings detected at coordinates 
            37.2431°N, 115.7930°W during Operation Stardust. Visual confirmation of unidentified craft 
            exhibiting propulsion characteristics inconsistent with known aerospace technology.
          </p>
          
          <p className="text-neutral-300 text-sm font-mono leading-relaxed mt-4">
            Click anywhere in this area to see the annotation menu appear at that position.
          </p>
          
          {selectedAnnotation && (
            <div className="mt-4 p-2 bg-[#adf0dd]/10 border border-[#adf0dd]/30 rounded">
              <span className="text-[#adf0dd] text-xs font-mono">
                ANNOTATION CREATED: {selectedAnnotation.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      <AnnotationMenu
        x={menuPosition.x}
        y={menuPosition.y}
        onClose={() => console.log('Menu closed')}
        onAnnotate={handleAnnotate}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the menu positioning and annotation creation. Click anywhere in the demo area to reposition the menu.'
      }
    }
  }
}

// Multiple menus demo
function MultipleMenusDemo() {
  const positions = [
    { x: 200, y: 150, label: 'Menu 1' },
    { x: 500, y: 250, label: 'Menu 2' },
    { x: 350, y: 350, label: 'Menu 3' }
  ]

  return (
    <div className="relative w-full h-96 bg-black border border-neutral-800 rounded-lg p-8">
      <div className="text-center mb-6">
        <h3 className="text-[#adf0dd] font-mono text-lg mb-2">MULTIPLE ANNOTATION MENUS</h3>
        <p className="text-neutral-300 text-sm font-mono">
          Demonstration of multiple annotation menus positioned simultaneously.
        </p>
      </div>

      {positions.map((pos, index) => (
        <div key={index}>
          {/* Visual indicator for menu position */}
          <div 
            className="absolute w-2 h-2 bg-[#adf0dd] rounded-full"
            style={{ left: pos.x - 4, top: pos.y - 4 }}
          />
          <div 
            className="absolute text-xs text-[#adf0dd] font-mono"
            style={{ left: pos.x + 10, top: pos.y - 10 }}
          >
            {pos.label}
          </div>
          
          <AnnotationMenu
            x={pos.x}
            y={pos.y}
            onClose={() => console.log(`${pos.label} closed`)}
            onAnnotate={(type) => console.log(`${pos.label} annotate:`, type)}
          />
        </div>
      ))}
    </div>
  )
}

export const MultipleMenus: Story = {
  render: () => <MultipleMenusDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example showing multiple annotation menus positioned at different locations. This could occur in collaborative editing scenarios.'
      }
    }
  }
}

// Styled variants
export const CustomStyling: Story = {
  render: () => (
    <div className="relative h-64 flex items-center justify-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg">
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 1000,
        }}
        className="bg-gradient-to-b from-neutral-900 to-black border-2 border-[#adf0dd]/50 rounded-lg shadow-xl shadow-[#adf0dd]/20 p-3 flex flex-col gap-2"
      >
        <button className="text-sm px-4 py-2 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-300 rounded-sm transition-colors font-mono">
          ✨ Highlight
        </button>
        <button className="text-sm px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-sm transition-colors font-mono">
          📝 Underline
        </button>
        <button className="text-sm px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-sm transition-colors font-mono">
          ⭕ Circle
        </button>
        <button className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-sm transition-colors font-mono">
          ❌ Cancel
        </button>
      </div>
      
      <div className="text-center">
        <h3 className="text-[#adf0dd] font-mono text-lg mb-2">CUSTOM STYLED MENU</h3>
        <p className="text-neutral-400 text-sm font-mono">
          Example with enhanced styling and visual effects
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom styled variant showing how the annotation menu can be enhanced with additional visual effects, gradients, and icons.'
      }
    }
  }
}