/**
 * Convert nuclear detonations timeline from fixed-width format to JSON
 */

import { readFileSync, writeFileSync } from 'fs'

interface NuclearExplosion {
  id: string
  date: string | null
  time: string | null
  dateTime: string | null
  testingParty: {
    code: string
    name: string
  }
  site: {
    code: string
    name: string
  }
  type: {
    code: string
    name: string
  }
  magnitude: {
    bodyWave: number | null
    surfaceWave: number | null
  }
  yield: {
    kilotons: number | { min?: number; max?: number; estimate: number } | null
    unit: string
  }
  location: {
    latitude: number | null
    longitude: number | null
  }
  purpose: {
    code: string
    name: string
  }
  device: {
    type: string
    description: string
  }
  geology: {
    rock: {
      code: string
      name: string
    }
    waterTable: 'above' | 'below' | null
  }
  name: string
  isPutative: boolean
  source: string
}

// Reference data
const testingParties: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CP': 'USSR/Russia',
  'FR': 'France',
  'IN': 'India',
  'PC': 'People\'s Republic of China',
  'IS': 'Israel (putative)'
}

const testSites: Record<string, string> = {
  'ANM': 'Alamogordo, New Mexico, USA',
  'HRJ': 'Hiroshima, Japan',
  'NGJ': 'Nagasaki, Japan',
  'BKN': 'Bikini Atoll',
  'ENW': 'Enwetak Atoll',
  'CNV': 'Central Nevada',
  'NTS': 'Nevada Test Site',
  'NTSF': 'Nevada Test Site',
}

const explosionTypes: Record<string, string> = {
  'TOWR': 'Tower',
  'AIRD': 'Air Drop',
  'UNDW': 'Underwater',
  'SURF': 'Surface',
  'ATMO': 'Atmospheric',
  'SHFT': 'Shaft',
  'TUNN': 'Tunnel',
  'GALY': 'Gallery'
}

const purposes: Record<string, string> = {
  'W': 'Weapon',
  'P': 'Peaceful',
  'M': 'Military',
  'R': 'Research',
  'E': 'Effects',
  'S': 'Safety'
}

const deviceTypes: Record<string, string> = {
  'U': 'Fission (U235 primary)',
  'P': 'Fission (Pu239 primary)',
  'I': 'Fission (unknown mix)',
  'B': 'Boosted',
  '2': 'Two-stage fusion'
}

const rockTypes: Record<string, string> = {
  'GR': 'Granite',
  'QP': 'Quartz porphyrite',
  'SA': 'Sandstone',
  'AL': 'Aleurolite (siltstone)',
  'PO': 'Porphyrite',
  'QS': 'Quartz syenite',
  'GS': 'Gritstone',
  'AR': 'Argillite (mudstone)',
  'CO': 'Conglomerate',
  'TS': 'Tuffaceous sandstone',
  'SL': 'Salt'
}

function parseDate( dateStr: string ): string | null {
  if ( !dateStr || dateStr.trim().length === 0 ) return null

  const yy = dateStr.substring( 0, 2 )
  const mm = dateStr.substring( 2, 4 )
  const dd = dateStr.substring( 4, 6 )

  const year = parseInt( yy ) < 50 ? 2000 + parseInt( yy ) : 1900 + parseInt( yy )

  return `${year}-${mm}-${dd}`
}

function parseTime( timeStr: string ): string | null {
  if ( !timeStr || timeStr.trim().length === 0 ) return null

  const hh = timeStr.substring( 0, 2 )
  const mm = timeStr.substring( 2, 4 )
  const ss = timeStr.substring( 4 )

  return `${hh}:${mm}:${ss}`
}

function parseCoordinate( coordStr: string ): number | null {
  if ( !coordStr || coordStr.trim().length === 0 ) return null

  coordStr = coordStr.trim()
  const direction = coordStr.slice( -1 )
  const value = parseFloat( coordStr.slice( 0, -1 ) )

  if ( isNaN( value ) ) return null

  if ( direction === 'S' || direction === 'W' ) {
    return -value
  }
  return value
}

function parseYield( yieldStr: string ): number | { min?: number; max?: number; estimate: number } | null {
  if ( !yieldStr || yieldStr.trim().length === 0 ) return null

  yieldStr = yieldStr.trim()

  if ( yieldStr.includes( '-' ) ) {
    const parts = yieldStr.split( '-' )
    const min = parseFloat( parts[0] )
    const max = parseFloat( parts[1] )
    return { min, max, estimate: ( min + max ) / 2 }
  }

  if ( yieldStr.startsWith( '<' ) ) {
    const val = parseFloat( yieldStr.substring( 1 ) )
    return { max: val, estimate: val }
  }

  if ( yieldStr.startsWith( '>' ) ) {
    const val = parseFloat( yieldStr.substring( 1 ) )
    return { min: val, estimate: val }
  }

  const value = parseFloat( yieldStr )
  return isNaN( value ) ? null : value
}

