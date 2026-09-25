'use client'

import {lazy, Suspense} from 'react'
import {useMindMapUiStore} from '@/features/mindmap/store/mindmap-ui-store'

// Lazy load view components
const TimelineView = lazy(() => import('@/features/mindmap/research-canvas/views/timeline/page'))
const SightingsView = lazy(() => import('@/features/mindmap/research-canvas/views/ufo-sightings/page'))
const SearchView = lazy(() => import('@/features/mindmap/research-canvas/views/search-and-discovery-interface/page'))
const DetailView = lazy(() => import('@/features/mindmap/research-canvas/views/content-card-detail-view/page'))

function ViewLoading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-neutral-950">
      <div className="text-neutral-400 text-sm">Loading view...</div>
    </div>
  )
}

interface ViewSwitcherProps {
  canvasContent: React.ReactNode
}

export function ViewSwitcher({canvasContent}: ViewSwitcherProps) {
  const {navigation} = useMindMapUiStore()

  const renderView = () => {
    switch (navigation.activeView) {
      case 'canvas':
        return canvasContent
      case 'timeline':
        return <Suspense fallback={<ViewLoading />}><TimelineView /></Suspense>
      case 'globe':
        return <Suspense fallback={<ViewLoading />}><SightingsView /></Suspense>
      case 'search':
        return <Suspense fallback={<ViewLoading />}><SearchView /></Suspense>
      case 'detail':
        return <Suspense fallback={<ViewLoading />}><DetailView /></Suspense>
      default:
        return canvasContent
    }
  }

  // MenuTrigger is now mounted globally in app/layout.tsx, so we only render the view here.
  return <>{renderView()}</>
}
