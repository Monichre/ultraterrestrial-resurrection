'use client'

import * as React from 'react'
import {cn} from '@/utils'
import {VintageDocumentCard} from './VintageDocumentCard'
import type {DocumentAttachment, IncidentReport} from './types'
import './vintage-document.css'

interface IncidentReportCardProps {
  incident: IncidentReport
  className?: string
}

const AttachmentArea = ({
  attachment,
  className,
}: {
  attachment?: DocumentAttachment
  className?: string
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className='vd-insert'>
        {attachment?.url ? (
          <div className='space-y-2'>
            {attachment.type === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachment.url}
                alt={attachment.caption}
                className='h-32 w-full object-cover contrast-110 saturate-75 sepia-[20%]'
              />
            ) : (
              <div className='flex h-32 items-center justify-center border border-[color:var(--vd-rule)] bg-[color:var(--vd-stock)]'>
                <div className='text-center font-[family-name:var(--vd-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--vd-ink-faint)]'>
                  <div className='font-bold'>[{attachment.type.toUpperCase()}]</div>
                  <div className='mt-1'>CLASSIFIED</div>
                </div>
              </div>
            )}
            <div className='text-center font-[family-name:var(--vd-mono)] text-[10px] tracking-wide text-[color:var(--vd-ink-dim)]'>
              {attachment.caption}
            </div>
          </div>
        ) : (
          <div className='flex h-32 items-center justify-center font-[family-name:var(--vd-mono)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--vd-ink-faint)]'>
            NO ATTACHMENT
            <br />
            AVAILABLE
          </div>
        )}
      </div>
    </div>
  )
}

const WitnessReport = ({
  report,
  index,
}: {
  report: {id: string; description: string; witness?: string}
  index: number
}) => {
  return (
    <div className='vd-witness'>
      <div className='vd-witness-head'>
        <span>Witness report #{index + 1}</span>
        {report.witness && <span>By: {report.witness}</span>}
      </div>
      <div className='text-[13px] leading-relaxed text-[color:var(--vd-ink)]'>
        &ldquo;{report.description}&rdquo;
      </div>
    </div>
  )
}

const IncidentReportCard = React.forwardRef<HTMLDivElement, IncidentReportCardProps>(
  ({incident, className}, ref) => {
    return (
      <VintageDocumentCard
        ref={ref}
        classification={incident.classification}
        title='INCIDENT REPORT'
        date={incident.date}
        location={incident.location}
        fileRef={`UT·VD // ${incident.id}`}
        className={cn('relative', className)}>
        <div className='mb-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='space-y-3'>
            <div>
              <div className='vd-label'>Incident type</div>
              <div className='mt-1 text-[13px] tracking-wide'>UNIDENTIFIED AERIAL PHENOMENA</div>
            </div>
            <hr className='vd-rule' />
            <div>
              <div className='vd-label'>Report id</div>
              <div className='mt-1 font-[family-name:var(--vd-mono)] text-[12px] tracking-wide'>
                {incident.id}
              </div>
            </div>
            <hr className='vd-rule' />
            <div>
              <div className='vd-label'>Status</div>
              <div className='mt-1 text-[12px] font-semibold tracking-wide text-[color:var(--vd-stamp)]'>
                UNDER INVESTIGATION
              </div>
            </div>
          </div>

          <div>
            <div className='vd-label mb-2'>Photographic evidence</div>
            <AttachmentArea attachment={incident.attachments?.[0]} className='w-full' />
          </div>
        </div>

        <div className='mb-5'>
          <div className='vd-label mb-2'>Incident summary</div>
          <div className='vd-insert'>
            <div className='text-[13px] leading-relaxed'>{incident.incidentDescription}</div>
          </div>
        </div>

        {incident.witnessReports && incident.witnessReports.length > 0 && (
          <div className='mb-5'>
            <div className='vd-label mb-2'>Witness statements</div>
            <div>
              {incident.witnessReports.map((report, index) => (
                <WitnessReport key={report.id} report={report} index={index} />
              ))}
            </div>
          </div>
        )}

        {incident.attachments && incident.attachments.length > 1 && (
          <div className='mb-5'>
            <div className='vd-label mb-2'>Additional evidence</div>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              {incident.attachments.slice(1).map((attachment) => (
                <AttachmentArea key={attachment.id} attachment={attachment} className='w-full' />
              ))}
            </div>
          </div>
        )}

        <div className='mt-6 flex flex-wrap items-end justify-between gap-4'>
          <div className='space-y-2'>
            <div className='vd-mark vd-mark--priority'>Priority: high</div>
            <div className='font-[family-name:var(--vd-mono)] text-[10px] tracking-wide text-[color:var(--vd-ink-faint)]'>
              Investigating officer: [REDACTED]
            </div>
          </div>

          <div className='text-center'>
            <div className='font-[family-name:var(--vd-mono)] text-[10px] tracking-wide text-[color:var(--vd-ink-faint)]'>
              Report no: {incident.id}
            </div>
            <div className='mt-2 w-32 border-t border-[color:var(--vd-rule)] pt-1 font-[family-name:var(--vd-mono)] text-[9px] uppercase tracking-[0.12em] text-[color:var(--vd-ink-faint)]'>
              Authorized signature
            </div>
          </div>

          <div className='vd-mark vd-mark--eyes'>Eyes only</div>
        </div>
      </VintageDocumentCard>
    )
  }
)

IncidentReportCard.displayName = 'IncidentReportCard'

export {IncidentReportCard}
export type {IncidentReportCardProps}
