import type {Meta, StoryObj} from '@storybook/react'
import {PersonnelFileCard} from './PersonnelFileCard'
import type {PersonnelFile} from './types'

const meta: Meta<typeof PersonnelFileCard> = {
  title: 'Documents/PersonnelFileCard',
  component: PersonnelFileCard,
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
          'Specialized vintage document card for government personnel files. Features personnel photo with paperclip attachment, service information, and security clearance details in authentic 1940s-1960s government file styling.',
      },
    },
  },
  argTypes: {
    personnel: {
      control: 'object',
      description: 'Complete personnel file data structure with service information',
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

// Sample personnel data for stories
const gordonCooper: PersonnelFile = {
  id: 'personnel-cooper-1963',
  type: 'personnel',
  title: 'GORDON COOPER',
  name: 'GORDON COOPER',
  classification: 'top-secret',
  date: '1963',
  rank: 'Major',
  serviceNumber: 'AF-2251',
  organization: 'MERCURY ASTRONAUT PROGRAM',
  securityClearance: 'TOP SECRET - COMPARTMENTED',
  notes:
    'Pilot demonstrates exceptional skill in test aircraft operations. Has reported unexplained aerial phenomena during multiple missions. Cleared for classified space program activities.',
  profilePhoto: {
    id: 'photo-cooper',
    url: '/api/placeholder/150/200',
    caption: 'Official Personnel Photo - Major Gordon Cooper',
    type: 'photo',
  },
}

const edwardRuppelt: PersonnelFile = {
  id: 'personnel-ruppelt-1952',
  type: 'personnel',
  title: 'EDWARD J. RUPPELT',
  name: 'EDWARD J. RUPPELT',
  classification: 'secret',
  date: '1952',
  rank: 'Captain',
  serviceNumber: 'AO-1847634',
  organization: 'PROJECT BLUE BOOK - ATIC',
  securityClearance: 'SECRET',
  notes:
    'Officer in charge of systematic UFO investigations. Developed scientific approach to aerial phenomena analysis. Coined term "Unidentified Flying Object" to replace "flying saucer" terminology.',
  profilePhoto: {
    id: 'photo-ruppelt',
    url: '/api/placeholder/150/200',
    caption: 'Captain Edward J. Ruppelt - Project Blue Book Director',
    type: 'photo',
  },
}

const jesseMarcel: PersonnelFile = {
  id: 'personnel-marcel-1947',
  type: 'personnel',
  title: 'JESSE A. MARCEL',
  name: 'JESSE A. MARCEL',
  classification: 'confidential',
  date: '1947',
  rank: 'Major',
  serviceNumber: 'AO-433889',
  organization: '509TH COMPOSITE GROUP - INTELLIGENCE',
  securityClearance: 'CONFIDENTIAL',
  notes:
    'Intelligence Officer responsible for initial assessment of Roswell incident debris. Highly experienced in identification of conventional and experimental aircraft materials.',
  profilePhoto: {
    id: 'photo-marcel',
    url: '/api/placeholder/150/200',
    caption: 'Major Jesse Marcel - Intelligence Officer',
    type: 'photo',
  },
}

const alienContact: PersonnelFile = {
  id: 'personnel-classified-xxxx',
  type: 'personnel',
  title: '[REDACTED] - CONTACT SPECIALIST',
  name: '[NAME CLASSIFIED]',
  classification: 'top-secret',
  date: '[DATE CLASSIFIED]',
  rank: '[RANK REDACTED]',
  serviceNumber: '[CLASSIFIED]',
  organization: 'DEPARTMENT OF [REDACTED]',
  securityClearance: 'ABOVE TOP SECRET - MAJESTIC CLEARANCE',
  notes:
    '[HEAVILY REDACTED] - Specialist in xenobiological contact protocols. [REDACTED] experience with non-terrestrial intelligence. Cleared for [CLASSIFICATION ABOVE TOP SECRET].',
  profilePhoto: {
    id: 'photo-classified',
    url: '/api/placeholder/150/200',
    caption: '[PHOTO CLASSIFICATION LEVEL COMPARTMENTALIZED]',
    type: 'photo',
  },
}

const civilianConsultant: PersonnelFile = {
  id: 'personnel-hynek-1966',
  type: 'personnel',
  title: 'DR. J. ALLEN HYNEK',
  name: 'DR. J. ALLEN HYNEK',
  classification: 'confidential',
  date: '1966',
  rank: 'Civilian Consultant',
  serviceNumber: 'CONSULTANT-0034',
  organization: 'NORTHWESTERN UNIVERSITY / USAF CONSULTANT',
  securityClearance: 'CONFIDENTIAL - SCIENTIFIC ADVISORY',
  notes:
    'Astronomical consultant to Project Blue Book. Initially skeptical of UFO phenomena, position evolved based on case analysis. Developed Close Encounter classification system.',
  profilePhoto: {
    id: 'photo-hynek',
    url: '/api/placeholder/150/200',
    caption: 'Dr. J. Allen Hynek - Scientific Consultant',
    type: 'photo',
  },
}

export const AstronautCooper: Story = {
  args: {
    personnel: gordonCooper,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Personnel file for astronaut Gordon Cooper with Top Secret classification. Demonstrates red styling for highest classification level and space program context.',
      },
    },
  },
}

