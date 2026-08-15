import type { CaseStackData } from '../types'

/**
 * The 2004 USS Nimitz "Tic Tac" encounter — the reference case for the
 * record-anatomy stack. Every claim below is drawn from the public record;
 * evidentiary states follow the platform taxonomy (CONTEXT.md).
 */
export const nimitzCase: CaseStackData = {
  fileRef: 'UT·RC // CASE:2004-NIM',
  classification: 'DECLASSIFIED · PUBLIC RECORD',
  title: 'The Nimitz Encounter',
  subtitle: 'USS Nimitz Carrier Strike Group · Pacific Range · 14 Nov 2004',
  layers: [
    {
      id: 'event',
      label: 'Event Record',
      state: 'CORROBORATED',
      summary:
        'Anomalous object engaged by two F/A-18F crews during a training intercept ~100 NM southwest of San Diego.',
      links: [
        { ref: 'EVT-2015-GIM', label: 'Gimbal — USS Roosevelt CSG', state: 'DOCUMENTED' },
        { ref: 'EVT-2015-GOF', label: 'GoFast — USS Roosevelt CSG', state: 'DOCUMENTED' },
        { ref: 'EVT-2019-OMA', label: 'USS Omaha drone swarm', state: 'CONTESTED' },
      ],
      body: {
        kind: 'event',
        facts: [
          { term: 'Date', detail: '2004-11-14 · ~12:00 PST' },
          { term: 'Location', detail: '31.4°N 117.6°W · Warning Area W-291' },
          { term: 'Platform', detail: 'USS Nimitz CSG · VFA-41 Black Aces' },
          { term: 'Object', detail: '~40 ft white lozenge, no wings, no exhaust' },
          { term: 'Behavior', detail: 'Mirrored intercept, departed at extreme speed' },
          { term: 'Duration', detail: '~5 min visual engagement' },
        ],
      },
    },
    {
      id: 'personnel',
      label: 'Witnesses',
      state: 'DOCUMENTED',
      summary:
        'Four naval aviators and radar operators on record, under oath or on camera, with mutually consistent accounts.',
      links: [
        { ref: 'PER-FRAVOR', label: 'Cmdr. David Fravor — congressional testimony 2023', state: 'DOCUMENTED' },
        { ref: 'PER-DIETRICH', label: 'Lt. Cmdr. Alex Dietrich — on-record interviews', state: 'DOCUMENTED' },
        { ref: 'PER-DAY', label: 'Sr. Chief Kevin Day — radar narrative', state: 'DOCUMENTED' },
      ],
      body: {
        kind: 'personnel',
        witnesses: [
          { name: 'D. Fravor', role: 'CO VFA-41 · visual', testimony: 'CORROBORATED' },
          { name: 'A. Dietrich', role: 'Pilot · visual', testimony: 'CORROBORATED' },
          { name: 'K. Day', role: 'Princeton · SPY-1 radar', testimony: 'DOCUMENTED' },
          { name: 'C. Underwood', role: 'WSO · FLIR capture', testimony: 'DOCUMENTED' },
        ],
      },
    },
    {
      id: 'evidence',
      label: 'Evidence Chain',
      state: 'CONTESTED',
      summary:
        'One authenticated sensor recording, radar tracks described but never released, and a report of unofficial provenance.',
      links: [
        { ref: 'DOC-FLIR1', label: 'FLIR1 video — DoD release Apr 2020', state: 'DOCUMENTED' },
        { ref: 'DOC-AATIP-XR', label: '2009 "Executive Report"', state: 'UNVERIFIED' },
        { ref: 'TOP-AATIP', label: 'AATIP program file', state: 'DOCUMENTED' },
      ],
      body: {
        kind: 'evidence',
        items: [
          { name: 'FLIR1 "Tic Tac" video', provenance: 'DoD-authenticated · released 2020', state: 'DOCUMENTED' },
          { name: 'SPY-1 radar tracks', provenance: 'Described by operators · logs not public', state: 'CONTESTED' },
          { name: 'Pilot testimony', provenance: 'Congress · press · podcast record', state: 'DOCUMENTED' },
          { name: '2009 Executive Report', provenance: 'Unofficial provenance · authorship disputed', state: 'UNVERIFIED' },
        ],
      },
    },
    {
      id: 'analysis',
      label: 'Analysis',
      state: 'AI-INFERRED',
      summary:
        'Analytical layer. Everything here is inference over the sourced layers above it — dashed borders mark the boundary.',
      links: [
        { ref: 'TOP-UAPTF', label: 'UAP Task Force lineage', state: 'DOCUMENTED' },
        { ref: 'TOP-AARO', label: 'AARO historical review', state: 'DOCUMENTED' },
        { ref: 'HYP-SENSOR', label: 'Sensor-artifact literature', state: 'CONTESTED' },
      ],
      body: {
        kind: 'analysis',
        hypotheses: [
          { label: 'Unknown advanced technology', state: 'CONTESTED' },
          { label: 'Classified US platform', state: 'UNVERIFIED' },
          { label: 'Sensor artifact + parallax (FLIR only)', state: 'CONTESTED' },
        ],
        anomalyIndex: '0.81 · high multi-sensor + multi-witness agreement',
        falsifiability:
          'Release of full SPY-1 telemetry would settle the 28,000 ft → sea-level displacement claim either way.',
      },
    },
  ],
}
