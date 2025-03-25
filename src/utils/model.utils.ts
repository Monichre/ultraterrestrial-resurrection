export const objectMapToSingular: any = {
  events: 'event',
  testimonies: 'testimony',
  personnel: 'personnel',
  organizations: 'organization',
  topics: 'topic',

  // Add more mappings here as needed
}
export const objectMapPlural: any = {
  event: 'events',
  testimony: 'testimonies',
  personnel: 'personnel',
  'subject-matter-expert': 'personnel',
  organization: 'organizations',
  topic: 'topics',

  // Add more mappings here as needed
}

export const connectionMapByEntityType: any = {
  events: [
    { table: 'event-subject-matter-experts', target: 'event' },
    { table: 'event-topic-subject-matter-experts', target: 'event' },
    { table: 'testimonies', target: 'event' },
  ],
  testimonies: [{ table: 'topics-testimonies', target: 'testimony' }],
  personnel: [
    {
      table: 'event-subject-matter-experts',
      target: 'subject-matter-expert',
    },
    {
      table: 'event-topic-subject-matter-experts',
      target: 'subject-matter-expert',
    },
    { table: 'organization-members', target: 'member' },
    {
      table: 'topic-subject-matter-experts',
      target: 'subject-matter-expert',
    },
    { table: 'testimonies', target: 'witness' },
  ],
  organizations: [
    // #TODO: Might be more record relations here
    { table: 'organization-members', target: 'organization' },
  ],
  topics: [
    { table: 'topics-testimonies', target: 'topic' },
    { table: 'topic-subject-matter-experts', target: 'topic' },
    { table: 'event-topic-subject-matter-experts', target: 'topic' },
  ],
}

export function removeLeadingZero(str: string) {
  if (!str) return str
  if (str?.startsWith('0')) {
    return str.replace(/^0+/, '')
  }
  return str
}

export const extractUniqueYearsFromEvents = (events: any[]) => {
  const years = new Set()
  events.sort((a, b) => {
    const dateA = new Date(a.date)

    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
  for (let event of events) {
    // @ts-ignore
    const year: any = removeLeadingZero(event?.date?.split('-')[0])

    if (!years.has(year)) {
      years.add(year)
    }
  }

  return Array.from(years)
}
export const extractCoordinatesFromEvents = (
  events: any[],
  withEventData = false
) => {
  return events.map((event) => {
    const { latitude, longitude, id, ...rest } = event
    return withEventData
      ? {
          lat: latitude,
          lng: longitude,
          size: 0.1,
          color: '#79ffe1',
          ...rest,
        }
      : {
          location: [latitude, longitude],
          size: 0.02,
        }
  })
}

// Function to generate a random color in hex format
const randomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Function to generate dummy data for the card schema
export const locationToAngles = (lat, long) => {
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ]
}
