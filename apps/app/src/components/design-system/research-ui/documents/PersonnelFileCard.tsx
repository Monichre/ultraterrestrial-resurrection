'use client'

import * as React from 'react'
import {cn} from '@/utils'
import {VintageDocumentCard} from './VintageDocumentCard'
import type {PersonnelFile} from './types'
import {PolaroidBasic} from '@/components/design-system/research-ui/photography/polaroid/Polaroid'
import './vintage-document.css'

interface PersonnelFileCardProps {
  personnel: PersonnelFile
  className?: string
  /** Show clipped polaroid; default off for dense dossier layout */
  showPhoto?: boolean
}

const PersonnelFileCard = React.forwardRef<HTMLDivElement, PersonnelFileCardProps>(
  ({personnel, className, showPhoto = false, ...props}, ref) => {
    const orgLine = [personnel.organization, personnel.rank].filter(Boolean).join(' · ')

    return (
      <VintageDocumentCard
        ref={ref}
        classification={personnel.classification}
        title={personnel.name}
        date={[personnel.date, personnel.rank].filter(Boolean).join(', ')}
        location={personnel.location}
        fileRef={`UT·VD // ${personnel.serviceNumber || personnel.id}`}
        className={cn(className)}
        {...props}>
        <div className={cn('grid gap-5', showPhoto ? 'md:grid-cols-[140px_1fr]' : 'grid-cols-1')}>
          {showPhoto && (
            <div className='origin-top-left scale-[0.72]'>
              <PolaroidBasic
                person={{
                  image: personnel.profilePhoto || {url: '/placeholder.svg'},
                  name: personnel.name,
                  role: personnel.organization || 'PERSONNEL',
                  rank: personnel.rank || 'CLASSIFIED',
                  id: `personnel-${personnel.name.replace(/\s+/g, '-').toLowerCase()}`,
                }}
              />
            </div>
          )}

          <div className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-[1fr_1.1fr]'>
              <div>
                <div className='vd-label'>Assignment</div>
                <p className='mt-1 text-[13px] font-semibold tracking-wide uppercase'>
                  {orgLine || 'MERCURY ASTRONAUT'}
                </p>
                {personnel.serviceNumber && (
                  <p className='vd-mono vd-ink-dim mt-2 text-[11px] tracking-wide'>
                    SVC {personnel.serviceNumber}
                  </p>
                )}
              </div>
              <div>
                <div className='vd-label'>Assessment</div>
                <p className='vd-ink-dim mt-1 text-[13px] leading-relaxed'>
                  {personnel.notes ||
                    'Pilot demonstrates exceptional test flight capabilities. Recommended for Mercury mission assignment.'}
                </p>
              </div>
            </div>

            <hr className='vd-rule' />

            <div className='vd-code-grid'>
              <span>OCR 617</span>
              <span>17-2-1</span>
              <span>830 48166 42 4986</span>
              <span>LRK: 09CG72</span>
            </div>

            {(personnel.securityClearance || personnel.notes) && (
              <>
                <hr className='vd-rule' />
                <div className='grid gap-2 text-[12px] sm:grid-cols-2'>
                  {personnel.securityClearance && (
                    <div>
                      <div className='vd-label'>Clearance</div>
                      <div className='mt-1 font-semibold tracking-wide'>
                        {personnel.securityClearance}
                      </div>
                    </div>
                  )}
                  {personnel.organization && (
                    <div>
                      <div className='vd-label'>Organization</div>
                      <div className='mt-1 tracking-wide'>{personnel.organization}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className='vd-diagram'>
              <div>
                [TECHNICAL DIAGRAMS]
                <br />
                OCR 617
              </div>
              <span className='vd-diagram-stamp'>CLASSIFIED</span>
            </div>
          </div>
        </div>
      </VintageDocumentCard>
    )
  }
)

PersonnelFileCard.displayName = 'PersonnelFileCard'

export {PersonnelFileCard}
export type {PersonnelFileCardProps}
