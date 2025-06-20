import type { Meta, StoryObj } from '@storybook/react'
import ClassifiedDocumentViewer from './classified-document-viewer'

const meta: Meta<typeof ClassifiedDocumentViewer> = {
  title: 'TipTap/Components/ClassifiedDocumentViewer',
  component: ClassifiedDocumentViewer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' }
      ]
    },
    docs: {
      description: {
        component: 'Comprehensive classified document viewer with text annotation capabilities. Features tabbed interface, security controls, and integrated text selection/annotation system for TipTap workflow.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default document viewer with sample classified content. Select any text in the document content to see annotation menu appear.'
      }
    }
  }
}

export const Loading: Story = {
  args: {
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with authentication animation. Shows terminal-style loading indicator while document access is being verified.'
      }
    }
  }
}

export const AccessDenied: Story = {
  args: {
    document: undefined,
    loading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Access denied state when user lacks sufficient security clearance for the requested document.'
      }
    }
  }
}

// Alternative document with different classification
const secretDocument = {
  id: "DOC-2023-0891",
  title: "Witness Testimony Analysis - Phoenix Lights Incident",
  classification: "secret" as const,
  dateCreated: "2023-06-22T14:15:00Z",
  lastAccessed: new Date().toISOString(),
  author: "Agent Sarah Martinez",
  content: {
    text: `WITNESS TESTIMONY ANALYSIS
Classification: SECRET
Case File: PHOENIX-1997-0313

EXECUTIVE SUMMARY

Analysis of 1,247 witness testimonies collected during and after the Phoenix Lights incident of March 13, 1997. This report synthesizes corroborating evidence and identifies key patterns in observer accounts.

INCIDENT OVERVIEW

Date: March 13, 1997
Time: 19:30 - 22:30 MST
Location: Phoenix, Arizona metropolitan area
Weather: Clear skies, visibility >10 miles
Duration: Approximately 3 hours

PRIMARY OBSERVATION CATEGORIES

Formation Lights (19:30-20:15 MST)
- Described as 5-7 lights in V-formation
- Silent movement from northwest to southeast
- Estimated altitude: 5,000-10,000 feet
- Witnessed by over 700 observers

Stationary Lights (20:30-22:30 MST)
- Array of 8-10 lights hovering over Phoenix
- Described as "large as footballs at arm's length"
- Gradual disappearance over 2-hour period
- Witnessed by over 500 observers

WITNESS CREDIBILITY ASSESSMENT

High Credibility (147 witnesses):
- Military personnel (active and retired)
- Commercial and private pilots
- Air traffic controllers
- Law enforcement officers

Medium Credibility (823 witnesses):
- Professional civilians
- Multiple independent observers
- Witnesses with photographic evidence

Low Credibility (277 witnesses):
- Single observers without corroboration
- Witnesses under influence of substances
- Previous UFO claim history

KEY TESTIMONIES

Governor Fife Symington (Former Air Force Captain):
"I witnessed a massive delta-shaped craft silently navigate over Squaw Peak. As an experienced pilot, I can definitively state this was not conventional aircraft."

Dr. Lynne Kitei (Physician):
"The lights appeared to be intelligently controlled. They moved in perfect formation and responded to observer attention by changing intensity."

Captain Ray Bowyer (America West Flight 564):
"From our altitude of 39,000 feet, we observed the formation pass beneath us. The objects were clearly structured craft, not flares or conventional aircraft."

PHYSICAL EVIDENCE

Photographic Evidence:
- 23 photographs deemed authentic after analysis
- 12 video recordings show consistent light patterns
- No evidence of digital manipulation detected

Radar Data:
- Luke Air Force Base radar logs classified
- Sky Harbor Airport reports "unknown targets"
- Multiple civilian radar operators confirm contacts

OFFICIAL RESPONSE ANALYSIS

Initial Military Statement:
"No unusual air activity detected in Phoenix area."

Revised Statement (3 months later):
"A-10 Warthog training exercise with illumination flares."

Inconsistencies in Official Account:
- Timeline discrepancies (flares dropped at 22:00, sightings began 19:30)
- Flight path conflicts with reported observations
- No advance NOTAM issued for military exercise

CONCLUSIONS

The Phoenix Lights incident represents one of the most well-documented mass UFO sightings in modern history. The quality and quantity of witness testimony, combined with physical evidence, suggests two distinct aerial phenomena occurred on March 13, 1997.

The official explanation of military flares accounts for only the later stationary lights phase and fails to address the earlier formation sightings. The coordinated nature of official responses indicates prior knowledge of these events.

RECOMMENDATIONS

1. Request declassification of Luke AFB radar data
2. Interview additional military personnel with security clearance
3. Conduct follow-up analysis of photographic evidence using enhanced techniques
4. Coordinate with international agencies regarding similar phenomena

CLASSIFICATION REVIEW

This document contains information that could compromise ongoing investigations and impact national security if disclosed. Recommend maintaining SECRET classification for minimum 25 years from publication date.`,
    images: [
      {
        id: "img-phoenix-001",
        url: "/placeholder.svg", 
        caption: "Enhanced photograph showing V-formation of lights over Squaw Peak",
        classification: "secret"
      }
    ],
    videos: [
      {
        id: "vid-phoenix-001",
        url: "",
        thumbnail: "/placeholder.svg",
        duration: "04:23",
        classification: "secret",
        name: "Witness Interview Compilation - Phoenix Lights"
      }
    ],
    attachments: [
      {
        id: "att-phoenix-001",
        name: "Witness_Statements_Complete.pdf",
        type: "application/pdf",
        size: "15.7 MB", 
        classification: "secret"
      }
    ]
  },
  metadata: {
    tags: ["phoenix-lights", "mass-sighting", "witness-testimony", "1997"],
    relatedDocuments: ["DOC-1997-0314", "DOC-2003-0445"],
    caseFiles: ["PHOENIX-1997-0313", "CASE-MASS-SIGHTINGS"],
    locations: ["Phoenix, Arizona", "Squaw Peak", "Sky Harbor Airport"],
    entities: ["Gov. Fife Symington", "Dr. Lynne Kitei", "Capt. Ray Bowyer"]
  },
  accessHistory: [
    {
      userId: "UID-9821",
      username: "s.martinez",
      timestamp: new Date().toISOString(),
      action: "viewed"
    }
  ]
}

