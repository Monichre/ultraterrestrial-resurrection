import type { GuidedTourDef } from './guided-tour-store'

/**
 * The flagship guided tour — the chronological spine of the modern UFO era.
 * Each waypoint is resolved against the live events table at tour start.
 */
export const FAMOUS_EVENTS_TOUR: GuidedTourDef = {
  mode: 'spine',
  id: 'famous-events-chronological',
  title: 'The Modern UFO Era',
  subtitle: 'A chronological journey through the events that shaped Disclosure',
  waypoints: [
    {
      searchQuery: 'Kenneth Arnold flying saucer',
      table: 'events',
      title: 'The Kenneth Arnold Sighting',
      year: '1947',
      narrative:
        'On June 24, 1947, pilot Kenneth Arnold reported nine crescent-shaped objects skipping "like saucers" near Mount Rainier. A reporter\'s paraphrase coined "flying saucer" — and the modern UFO era began. Within weeks, sightings swept the country.',
    },
    {
      searchQuery: 'Roswell incident crash debris',
      table: 'events',
      title: 'The Roswell Incident',
      year: '1947',
      narrative:
        'Two weeks after Arnold, the Roswell Army Air Field announced it had recovered a "flying disc" from a ranch near Corona, New Mexico — then retracted it within hours, claiming a weather balloon. Major Jesse Marcel, who handled the debris, disputed that story for the rest of his life.',
    },
    {
      searchQuery: 'Washington D.C. radar sightings jets 1952',
      table: 'events',
      title: 'The Washington D.C. Flap',
      year: '1952',
      narrative:
        'Over two July weekends in 1952, unknown objects appeared on radar at National Airport and Andrews AFB — simultaneously tracked by multiple installations while jets scrambled. It remains the most documented mass radar-visual case in history and triggered the CIA\'s Robertson Panel.',
    },
    {
      searchQuery: 'Betty Barney Hill abduction New Hampshire',
      table: 'events',
      title: 'The Hill Abduction',
      year: '1961',
      narrative:
        'Betty and Barney Hill\'s account of missing time on a New Hampshire road became the template for the abduction phenomenon: independent hypnotic recall, the famous "star map," and a two-hour gap neither could explain. The case moved the phenomenon from the sky into the witness.',
    },
    {
      searchQuery: 'Rendlesham Forest incident Bentwaters',
      table: 'events',
      title: 'Rendlesham Forest',
      year: '1980',
      narrative:
        'Over consecutive December nights, US Air Force personnel at the twin NATO bases of Bentwaters and Woodbridge tracked lights and a landed craft in Rendlesham Forest. Deputy base commander Lt. Col. Charles Halt recorded events live on tape — the "British Roswell," witnessed by trained military observers.',
    },
    {
      searchQuery: 'Phoenix Lights Arizona mass sighting',
      table: 'events',
      title: 'The Phoenix Lights',
      year: '1997',
      narrative:
        'Thousands of Arizonans — including Governor Fife Symington, who mocked it publicly and admitted privately years later — watched a silent V-shaped formation cross the state on March 13, 1997. It remains the largest mass sighting in American history.',
    },
    {
      searchQuery: 'Nimitz tic tac encounter Fravor',
      table: 'events',
      title: 'The Nimitz Encounter',
      year: '2004',
      narrative:
        'Off San Diego, Commander David Fravor and three other aviators from the USS Nimitz carrier group engaged a white "Tic Tac" object that outmaneuvered their F/A-18s and was tracked dropping 80,000 feet in seconds. The FLIR footage would surface 13 years later and change everything.',
    },
    {
      searchQuery: 'USS Theodore Roosevelt UFO Encounter',
      table: 'events',
      title: 'The Roosevelt Encounters & Disclosure',
      year: '2014–2017',
      narrative:
        'For months in 2014–15, F/A-18 crews from the USS Theodore Roosevelt tracked objects off the US East Coast nearly every day — the GIMBAL and GOFAST videos came from these flights. When the New York Times revealed the Pentagon\'s secret AATIP program in December 2017 alongside this footage, the subject moved from taboo to congressional hearings, and the modern Disclosure era began.',
    },
  ],
}

export const GUIDED_TOURS: GuidedTourDef[] = [FAMOUS_EVENTS_TOUR]
