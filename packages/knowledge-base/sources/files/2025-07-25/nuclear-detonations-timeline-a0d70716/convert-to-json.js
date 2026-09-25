#!/usr/bin/env node
/**
 * Convert nuclear detonations timeline from fixed-width format to JSON
 * 
 * Format reference from the source file:
 * LINE 2 (main data):
 * - COLUMNS 1-6: DATE (yymmdd)
 * - COLUMNS 8-15: TIME (hhmmss.d)
 * - COLUMNS 17-18: TP (Testing Party)
 * - COLUMNS 19-21: SITE (Test site code)
 * - COLUMNS 23-26: TYPE (explosion type)
 * - COLUMNS 28-31: MAG mb (magnitude body wave)
 * - COLUMNS 33-36: MAG Ms (magnitude surface wave)
 * - COLUMNS 38-43: YIELD (kilotons)
 * - COLUMNS 45-52: LAT (latitude)
 * - COLUMNS 54-61: LON (longitude)
 * - COLUMNS 63: PU (Purpose)
 * - COLUMNS 64-67: ROCK (rock type)
 * - COLUMNS 68: water table indicator
 * - COLUMNS 69-76: NAME
 * - COLUMNS 77-80: SRC (Source reference)
 */

const fs = require('fs');
const path = require('path');

// Country/testing party codes
const testingParties = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CP': 'USSR/Russia',
  'FR': 'France',
  'IN': 'India',
  'PC': 'People\'s Republic of China',
  'IS': 'Israel (putative)'
};

// Test site codes (partial list from header)
const testSites = {
  'ANM': 'Alamogordo, New Mexico, USA',
  'HRJ': 'Hiroshima, Japan',
  'NGJ': 'Nagasaki, Japan',
  'BKN': 'Bikini Atoll',
  'ENW': 'Enwetak Atoll',
  'CNV': 'Central Nevada',
  'NTS': 'Nevada Test Site',
  'NTSF': 'Nevada Test Site',
  'FMT': 'Farmington, Colorado',
  'MBI': 'Monte Bello Islands, Australia',
};

// Explosion type codes
const explosionTypes = {
  'TOWR': 'Tower',
  'AIRD': 'Air Drop',
  'UNDW': 'Underwater',
  'SURF': 'Surface',
  'ATMO': 'Atmospheric',
  'SHFT': 'Shaft',
  'TUNN': 'Tunnel',
  'GALY': 'Gallery'
};

// Purpose codes
const purposes = {
  'W': 'Weapon',
  'P': 'Peaceful',
  'M': 'Military',
  'R': 'Research',
  'E': 'Effects',
  'S': 'Safety'
};

// Device type codes
const deviceTypes = {
  'U': 'Fission (U235 primary)',
  'P': 'Fission (Pu239 primary)',
  'I': 'Fission (unknown mix)',
  'B': 'Boosted',
  '2': 'Two-stage fusion'
};

// Rock type codes
const rockTypes = {
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
};

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim().length === 0) return null;
  
  const yy = dateStr.substring(0, 2);
  const mm = dateStr.substring(2, 4);
  const dd = dateStr.substring(4, 6);
  
  // Convert 2-digit year (19xx or 20xx)
  const year = parseInt(yy) < 50 ? 2000 + parseInt(yy) : 1900 + parseInt(yy);
  
  return `${year}-${mm}-${dd}`;
}

function parseTime(timeStr) {
  if (!timeStr || timeStr.trim().length === 0) return null;
  
  const hh = timeStr.substring(0, 2);
  const mm = timeStr.substring(2, 4);
  const ss = timeStr.substring(4);
  
  return `${hh}:${mm}:${ss}`;
}

function parseCoordinate(coordStr) {
  if (!coordStr || coordStr.trim().length === 0) return null;
  
  coordStr = coordStr.trim();
  
  // Extract direction (N, S, E, W)
  const direction = coordStr.slice(-1);
  const value = parseFloat(coordStr.slice(0, -1));
  
  if (isNaN(value)) return null;
  
  // Convert to signed decimal
  if (direction === 'S' || direction === 'W') {
    return -value;
  }
  return value;
}

