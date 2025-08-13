import * as React from 'react'
import {cn} from '@/utils'
import {VintageDocumentCard} from './VintageDocumentCard'
import {IncidentReport, DocumentAttachment} from './types'

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
      {/* Paperclip effect */}
      <div className='absolute -top-2 -right-2 z-20'>
        <div className='w-6 h-8 bg-gray-400 rounded-sm transform rotate-12 shadow-md'>
          <div className='absolute inset-0.5 bg-gray-300 rounded-sm'></div>
          <div className='absolute top-1 left-1 right-1 h-0.5 bg-gray-500 rounded'></div>
          <div className='absolute bottom-1 left-1 right-1 h-0.5 bg-gray-500 rounded'></div>
        </div>
      </div>

      {/* Attachment display area */}
      <div className='border-2 border-gray-300 bg-gray-50 p-2 shadow-md transform -rotate-1'>
        {attachment?.url ? (
          <div className='space-y-2'>
            {attachment.type === 'photo' ? (
              <img
                src={attachment.url}
                alt={attachment.caption}
                className='w-full h-32 object-cover filter sepia-[30%] contrast-120 saturate-75'
              />
            ) : (
              <div className='w-full h-32 bg-white border border-gray-200 flex items-center justify-center'>
                <div className='text-center text-xs font-mono text-gray-600'>
                  <div className='font-bold'>[{attachment.type.toUpperCase()}]</div>
                  <div className='mt-1'>CLASSIFIED</div>
                </div>
              </div>
            )}
            <div className='text-xs font-mono text-gray-700 text-center'>{attachment.caption}</div>
          </div>
        ) : (
          <div className='w-full h-32 bg-gray-200 border border-gray-300 flex items-center justify-center'>
            <div className='text-xs text-gray-500 text-center font-mono'>
              NO ATTACHMENT
              <br />
              AVAILABLE
            </div>
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
    <div className='border-l-4 border-red-600 pl-4 py-2 mb-4 bg-red-50/30'>
      <div className='flex justify-between items-start mb-2'>
        <span className='font-mono text-xs font-bold text-gray-800'>
          WITNESS REPORT #{index + 1}
        </span>
        {report.witness && (
          <span className='font-mono text-xs text-gray-600'>BY: {report.witness}</span>
        )}
      </div>
      <div className='font-mono text-sm text-gray-800 leading-relaxed'>"{report.description}"</div>
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
        className={cn('relative', className)}>
        {/* Report header information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='space-y-3'>
            <div className='border-b border-gray-400 pb-2'>
              <span className='font-mono text-sm font-bold text-gray-800'>INCIDENT TYPE:</span>
              <div className='font-mono text-sm text-gray-700 mt-1'>
                UNIDENTIFIED AERIAL PHENOMENA
              </div>
            </div>

            <div className='border-b border-gray-400 pb-2'>
              <span className='font-mono text-sm font-bold text-gray-800'>REPORT ID:</span>
              <div className='font-mono text-sm text-gray-700 mt-1'>{incident.id}</div>
            </div>

            <div className='border-b border-gray-400 pb-2'>
              <span className='font-mono text-sm font-bold text-gray-800'>STATUS:</span>
              <div className='font-mono text-sm text-red-600 mt-1 font-bold'>
                UNDER INVESTIGATION
              </div>
            </div>
          </div>

          {/* Attachment area */}
          <div>
            <div className='font-mono text-sm font-bold text-gray-800 mb-3'>
              PHOTOGRAPHIC EVIDENCE:
            </div>
            <AttachmentArea attachment={incident.attachments?.[0]} className='w-full' />
          </div>
        </div>

        {/* Incident description */}
        <div className='mb-6'>
          <div className='font-mono text-sm font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1'>
            INCIDENT SUMMARY:
          </div>
          <div className='bg-yellow-50 border border-yellow-200 p-4 relative'>
            <div className='font-mono text-sm text-gray-800 leading-relaxed'>
              {incident.incidentDescription}
            </div>

            {/* Handwritten annotation effect */}
            <div className='absolute bottom-2 right-2 transform rotate-6 text-blue-600 opacity-70'>
              <div className='text-xs font-handwriting'>Verify details</div>
            </div>
          </div>
        </div>

        {/* Witness reports */}
        {incident.witnessReports && incident.witnessReports.length > 0 && (
          <div className='mb-6'>
            <div className='font-mono text-sm font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1'>
              WITNESS STATEMENTS:
            </div>
            <div className='space-y-3'>
              {incident.witnessReports.map((report, index) => (
                <WitnessReport key={report.id} report={report} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Additional attachments */}
        {incident.attachments && incident.attachments.length > 1 && (
          <div className='mb-6'>
            <div className='font-mono text-sm font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1'>
              ADDITIONAL EVIDENCE:
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {incident.attachments.slice(1).map((attachment, index) => (
                <AttachmentArea key={attachment.id} attachment={attachment} className='w-full' />
              ))}
            </div>
          </div>
        )}

        {/* Footer stamps and signatures */}
        <div className='mt-8 flex justify-between items-end'>
          <div className='space-y-2'>
            <div className='transform -rotate-2'>
              <div className='border-2 border-red-600 text-red-600 px-3 py-1 text-xs font-bold bg-red-50'>
                PRIORITY: HIGH
              </div>
            </div>
            <div className='text-xs font-mono text-gray-600'>INVESTIGATING OFFICER: [REDACTED]</div>
          </div>

          <div className='text-center'>
            <div className='font-mono text-xs text-gray-600 mb-2'>REPORT NO: {incident.id}</div>
            <div className='border-t border-gray-400 w-32'>
              <div className='text-xs font-mono text-gray-600 mt-1'>AUTHORIZED SIGNATURE</div>
            </div>
          </div>

          <div className='transform rotate-3'>
            <div className='border-2 border-black text-black px-3 py-1 text-xs font-bold bg-white'>
              EYES ONLY
            </div>
          </div>
        </div>
      </VintageDocumentCard>
    )
  }
)

IncidentReportCard.displayName = 'IncidentReportCard'

export {IncidentReportCard}
export type {IncidentReportCardProps}
