'use client'

import type React from 'react'
import {useState, useMemo} from 'react'
import {XIcon, FileTextIcon, PaperclipIcon} from 'lucide-react'

interface CaseFileFolderProps {
  isOpen: boolean
  onClose: () => void
  caseData?: {
    caseNumber: string
    title: string
    date: string
    classification: string
    subject: string
    summary: string
    notes: string[]
    evidence: Array<{
      id: string
      type: string
      description: string
    }>
  }
}

const DEFAULT_CASE_DATA = {
  caseNumber: 'XF-73291',
  title: 'UNEXPLAINED PHENOMENA INVESTIGATION',
  date: '04/17/1978',
  classification: 'TOP SECRET',
  subject: 'Lunar Surface Anomalies',
  summary:
    'Multiple credible reports of unusual light patterns observed on lunar surface. Possible connection to similar terrestrial phenomena under investigation.',
  notes: [
    'Apollo mission crew testimonies indicate consistent pattern of anomalous events.',
    'Spectral analysis suggests possible gas emissions from Aristarchus crater region.',
    'Similar light patterns documented at terrestrial locations with high electromagnetic readings.',
    'Recommend continued surveillance and correlation with Project BLUE BOOK findings.',
  ],
  evidence: [
    {
      id: 'E-001',
      type: 'PHOTOGRAPH',
      description: 'Lunar surface anomaly, Aristarchus crater, 03/14/1978',
    },
    {
      id: 'E-002',
      type: 'TESTIMONY',
      description: 'Apollo 15 mission specialist report, classified annex',
    },
    {
      id: 'E-003',
      type: 'SPECTRAL DATA',
      description: 'Emission analysis from Mt. Palomar observation',
    },
    {
      id: 'E-004',
      type: 'PHOTOGRAPH',
      description: 'Redwood National Forest aerial phenomenon, 04/20/1978',
    },
  ],
}

// Sub-component for evidence items to stabilize their random elements
const EvidenceItem = ({item}: {item: {id: string; type: string; description: string}}) => {
  const {showTechnicalElements, showRedacted, randomRef} = useMemo(
    () => ({
      showTechnicalElements: Math.random() > 0.5,
      showRedacted: Math.random() > 0.6,
      randomRef: Math.floor(Math.random() * 10000),
    }),
    []
  )

  return (
    <div
      className='border border-black p-4 flex items-start bg-[#e8e3d5]'
      style={{
        backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)',
        backgroundSize: '4px 4px',
      }}>
      <div className='shrink-0 mr-4'>
        <div className='w-10 h-10 bg-black text-[#e8e3d5] flex items-center justify-center'>
          <FileTextIcon size={20} />
        </div>
      </div>
      <div>
        <div className='flex items-center'>
          <div className='bg-black text-[#e8e3d5] px-2 py-1 text-xs mr-3'>{item.id}</div>
          <div className='font-bold'>{item.type}</div>
        </div>
        <div className='mt-2'>{item.description}</div>
        {showTechnicalElements && (
          <div className='mt-2 flex items-center gap-1'>
            <div className='h-2 w-2 bg-black'></div>
            <div className='h-2 w-6 bg-black'></div>
            <div className='text-xs opacity-70'>REF: {randomRef}</div>
          </div>
        )}
      </div>
      {showRedacted && (
        <div className='ml-auto pl-4'>
          <div className='bg-black text-transparent px-8 py-1 text-xs'>redacted text</div>
        </div>
      )}
    </div>
  )
}

