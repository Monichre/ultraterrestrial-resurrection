'use client'

import Link from 'next/link'
import {useRef, useState, type CSSProperties} from 'react'
import {SAMPLE_MEMORIES} from './fixtures'
import {MemoryRow} from './MemoryRow'
import {ORYZAE_COLORS, ORYZAE_NAV_ITEMS, type MemoryNode, type OryzaeNavItem} from './types'
import {useOryzaeFonts} from './use-oryzae-fonts'

export interface OryzaeTimelineProps {
  memories?: MemoryNode[]
  initialNav?: OryzaeNavItem
  indexHref?: string
  showIndexLink?: boolean
  title?: string
  className?: string
  style?: CSSProperties
  onNavChange?: (nav: OryzaeNavItem) => void
}

export function OryzaeTimeline({
  memories = SAMPLE_MEMORIES,
  initialNav = '今週',
  indexHref = '/',
  showIndexLink = true,
  title = 'Oryzae',
  className,
  style,
  onNavChange,
}: OryzaeTimelineProps) {
  useOryzaeFonts()
  const [activeNav, setActiveNav] = useState<OryzaeNavItem>(initialNav)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleNav(item: OryzaeNavItem) {
    setActiveNav(item)
    onNavChange?.(item)
  }

  function handleScrollTop() {
    scrollRef.current?.scrollTo({top: 0, behavior: 'smooth'})
  }

  const memoryCount = String(memories.length).padStart(2, '0')

  return (
    <div
      className={className}
      style={{
        fontFamily: "'Noto Serif JP', serif",
        backgroundColor: ORYZAE_COLORS.void,
        color: ORYZAE_COLORS.paper,
        userSelect: 'none',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        ...style,
      }}>
      {showIndexLink && (
        <Link
          href={indexHref}
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            color: ORYZAE_COLORS.muted,
            textDecoration: 'none',
            letterSpacing: '0.2em',
            zIndex: 200,
            textTransform: 'uppercase',
          }}>
          Index →
        </Link>
      )}

      <aside
        style={{
          width: 48,
          height: '100%',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          backgroundColor: ORYZAE_COLORS.void,
          zIndex: 30,
        }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 10,
            color: ORYZAE_COLORS.faint,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48}}>
            {['REF.04', '01', '02'].map((label) => (
              <span
                key={label}
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  letterSpacing: '0.3em',
                  cursor: 'pointer',
                  fontSize: 10,
                }}>
                {label}
              </span>
            ))}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32}}>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: ORYZAE_COLORS.accentSoft,
              }}
            />
            <div style={{width: 4, height: 4, borderRadius: '50%', background: '#4b5563'}} />
          </div>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundSize: '40px 40px',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <header
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            backgroundColor: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 30,
            flexShrink: 0,
          }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <h1
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                textTransform: 'uppercase',
                color: ORYZAE_COLORS.faint,
                letterSpacing: '0.2em',
              }}>
              {title} / <span style={{color: '#e5e7eb'}}>Timeline</span>
            </h1>
          </div>

          <nav style={{display: 'flex', alignItems: 'center', gap: 32}}>
            {ORYZAE_NAV_ITEMS.map((item) => {
              const isActive = activeNav === item
              return (
                <button
                  key={item}
                  type='button'
                  onClick={() => handleNav(item)}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    color: isActive ? '#e5e7eb' : ORYZAE_COLORS.muted,
                    fontWeight: isActive ? 700 : 400,
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive
                      ? `1px solid ${ORYZAE_COLORS.accent}`
                      : '1px solid transparent',
                    paddingBottom: 2,
                    cursor: 'pointer',
                    letterSpacing: '0.15em',
                  }}>
                  {item}
                </button>
              )
            })}
          </nav>

          <div style={{width: 80}} />
        </header>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
            paddingTop: 80,
            paddingBottom: 80,
          }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background:
                'linear-gradient(to bottom, transparent, rgba(74,158,142,0.15) 50px, rgba(74,158,142,0.15) calc(100% - 50px), transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          <div style={{maxWidth: 896, margin: '0 auto', position: 'relative'}}>
            {memories.map((memory, index) => (
              <MemoryRow key={memory.id} memory={memory} index={index} total={memories.length} />
            ))}
          </div>

          <div style={{height: 160}} />
        </div>

        <footer
          style={{
            height: 40,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: ORYZAE_COLORS.void,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 30,
            flexShrink: 0,
          }}>
          <button
            type='button'
            onClick={handleScrollTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 9,
              color: ORYZAE_COLORS.muted,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}>
            <div style={{width: 6, height: 6, borderRadius: '50%', background: '#4b5563'}} />
            Scroll to Top
          </button>

          <div
            style={{
              height: 2,
              width: 64,
              backgroundColor: '#374151',
              borderRadius: 9999,
              overflow: 'hidden',
            }}>
            <div
              style={{
                height: '100%',
                width: '66.67%',
                backgroundColor: ORYZAE_COLORS.accent,
              }}
            />
          </div>

          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              color: ORYZAE_COLORS.muted,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
            {memoryCount} Memories
          </div>
        </footer>
      </main>
    </div>
  )
}

OryzaeTimeline.displayName = 'OryzaeTimeline'
