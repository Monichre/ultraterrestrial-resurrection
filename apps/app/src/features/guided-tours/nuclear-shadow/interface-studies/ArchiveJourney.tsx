'use client'

import {useEffect, useRef, useState} from 'react'
import {ArchiveInterfaceStudy} from './ArchiveInterfaceStudy'
import {studyStages, type ArchiveInterface} from './study-data'

export type ArchiveJourneyProps = {initialInterface?: ArchiveInterface}

export function ArchiveJourney({initialInterface = 'foundation'}: ArchiveJourneyProps) {
  const [active, setActive] = useState(initialInterface)
  const [visited, setVisited] = useState<ArchiveInterface[]>([initialInterface])
  const statusRef = useRef<HTMLParagraphElement>(null)
  const navigatedRef = useRef(false)
  const current = studyStages.find((item) => item.id === active)!
  useEffect(() => {
    if (navigatedRef.current) statusRef.current?.focus()
  }, [active])

  function navigate(target: ArchiveInterface) {
    navigatedRef.current = true
    setActive(target)
    setVisited((previous) => (previous.includes(target) ? previous : [...previous, target]))
  }

  return (
    <div className='ut-archive-journey'>
      <nav className='ut-archive-journey-nav' aria-label='Archive user journey'>
        {studyStages.map((item) => (
          <button
            key={item.id}
            type='button'
            aria-current={active === item.id ? 'step' : undefined}
            onClick={() => navigate(item.id)}
          >
            {item.ordinal} / {item.label}
          </button>
        ))}
      </nav>
      <p className='ut-archive-journey-status' role='status' tabIndex={-1} ref={statusRef}>
        Current: {current.label} · {visited.length} of 3 interfaces visited · notes and selections
        remain local until reload.
      </p>
      {studyStages.map((item, index) => (
        <div key={item.id} hidden={active !== item.id}>
          <ArchiveInterfaceStudy
            interfaceId={item.id}
            onNext={() => navigate(studyStages[(index + 1) % studyStages.length].id)}
          />
        </div>
      ))}
    </div>
  )
}