export const ProjectBlueBookDirector: Story = {
  args: {
    personnel: edwardRuppelt,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Captain Edward Ruppelt, director of Project Blue Book. Shows Secret classification with orange styling and UFO investigation context.',
      },
    },
  },
}

export const RoswellIntelligenceOfficer: Story = {
  args: {
    personnel: jesseMarcel,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Major Jesse Marcel from the famous Roswell incident. Demonstrates Confidential classification with blue styling and historical significance.',
      },
    },
  },
}

export const CivilianConsultant: Story = {
  args: {
    personnel: civilianConsultant,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dr. J. Allen Hynek as civilian consultant. Shows how component handles non-military personnel with civilian rank designation.',
      },
    },
  },
}

export const HighlyClassifiedPersonnel: Story = {
  args: {
    personnel: alienContact,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Highly classified personnel file with extensive redactions. Demonstrates handling of compartmentalized access and above top secret materials.',
      },
    },
  },
}

export const MinimalPersonnelFile: Story = {
  args: {
    personnel: {
      id: 'personnel-basic',
      type: 'personnel',
      title: 'JOHN DOE',
      name: 'JOHN DOE',
      classification: 'unclassified',
      date: '1955',
      rank: 'Lieutenant',
      serviceNumber: 'AF-987654',
      organization: 'STANDARD MILITARY UNIT',
      securityClearance: 'STANDARD',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minimal personnel file without photo and notes. Shows how component gracefully handles incomplete data.',
      },
    },
  },
}

export const WithoutPhoto: Story = {
  args: {
    personnel: {
      id: 'personnel-no-photo',
      type: 'personnel',
      title: 'ANALYST WITHOUT PHOTO',
      name: 'MARY JOHNSON',
      classification: 'confidential',
      date: '1959',
      rank: 'Captain',
      serviceNumber: 'AF-445566',
      organization: 'ANALYSIS DIVISION',
      securityClearance: 'CONFIDENTIAL',
      notes:
        'Intelligence analyst specializing in aerial phenomena assessment. Photo not available due to operational security requirements.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Personnel file without profile photo. Demonstrates fallback display when photo is not available.',
      },
    },
  },
}

export const LongServiceRecord: Story = {
  args: {
    personnel: {
      id: 'personnel-veteran',
      type: 'personnel',
      title: 'COL. WILLIAM H. BLANCHARD',
      name: 'COL. WILLIAM H. BLANCHARD',
      classification: 'secret',
      date: '1947',
      rank: 'Colonel',
      serviceNumber: 'AO-123456',
      organization: '509TH COMPOSITE GROUP - COMMANDING OFFICER',
      securityClearance: 'SECRET - SPECIAL ACCESS',
      notes:
        'Commanding Officer of 509th Composite Group during Roswell incident. Authorized initial press release regarding "flying disc" recovery. Subsequently involved in damage control and cover story implementation. Long distinguished service record including Pacific Theater operations and nuclear weapons program development.',
      profilePhoto: {
        id: 'photo-blanchard',
        url: '/api/placeholder/150/200',
        caption: 'Colonel William H. Blanchard - Commanding Officer',
        type: 'photo',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Personnel file with extensive service notes. Shows how component handles longer text content with appropriate spacing and readability.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    personnel: gordonCooper,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing the PersonnelFileCard component. Use the controls to modify the personnel data structure and see real-time changes.',
      },
    },
  },
}
