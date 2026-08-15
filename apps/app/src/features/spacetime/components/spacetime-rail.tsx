'use client'

import Link from 'next/link'
import {BarChart3, Eye, FolderClosed, Globe2, Settings, Sparkles} from 'lucide-react'
import {cn} from '@/lib/utils'

/**
 * Left instrument rail — concept-01 frame 1 / concept-03 frame 1.
 *
 * The boards show six labelled icon slots (OVERVIEW · SIGHTINGS · EVENTS ·
 * CASES · ANALYTICS · SETTINGS). Slots that correspond to a real route link to
 * it; the two that don't render visibly inert rather than as dead links —
 * chrome that looks live but does nothing is worse than chrome that says so.
 */

interface RailItem {
  label: string
  icon: typeof Globe2
  href?: string
  /** True for the surface we are currently on. */
  active?: boolean
}

const RAIL_ITEMS: RailItem[] = [
  {label: 'Canvas', icon: Globe2, href: '/spacetime', active: true},
  {label: 'Sightings', icon: Eye, href: '/sightings'},
  {label: 'Events', icon: Sparkles, href: '/events'},
  {label: 'Cases', icon: FolderClosed, href: '/tours'},
  {label: 'Analytics', icon: BarChart3},
  {label: 'Settings', icon: Settings},
]

export function SpacetimeRail() {
  return (
    <nav
      aria-label='Observatory sections'
      className='flex h-full flex-col items-center gap-1 border-r border-[rgba(125,190,210,0.16)] bg-[rgba(6,10,13,0.9)] py-4'
    >
      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon
        const body = (
          <>
            <Icon
              size={17}
              strokeWidth={1.5}
              className={cn(
                'transition-colors',
                item.active ? 'text-[#4fd8e8]' : 'text-[#6b7c83] group-hover:text-[#b6c6cb]',
              )}
            />
            <span
              className={cn(
                'font-mono text-[7px] tracking-[0.16em] uppercase transition-colors',
                item.active ? 'text-[#4fd8e8]' : 'text-[#4d5c62] group-hover:text-[#8b9ba1]',
              )}
            >
              {item.label}
            </span>
          </>
        )

        const shell = cn(
          'group relative flex w-14 flex-col items-center gap-1.5 rounded-lg px-1 py-2.5',
          item.active
            ? 'bg-[rgba(79,216,232,0.09)] ring-1 ring-[rgba(79,216,232,0.28)]'
            : 'hover:bg-white/[0.04]',
        )

        if (!item.href) {
          return (
            <div
              key={item.label}
              className={cn(shell, 'cursor-not-allowed opacity-35')}
              title={`${item.label} — no surface built yet`}
              aria-disabled
            >
              {body}
            </div>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={shell}
            aria-current={item.active ? 'page' : undefined}
          >
            {/* Active marker on the rail edge, as on the boards. */}
            {item.active ? (
              <span
                aria-hidden
                className='absolute top-2 bottom-2 -left-[1px] w-[2px] rounded-full bg-[#4fd8e8]'
              />
            ) : null}
            {body}
          </Link>
        )
      })}
    </nav>
  )
}