export const SecretClassification: Story = {
  args: {
    document: secretDocument
  },
  parameters: {
    docs: {
      description: {
        story: 'Document viewer showing SECRET classification level with witness testimony content. Demonstrates different classification styling and content structure.'
      }
    }
  }
}

// Confidential document example
const confidentialDocument = {
  id: "DOC-2024-0156",
  title: "UFO Sighting Report - Commercial Flight UA2743",
  classification: "confidential" as const,
  dateCreated: "2024-01-08T09:45:00Z",
  lastAccessed: new Date().toISOString(),
  author: "Captain Michael Torres",
  content: {
    text: `COMMERCIAL FLIGHT SIGHTING REPORT
Classification: CONFIDENTIAL
Flight: UA2743 (Denver to Chicago)
Date: January 8, 2024

FLIGHT DETAILS

Aircraft: Boeing 737-800
Registration: N8234U
Departure: Denver International Airport (DEN) - 08:15 MST
Arrival: Chicago O'Hare (ORD) - 12:30 CST
Flight Level: 37,000 feet
Weather: Clear skies, unlimited visibility

SIGHTING REPORT

Time: 10:23 MST (17:23 UTC)
Position: 39.7°N, 101.2°W (Eastern Colorado)
Duration: Approximately 2 minutes 15 seconds

DESCRIPTION OF OBJECT

The object was first observed by First Officer Jennifer Walsh at bearing 045° relative to aircraft heading. Initial appearance was that of a metallic, disc-shaped craft approximately 200-300 feet in diameter.

Object Characteristics:
- Highly reflective metallic surface
- No visible propulsion systems
- No navigation lights or markings
- Silent (no radio emissions detected)
- Maintained altitude approximately 1,000 feet below our position

MANEUVERS OBSERVED

The object demonstrated flight characteristics inconsistent with known aircraft:

1. Instantaneous acceleration from stationary to estimated Mach 2+
2. 90-degree directional changes without banking or deceleration
3. Vertical ascent at impossible angles for conventional aircraft
4. Sudden disappearance (not gradual departure)

CREW OBSERVATIONS

Captain Michael Torres (24 years experience):
"In my decades of flying, I have never witnessed anything like this object. Its movements defied physics as I understand them."

First Officer Jennifer Walsh (8 years experience):
"The object appeared to be under intelligent control. It seemed to acknowledge our presence before departing."

Flight Attendant Lisa Chen:
"Several passengers also observed the object and took photographs on personal devices."

ATC COMMUNICATION

Denver Center was notified of the sighting at 10:25 MST. Air Traffic Controller reported no other aircraft in the vicinity on radar. Military liaison contacted but no information provided regarding testing activities.

PASSENGER IMPACT

Approximately 12 passengers observed the object and expressed concern. Crew provided standard reassurance while documenting contact information for potential follow-up interviews.

PHOTOGRAPHIC EVIDENCE

Three passengers captured images on mobile devices. Contact information collected for potential evidence gathering if required by authorities.

RECOMMENDATIONS

This sighting occurred in controlled airspace with multiple credible witnesses. Recommend:

1. Follow-up interviews with crew and passengers
2. Analysis of passenger photographs
3. Radar data review from Denver and Chicago centers
4. Coordination with military regarding any classified activities

The professional nature of the witnesses and the detailed observations warrant serious investigation of this incident.`,
    images: [
      {
        id: "img-ua2743-001",
        url: "/placeholder.svg",
        caption: "Flight path map showing sighting location over Eastern Colorado",
        classification: "confidential"
      }
    ],
    videos: [],
    attachments: [
      {
        id: "att-ua2743-001", 
        name: "Flight_Data_UA2743.csv",
        type: "text/csv",
        size: "234 KB",
        classification: "confidential"
      }
    ]
  },
  metadata: {
    tags: ["commercial-aviation", "pilot-sighting", "colorado", "2024"],
    relatedDocuments: ["DOC-2024-0134", "DOC-2024-0178"],
    caseFiles: ["AVIATION-SIGHTINGS-2024"],
    locations: ["Eastern Colorado", "Denver International Airport"],
    entities: ["Capt. Michael Torres", "FO Jennifer Walsh", "United Airlines"]
  },
  accessHistory: [
    {
      userId: "UID-7534",
      username: "m.torres",
      timestamp: new Date().toISOString(),
      action: "created"
    }
  ]
}

