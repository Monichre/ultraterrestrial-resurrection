'use client'

import {useState, useCallback} from 'react'
import {Button} from '@/components/ui/button'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {Bookmark, Play, Plus, Star, Map, Users, Calendar, FileText} from 'lucide-react'

interface ExplorationPathway {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'military' | 'sightings' | 'disclosure' | 'media'
  tags: string[]
}

const EXPLORATION_PATHWAYS: ExplorationPathway[] = [
  {
    id: 'roswell-to-aaro',
    name: 'Roswell to AARO',
    description: 'Military lineage from Roswell to modern disclosure',
    icon: <Map className='w-4 h-4' />,
    category: 'military',
    tags: ['military', 'disclosure', 'timeline'],
  },
  {
    id: 'waves-of-sightings',
    name: 'Waves of Sightings',
    description: 'Phoenix Lights → Tic Tac → Modern encounters',
    icon: <Users className='w-4 h-4' />,
    category: 'sightings',
    tags: ['sightings', 'waves', 'encounters'],
  },
  {
    id: 'disclosure-media',
    name: 'Disclosure & Media',
    description: 'NYT 2017 → Whistleblowers → Congressional hearings',
    icon: <FileText className='w-4 h-4' />,
    category: 'media',
    tags: ['media', 'whistleblowers', 'congress'],
  },
  {
    id: 'nuclear-connection',
    name: 'Nuclear Connection',
    description: 'UFO activity near nuclear facilities',
    icon: <Star className='w-4 h-4' />,
    category: 'sightings',
    tags: ['nuclear', 'facilities', 'security'],
  },
  {
    id: 'abduction-phenomenon',
    name: 'Abduction Phenomenon',
    description: 'Key abduction cases and testimonies',
    icon: <Users className='w-4 h-4' />,
    category: 'sightings',
    tags: ['abductions', 'testimonies', 'phenomenon'],
  },
  {
    id: 'crash-retrievals',
    name: 'Crash Retrievals',
    description: 'Documented crash and retrieval cases',
    icon: <Map className='w-4 h-4' />,
    category: 'military',
    tags: ['crashes', 'retrievals', 'evidence'],
  },
]

export function SavedViewsPanel() {
  const [savedViews, setSavedViews] = useState<string[]>([])
  const {organizeLayout, fitView} = useMindMap()

  const handleLoadPathway = useCallback(
    (pathway: ExplorationPathway) => {
      // This would typically load a saved view or pathway
      console.log(`Loading pathway: ${pathway.name}`)

      // Apply pathway-specific layout
      switch (pathway.category) {
        case 'military':
          organizeLayout({
            direction: 'horizontal',
            centerChildren: true,
            parentChildSpacing: 200,
            siblingSpacing: 120,
            preserveExistingLayout: false,
          })
          break
        case 'sightings':
          organizeLayout({
            direction: 'vertical',
            centerChildren: true,
            parentChildSpacing: 150,
            siblingSpacing: 100,
            preserveExistingLayout: false,
          })
          break
        case 'disclosure':
          organizeLayout({
            direction: 'horizontal',
            centerChildren: true,
            parentChildSpacing: 180,
            siblingSpacing: 90,
            preserveExistingLayout: false,
          })
          break
        case 'media':
          organizeLayout({
            direction: 'vertical',
            centerChildren: true,
            parentChildSpacing: 160,
            siblingSpacing: 80,
            preserveExistingLayout: false,
          })
          break
      }

      // Fit view to show the pathway
      setTimeout(() => fitView(), 100)
    },
    [organizeLayout, fitView]
  )

  const handleSaveCurrentView = useCallback(() => {
    const viewName = prompt('Enter a name for this view:')
    if (viewName) {
      setSavedViews((prev) => [...prev, viewName])
      // In a real implementation, you'd save the current state
      console.log(`Saving view: ${viewName}`)
    }
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'military':
        return 'text-red-400'
      case 'sightings':
        return 'text-blue-400'
      case 'disclosure':
        return 'text-green-400'
      case 'media':
        return 'text-yellow-400'
      default:
        return 'text-neutral-400'
    }
  }

  return (
    <div className='w-[425px] h-auto flex flex-col bg-neutral-800/90 text-white shadow-lg backdrop-blur-md border border-white/5 rounded-2xl'>
      <header className='border-b border-b-[#292f35] p-3'>
        <div className='text-white text-sm font-medium mb-2 flex items-center gap-2'>
          <Bookmark className='w-4 h-4' />
          Exploration Pathways
        </div>

        {/* Save Current View */}
        <Button
          size='sm'
          variant='outline'
          onClick={handleSaveCurrentView}
          className='w-full text-xs h-8'>
          <Plus className='w-3 h-3 mr-1' />
          Save Current View
        </Button>
      </header>

      {/* Exploration Pathways */}
      <div className='p-3 space-y-2 max-h-64 overflow-y-auto'>
        <div className='text-xs text-neutral-400 mb-2'>Curated Pathways</div>
        {EXPLORATION_PATHWAYS.map((pathway) => (
          <button
            key={pathway.id}
            onClick={() => handleLoadPathway(pathway)}
            className='w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-neutral-700/30 rounded-lg transition-colors'>
            <div className={getCategoryColor(pathway.category)}>{pathway.icon}</div>
            <div className='flex flex-col flex-1'>
              <span className='font-medium'>{pathway.name}</span>
              <span className='text-xs text-neutral-400'>{pathway.description}</span>
              <div className='flex gap-1 mt-1'>
                {pathway.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className='text-xs px-1 py-0.5 bg-white/5 rounded text-neutral-300'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Play className='w-3 h-3 text-neutral-500' />
          </button>
        ))}
      </div>

      {/* Saved Views */}
      {savedViews.length > 0 && (
        <div className='border-t border-t-[#292f35] p-3'>
          <div className='text-xs text-neutral-400 mb-2'>Your Saved Views</div>
          <div className='space-y-1'>
            {savedViews.map((view, index) => (
              <button
                key={index}
                className='w-full flex items-center gap-2 px-2 py-1 text-left text-xs text-neutral-300 hover:bg-neutral-700/30 rounded-lg transition-colors'>
                <Star className='w-3 h-3 text-yellow-400' />
                <span>{view}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <footer className='border-t border-t-[#292f35] p-3'>
        <div className='text-xs text-neutral-400 mb-2'>Quick Actions</div>
        <div className='grid grid-cols-2 gap-1'>
          <Button size='sm' variant='outline' onClick={() => fitView()} className='text-xs h-7'>
            Fit View
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() =>
              organizeLayout({
                direction: 'horizontal',
                centerChildren: true,
                parentChildSpacing: 120,
                siblingSpacing: 80,
                preserveExistingLayout: true,
              })
            }
            className='text-xs h-7'>
            Auto Layout
          </Button>
        </div>
      </footer>
    </div>
  )
}
