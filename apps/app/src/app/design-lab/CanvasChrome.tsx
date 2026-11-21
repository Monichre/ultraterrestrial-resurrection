'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'

import {EDGES, INTELLIGENCE, NODES, TOUR} from './fixtures'

type TourFixture = typeof TOUR

const NAV = ['graph', 'time', 'filter', 'bookmark', 'folder', 'doc'] as const

export type CanvasChromeProps = {
  children?: ReactNode
  tourActiveId?: string
  dimInactive?: boolean
  showTourPath?: boolean
  /** Always-visible rail vs peek + hover (apossible chrome-minimal). */
  navMode?: 'always' | 'auto-hide'
  /** Draw edge labels mid-path (affinity / evidentiary links). */
  showEdgeLabels?: boolean
  /** Bake tour intelligence into the active record card. */
  bakeIntelIntoRecord?: boolean
  className?: string
}

/** Shared mini research-canvas floor for fair variant comparison. */
export function CanvasChrome({
  children,
  tourActiveId = 'roswell',
  dimInactive = true,
  showTourPath = true,
  navMode = 'always',
  showEdgeLabels = false,
  bakeIntelIntoRecord = false,
  className = '',
}: CanvasChromeProps) {
  const [isNavOpen, setIsNavOpen] = useState(navMode === 'always')
  const [isNavPinned, setIsNavPinned] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (navMode === 'always') {
      setIsNavOpen(true)
      return
    }
    if (!isNavPinned) setIsNavOpen(false)
  }, [navMode, isNavPinned])

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const openNav = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setIsNavOpen(true)
  }

  const scheduleCloseNav = () => {
    if (navMode !== 'auto-hide' || isNavPinned) return
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setIsNavOpen(false), 420)
  }

  return (
    <div
      className={`relative h-[420px] w-full overflow-hidden rounded-lg border border-[var(--ut-line)] ${className}`}
      style={{
        backgroundColor: 'var(--ut-void)',
        backgroundImage:
          'radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, oklch(0.1 0.005 85 / 0.55) 100%), radial-gradient(circle at 25% 25%, oklch(0.3 0.012 85 / 0.5) 0.5px, transparent 1px), radial-gradient(circle at 75% 75%, oklch(0.24 0.01 85 / 0.5) 0.5px, transparent 1px)',
        backgroundSize: '100% 100%, 10px 10px, 10px 10px',
      }}>
      {navMode === 'auto-hide' && (
        <div
          data-testid='nav-hotzone'
          className='absolute bottom-0 left-0 top-0 z-30 w-3'
          onMouseEnter={openNav}
          onFocus={openNav}
          aria-hidden
        />
      )}

      <nav
        aria-label='Canvas views'
        data-testid='canvas-side-nav'
        data-open={isNavOpen ? 'true' : 'false'}
        onMouseEnter={openNav}
        onMouseLeave={scheduleCloseNav}
        className={`absolute left-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 rounded-full border border-[var(--ut-line)] bg-[var(--ut-surface)] p-1.5 backdrop-blur-md transition-all duration-200 ease-out ${
          isNavOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none -translate-x-3 opacity-0'
        }`}>
        {NAV.map((item, i) => (
          <span
            key={item}
            className={`flex size-7 items-center justify-center rounded-full text-[9px] ${
              i === 0 ? 'bg-[var(--ut-paper)] text-[var(--ut-void)]' : 'text-[var(--ut-ink-faint)]'
            }`}
            aria-hidden>
            {item[0]!.toUpperCase()}
          </span>
        ))}
        {navMode === 'auto-hide' && (
          <button
            type='button'
            data-testid='nav-pin'
            aria-pressed={isNavPinned}
            aria-label={isNavPinned ? 'Unpin side menu' : 'Pin side menu'}
            onClick={() => setIsNavPinned((v) => !v)}
            className={`ut-mono mt-0.5 rounded-full px-1 py-0.5 text-[7px] ${
              isNavPinned
                ? 'bg-emerald-400/20 text-emerald-300'
                : 'text-[var(--ut-ink-faint)] hover:text-[var(--ut-paper)]'
            }`}>
            {isNavPinned ? 'PIN' : '·'}
          </button>
        )}
      </nav>

      {navMode === 'auto-hide' && !isNavOpen && (
        <button
          type='button'
          data-testid='nav-peek'
          aria-label='Show side menu'
          onMouseEnter={openNav}
          onFocus={openNav}
          onClick={openNav}
          className='absolute left-0 top-1/2 z-30 flex h-16 w-2.5 -translate-y-1/2 items-center justify-center rounded-r border border-l-0 border-[var(--ut-line)] bg-[var(--ut-surface)]/90'>
          <span className='ut-mono rotate-90 text-[7px] text-[var(--ut-ink-faint)]'>NAV</span>
        </button>
      )}

      <svg className='pointer-events-none absolute inset-0 z-0 h-full w-full' aria-hidden>
        {EDGES.map((e) => {
          const a = NODES.find((n) => n.id === e.from)
          const b = NODES.find((n) => n.id === e.to)
          if (!a || !b) return null
          const isTour = e.kind === 'tour'
          if (isTour && !showTourPath) return null
          const stroke =
            e.kind === 'tour'
              ? 'oklch(0.72 0.12 55 / 0.85)'
              : e.kind === 'dashed'
                ? 'oklch(0.62 0.18 300 / 0.7)'
                : 'oklch(0.55 0.14 300 / 0.75)'
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke={stroke}
                strokeWidth={isTour ? 2 : 1.25}
                strokeDasharray={e.kind === 'solid' ? undefined : '5 4'}
              />
              {showEdgeLabels && (
                <foreignObject
                  x={`${mx - 9}%`}
                  y={`${my - 3}%`}
                  width='18%'
                  height='28'
                  className='overflow-visible'>
                  <div
                    data-testid={`edge-label-${e.from}-${e.to}`}
                    className={`mx-auto w-max max-w-[140px] truncate rounded border px-1.5 py-0.5 text-center backdrop-blur-sm ${
                      e.kind === 'dashed'
                        ? 'border-dashed border-violet-400/45 bg-[var(--ut-void)]/85'
                        : e.kind === 'tour'
                          ? 'border-amber-400/40 bg-[var(--ut-void)]/85'
                          : 'border-[var(--ut-line)] bg-[var(--ut-surface)]/90'
                    }`}>
                    <span
                      className={`ut-mono text-[7px] leading-none ${
                        e.kind === 'dashed'
                          ? 'text-violet-300/90'
                          : e.kind === 'tour'
                            ? 'text-amber-300/90'
                            : 'text-[var(--ut-ink-dim)]'
                      }`}>
                      {e.label}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
      </svg>

      {NODES.map((n) => {
        const isActive = n.id === tourActiveId
        const dim = dimInactive && !isActive
        const showBakedIntel = bakeIntelIntoRecord && isActive
        return (
          <div
            key={n.id}
            data-testid={`node-${n.id}`}
            className={`absolute z-10 w-[176px] -translate-x-1/2 -translate-y-1/2 rounded-md border px-2.5 py-2 backdrop-blur-md transition-opacity ${
              isActive
                ? 'border-emerald-400/50 bg-[var(--ut-surface-2)] shadow-[0_0_0_1px_oklch(0.72_0.14_160/0.25)]'
                : 'border-[var(--ut-line)] bg-[var(--ut-surface)]'
            } ${dim ? 'opacity-40' : 'opacity-100'}`}
            style={{left: `${n.x}%`, top: `${n.y}%`}}>
            <p className='text-[11px] font-medium leading-snug text-[var(--ut-paper)]'>{n.title}</p>
            <p className='ut-mono mt-1 text-[7.5px] text-[var(--ut-ink-faint)]'>{n.meta}</p>
            {showBakedIntel && (
              <div
                data-testid='baked-record-intel'
                className='mt-2 space-y-1.5 border-t border-dashed border-violet-400/35 pt-2'>
                <div className='flex flex-wrap gap-1'>
                  {INTELLIGENCE.figures.map((f) => (
                    <Stamp key={f.name} tone='violet'>
                      {f.state}
                    </Stamp>
                  ))}
                </div>
                <p className='text-[9px] leading-snug text-[var(--ut-ink-dim)]'>
                  {INTELLIGENCE.hypothesis}
                </p>
                <p className='ut-mono text-[7px] text-violet-300/80'>{INTELLIGENCE.affinity}</p>
              </div>
            )}
          </div>
        )
      })}

      {children}
    </div>
  )
}

export function Stamp({
  children,
  tone = 'emerald',
}: {
  children: ReactNode
  tone?: 'emerald' | 'violet' | 'amber'
}) {
  const color =
    tone === 'violet'
      ? 'border-violet-400/35 text-violet-300/90'
      : tone === 'amber'
        ? 'border-amber-400/35 text-amber-300/90'
        : 'border-emerald-400/35 text-emerald-300/90'
  return (
    <span className={`ut-mono inline-flex rounded border px-1.5 py-0.5 text-[8px] ${color}`}>
      {children}
    </span>
  )
}

export function TourMeta({tour}: {tour: TourFixture}) {
  return (
    <span className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>
      {tour.step}/{tour.total}
    </span>
  )
}