const CaseFileFolder: React.FC<CaseFileFolderProps> = ({
  isOpen,
  onClose,
  caseData = DEFAULT_CASE_DATA,
}) => {
  const [activeTab, setActiveTab] = useState('summary')

  const {folderRotation, stampPosition, randomCode, randomRef} = useMemo(() => {
    const stampPositions = [
      {top: '15%', right: '10%', rotate: '15deg'},
      {top: '30%', left: '15%', rotate: '-10deg'},
      {bottom: '20%', right: '15%', rotate: '5deg'},
    ]
    const codeNumbers = [
      '44-18-0044',
      '09C6T2',
      '820-43135-42/436',
      '089-04-7-2-T137',
      'WALK-09C6T2',
      'E080U-W525',
      '140-04',
      '19-10-121',
      'TS00K3',
    ]
    return {
      folderRotation: Math.floor(Math.random() * 5) - 2,
      stampPosition: stampPositions[Math.floor(Math.random() * stampPositions.length)],
      randomCode: codeNumbers[Math.floor(Math.random() * codeNumbers.length)],
      randomRef: Math.floor(Math.random() * 100000),
    }
  }, [])

  if (!isOpen) return null

  const TABS = [
    {id: 'summary', label: 'SUMMARY'},
    {id: 'notes', label: 'FIELD NOTES'},
    {id: 'evidence', label: 'EVIDENCE'},
  ]

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm p-4'>
      <div
        className='relative max-w-4xl w-full max-h-[90vh] pt-10'
        style={{
          transform: `rotate(${folderRotation}deg)`,
        }}>
        {/* New Top-Left Folder Tab */}
        <div
          className='absolute top-0 left-0 w-auto h-10 border-l border-t border-r border-[#a89070] z-20'
          style={{
            backgroundColor: '#d3b88c',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard.png")',
            borderBottom: '1px solid #d3b88c',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1), 0 -2px 2px rgba(0,0,0,0.1)',
          }}>
          <div
            className='flex items-center justify-center h-full text-black/80 text-lg px-4'
            style={{fontFamily: 'var(--font-just-another-hand), cursive'}}>
            CASE FILE: {caseData.caseNumber}
          </div>
        </div>
        <div
          className='relative flex flex-col'
          style={{
            width: '100%',
            height: '85vh',
            backgroundColor: '#d3b88c',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard.png")',
            padding: '2rem',
            borderRadius: '3px',
            border: '1px solid #a89070',
          }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black text-[#d3b88c] rounded-full z-30 hover:bg-red-700 transition-colors'>
            <XIcon size={16} />
          </button>
          {/* Classification stamp */}
          <div
            className='absolute z-20 flex items-center justify-center'
            style={{
              ...stampPosition,
              padding: '0.5rem 1.5rem',
              border: '2px solid #b91c1c',
              color: '#b91c1c',
              fontFamily: '"Courier New", monospace',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              letterSpacing: '1px',
              transform: `rotate(${stampPosition.rotate})`,
              opacity: 0.8,
            }}>
            {caseData.classification}
          </div>

          {/* Folder contents */}
          <div className='relative z-10 flex flex-col flex-grow h-full overflow-hidden'>
            {/* Header */}
            <div className='border-b-2 border-black pb-4 mb-6 shrink-0'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className=' font-justAnotherHand text-black font-bold '>
                    CASE FILE: {caseData.caseNumber}
                  </h3>
                  <h1 className='text-2xl font-bold tracking-tight text-black mt-1'>
                    {caseData.title}
                  </h1>
                </div>
                <div className='text-right'>
                  <div className='text-xs font-mono text-black opacity-70'>DATE:</div>
                  <div className='font-mono text-sm text-black'>{caseData.date}</div>
                  <div className='mt-2 px-2 py-1 bg-black text-[#d3b88c] text-xs font-mono inline-block'>
                    {randomCode}
                  </div>
                </div>
              </div>
              <div className='mt-4 flex items-center'>
                <div className='text-xs font-mono text-black opacity-70 mr-2'>SUBJECT:</div>
                <div className='font-mono text-sm text-black'>{caseData.subject}</div>
              </div>
            </div>

            {/* Tabs + Content wrapper */}
            <div className='relative mt-6 flex flex-col flex-grow overflow-hidden'>
              {/* Tab buttons */}
              <div className='relative z-10 flex pl-2 shrink-0'>
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`px-6 py-2 font-mono text-sm border-t border-l border-r border-black rounded-t-lg -mb-px mr-1 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#e8e3d5] text-black font-bold'
                        : 'bg-[#c4a978] text-black/70 hover:bg-[#d3b88c]'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{zIndex: activeTab === tab.id ? 11 : 10 - index}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div
                className='relative z-[9] bg-[#e8e3d5] p-6 border border-black rounded-b-lg rounded-tr-lg flex-grow overflow-y-auto'
                style={{
                  backgroundImage: 'radial-gradient(#00000020 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}>
                {activeTab === 'summary' && (
                  <div className='font-mono text-sm text-black leading-relaxed'>
                    <div className='mb-6'>{caseData.summary}</div>
                    <div className='relative w-full h-64 border border-black mt-6 mb-6'>
                      <div className='absolute inset-0 opacity-20'>
                        <img
                          src='/textures/technical-diagram-overlay.png'
                          alt='Technical diagram'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div
                        className='absolute inset-0'
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, #00000020 1px, transparent 1px), linear-gradient(to bottom, #00000020 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}></div>
                      <div className='absolute top-1/4 left-1/4 w-8 h-8 rounded-full border-2 border-black'></div>
                      <div className='absolute top-1/4 left-1/4 w-24 h-1 bg-black transform translate-x-8 translate-y-4'></div>
                      <div className='absolute top-1/4 left-1/2 w-12 h-12 border-2 border-black'></div>
                      <div className='absolute top-1/2 left-1/4 w-1 h-24 bg-black transform translate-x-4'></div>
                      <div className='absolute top-2/3 left-1/4 w-32 h-1 bg-black transform translate-x-4'></div>
                      <div className='absolute top-1/3 right-1/4 w-16 h-16 border-2 border-[#b91c1c] rounded-full'></div>
                      <div className='absolute bottom-1/4 right-1/3 font-mono text-xs text-[#b91c1c]'>
                        ANOMALY DETECTED
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <div className='text-xs opacity-70'>FILED BY: AGENT K. COOPER</div>
                      <div className='border border-black px-3 py-1 text-xs'>REF: {randomRef}</div>
                    </div>
                  </div>
                )}
                {activeTab === 'notes' && (
                  <div className='font-mono text-sm text-black'>
                    <h3 className='text-lg font-bold mb-4 uppercase'>Field Notes</h3>
                    <ul className='space-y-4'>
                      {caseData.notes.map((note, index) => (
                        <li key={index} className='flex items-start'>
                          <div className='w-6 h-6 bg-black text-[#e8e3d5] flex items-center justify-center mr-3 shrink-0'>
                            {index + 1}
                          </div>
                          <div className='leading-relaxed pt-1'>{note}</div>
                        </li>
                      ))}
                    </ul>
                    <div
                      className='mt-8 p-4 border border-black relative'
                      style={{
                        transform: 'rotate(-1deg)',
                        fontFamily: 'cursive',
                      }}>
                      <div className='text-black opacity-80 leading-relaxed'>
                        Connection to Project BLUE BOOK seems increasingly likely. Cross-reference
                        with Incident 17-A from 1967 files. -Cooper
                      </div>
                      <div className='absolute -top-2 -right-2 text-black opacity-70'>
                        <PaperclipIcon size={20} />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'evidence' && (
                  <div className='font-mono text-sm text-black'>
                    <h3 className='text-lg font-bold mb-4 uppercase'>Evidence Log</h3>
                    <div className='space-y-4'>
                      {caseData.evidence.map((item) => (
                        <EvidenceItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className='mt-6 flex justify-between items-center shrink-0'>
              <div className='font-mono text-xs text-black opacity-70'>
                PROPERTY OF U.S. GOVERNMENT - UNAUTHORIZED DISCLOSURE PROHIBITED
              </div>
              <div className='font-mono text-xs text-black'>PAGE 1 OF 17</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseFileFolder
export type {CaseFileFolderProps}
