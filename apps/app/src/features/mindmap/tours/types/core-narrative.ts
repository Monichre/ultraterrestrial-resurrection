/**
 * Core Narrative Tour Types
 * 
 * Simple sequential tour through the fundamental UFO disclosure narrative
 * starting from Roswell 1947 and moving chronologically forward
 */

export interface CoreNarrativeTour {
  id: string
  title: string
  description: string
  events: NarrativeEvent[]
}

export interface NarrativeEvent {
  id: string
  title: string
  year: number
  description: string
  // Database reference to the actual event record
  eventId: string
  // What related entities to load when this event is reached
  loadRelated: {
    personnel?: boolean
    organizations?: boolean
    documents?: boolean
    topics?: boolean
  }
}

export interface CoreNarrativeProgress {
  tourId: string
  currentEventIndex: number
  completedEvents: string[]
  startedAt: string
}

/**
 * The core UFO disclosure narrative tour
 * Starts at Roswell and moves chronologically through major events
 */
export const CORE_UFO_NARRATIVE: CoreNarrativeTour = {
  id: 'core-ufo-narrative',
  title: 'The Core UFO Narrative',
  description: 'A chronological journey through the major events that shaped UFO disclosure, from Roswell 1947 to the present day.',
  events: [
    {
      id: 'roswell-1947',
      title: 'The Roswell Incident (1947)',
      year: 1947,
      description: 'The crashed "weather balloon" that became the foundation of modern UFO lore and disclosure demands.',
      eventId: 'roswell-1947',
      loadRelated: {
        personnel: true,
        organizations: true,
        documents: true
      }
    },
    {
      id: 'project-blue-book-start',
      title: 'Project Blue Book Begins (1952)',
      year: 1952,
      description: 'The Air Force establishes systematic UFO investigation, marking official government acknowledgment.',
      eventId: 'project-blue-book-1952',
      loadRelated: {
        personnel: true,
        organizations: true
      }
    },
    {
      id: 'condon-report',
      title: 'The Condon Report (1968)',
      year: 1968,
      description: 'Scientific study concludes UFOs pose no threat, leading to Project Blue Book closure.',
      eventId: 'condon-report-1968',
      loadRelated: {
        personnel: true,
        documents: true
      }
    },
    {
      id: 'pentagon-videos',
      title: 'Pentagon UAP Videos Released (2017)',
      year: 2017,
      description: 'The modern disclosure era begins with official release of Navy UAP encounter videos.',
      eventId: 'pentagon-uap-videos-2017',
      loadRelated: {
        personnel: true,
        organizations: true,
        documents: true,
        topics: true
      }
    },
    {
      id: 'uap-report',
      title: 'Official UAP Report to Congress (2021)',
      year: 2021,
      description: 'Government acknowledges UAPs are real and pose potential national security concerns.',
      eventId: 'uap-report-2021',
      loadRelated: {
        personnel: true,
        organizations: true,
        documents: true
      }
    }
  ]
}