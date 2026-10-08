'use client'

import {useId, useState, type CSSProperties} from 'react'
import {
  documentLayers,
  foundationSections,
  referenceImages,
  type ArchiveInterface,
} from './study-data'
import {nuclearShadowDefinition} from '../nuclear-shadow.definition'
import './archive-studies.css'

export type ArchiveInterfaceStudyProps = {
  interfaceId: ArchiveInterface
  imageSrc?: string
  initialDisclosure?: number
  initialLayer?: 'approved' | 'mechanisms' | 'context'
  onNext?: () => void
}

/** Interactive reference plates. The supplied artwork remains the visual composition. */
export function ArchiveInterfaceStudy({
  interfaceId,
  imageSrc,
  initialDisclosure = 0,
  initialLayer = 'approved',
  onNext,
}: ArchiveInterfaceStudyProps) {
  const instanceId = useId()
  const [section, setSection] = useState<string>('thesis')
  const [inspection, setInspection] = useState<'claim' | 'basis' | 'counterpoint' | 'unresolved'>(
    'claim'
  )
  const [disclosure, setDisclosure] = useState(initialDisclosure)
  const [layer, setLayer] = useState<string>(initialLayer)
  const [note, setNote] = useState('')
  const selectedSection =
    foundationSections.find((item) => item.id === section) ?? foundationSections[0]
  const selectedLayer = documentLayers.find((item) => item.id === layer) ?? documentLayers[0]
  const waypoint = nuclearShadowDefinition.waypoints.find(
    (item) => item.ordinal === (interfaceId === 'trinity' ? 2 : 3)
  )!
  const title = interfaceId === 'foundation' ? 'Visual Foundation' : waypoint.title
  const disclosureLabel = disclosure < 34 ? 'Public' : disclosure < 67 ? 'Controlled' : 'Restricted'

  return (
    <section className={`ut-archive-study ut-archive-study--${interfaceId}`} aria-label={title}>
      <header className='ut-archive-study-intro'>
        <span>UT / Interface studies</span>
        <h1>{title}</h1>
        <p>
          {interfaceId === 'foundation'
            ? 'Read the visual language before entering the evidence.'
            : 'The Nuclear Shadow · Act I: The Architecture of Secrecy'}
        </p>
      </header>
      <div className='ut-archive-study-layout'>
        <figure className='ut-archive-plate'>
          <div className='ut-archive-plate-art'>
            <img
              src={imageSrc ?? referenceImages[interfaceId]}
              alt={
                interfaceId === 'foundation'
                  ? 'Ultraterrestrial visual language board: eleven numbered sections, aged paper, archive motifs, palette and typography.'
                  : interfaceId === 'trinity'
                    ? 'Trinity reference composition: detonation photograph, instrumentation, observer log, topographic map, and restricted document.'
                    : 'Controlled Revelation reference composition: stacked paper reports, classification tabs, disclosure slider, and released and withheld excerpts.'
              }
            />
            {interfaceId === 'foundation' && (
              <div className='ut-archive-hotspots'>
                {foundationSections.map((item, index) => (
                  <button
                    key={item.id}
                    type='button'
                    className='ut-archive-hotspot'
                    style={{
                      left: `${item.bounds[0]}%`,
                      top: `${item.bounds[1]}%`,
                      width: `${item.bounds[2]}%`,
                      height: `${item.bounds[3]}%`,
                    }}
                    aria-label={`${index + 1}. ${item.title}`}
                    aria-pressed={section === item.id}
                    onClick={() => setSection(item.id)}
                  >
                    <span className='ut-archive-sr-only'>{item.title}</span>
                  </button>
                ))}
              </div>
            )}
            {interfaceId === 'trinity' && (
              <div className='ut-archive-hotspots'>
                <button
                  type='button'
                  className='ut-archive-hotspot'
                  style={{left: '17%', top: '26%', width: '44%', height: '43%'}}
                  aria-label='Inspect the Trinity basis'
                  onClick={() => setInspection('basis')}
                />
                <button
                  type='button'
                  className='ut-archive-hotspot'
                  style={{left: '17%', top: '71%', width: '40%', height: '27%'}}
                  aria-label='Read the observer-log counterpoint'
                  onClick={() => setInspection('counterpoint')}
                />
                <button
                  type='button'
                  className='ut-archive-hotspot'
                  style={{left: '62%', top: '50%', width: '35%', height: '45%'}}
                  aria-label='Inspect what remains unresolved'
                  onClick={() => setInspection('unresolved')}
                />
              </div>
            )}
            {interfaceId === 'disclosure' && (
              <>
                <div className='ut-archive-tabs' role='group' aria-label='Document layers'>
                  {documentLayers.map((item) => (
                    <button
                      key={item.id}
                      type='button'
                      aria-pressed={layer === item.id}
                      onClick={() => setLayer(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div
                  className='ut-archive-mask'
                  style={{'--disclosure': `${100 - disclosure}%`} as CSSProperties}
                  aria-hidden='true'
                />
                <div className='ut-archive-slider'>
                  <label htmlFor={`${instanceId}-mask`}>Disclosure mask · {disclosureLabel}</label>
                  <input
                    id={`${instanceId}-mask`}
                    type='range'
                    min={0}
                    max={100}
                    value={disclosure}
                    aria-valuetext={`${disclosureLabel} · ${disclosure}% of illustrative reveal`}
                    onChange={(event) => setDisclosure(Number(event.target.value))}
                  />
                </div>
              </>
            )}
          </div>
          <figcaption>Original user-supplied artwork · interactive reference study</figcaption>
        </figure>
        <div className='ut-archive-readout'>
          {interfaceId === 'foundation' ? (
            <>
              <p className='ut-archive-kicker'>Visual language / 11 sections</p>
              <label className='ut-archive-select'>
                Read section{' '}
                <select value={section} onChange={(event) => setSection(event.target.value)}>
                  {foundationSections.map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {index + 1}. {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className='ut-archive-reading' role='status'>
                <h2>{selectedSection.title}</h2>
                <p>{selectedSection.text}</p>
              </div>
              <p className='ut-archive-margin-note'>
                The record is the material. The interface is the instrument.
              </p>
              {onNext && (
                <button type='button' className='ut-archive-action' onClick={onNext}>
                  Enter Trinity →
                </button>
              )}
            </>
          ) : (
            <>
              <p className='ut-archive-kicker'>
                Waypoint {interfaceId === 'trinity' ? '02' : '03'} / Reading record
              </p>
              <nav aria-label='Waypoint reading' className='ut-archive-reading-nav'>
                {(['claim', 'basis', 'counterpoint', 'unresolved'] as const).map((item) => (
                  <button
                    type='button'
                    key={item}
                    aria-pressed={inspection === item}
                    onClick={() => setInspection(item)}
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <div className='ut-archive-reading' role='status'>
                <h2>
                  {inspection === 'claim'
                    ? 'Reading'
                    : inspection === 'basis'
                      ? 'Basis'
                      : inspection === 'counterpoint'
                        ? 'Counterpoint'
                        : 'Unresolved'}
                </h2>
                {inspection === 'claim' && <p>{waypoint.narrative.entryClaim}</p>}
                {inspection === 'basis' &&
                  waypoint.evidence.supporting.map((item) => (
                    <div key={item.id} className='ut-archive-source'>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      {item.sourceUrl ? (
                        <a href={item.sourceUrl} target='_blank' rel='noreferrer'>
                          {item.sourceLabel} ↗
                        </a>
                      ) : (
                        <span>{item.sourceLabel}</span>
                      )}
                    </div>
                  ))}
                {inspection === 'counterpoint' &&
                  waypoint.evidence.counterpoints.map((item) => (
                    <p key={item.id}>{item.summary}</p>
                  ))}
                {inspection === 'unresolved' && (
                  <>
                    <p>{waypoint.epistemic.openQuestions.join(' ')}</p>
                    <p className='ut-archive-boundary'>
                      Not established: {waypoint.epistemic.notEstablished.join('; ')}.
                    </p>
                  </>
                )}
              </div>
              {interfaceId === 'disclosure' && (
                <div className='ut-archive-layer-reading' role='status'>
                  <p className='ut-archive-kicker'>
                    {disclosureLabel} / {disclosure}% illustrative reveal
                  </p>
                  <h2>{selectedLayer.title}</h2>
                  <p>{selectedLayer.text}</p>
                </div>
              )}
              <p className='ut-archive-reference-note'>
                {interfaceId === 'disclosure'
                  ? 'The artwork’s report, dates, quotations and propulsion text are visual-reference copy. The reading here follows the existing Smyth Report tour definition.'
                  : 'The artwork is a visual reference. The reading and source links here follow the existing Trinity tour definition.'}
              </p>
              <label className='ut-archive-note'>
                Next trace
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={waypoint.narrative.handoffQuestion}
                />
              </label>
              {note.trim() && (
                <p className='ut-archive-note-status' role='status'>
                  Local research note retained: {note.trim()}
                </p>
              )}
              {onNext && (
                <button type='button' className='ut-archive-action' onClick={onNext}>
                  {interfaceId === 'trinity'
                    ? 'Follow the disclosure'
                    : 'Return to visual foundation'}{' '}
                  →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
