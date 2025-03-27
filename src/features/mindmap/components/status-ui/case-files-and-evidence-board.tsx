'use client'

import {EvidenceCard} from '@/features/case-files/case-file/case-file-evidence/evidence-card'
import {Card} from '@/components/ui/card'
import {AnimatePresence, motion} from 'framer-motion'
import {useState} from 'react'
import {File, FolderArchive} from 'lucide-react'

interface Evidence {
  id: string
  caseNumber: string
  classification: 'top-secret' | 'classified' | 'confidential'
  timestamp: string
  title: string
  description: string
  credibilityScore?: number
  sourceVerified?: boolean
}

export const CaseFilesAndEvidenceBoard = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Mock evidence data
  const evidenceItems: Evidence[] = [
    {
      id: 'ev-001',
      caseNumber: 'X-37B',
      classification: 'top-secret',
      timestamp: '2077-03-15T21:27:18',
      title: 'Quantum Encryption Breach',
      description:
        'Unauthorized access detected in quantum mainframe sector 7. Temporal anomalies reported.',
      credibilityScore: 0.87,
      sourceVerified: true,
    },
    {
      id: 'ev-002',
      caseNumber: 'X-37B',
      classification: 'classified',
      timestamp: '2077-03-14T18:42:03',
      title: 'Biosignal Anomaly',
      description:
        'Unknown biological signatures detected in restricted area. DNA analysis inconclusive.',
    },
  ]

  // Tab animation (collapsed state)
  const tabVariants = {
    initial: {
      x: 0,
    },
    hover: {
      x: -5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  // Container animation (expanded state)
  const containerVariants = {
    collapsed: {
      width: '48px',
      height: '120px',
      right: 0,
      opacity: 1,
    },
    expanded: {
      width: '32rem',
      height: 'auto',
      right: 0,
      opacity: 1,
      transition: {
        width: {duration: 0.4, ease: 'easeOut'},
        height: {duration: 0.5, ease: 'easeOut', delay: 0.1},
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  // Card animation
  const cardVariants = {
    collapsed: {
      opacity: 0,
      y: 20,
    },
    expanded: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }

  // Inner content animation (staggered)
  const contentVariants = {
    collapsed: {
      opacity: 0,
    },
    expanded: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.08,
      },
    },
  }

  // Text and border animations
  const itemVariants = {
    collapsed: {
      opacity: 0,
      y: 10,
    },
    expanded: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    // -translate-y-1/2
    // top-[24px]
    <motion.div
      className='fixed right-0 top-[40px] z-40'
      variants={containerVariants}
      initial='collapsed'
      animate={isExpanded ? 'expanded' : 'collapsed'}>
      {/* Tab (visible when collapsed) */}
      {!isExpanded && (
        <motion.div
          // top-1/2 -translate-y-1/2 rotate-[2deg]

          className='absolute right-0 top-[10px] z-50 w-12 h-24 bg-black/40 backdrop-blur-sm border-l border-y border-[#adf0dd]/30 rounded-l-md flex items-center justify-center cursor-pointer  shadow-lg'
          variants={tabVariants}
          animate={isHovered ? 'hover' : 'initial'}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => setIsExpanded(true)}
          whileTap={{scale: 0.95}}>
          <File className='text-[#adf0dd] w-5 h-5' />
        </motion.div>
      )}

      {/* Expanded panel content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className='w-full h-full bg-black/30 backdrop-blur-sm border border-[#adf0dd]/30 rounded-l-md overflow-hidden shadow-[0_0_15px_rgba(173,240,221,0.15)]'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0, transition: {duration: 0.2}}}>
            <div className='p-4 h-full'>
              {/* Header */}
              <motion.div
                className='flex justify-between items-center mb-4'
                variants={contentVariants}
                initial='collapsed'
                animate='expanded'>
                <motion.h2 className='text-[#adf0dd] font-mono text-lg' variants={itemVariants}>
                  CASE FILES & EVIDENCE
                </motion.h2>
                <motion.button
                  className='text-[#adf0dd]/80 hover:text-[#adf0dd] font-mono p-2'
                  onClick={() => setIsExpanded(false)}
                  variants={itemVariants}
                  whileTap={{scale: 0.95}}>
                  [ CLOSE ]
                </motion.button>
              </motion.div>

              {/* Content */}
              <motion.div
                className='space-y-4 max-h-[70vh] overflow-y-auto pr-2'
                variants={contentVariants}
                initial='collapsed'
                animate='expanded'>
                {evidenceItems.map((evidence, index) => (
                  <motion.div
                    key={evidence.id}
                    variants={cardVariants}
                    custom={index}
                    className='mb-4'>
                    <EvidenceCard {...evidence} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
