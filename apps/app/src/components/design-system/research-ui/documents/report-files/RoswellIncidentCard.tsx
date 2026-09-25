import * as React from 'react'
import {cn} from '@/utils'
import {VintageDocumentCard} from '../VintageDocumentCard'
import {IncidentReport, DocumentAttachment} from '../types'

interface RoswellIncidentCardProps {
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

      {/* Photo area */}
      <div className='bg-gray-100 border-2 border-gray-300 p-1 shadow-md transform -rotate-1'>
        {attachment?.url ? (
          <img
            src={attachment.url}
            alt={attachment.caption}
            className='w-full h-full object-cover grayscale sepia'
          />
        ) : (
          <div className='w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs'>
            [PHOTOGRAPH ATTACHED]
          </div>
        )}
        {attachment?.caption && (
          <p className='text-xs text-center mt-1 text-gray-600 font-mono'>{attachment.caption}</p>
        )}
      </div>
    </div>
  )
}

const WitnessReport = ({
  report,
  index,
}: {
  report: {description: string; witness?: string}
  index: number
}) => (
  <div className='mb-4'>
    <p className='text-sm leading-relaxed text-black font-mono'>
      <span className='font-bold'>Witness Reports:</span>
    </p>
    <div className='ml-4 mt-1'>
      <p className='text-sm leading-relaxed text-black font-mono whitespace-pre-line'>
        {report.description}
      </p>
      {report.witness && (
        <p className='text-xs text-gray-700 mt-1 italic'>&mdash; {report.witness}</p>
      )}
    </div>
  </div>
)

const RoswellIncidentCard = React.forwardRef<HTMLDivElement, RoswellIncidentCardProps>(
  ({incident, className, ...props}, ref) => {
    const crashSitePhoto = incident.attachments?.find((a) => a.type === 'photo')

    return (
      <VintageDocumentCard
        ref={ref}
        classification={incident.classification}
        title={incident.title}
        date={incident.date}
        location={incident.location}
        className={cn('font-mono', className)}
        {...props}>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Main Content Area */}
          <div className='md:col-span-2 space-y-4'>
            {/* Main incident description */}
            <div className='space-y-2'>
              <p className='text-sm leading-relaxed text-black font-mono'>
                {incident.incidentDescription}
              </p>
            </div>

            {/* Witness Reports */}
            <div className='space-y-3'>
              {incident.witnessReports.map((report, index) => (
                <WitnessReport key={index} report={report} index={index} />
              ))}
            </div>

            {/* Additional Details */}
            <div className='border-t border-gray-400 pt-3 mt-4'>
              <p className='text-sm text-black font-mono'>
                <span className='font-bold'>Disc's surface was dull metallic. These</span>
                <br />
                <span className='font-bold'>nettings distnormfully foil, and no</span>
                <br />
                <span className='font-bold'>were of glass,like material.</span>
              </p>
              <br />
              <p className='text-sm text-black font-mono'>
                <span className='font-bold'>No scorched marks and signs of being</span>
                <br />
                <span className='font-bold'>usual on large and were occurrre.</span>
              </p>
            </div>
          </div>

          {/* Photo Attachment Area */}
          <div className='md:col-span-1'>
            <AttachmentArea attachment={crashSitePhoto} className='mb-4' />
          </div>
        </div>

        {/* Arrow pointing to photo */}
        <div className='absolute top-1/3 right-1/4 transform translate-x-4'>
          <svg width='40' height='20' viewBox='0 0 40 20' className='text-black opacity-70'>
            <path
              d='M2 10 L30 10 M25 5 L30 10 L25 15'
              stroke='currentColor'
              strokeWidth='1.5'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </VintageDocumentCard>
    )
  }
)

RoswellIncidentCard.displayName = 'RoswellIncidentCard'

export {RoswellIncidentCard}
export type {RoswellIncidentCardProps}