function parseLine( line: string, lineNumber: number ): NuclearExplosion | null {
  if ( lineNumber < 273 || line.length < 70 ) return null
  if ( !/^\d{6}/.test( line ) ) return null

  try {
    const dateStr = line.substring( 0, 6 ).trim()
    const timeStr = line.substring( 7, 15 ).trim()
    const testingParty = line.substring( 16, 18 ).trim()
    const site = line.substring( 18, 22 ).trim()
    const type = line.substring( 22, 26 ).trim()
    const magMb = line.substring( 27, 31 ).trim()
    const magMs = line.substring( 32, 36 ).trim()
    const yieldStr = line.substring( 37, 43 ).trim()
    const latStr = line.substring( 44, 52 ).trim()
    const lonStr = line.substring( 53, 61 ).trim()
    const purpose = line.substring( 62, 63 ).trim()
    const deviceType = line.substring( 63, 65 ).trim()
    const rock = line.substring( 65, 67 ).trim()
    const waterTable = line.substring( 67, 68 ).trim()
    const name = line.substring( 68, 76 ).trim()
    const source = line.substring( 76, 80 ).trim()

    const date = parseDate( dateStr )
    const time = parseTime( timeStr )
    const isPutative = name.startsWith( '*' )

    return {
      id: `${dateStr}-${name.replace( /\*/g, '' ).replace( /\s+/g, '-' )}`,
      date,
      time,
      dateTime: date && time ? `${date}T${time}Z` : date ? `${date}T00:00:00Z` : null,
      testingParty: {
        code: testingParty,
        name: testingParties[testingParty] || testingParty
      },
      site: {
        code: site,
        name: testSites[site] || site
      },
      type: {
        code: type,
        name: explosionTypes[type] || type
      },
      magnitude: {
        bodyWave: magMb ? parseFloat( magMb ) : null,
        surfaceWave: magMs ? parseFloat( magMs ) : null
      },
      yield: {
        kilotons: parseYield( yieldStr ),
        unit: 'kt'
      },
      location: {
        latitude: parseCoordinate( latStr ),
        longitude: parseCoordinate( lonStr )
      },
      purpose: {
        code: purpose,
        name: purposes[purpose] || purpose
      },
      device: {
        type: deviceType,
        description: deviceTypes[deviceType] || deviceType
      },
      geology: {
        rock: {
          code: rock,
          name: rockTypes[rock] || rock
        },
        waterTable: waterTable === '+' ? 'above' : waterTable === '-' ? 'below' : null
      },
      name: name.replace( /\*/g, '' ),
      isPutative,
      source
    }
  } catch ( error ) {
    console.error( `Error parsing line ${lineNumber}:`, error )
    return null
  }
}

function main() {
  const inputFile = 'nuclear-detonations-timeline.md'
  const outputFile = 'nuclear-detonations-timeline.json'

  console.log( '📖 Reading file:', inputFile )
  const content = readFileSync( inputFile, 'utf-8' )
  const lines = content.split( '\n' )

  console.log( `📊 Processing ${lines.length} lines...` )

  const explosions: NuclearExplosion[] = []

  lines.forEach( ( line, index ) => {
    const explosion = parseLine( line, index + 1 )
    if ( explosion ) {
      explosions.push( explosion )
    }
  } )

  const output = {
    metadata: {
      title: 'Catalog of Known and Putative Nuclear Explosions',
      compiler: 'James E. Lawson Jr.',
      source: 'Oklahoma Geological Survey Observatory',
      lastModified: '1996-08-05',
      url: 'gopher://wealaka.okgeosurvey1.gov:70/00/nuke.cat/nuke.cat.under.construction',
      disclaimer: 'Compiled from unclassified widely accepted sources',
      totalExplosions: explosions.length,
      generatedAt: new Date().toISOString()
    },
    reference: {
      testingParties,
      testSites,
      explosionTypes,
      purposes,
      deviceTypes,
      rockTypes
    },
    explosions
  }

  console.log( `✅ Parsed ${explosions.length} nuclear explosions` )
  console.log( '💾 Writing to:', outputFile )

  writeFileSync( outputFile, JSON.stringify( output, null, 2 ), 'utf-8' )

  console.log( '✨ Conversion complete!' )

  // Statistics
  const byCountry: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const byDecade: Record<string, number> = {}

  explosions.forEach( exp => {
    const country = exp.testingParty.name
    byCountry[country] = ( byCountry[country] || 0 ) + 1

    const type = exp.type.name
    byType[type] = ( byType[type] || 0 ) + 1

    if ( exp.date ) {
      const year = parseInt( exp.date.substring( 0, 4 ) )
      const decade = `${Math.floor( year / 10 ) * 10}s`
      byDecade[decade] = ( byDecade[decade] || 0 ) + 1
    }
  } )

  console.log( '\n📈 Summary Statistics:\n' )
  console.log( 'By Country:' )
  Object.entries( byCountry )
    .sort( ( a, b ) => b[1] - a[1] )
    .forEach( ( [country, count] ) => {
      console.log( `  ${country}: ${count}` )
    } )

  console.log( '\nBy Type:' )
  Object.entries( byType )
    .sort( ( a, b ) => b[1] - a[1] )
    .forEach( ( [type, count] ) => {
      console.log( `  ${type}: ${count}` )
    } )

  console.log( '\nBy Decade:' )
  Object.entries( byDecade )
    .sort()
    .forEach( ( [decade, count] ) => {
      console.log( `  ${decade}: ${count}` )
    } )
}

main();

