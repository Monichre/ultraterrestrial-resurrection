'use client'

import * as React from 'react'
import {IncidentReportCard, PersonnelFileCard} from './index'
import type {IncidentReport, PersonnelFile} from './types'
import './vintage-document.css'

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
      description: 'Reports came in of a crash near Roswell, New Mexico.',
    },
    {
      id: 'witness-2',
      description:
        'Large crash site, burned and charred, with flames and black smoking ash across the debris field.',
    },
  ],
  attachments: [
    {
      id: 'photo-1',
      url: '/api/placeholder/300/200',
      caption: 'Crash Site Photo',
      type: 'photo',
    },
  ],
}

const samplePersonnelFile: PersonnelFile = {
  id: 'personnel-cooper-1963',
  type: 'personnel',
  title: 'GORDON COOPER',
  name: 'COOPER',
  classification: 'top-secret',
  date: '1963',
  rank: 'Major',
  serviceNumber: 'AF-2251',
  organization: 'MERCURY ASTRONAUT',
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
    <div
      className={['vd-blotter min-h-screen px-6 py-10 sm:px-10', className]
        .filter(Boolean)
        .join(' ')}>
      <div className='mx-auto max-w-4xl'>
        <p className='vd-demo-title'>Documents · archival dossier</p>
        <h1 className='vd-demo-heading'>Vintage document set</h1>

        <div className='space-y-14'>
          <section>
            <p className='vd-demo-section-label'>Incident report · Roswell</p>
            <IncidentReportCard incident={sampleIncidentReport} />
          </section>

          <section>
            <p className='vd-demo-section-label'>Personnel file · Cooper</p>
            <PersonnelFileCard personnel={samplePersonnelFile} />
          </section>
        </div>

        <div className='vd-demo-usage'>
          <p className='vd-demo-section-label' style={{marginBottom: 0}}>
            Usage
          </p>
          <pre>{`import { IncidentReportCard, PersonnelFileCard } from '@/components/design-system/research-ui/documents'

<IncidentReportCard incident={incidentData} />
<PersonnelFileCard personnel={personnelData} />`}</pre>
        </div>
      </div>
    </div>
  )
}

export default VintageDocumentsDemo
