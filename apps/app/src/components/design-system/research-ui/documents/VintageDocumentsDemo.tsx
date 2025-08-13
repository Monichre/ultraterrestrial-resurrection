import * as React from 'react'
import {IncidentReportCard, PersonnelFileCard} from './index'
import type {IncidentReport, PersonnelFile} from './types'

// Sample data for demonstration
const sampleIncidentReport: IncidentReport = {
  id: 'incident-roswell-1947',
  type: 'incident',
  title: 'ROSWELL INCIDENT',
  classification: 'unclassified',
  date: 'JULY 1947',
  location: 'Roswell, New Mexico',
  incidentDescription: 'A large circular disc crashed near Roswell, New Mexico.',
  witnessReports: [
    {
      id: 'witness-1',
      description: 'Reports came in titan crashes near Rospell, New Mexico.',
    },
    {
      id: 'witness-2',
      description:
        'Large crash site site. burned and, charred, with flames and black smoking ash due to the site there of lang change bring.',
    },
  ],
  attachments: [
    {
      id: 'photo-1',
      url: '/api/placeholder/300/200', // Placeholder for crash site photo
      caption: 'Crash Site Photo',
      type: 'photo',
    },
  ],
}

const samplePersonnelFile: PersonnelFile = {
  id: 'personnel-cooper-1963',
  type: 'personnel',
  title: 'GORDON COOPER',
  name: 'GORDON COOPER',
  classification: 'top-secret',
  date: '1963',
  rank: 'Major',
  serviceNumber: 'AF-2251',
  organization: 'MERCURY ASTRONAUT 1963',
  securityClearance: 'TOP SECRET',
  notes:
    'Pilot demonstrates exceptional test flight capabilities. Recommended for Mercury mission assignment.',
  profilePhoto: {
    id: 'photo-cooper',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    caption: 'Personnel Photo - Gordon Cooper',
    type: 'photo',
  },
}

interface VintageDocumentsDemoProps {
  className?: string
}

export const VintageDocumentsDemo: React.FC<VintageDocumentsDemoProps> = ({className}) => {
  return (
    <div className={`space-y-8 p-8 bg-gray-100 min-h-screen ${className}`}>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          Vintage Document Components Demo
        </h1>

        <div className='space-y-12'>
          {/* Incident Report Card Demo */}
          <section>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>
              Incident Report - Roswell Style
            </h2>
            <IncidentReportCard incident={sampleIncidentReport} />
          </section>

          {/* Personnel File Card Demo */}
          <section>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>
              Personnel File - Gordon Cooper Style
            </h2>
            <PersonnelFileCard personnel={samplePersonnelFile} />
          </section>
        </div>

        {/* Usage Information */}
        <div className='mt-12 p-6 bg-white rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold mb-4'>Usage Example</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { IncidentReportCard, PersonnelFileCard } from '@/components/documents';

// For incident reports
<IncidentReportCard incident={incidentData} />

// For personnel files  
<PersonnelFileCard personnel={personnelData} />`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default VintageDocumentsDemo
