import type {
  TourDefinition,
  TourTransitionDefinition,
  TourWaypointDefinition,
} from '../shared/types/tour-definition';
import { evidence } from './nuclear-shadow.sources';
import { nuclearShadowIds as ids, nuclearShadowLayout as layout } from './nuclear-shadow.layout';

const standardGates = {
  claim: { kind: 'acknowledge' },
  evidence: { kind: 'open-any', minimum: 1 },
  challenge: { kind: 'open-any', minimum: 1 },
  residue: { kind: 'acknowledge' },
} as const;

const camera = {
  zoom: 1.08,
  arrivalDurationMs: 700,
  departureDurationMs: 1_100,
} as const;

const waypoints: TourWaypointDefinition[] = [
  {
    id: ids.secretMachine,
    ordinal: 1,
    title: 'The Secret Machine',
    subtitle: 'The Manhattan Engineer District',
    shortLabel: 'Manhattan Project',
    dateRange: { start: '1942-08-13', end: '1945-08-14', display: '1942-1945' },
    narrative: {
      entryClaim:
        'The Manhattan Project created a durable operating model for geographically distributed, contractor-supported, need-to-know science under military control.',
      question: 'What happens when revolutionary physics becomes inseparable from military secrecy?',
      handoffQuestion: 'What happens when the hidden work produces a civilization-changing result?',
      completionStatement:
        'Compartmentalization can sharply restrict visibility, but it is an operating method rather than a guarantee of perfect secrecy.',
    },
    layout: { ...layout[ids.secretMachine], visualMode: 'archive', importance: 'primary' },
    camera,
    claims: [
      {
        id: 'claim.manhattan.compartmentalization',
        text:
          'Manhattan Project personnel and sites were organized through compartmentalized access and distributed production.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.manhattanNps.id,
          evidence.manhattanDoe.id,
          evidence.sovietEspionage.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.manhattanNps, evidence.manhattanDoe],
      counterpoints: [evidence.sovietEspionage],
      contextual: [],
    },
    epistemic: {
      established: [
        'Compartmentalized access',
        'Distributed secret facilities',
        'Military, laboratory, university, and contractor integration',
      ],
      notEstablished: [
        'A connection to anomalous craft',
        'Development of non-nuclear exotic propulsion',
        'Perfect continuity between every wartime and postwar compartment',
      ],
      openQuestions: [
        'Which organizational practices survived into postwar aerospace programs?',
        'How much can disappear across lawful compartments without any one participant seeing the whole?',
      ],
    },
    transition: {
      targetWaypointId: ids.trinity,
      edgeKind: 'chronological',
      durationMs: 1_100,
    },
  },
  {
    id: ids.trinity,
    ordinal: 2,
    title: 'Trinity',
    subtitle: 'The Threshold Event',
    shortLabel: 'Trinity',
    dateRange: { start: '1945-07-16', display: 'July 16, 1945' },
    narrative: {
      entryClaim:
        'Trinity converted hidden theoretical and engineering work into a strategic reality before the public understood the system that produced it.',
      question: 'How long can a technological revolution exist before the public becomes aware of it?',
      handoffQuestion: 'Once the weapon existed, how would the state explain it without revealing how to reproduce it?',
      completionStatement:
        'Trinity is a documented technological threshold; later anomalous associations must remain on a separate evidentiary layer.',
    },
    layout: { ...layout[ids.trinity], visualMode: 'field', importance: 'primary' },
    camera: { ...camera, zoom: 1.14 },
    claims: [
      {
        id: 'claim.trinity.threshold',
        text:
          'Trinity was the first nuclear detonation and the culmination of the Manhattan Project weapons-development effort.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.trinityDoe.id,
          evidence.trinityNps.id,
          evidence.trinityRetrospective.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.trinityDoe, evidence.trinityNps],
      counterpoints: [evidence.trinityRetrospective],
      contextual: [],
    },
    epistemic: {
      established: [
        'First detonation of a nuclear device',
        'A hidden project produced a globally consequential capability',
      ],
      notEstablished: [
        'That Trinity attracted nonhuman attention',
        'That later anomalous reports were caused by the test',
      ],
      openQuestions: [
        'Did the atomic age only transform human institutions, or did it alter the anomaly landscape?',
      ],
    },
    transition: {
      targetWaypointId: ids.controlledRevelation,
      edgeKind: 'chronological',
      durationMs: 1_050,
    },
  },
  {
    id: ids.controlledRevelation,
    ordinal: 3,
    title: 'Controlled Revelation',
    subtitle: 'The Smyth Report',
    shortLabel: 'Smyth Report',
    dateRange: { start: '1945-08-12', display: 'August 1945' },
    narrative: {
      entryClaim:
        'The first public account of the Manhattan Project was an authorized disclosure designed to explain the achievement while protecting sensitive mechanisms.',
      question: 'Can disclosure function as one of the tools of secrecy?',
      handoffQuestion: 'What legal structure could preserve control over nuclear knowledge after wartime emergency ended?',
      completionStatement:
        'Disclosure and secrecy are not opposites when public release is itself deliberately scoped.',
    },
    layout: {
      ...layout[ids.controlledRevelation],
      visualMode: 'public-release',
      importance: 'primary',
    },
    camera,
    claims: [
      {
        id: 'claim.disclosure.controlled',
        text:
          'The Smyth Report was prepared and reviewed as a controlled public explanation of the Manhattan Project.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.smythReport.id,
          evidence.opennessHistory.id,
          evidence.disclosureNotDeception.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.smythReport, evidence.opennessHistory],
      counterpoints: [evidence.disclosureNotDeception],
      contextual: [],
    },
    epistemic: {
      established: [
        'Public disclosure was prepared before release',
        'Technical detail was intentionally limited',
      ],
      notEstablished: [
        'That every omission was deceptive',
        'That controlled release automatically signals a hidden anomalous program',
      ],
      openQuestions: [
        'Which later disclosure events should be read as transparency, boundary management, or both?',
      ],
    },
    transition: {
      targetWaypointId: ids.bornSecret,
      edgeKind: 'institutional-inheritance',
      durationMs: 1_100,
    },
  },
  {
    id: ids.bornSecret,
    ordinal: 4,
    title: 'Born Secret',
    subtitle: 'Restricted Data and the Atomic Energy Acts',
    shortLabel: 'Restricted Data',
    dateRange: { start: '1946-08-01', end: '1954-08-30', display: '1946-1954' },
    narrative: {
      entryClaim:
        'Restricted Data is a statutory subject-matter category, not merely an ordinary secret stamped after creation.',
      question: 'Which kinds of knowledge become controlled by what they are rather than only by a later decision?',
      handoffQuestion: 'How does this nuclear regime interact with ordinary national-security classification?',
      completionStatement:
        'Nuclear information can be born into a statutory regime, while separable propulsion and transport may follow a different path.',
    },
    layout: { ...layout[ids.bornSecret], visualMode: 'archive', importance: 'primary' },
    camera: { ...camera, zoom: 1.04 },
    claims: [
      {
        id: 'claim.restricted-data.born-secret',
        text:
          'Restricted Data is defined by federal statute, while the atomic-weapon definition excludes separable and divisible means of transport or propulsion.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.atomicEnergyAct.id,
          evidence.eo13526.id,
          evidence.propulsionExclusion.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.atomicEnergyAct, evidence.eo13526],
      counterpoints: [evidence.propulsionExclusion],
      contextual: [],
    },
    epistemic: {
      established: [
        'Restricted Data is defined by subject matter',
        'Nuclear energy and weapon information can fall under statutory controls',
        'Separable means of transport or propulsion are not automatically part of the atomic-weapon definition',
      ],
      notEstablished: [
        'That every advanced propulsion concept is Restricted Data',
        'That classification power is legally unlimited',
      ],
      openQuestions: [
        'Where would a program mixing nuclear energy, aerospace systems, intelligence, and materials science be controlled?',
      ],
    },
    transition: {
      targetWaypointId: ids.twoSecrecyUniverses,
      edgeKind: 'institutional-inheritance',
      durationMs: 1_150,
    },
  },
  {
    id: ids.twoSecrecyUniverses,
    ordinal: 5,
    title: 'Two Secrecy Universes',
    subtitle: 'Atomic Statute and Executive Classification',
    shortLabel: 'RD / NSI',
    dateRange: { start: '1946-08-01', end: 'present', display: '1946-present' },
    narrative: {
      entryClaim:
        'One program can contain nuclear, weapons-system, intelligence, operational, and scientific information governed through overlapping regimes.',
      question: 'What happens when a single capability crosses multiple legal and institutional boundaries?',
      handoffQuestion: 'What additional controls appear when ordinary classification is judged insufficient?',
      completionStatement:
        'Classification category, damage level, and access compartment are separate axes that can overlap.',
    },
    layout: {
      ...layout[ids.twoSecrecyUniverses],
      visualMode: 'blacksite',
      importance: 'primary',
    },
    camera: { ...camera, zoom: 1.0 },
    claims: [
      {
        id: 'claim.secrecy.dual-systems',
        text:
          'Restricted Data, Formerly Restricted Data, and executive national-security classification are related but distinct control systems.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.frdStatute.id,
          evidence.eo13526.id,
          evidence.classificationGuidance.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.frdStatute, evidence.eo13526],
      counterpoints: [evidence.classificationGuidance],
      contextual: [],
    },
    epistemic: {
      established: [
        'Formerly Restricted Data remains classified',
        'Executive classification includes national-security science, weapons, intelligence, and system vulnerabilities',
      ],
      notEstablished: [
        'An exact classification result for a hypothetical program without authoritative guidance',
      ],
      openQuestions: [
        'Can fragmented oversight reproduce the same appearance as a program with no oversight?',
      ],
    },
    transition: {
      targetWaypointId: ids.blackArchitecture,
      edgeKind: 'institutional-inheritance',
      durationMs: 1_100,
    },
  },
  {
    id: ids.blackArchitecture,
    ordinal: 6,
    title: 'The Black Architecture',
    subtitle: 'Special Access and Classified Programs',
    shortLabel: 'SAPs',
    dateRange: { start: 'postwar', end: 'present', display: 'Postwar-present' },
    narrative: {
      entryClaim:
        'Special Access Programs add exceptional access and safeguarding controls to already classified information.',
      question: 'How can deeply sensitive technology remain lawful, funded, overseen, and almost entirely invisible to the public?',
      handoffQuestion: 'If a revolutionary propulsion capability existed, which path through this architecture would it take?',
      completionStatement:
        'The architecture can conceal advanced systems; its existence is not evidence that any claimed exotic system occupies it.',
    },
    layout: {
      ...layout[ids.blackArchitecture],
      visualMode: 'blacksite',
      importance: 'primary',
    },
    camera: { ...camera, zoom: 1.06 },
    claims: [
      {
        id: 'claim.sap.black-architecture',
        text:
          'Special Access Programs impose protections beyond ordinary classification while retaining formal authorization and oversight pathways.',
        status: 'established',
        confidence: 'high',
        evidenceIds: [
          evidence.sapDirective.id,
          evidence.sapStatute.id,
          evidence.sapNotProof.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.sapDirective, evidence.sapStatute],
      counterpoints: [evidence.sapNotProof],
      contextual: [],
    },
    epistemic: {
      established: [
        'SAPs can protect exceptionally sensitive advanced technologies and operations',
        'Oversight may be narrowed and compartmented rather than absent',
      ],
      notEstablished: [
        'Recovered nonhuman craft programs',
        'Operational antigravity systems',
        'A hidden technology merely because the mechanism to hide one exists',
      ],
      openQuestions: [
        'What evidence could distinguish a highly compartmented conventional program from an alleged exotic one?',
      ],
    },
    transition: {
      targetWaypointId: ids.propulsionFork,
      edgeKind: 'evidentiary',
      durationMs: 1_150,
    },
  },
  {
    id: ids.propulsionFork,
    ordinal: 7,
    title: 'The Propulsion Fork',
    subtitle: 'Nuclear, Non-Nuclear, and Fundamental Physics',
    shortLabel: 'Propulsion Fork',
    dateRange: { start: '1945', end: 'present', display: '1945-present' },
    narrative: {
      entryClaim:
        'A revolutionary aerospace capability could be protected through conventional nuclear, defense, intelligence, and special-access mechanisms without requiring a unique UFO classification.',
      question: 'Where would radical propulsion go if it were achieved, recovered, or merely suspected?',
      handoffQuestion: 'What happens when an anomalous recovery claim enters a system already built to control revolutionary knowledge?',
      completionStatement:
        'Capable of concealing is not evidence of existence; classification architecture defines a possible route, not a proven payload.',
    },
    layout: {
      ...layout[ids.propulsionFork],
      visualMode: 'blacksite',
      importance: 'primary',
    },
    camera: { ...camera, zoom: 1.0 },
    claims: [
      {
        id: 'claim.propulsion.jurisdiction-fork',
        text:
          'Nuclear propulsion, non-nuclear advanced propulsion, and fundamental research can follow different classification paths depending on content, authority, and national-security application.',
        status: 'supported',
        confidence: 'high',
        evidenceIds: [
          evidence.nuclearPropulsion.id,
          evidence.nonNuclearPropulsion.id,
          evidence.blackPhysicsGuardrail.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.nuclearPropulsion, evidence.nonNuclearPropulsion],
      counterpoints: [evidence.blackPhysicsGuardrail],
      contextual: [],
    },
    epistemic: {
      established: [
        'Different technical contents can create different legal equities',
        'Advanced non-nuclear systems can be classified under ordinary national-security authority',
      ],
      notEstablished: [
        'That black physics is an official government category',
        'That any field-propulsion breakthrough has been achieved',
      ],
      openQuestions: [
        'Which observable records, budgets, facilities, patents, materials, or testimony could test the advanced-propulsion hypothesis?',
      ],
    },
    transition: {
      targetWaypointId: ids.roswell,
      edgeKind: 'hypothesis',
      durationMs: 1_200,
    },
  },
  {
    id: ids.roswell,
    ordinal: 8,
    title: 'Roswell',
    subtitle: 'The Secrecy Machine Meets the Anomaly',
    shortLabel: 'Roswell',
    dateRange: { start: '1947-07-08', display: 'July 1947' },
    narrative: {
      entryClaim:
        'Roswell sits at the collision point between a contested recovery event, an active classified military environment, changing public explanations, later testimony, and decades of narrative growth.',
      question: 'What can the historical record sustain once the event is decomposed into contemporaneous documents, official explanations, missing records, and later claims?',
      handoffQuestion: 'Which postwar cases justify extending the nuclear-shadow route beyond Roswell?',
      completionStatement:
        'The architecture of secrecy changes how absence, contradiction, and delayed testimony should be interpreted, but it does not determine the answer in advance.',
    },
    layout: { ...layout[ids.roswell], visualMode: 'archive', importance: 'primary' },
    camera: { ...camera, zoom: 1.12 },
    claims: [
      {
        id: 'claim.roswell.secrecy-meets-anomaly',
        text:
          'The Roswell record includes documented official messaging, a later classified-balloon explanation, records gaps, and extensive retrospective testimony with unequal evidentiary weight.',
        status: 'contested',
        confidence: 'high',
        evidenceIds: [
          evidence.roswellGao.id,
          evidence.roswellAirForce.id,
          evidence.roswellNarrativeGrowth.id,
          evidence.roswellBroadArchive.id,
        ],
      },
    ],
    gates: standardGates,
    evidence: {
      supporting: [evidence.roswellGao, evidence.roswellAirForce],
      counterpoints: [evidence.roswellNarrativeGrowth],
      contextual: [evidence.roswellBroadArchive],
    },
    epistemic: {
      established: [
        'Military public messaging changed quickly',
        'The Air Force later attributed the debris to Project Mogul',
        'A federal review documented records-retention gaps',
      ],
      notEstablished: [
        'Recovery of a nonhuman craft',
        'That all missing records were deliberately destroyed to conceal an anomalous recovery',
        'That all retrospective testimony is false or all is accurate',
      ],
      openQuestions: [
        'Which claims originate in 1947 and which enter the record later?',
        'What evidence remains after provenance, temporal distance, and source independence are scored?',
      ],
    },
  },
];

const transitions: TourTransitionDefinition[] = waypoints
  .filter((waypoint) => waypoint.transition)
  .map((waypoint) => ({
    id: `transition.nuclear-shadow.${waypoint.shortLabel.toLowerCase().replaceAll(' ', '-')}`,
    sourceWaypointId: waypoint.id,
    targetWaypointId: waypoint.transition!.targetWaypointId,
    kind: waypoint.transition!.edgeKind,
    durationMs: waypoint.transition!.durationMs,
    label:
      waypoint.transition!.edgeKind === 'institutional-inheritance'
        ? 'institutional inheritance'
        : waypoint.transition!.edgeKind === 'hypothesis'
          ? 'contested bridge'
          : undefined,
  })) as TourTransitionDefinition[];

export const nuclearShadowDefinition: TourDefinition = {
  id: 'ut.tour.nuclear-shadow',
  slug: 'nuclear-shadow',
  title: 'The Nuclear Shadow',
  subtitle: 'The Architecture of Secrecy: Manhattan Project to Roswell',
  version: '0.1.0',
  entryWaypointId: ids.secretMachine,
  route: [
    ids.secretMachine,
    ids.trinity,
    ids.controlledRevelation,
    ids.bornSecret,
    ids.twoSecrecyUniverses,
    ids.blackArchitecture,
    ids.propulsionFork,
    ids.roswell,
  ],
  waypoints,
  transitions,
  defaultEvidenceThreshold: 'official-record',
  viewport: {
    minZoom: 0.28,
    maxZoom: 1.85,
    overviewPadding: 0.2,
  },
};
