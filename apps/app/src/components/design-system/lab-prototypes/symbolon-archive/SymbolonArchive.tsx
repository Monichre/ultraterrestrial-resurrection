'use client'

import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { ARCHIVE_ENTRIES, REFERENCE_ITEMS, SYMBOLON_NAV_ITEMS } from './fixtures'
import type { SymbolonNav } from './types'
import { useSymbolonFonts } from '../use-symbolon-fonts'
import './symbolon-archive.css'

export interface SymbolonArchiveProps {
  initialNav?: SymbolonNav
  className?: string
  style?: CSSProperties
  brandLabel?: string
  year?: string
  onNavChange?: (nav: SymbolonNav) => void
  onTransmit?: (payload: { name: string; org: string; message: string }) => void
}

function TriadDiagram() {
  return (
    <div className='sa-diagram' aria-hidden>
      <svg viewBox='0 0 600 360' fill='none'>
        <circle cx='300' cy='120' r='48' stroke='#6B6C70' strokeWidth='1' />
        <circle cx='180' cy='260' r='48' stroke='#6B6C70' strokeWidth='1' />
        <circle cx='420' cy='260' r='48' stroke='#6B6C70' strokeWidth='1' />
        <path d='M300 168 L210 230 M300 168 L390 230 M218 260 L382 260' stroke='#222225' />
        <text x='300' y='125' textAnchor='middle' fill='#FFF7E0' fontSize='11' fontFamily='JetBrains Mono'>
          Object
        </text>
        <text x='180' y='265' textAnchor='middle' fill='#FFF7E0' fontSize='11' fontFamily='JetBrains Mono'>
          Representamen
        </text>
        <text x='420' y='265' textAnchor='middle' fill='#FFF7E0' fontSize='11' fontFamily='JetBrains Mono'>
          Interpretant
        </text>
      </svg>
    </div>
  )
}

function Spine({ brandLabel, year }: { brandLabel: string; year: string }) {
  return (
    <aside className='sa-spine'>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div className='sa-mark'>S</div>
        <div className='sa-spine-year'>{year}</div>
        <div className='sa-spine-divider' />
      </div>
      <div className='sa-spine-brand'>{brandLabel}</div>
    </aside>
  )
}

