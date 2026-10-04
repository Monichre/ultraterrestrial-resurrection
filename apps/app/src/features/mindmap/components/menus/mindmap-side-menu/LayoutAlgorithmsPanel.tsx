'use client'

import {useCallback} from 'react'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {Calendar, Layers, MapPin, Network, Clock, Target, Globe, GitBranch} from 'lucide-react'

interface LayoutAlgorithm {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  type: 'chronological' | 'thematic' | 'geographic' | 'hierarchical'
}

const LAYOUT_ALGORITHMS: LayoutAlgorithm[] = [
  {
    id: 'chronological',
    name: 'Chronological',
    description: 'Disclosure timeline layout',
    icon: <Calendar className='w-4 h-4' />,
    type: 'chronological',
  },
  {
    id: 'thematic',
    name: 'Thematic',
    description: 'Crash retrievals, abductions, leaks',
    icon: <Layers className='w-4 h-4' />,
    type: 'thematic',
  },
  {
    id: 'geographic',
    name: 'Geographic',
    description: 'World map overlay layout',
    icon: <Globe className='w-4 h-4' />,
    type: 'geographic',
  },
  {
    id: 'hierarchical',
    name: 'Hierarchical',
    description: 'Influence chains (Pentagon → AATIP → Elizondo)',
    icon: <GitBranch className='w-4 h-4' />,
    type: 'hierarchical',
  },
]

export function LayoutAlgorithmsPanel() {
  const {organizeLayout} = useMindMap()

  const handleLayoutChange = useCallback(
    (algorithm: LayoutAlgorithm) => {
      let layoutOptions = {
        direction: 'horizontal' as 'horizontal' | 'vertical',
        centerChildren: true,
        parentChildSpacing: 120,
        siblingSpacing: 80,
        preserveExistingLayout: false,
      }

      switch (algorithm.type) {
        case 'chronological':
          layoutOptions = {
            ...layoutOptions,
            direction: 'horizontal',
            parentChildSpacing: 150,
            siblingSpacing: 100,
          }
          break
        case 'thematic':
          layoutOptions = {
            ...layoutOptions,
            direction: 'vertical',
            parentChildSpacing: 200,
            siblingSpacing: 120,
          }
          break
        case 'geographic':
          layoutOptions = {
            ...layoutOptions,
            direction: 'horizontal',
            parentChildSpacing: 300,
            siblingSpacing: 150,
          }
          break
        case 'hierarchical':
          layoutOptions = {
            ...layoutOptions,
            direction: 'vertical',
            parentChildSpacing: 180,
            siblingSpacing: 100,
          }
          break
      }

      organizeLayout(layoutOptions)
    },
    [organizeLayout]
  )

  return (
    <div className='bg-neutral-800 rounded-lg p-4 shadow-lg border border-neutral-700 min-w-[240px]'>
      <div className='text-white text-sm font-medium mb-4 flex items-center gap-2'>
        <Network className='w-4 h-4' />
        Layout Algorithms
      </div>

      <div className='space-y-2'>
        {LAYOUT_ALGORITHMS.map((algorithm) => (
          <button
            key={algorithm.id}
            onClick={() => handleLayoutChange(algorithm)}
            className='w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 rounded-md transition-colors'>
            <div className='text-neutral-400'>{algorithm.icon}</div>
            <div className='flex flex-col'>
              <span className='font-medium'>{algorithm.name}</span>
              <span className='text-xs text-neutral-400'>{algorithm.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Layout Presets */}
      <div className='mt-4 pt-4 border-t border-neutral-700'>
        <div className='text-xs text-neutral-400 mb-2'>Quick Presets</div>
        <div className='grid grid-cols-2 gap-1'>
          <button
            onClick={() =>
              organizeLayout({
                direction: 'horizontal',
                centerChildren: true,
                parentChildSpacing: 100,
                siblingSpacing: 60,
                preserveExistingLayout: true,
              })
            }
            className='px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded text-white transition-colors'>
            Compact
          </button>
          <button
            onClick={() =>
              organizeLayout({
                direction: 'horizontal',
                centerChildren: true,
                parentChildSpacing: 200,
                siblingSpacing: 120,
                preserveExistingLayout: true,
              })
            }
            className='px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded text-white transition-colors'>
            Spacious
          </button>
        </div>
      </div>
    </div>
  )
}