export const ConfidentialClassification: Story = {
  args: {
    document: confidentialDocument
  },
  parameters: {
    docs: {
      description: {
        story: 'Document viewer with CONFIDENTIAL classification showing commercial aviation sighting report. Demonstrates blue classification styling and different content format.'
      }
    }
  }
}

// Interactive story with state management
export const InteractiveDemo: Story = {
  render: () => {
    const [currentDoc, setCurrentDoc] = React.useState(0)
    const documents = [secretDocument, confidentialDocument]
    
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="text-[#adf0dd] font-mono text-lg">DOCUMENT VIEWER - INTERACTIVE DEMO</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDoc(0)}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  currentDoc === 0 
                    ? 'bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-300'
                }`}
              >
                SECRET DOC
              </button>
              <button
                onClick={() => setCurrentDoc(1)}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  currentDoc === 1 
                    ? 'bg-[#adf0dd]/20 text-[#adf0dd] border border-[#adf0dd]/30' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-300'
                }`}
              >
                CONFIDENTIAL DOC
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <ClassifiedDocumentViewer document={documents[currentDoc]} />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo allowing switching between different classified documents to see varying classification levels and content structures.'
      }
    }
  }
}

// Annotations focused story
export const AnnotationFocus: Story = {
  args: {
    document: {
      ...secretDocument,
      content: {
        ...secretDocument.content,
        text: `SAMPLE DOCUMENT FOR ANNOTATION TESTING

This is a shorter document specifically designed to test the annotation functionality. 

Select any text in this document to see the annotation menu appear. You can highlight important sections, underline key findings, or circle critical data points.

The annotation system integrates seamlessly with the TipTap editor workflow, allowing researchers to mark up classified documents for analysis and collaboration.

Try selecting different portions of text to see how the context menu positioning works across various locations in the document.`
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Focused example highlighting the text annotation capabilities. Document content is shortened to make testing annotations easier.'
      }
    }
  }
}