function TopMeta({
  activeNav,
  onNav,
}: {
  activeNav: SymbolonNav
  onNav: (nav: SymbolonNav) => void
}) {
  return (
    <div className='sa-top-meta'>
      <nav className='sa-nav'>
        {SYMBOLON_NAV_ITEMS.map((item) => (
          <button
            key={item}
            type='button'
            data-active={activeNav === item}
            onClick={() => onNav(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <span style={{ fontSize: 10, color: '#6B6C70' }}>44°58′N / 93°15′W</span>
    </div>
  )
}

function DataPanel() {
  return (
    <aside className='sa-panel'>
      <div>
        <div className='sa-data-label'>Reference Index</div>
        {REFERENCE_ITEMS.map((item) => (
          <div key={item.code}>
            <div className='sa-ref-code'>{item.code}</div>
            <div className='sa-ref-desc'>{item.desc}</div>
          </div>
        ))}
      </div>
      <div>
        <div className='sa-data-label'>System Status</div>
        <div className='sa-ref-desc'>
          OBSCURATION: ACTIVE
          <br />
          FRAMEWORK: PEIRCEAN TRIAD
          <br />
          CHANNEL: SECURE
        </div>
      </div>
    </aside>
  )
}

export function SymbolonArchive({
  initialNav = 'Methodology',
  className,
  style,
  brandLabel = 'Symbolon Identity Arch.',
  year = '2024',
  onNavChange,
  onTransmit,
}: SymbolonArchiveProps) {
  useSymbolonFonts()
  const [activeNav, setActiveNav] = useState<SymbolonNav>(initialNav)
  const [formData, setFormData] = useState({ name: '', org: '', message: '' })
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const txCode = useMemo(() => `TX-${Math.floor(Math.random() * 9000 + 1000)}`, [submitted])

  function handleNav(nav: SymbolonNav) {
    setActiveNav(nav)
    onNavChange?.(nav)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: { name?: string; message?: string } = {}
    if (!formData.name.trim()) nextErrors.name = 'Required'
    if (!formData.message.trim()) nextErrors.message = 'Required'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onTransmit?.(formData)
    setSubmitted(true)
  }

  return (
    <div className={['sa-root', className].filter(Boolean).join(' ')} style={style}>
      <div className='sa-gl' />
      <div className='sa-ui'>
        <Spine brandLabel={brandLabel} year={year} />
        <main className='sa-main'>
          <TopMeta activeNav={activeNav} onNav={handleNav} />

          {activeNav === 'Methodology' && (
            <>
              <span className='sa-section-tag'>Volume 01 // Structural Semiotics</span>
              <h1 className='sa-title'>
                The Peircean
                <br />
                Triad Framework
              </h1>
              <p className='sa-body'>
                To design a symbol is to architect a relationship. In the <strong>Symbolon</strong>{' '}
                methodology, we move beyond aesthetic surface treatment to engage with the triadic
                structure of the sign as defined by Charles Sanders Peirce.
              </p>
              <blockquote className='sa-quote'>
                &ldquo;A sign is something which stands to somebody for something in some respect or
                capacity.&rdquo;
              </blockquote>
              <TriadDiagram />
              <h2 className='sa-h2'>The Three Modes</h2>
              <p className='sa-body'>
                <strong>01. The Icon (Firstness)</strong>
                <br />
                The icon signifies by virtue of its own internal qualities. It looks like what it
                represents.
              </p>
              <p className='sa-body'>
                <strong>02. The Index (Secondness)</strong>
                <br />
                The index is a sign of cause and effect — footprint, shadow, implication of presence.
              </p>
              <p className='sa-body'>
                <strong>03. The Symbol (Thirdness)</strong>
                <br />
                The symbol functions by convention alone. Brand equity lives here.
              </p>
            </>
          )}

          {activeNav === 'Idx. Archive' && (
            <>
              <span className='sa-section-tag'>Volume 00 // Index</span>
              <h1 className='sa-title'>
                Archive
                <br />
                Index
              </h1>
              <p className='sa-body'>
                The <strong>Symbolon Archive</strong> is the repository of identity artifacts and
                methodological documents. Each entry is classified by semiotic function.
              </p>
              {ARCHIVE_ENTRIES.map((item) => (
                <div key={item.code} className='sa-archive-row'>
                  <div className='sa-archive-code'>{item.code}</div>
                  <div>
                    <div className='sa-archive-title'>{item.title}</div>
                    <div className='sa-archive-desc'>{item.desc}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeNav === 'Transmit' && (
            <>
              <span className='sa-section-tag'>Transmission Protocol</span>
              <h1 className='sa-title'>
                Initiate
                <br />
                Contact
              </h1>
              <p className='sa-body'>
                To engage the <strong>Symbolon Collective</strong>, transmit your inquiry through
                this channel. Responses arrive within one lunar cycle.
              </p>
              {submitted ? (
                <div className='sa-success'>
                  <div className='sa-archive-title'>Transmission Received</div>
                  <div className='sa-archive-desc'>
                    Logged under reference <span style={{ color: '#C9A881' }}>{txCode}</span>. Await
                    response.
                  </div>
                </div>
              ) : (
                <form className='sa-form' onSubmit={handleSubmit}>
                  <label htmlFor='sa-name'>Designation *</label>
                  <input
                    id='sa-name'
                    value={formData.name}
                    placeholder='Your name or alias'
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setErrors({ ...errors, name: undefined })
                    }}
                    style={errors.name ? { borderColor: '#C9A881' } : undefined}
                  />
                  <label htmlFor='sa-org'>Organization</label>
                  <input
                    id='sa-org'
                    value={formData.org}
                    placeholder='Entity or collective'
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  />
                  <label htmlFor='sa-message'>Transmission *</label>
                  <textarea
                    id='sa-message'
                    value={formData.message}
                    placeholder='Describe your identity architecture needs...'
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      setErrors({ ...errors, message: undefined })
                    }}
                    style={errors.message ? { borderColor: '#C9A881' } : undefined}
                  />
                  <button type='submit'>Transmit</button>
                </form>
              )}
            </>
          )}
        </main>
        <DataPanel />
      </div>
    </div>
  )
}
