import * as React from 'react'
import {cn} from '@/utils'
import {VintageDocumentCard} from './VintageDocumentCard'

import {PersonnelFile, DocumentAttachment} from './types'
import {PolaroidBasic} from '@/components/design-system/research-ui/photography/polaroid/Polaroid'

interface PersonnelFileCardProps {
  personnel: PersonnelFile
  className?: string
}

const PersonnelPhoto = ({
  photo,
  name,
  rank,
  organization,
}: {
  photo?: DocumentAttachment
  name: string
  rank?: string
  organization?: string
}) => {
  // Transform personnel data to match Polaroid component interface
  const polaroidData = {
    image: photo || {url: '/placeholder.svg'},
    name,
    role: organization || 'PERSONNEL',
    rank: rank || 'CLASSIFIED',
    id: `personnel-${name.replace(/\s+/g, '-').toLowerCase()}`,
  }

  return (
    <div className='scale-75 origin-top-left'>
      <PolaroidBasic person={polaroidData} />
    </div>
  )
}

const DocumentInfo = ({
  label,
  value,
  className,
}: {
  label: string
  value?: string
  className?: string
}) => {
  if (!value) return null

  return (
    <div className={cn('flex', className)}>
      <span className='font-bold text-black min-w-24'>{label}:</span>
      <span className='text-black ml-2'>{value}</span>
    </div>
  )
}

const PersonnelFileCard = React.forwardRef<HTMLDivElement, PersonnelFileCardProps>(
  ({personnel, className, ...props}, ref) => {
    return (
      <VintageDocumentCard
        ref={ref}
        classification={personnel.classification}
        title={personnel.name}
        date={personnel.date}
        location={personnel.location}
        className={cn('font-mono', 'document-texture', className)}
        {...props}>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Personnel Photo */}
          <div className='md:col-span-1'>
            <PersonnelPhoto
              photo={personnel.profilePhoto}
              name={personnel.name}
              rank={personnel.rank}
              organization={personnel.organization}
            />
          </div>

          {/* Personnel Information */}
          <div className='md:col-span-2 space-y-4'>
            {/* Basic Information */}
            <div className='space-y-2 text-sm'>
              <h2 className='text-lg font-bold text-black mb-3 tracking-wider'>
                {personnel.organization || 'MERCURY ASTRONAUT 1963'}
              </h2>

              <DocumentInfo label='Name' value={personnel.name} />
              <DocumentInfo label='Rank' value={personnel.rank} />
              <DocumentInfo label='Service No' value={personnel.serviceNumber} />
              <DocumentInfo label='Organization' value={personnel.organization} />
            </div>

            {/* Security Clearance Section */}
            <div className='border-t border-gray-400 pt-4'>
              <h3 className='font-bold text-black mb-3'>Security Information:</h3>
              <DocumentInfo label='Clearance Level' value={personnel.securityClearance} />
              <DocumentInfo label='Notes' value={personnel.notes} />
            </div>

            {/* Classification Details */}
            <div className='border-t border-gray-400 pt-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-bold text-black'>OCR 617</span>
                </div>
                <div>
                  <span className='font-bold text-black'>17-2-1</span>
                </div>
              </div>

              <div className='mt-3 grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-black'>830 48166 42 4986</span>
                </div>
                <div>
                  <span className='text-black'>LRK: 09CG72</span>
                </div>
              </div>
            </div>

            {/* Technical Diagrams Area */}
            <div className='border-t border-gray-400 pt-4'>
              <div className='bg-gray-100 border border-gray-300 p-2 h-24 flex items-center justify-center'>
                <div className='text-xs text-gray-600 text-center'>
                  [TECHNICAL DIAGRAMS]
                  <br />
                  <span className='font-mono'>OCR 617</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Classification Stamp */}
        <div className='absolute bottom-4 right-4'>
          <div className='bg-black text-white px-2 py-1 text-xs font-bold transform rotate-2'>
            CLASSIFIED
          </div>
        </div>
      </VintageDocumentCard>
    )
  }
)

PersonnelFileCard.displayName = 'PersonnelFileCard'

export {PersonnelFileCard}
export type {PersonnelFileCardProps}
