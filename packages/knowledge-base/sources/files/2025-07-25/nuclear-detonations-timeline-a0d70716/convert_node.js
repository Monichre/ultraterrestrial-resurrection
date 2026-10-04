const fs = require('fs')

function parseDate(s) {
  if (!s || !s.trim()) return null
  const yy = s.slice(0, 2)
  const mm = s.slice(2, 4)
  const dd = s.slice(4, 6)
  const year = parseInt(yy, 10) < 50 ? 2000 + parseInt(yy, 10) : 1900 + parseInt(yy, 10)
  return 
}

function parseTime(s) {
  if (!s || !s.trim()) return null
  const hh = s.slice(0, 2)
  const mm = s.slice(2, 4)
  const ss = s.slice(4)
  return 
}

function parseCoord(s) {
  if (!s || !s.trim()) return null
  s = s.trim()
  const dir = s.slice(-1)
  const val = parseFloat(s.slice(0, -1))
  if (isNaN(val)) return null
  return dir === 'S' || dir === 'W' ? -val : val
}

function parseYield(s) {
  if (!s || !s.trim()) return null
  s = s.trim()
  if (s.includes('-')) {
    const [a, b] = s.split('-')
    const min = parseFloat(a)
    const max = parseFloat(b)
    return { min, max, estimate: (min + max) / 2 }
  }
  if (s[0] === '<') {
    const v = parseFloat(s.slice(1))
    return { max: v, estimate: v }
  }
  if (s[0] === '>') {
    const v = parseFloat(s.slice(1))
    return { min: v, estimate: v }
  }
  const v = parseFloat(s)
  return isNaN(v) ? null : v
}

function main() {
  const base = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/knowledge-base/sources/files/2025-07-25/nuclear-detonations-timeline-a0d70716'
  const input = base + '/nuclear-detonations-timeline.md'
  const output = base + '/nuclear-detonations-timeline.json'

  const lines = fs.readFileSync(input, 'utf8').split('\n')

  const explosions = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (i + 1 < 273) continue
    if (!line || line.length < 10) continue
    if (!/^\d{6}/.test(line)) continue

    const dateStr = line.slice(0, 6).trim()
    const timeStr = line.slice(7, 15).trim()
    const tp = line.slice(16, 18).trim()
    const site = line.slice(18, 22).trim()
    const type = line.slice(22, 26).trim()
    const magMb = line.slice(27, 31).trim()
    const magMs = line.slice(32, 36).trim()
    const yld = line.slice(37, 43).trim()
    const lat = line.slice(44, 52).trim()
    const lon = line.slice(53, 61).trim()
    const purpose = line.slice(62, 63).trim()
    const device = line.slice(63, 65).trim()
    const rock = line.slice(65, 67).trim()
    const water = line.slice(67, 68).trim()
    const name = line.slice(68, 76).trim()
    const src = line.slice(76, 80).trim()

    const date = parseDate(dateStr)
    const time = parseTime(timeStr)

    explosions.push({
      id: ,
      date,
      time,
      dateTime: date ? (time ?  : ) : null,
      testingParty: { code: tp },
      site: { code: site },
      type: { code: type },
      magnitude: {
        bodyWave: magMb ? parseFloat(magMb) : null,
        surfaceWave: magMs ? parseFloat(magMs) : null
      },
      yield: { kilotons: parseYield(yld), unit: 'kt' },
      location: { latitude: parseCoord(lat), longitude: parseCoord(lon) },
      purpose: { code: purpose },
      device: { type: device },
      geology: {
        rock: { code: rock },
        waterTable: water === '+' ? 'above' : water === '-' ? 'below' : null
      },
      name: name.replace(/\*/g, ''),
      isPutative: name.startsWith('*'),
      source: src,
      rawLine: line
    })
  }

  const outObj = {
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
    explosions
  }

  fs.writeFileSync(output, JSON.stringify(outObj, null, 2))
  console.log('Wrote', output, 'with', explosions.length, 'records')
}

main()