function parseYield(yieldStr) {
  if (!yieldStr || yieldStr.trim().length === 0) return null;
  
  yieldStr = yieldStr.trim();
  
  // Handle range (e.g., "10-20")
  if (yieldStr.includes('-')) {
    const parts = yieldStr.split('-');
    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);
    return {
      min,
      max,
      estimate: (min + max) / 2
    };
  }
  
  // Handle comparison operators
  if (yieldStr.startsWith('<')) {
    return {
      max: parseFloat(yieldStr.substring(1)),
      estimate: parseFloat(yieldStr.substring(1))
    };
  }
  
  if (yieldStr.startsWith('>')) {
    return {
      min: parseFloat(yieldStr.substring(1)),
      estimate: parseFloat(yieldStr.substring(1))
    };
  }
  
  const value = parseFloat(yieldStr);
  return isNaN(value) ? null : value;
}

function parseLine(line, lineNumber) {
  // Skip header lines and empty lines
  if (lineNumber < 273 || line.length < 70) {
    return null;
  }
  
  // Skip lines that don't start with a date pattern
  if (!/^\d{6}/.test(line)) {
    return null;
  }
  
  try {
    const dateStr = line.substring(0, 6).trim();
    const timeStr = line.substring(7, 15).trim();
    const testingParty = line.substring(16, 18).trim();
    const site = line.substring(18, 22).trim();
    const type = line.substring(22, 26).trim();
    const magMb = line.substring(27, 31).trim();
    const magMs = line.substring(32, 36).trim();
    const yieldStr = line.substring(37, 43).trim();
    const latStr = line.substring(44, 52).trim();
    const lonStr = line.substring(53, 61).trim();
    const purpose = line.substring(62, 63).trim();
    const deviceType = line.substring(63, 65).trim();
    const rock = line.substring(65, 67).trim();
    const waterTable = line.substring(67, 68).trim();
    const name = line.substring(68, 76).trim();
    const source = line.substring(76, 80).trim();
    
    const date = parseDate(dateStr);
    const time = parseTime(timeStr);
    const isPutative = name.startsWith('*');
    
    return {
      id: `${dateStr}-${name.replace(/\*/g, '').replace(/\s+/g, '-')}`,
      date,
      time,
      dateTime: date && time ? `${date}T${time}Z` : null,
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
        bodyWave: magMb ? parseFloat(magMb) : null,
        surfaceWave: magMs ? parseFloat(magMs) : null
      },
      yield: {
        kilotons: parseYield(yieldStr),
        unit: 'kt'
      },
      location: {
        latitude: parseCoordinate(latStr),
        longitude: parseCoordinate(lonStr)
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
      name: name.replace(/\*/g, ''),
      isPutative,
      source: source,
      rawLine: line
    };
  } catch (error) {
    console.error(`Error parsing line ${lineNumber}:`, error.message);
    return null;
  }
}

function convertToJSON() {
  const inputFile = path.join(__dirname, 'nuclear-detonations-timeline.md');
  const outputFile = path.join(__dirname, 'nuclear-detonations-timeline.json');
  
  console.log('Reading file:', inputFile);
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split('\n');
  
  const explosions = [];
  let lineNumber = 0;
  
  for (const line of lines) {
    lineNumber++;
    const explosion = parseLine(line, lineNumber);
    if (explosion) {
      explosions.push(explosion);
    }
  }
  
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
    testingParties,
    testSites,
    explosionTypes,
    purposes,
    deviceTypes,
    rockTypes,
    explosions
  };
  
  console.log(`Parsed ${explosions.length} nuclear explosions`);
  console.log('Writing to:', outputFile);
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log('✅ Conversion complete!');
  console.log(`📊 Total explosions: ${explosions.length}`);
  
  // Summary statistics
  const byCountry = {};
  const byType = {};
  const byDecade = {};
  
  for (const exp of explosions) {
    // By country
    const country = exp.testingParty.name;
    byCountry[country] = (byCountry[country] || 0) + 1;
    
    // By type
    const type = exp.type.name;
    byType[type] = (byType[type] || 0) + 1;
    
    // By decade
    if (exp.date) {
      const year = parseInt(exp.date.substring(0, 4));
      const decade = `${Math.floor(year / 10) * 10}s`;
      byDecade[decade] = (byDecade[decade] || 0) + 1;
    }
  }
  
  console.log('\n📈 Summary Statistics:');
  console.log('\nBy Country:');
  Object.entries(byCountry).sort((a, b) => b[1] - a[1]).forEach(([country, count]) => {
    console.log(`  ${country}: ${count}`);
  });
  
  console.log('\nBy Type:');
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log('\nBy Decade:');
  Object.entries(byDecade).sort().forEach(([decade, count]) => {
    console.log(`  ${decade}: ${count}`);
  });
}

// Run the conversion
convertToJSON();

