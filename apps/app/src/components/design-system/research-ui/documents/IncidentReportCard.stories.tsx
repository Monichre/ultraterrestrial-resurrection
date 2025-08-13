import type {Meta, StoryObj} from '@storybook/react'
import {IncidentReportCard} from './IncidentReportCard'
import type {IncidentReport} from './types'

const meta: Meta<typeof IncidentReportCard> = {
  title: 'Documents/IncidentReportCard',
  component: IncidentReportCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Specialized vintage document card for UFO/incident reports. Features witness statement sections, evidence areas with paperclip attachments, and official stamps for authentic government incident documentation.',
      },
    },
  },
  argTypes: {
    incident: {
      control: 'object',
      description: 'Complete incident report data structure with metadata',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for customization',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample incident data for stories
const roswellIncident: IncidentReport = {
  id: 'incident-roswell-1947',
  type: 'incident',
  title: 'ROSWELL INCIDENT',
  classification: 'unclassified',
  date: 'JULY 1947',
  location: 'Roswell, New Mexico',
  incidentDescription:
    'Multiple witnesses reported the crash of an unidentified flying object near Roswell, New Mexico. Initial military response suggested recovery of a "flying disc" before official explanation was revised to weather balloon.',
  witnessReports: [
    {
      id: 'witness-1',
      description:
        'Discovered unusual debris on ranch property. Material exhibited properties unlike any known earthly substances.',
      witness: 'William "Mac" Brazel (Rancher)',
    },
    {
      id: 'witness-2',
      description:
        'First military personnel on scene. Observed wreckage that did not match any conventional aircraft.',
      witness: 'Major Jesse Marcel (Intelligence Officer)',
    },
    {
      id: 'witness-3',
      description:
        'Received unusual request for child-sized coffins from military personnel. Subsequently threatened to maintain silence.',
      witness: 'Glenn Dennis (Mortician)',
    },
  ],
  attachments: [
    {
      id: 'photo-debris',
      url: '/api/placeholder/300/200',
      caption: 'Debris field photographed at Foster Ranch',
      type: 'photo',
    },
    {
      id: 'doc-press-release',
      url: '/api/placeholder/400/300',
      caption: 'Original press release - "Flying Disc Recovered"',
      type: 'document',
    },
  ],
}

const phoenixLightsIncident: IncidentReport = {
  id: 'incident-phoenix-1997',
  type: 'incident',
  title: 'PHOENIX LIGHTS MASS SIGHTING',
  classification: 'confidential',
  date: 'MARCH 13, 1997',
  location: 'Phoenix, Arizona Metropolitan Area',
  incidentDescription:
    'Mass UFO sighting involving over 10,000 witnesses across Arizona. Two distinct phases: V-formation of lights (19:30-20:15) and stationary hovering lights (20:30-22:30). Official explanation of military flares contradicted by timeline and witness testimony.',
  witnessReports: [
    {
      id: 'witness-gov',
      description:
        'Witnessed massive delta-shaped craft silently navigate over Squaw Peak. As an experienced pilot, I can definitively state this was not conventional aircraft.',
      witness: 'Governor Fife Symington (Former Air Force Captain)',
    },
    {
      id: 'witness-physician',
      description:
        'The lights appeared intelligently controlled, moving in perfect formation and responding to observer attention.',
      witness: 'Dr. Lynne Kitei (Physician/Researcher)',
    },
    {
      id: 'witness-pilot',
      description:
        'From our altitude of 39,000 feet, observed formation pass beneath us. Objects were clearly structured craft.',
      witness: 'Captain Ray Bowyer (America West Flight 564)',
    },
  ],
  attachments: [
    {
      id: 'photo-formation',
      url: '/api/placeholder/350/250',
      caption: 'Enhanced photograph of V-formation over Phoenix',
      type: 'photo',
    },
    {
      id: 'radar-data',
      url: '/api/placeholder/400/200',
      caption: 'Radar contact data (partially redacted)',
      type: 'document',
    },
  ],
}

const rendleshamIncident: IncidentReport = {
  id: 'incident-rendlesham-1980',
  type: 'incident',
  title: 'RENDLESHAM FOREST INCIDENT',
  classification: 'secret',
  date: 'DECEMBER 26-28, 1980',
  location: 'RAF Bentwaters/Woodbridge, United Kingdom',
  incidentDescription:
    'Military personnel from USAF bases reported multiple nights of unexplained aerial phenomena and ground traces. Event involved radiation readings, physical evidence, and official memoranda from base personnel.',
  witnessReports: [
    {
      id: 'witness-halt',
      description:
        'Conducted systematic investigation with Geiger counter readings and audio recordings. Observed structured craft with light beams directed toward weapon storage areas.',
      witness: 'Deputy Base Commander Charles Halt',
    },
    {
      id: 'witness-penniston',
      description:
        'Made physical contact with craft. Observed triangular object with hieroglyphic-like symbols. Received telepathic binary code transmission.',
      witness: 'Staff Sergeant Jim Penniston',
    },
    {
      id: 'witness-burroughs',
      description:
        'Accompanied Penniston to investigate lights. Experienced time distortion and physical effects. Medical records subsequently classified.',
      witness: 'Airman John Burroughs',
    },
  ],
  attachments: [
    {
      id: 'halt-memo',
      url: '/api/placeholder/400/300',
      caption: "Colonel Halt's official memorandum to MoD",
      type: 'document',
    },
    {
      id: 'landing-site',
      url: '/api/placeholder/300/200',
      caption: 'Triangular depression marks at landing site',
      type: 'photo',
    },
  ],
}

export const RoswellClassic: Story = {
  args: {
    incident: roswellIncident,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The classic Roswell incident from 1947. Demonstrates unclassified document styling with multiple witness reports and photographic evidence.',
      },
    },
  },
}

