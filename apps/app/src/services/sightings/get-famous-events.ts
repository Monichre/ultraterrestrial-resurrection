import { xata } from '@/db/xata/client';

/**
 * Fetch famous events chronologically for the guided tour
 * @param limit Maximum number of records to return
 */
export async function getFamousEventsChronologically(limit: number = 50) {
  try {
    // Query events that are marked as famous or historically significant
    const famousEvents = await xata.db.events
      .filter({
        $any: [
          { category: { $is: 'famous' } },
          { significance: { $is: 'high' } },
          { historical_importance: { $is: true } }
        ]
      })
      .sort('date', 'asc') // Chronological order
      .getPaginated({
        pagination: {
          size: limit
        }
      });

    return famousEvents.records;
  } catch (error) {
    console.error('Error fetching famous events:', error);
    return [];
  }
}

/**
 * Get key historical UFO events for the default guided tour
 * Hardcoded list of famous events if database query doesn't work
 */
export async function getDefaultFamousEvents() {
  // First try to get from database
  const dbEvents = await getFamousEventsChronologically();
  
  if (dbEvents.length > 0) {
    return dbEvents;
  }

  // Fallback to hardcoded famous events for the tour
  const famousEventsList = [
    {
      id: 'roswell-1947',
      title: 'Roswell Incident',
      date: new Date('1947-07-08'),
      location: 'Roswell, New Mexico',
      description: 'The most famous UFO incident in history',
      category: 'famous',
      year: 1947
    },
    {
      id: 'kenneth-arnold-1947',
      title: 'Kenneth Arnold Sighting',
      date: new Date('1947-06-24'),
      location: 'Mount Rainier, Washington',
      description: 'The sighting that coined the term "flying saucer"',
      category: 'famous',
      year: 1947
    },
    {
      id: 'washington-dc-1952',
      title: 'Washington D.C. UFO Incident',
      date: new Date('1952-07-19'),
      location: 'Washington, D.C.',
      description: 'UFOs over the nation\'s capital',
      category: 'famous',
      year: 1952
    },
    {
      id: 'betty-barney-hill-1961',
      title: 'Betty and Barney Hill Abduction',
      date: new Date('1961-09-19'),
      location: 'New Hampshire',
      description: 'First widely publicized alien abduction case',
      category: 'famous',
      year: 1961
    },
    {
      id: 'rendlesham-forest-1980',
      title: 'Rendlesham Forest Incident',
      date: new Date('1980-12-26'),
      location: 'Suffolk, England',
      description: 'Britain\'s Roswell',
      category: 'famous',
      year: 1980
    },
    {
      id: 'phoenix-lights-1997',
      title: 'Phoenix Lights',
      date: new Date('1997-03-13'),
      location: 'Phoenix, Arizona',
      description: 'Mass UFO sighting witnessed by thousands',
      category: 'famous',
      year: 1997
    },
    {
      id: 'tic-tac-2004',
      title: 'USS Nimitz Tic Tac Encounter',
      date: new Date('2004-11-14'),
      location: 'Pacific Ocean',
      description: 'Navy pilots encounter "Tic Tac" shaped UFO',
      category: 'famous',
      year: 2004
    },
    {
      id: 'pentagon-videos-2017',
      title: 'Pentagon UAP Videos Release',
      date: new Date('2017-12-16'),
      location: 'United States',
      description: 'Official release of military UAP footage',
      category: 'famous',
      year: 2017
    },
    {
      id: 'congressional-hearing-2022',
      title: 'Congressional UAP Hearing',
      date: new Date('2022-05-17'),
      location: 'Washington, D.C.',
      description: 'First public congressional hearing on UAPs in 50 years',
      category: 'famous',
      year: 2022
    }
  ];

  return famousEventsList;
}

/**
 * Get famous events grouped by era for tour navigation
 */
export async function getFamousEventsByEra() {
  const events = await getDefaultFamousEvents();
  
  const eras = {
    'Post-War Genesis (1945-1950)': [],
    'Government Investigation Era (1950-1970)': [],
    'Civilian Research Era (1970-1990)': [],
    'Modern Research Era (1990-2010)': [],
    'Disclosure Era (2010-Present)': []
  };

  events.forEach(event => {
    const year = event.date ? new Date(event.date).getFullYear() : event.year;
    
    if (year >= 1945 && year <= 1950) {
      eras['Post-War Genesis (1945-1950)'].push(event);
    } else if (year > 1950 && year <= 1970) {
      eras['Government Investigation Era (1950-1970)'].push(event);
    } else if (year > 1970 && year <= 1990) {
      eras['Civilian Research Era (1970-1990)'].push(event);
    } else if (year > 1990 && year <= 2010) {
      eras['Modern Research Era (1990-2010)'].push(event);
    } else if (year > 2010) {
      eras['Disclosure Era (2010-Present)'].push(event);
    }
  });

  return eras;
}