export const PhoenixLightsMass: Story = {
  args: {
    incident: phoenixLightsIncident,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Phoenix Lights mass sighting with confidential classification. Shows blue styling and high-profile witness testimonies including government officials.',
      },
    },
  },
}

export const RendleshamMilitary: Story = {
  args: {
    incident: rendleshamIncident,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Rendlesham Forest military incident with secret classification. Demonstrates orange styling and official military documentation.',
      },
    },
  },
}

export const MinimalIncident: Story = {
  args: {
    incident: {
      id: 'incident-minimal',
      type: 'incident',
      title: 'ROUTINE AERIAL ANOMALY',
      classification: 'unclassified',
      date: 'JUNE 15, 1952',
      location: 'Edwards Test Range',
      incidentDescription:
        'Brief sighting of unidentified aerial phenomenon during routine test flight operations.',
      witnessReports: [
        {
          id: 'witness-single',
          description: 'Observed metallic object moving at high speed across test range airspace.',
          witness: 'Test Pilot (Name Redacted)',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minimal incident report with single witness and no attachments. Shows how component handles sparse data gracefully.',
      },
    },
  },
}

export const TopSecretIncident: Story = {
  args: {
    incident: {
      id: 'incident-classified',
      type: 'incident',
      title: '[REDACTED] RECOVERY OPERATION',
      classification: 'top-secret',
      date: '[CLASSIFIED]',
      location: '[COORDINATES REDACTED]',
      incidentDescription:
        '[FULL DESCRIPTION CLASSIFIED] - Extraordinary recovery operation involving non-conventional technology. Multiple agencies involved in material analysis and containment protocols.',
      witnessReports: [
        {
          id: 'witness-classified-1',
          description: '[TESTIMONY REDACTED] - Witness cleared for compartmentalized access only.',
          witness: '[NAME CLASSIFIED] - Security Clearance TS/SCI',
        },
        {
          id: 'witness-classified-2',
          description:
            '[PARTIAL REDACTION] - Observed technology demonstrating capabilities beyond current understanding of physics.',
          witness: '[RANK] [SURNAME] - Technical Analysis Division',
        },
      ],
      attachments: [
        {
          id: 'classified-analysis',
          url: '/api/placeholder/400/300',
          caption: 'Technical Analysis Report [CLASSIFICATION LEVEL COMPARTMENTALIZED]',
          type: 'document',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Top Secret incident with heavy redactions. Demonstrates red styling and how component handles classified information with appropriate visual cues.',
      },
    },
  },
}

export const WithoutAttachments: Story = {
  args: {
    incident: {
      id: 'incident-no-attachments',
      type: 'incident',
      title: 'VERBAL REPORT ONLY',
      classification: 'confidential',
      date: 'SEPTEMBER 1954',
      location: 'Holloman AFB',
      incidentDescription:
        'Incident reported through verbal channels only. No physical evidence or documentation recovered at time of filing.',
      witnessReports: [
        {
          id: 'witness-verbal',
          description:
            'Reported unusual aerial activity during night training exercises. No photographic evidence available.',
          witness: 'Training Squadron Commander',
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Incident report without attachments. Shows how component gracefully handles cases where no photographic or documentary evidence is available.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    incident: roswellIncident,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing the IncidentReportCard component. Use the controls to modify the incident data structure and see real-time changes.',
      },
    },
  },
}
