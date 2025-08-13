'use client'

export default function TechnicalDiagramDocument() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-8 font-mono'>
      <div className='max-w-4xl mx-auto'>
        {/* Document Container */}
        <div
          className='relative bg-white p-8 shadow-2xl border border-gray-300'
          style={{filter: 'contrast(1.2) brightness(0.95)'}}>
          {/* Paper texture and aging */}
          <div className='absolute inset-0 opacity-10 pointer-events-none'>
            <div className='absolute top-8 right-16 w-20 h-20 bg-gray-600 rounded-full blur-lg'></div>
            <div className='absolute bottom-20 left-12 w-12 h-12 bg-gray-500 rounded-full blur-md'></div>
            <div className='absolute top-32 left-8 w-6 h-32 bg-gray-400 rounded-sm blur-sm'></div>
          </div>

          {/* Header - Partially redacted */}
          <div className='text-center mb-8'>
            <div className='text-sm text-black tracking-wider mb-2'>
              <span className='bg-black text-black px-8'>XXXXXXXX</span> OTC{' '}
              <span className='bg-black text-black px-4'>XXXX</span> CLEARANTHIS{' '}
              <span className='bg-black text-black px-4'>XXX</span>
            </div>
            <div className='text-sm text-black tracking-wider mb-2'>
              <span className='bg-black text-black px-8'>XXXXXXXXXXXXXXX</span>{' '}
              <span className='bg-black text-black px-6'>XXXXX</span>
            </div>
          </div>

          {/* Main Technical Diagram */}
          <div className='relative h-96 border-2 border-gray-800 mb-8'>
            <svg className='w-full h-full' viewBox='0 0 800 400'>
              {/* Grid background */}
              <defs>
                <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
                  <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e5e5e5' strokeWidth='0.5' />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill='url(#grid)' />

              {/* Technical annotations scattered around */}
              <text x='50' y='40' className='text-xs fill-black font-mono'>
                NEDEPOCS
              </text>
              <text x='150' y='60' className='text-xs fill-black font-mono'>
                MENTS QUAD
              </text>

              <text x='320' y='30' className='text-xs fill-black font-mono'>
                COORDINATOR
              </text>
              <text x='320' y='45' className='text-xs fill-black font-mono'>
                MEASUREMENTS
              </text>

              <text x='600' y='50' className='text-xs fill-black font-mono'>
                FLIGHT
              </text>

              {/* Diagonal lines and connections */}
              <line x1='100' y1='80' x2='200' y2='120' stroke='black' strokeWidth='1' />
              <line x1='200' y1='120' x2='350' y2='100' stroke='black' strokeWidth='1' />
              <line x1='350' y1='100' x2='500' y2='140' stroke='black' strokeWidth='1' />
              <line x1='500' y1='140' x2='650' y2='90' stroke='black' strokeWidth='1' />

              {/* Central technical elements */}
              <text x='80' y='120' className='text-xs fill-black font-mono'>
                CLEARLY SIM
              </text>
              <text x='80' y='140' className='text-xs fill-black font-mono'>
                OCEAAS DID
              </text>

              <text x='550' y='120' className='text-xs fill-black font-mono'>
                TEDCSTADCD
              </text>
              <text x='580' y='135' className='text-xs fill-black font-mono'>
                70.30
              </text>
              <text x='640' y='120' className='text-xs fill-black font-mono'>
                ANALYSIS
              </text>
              <text x='680' y='135' className='text-xs fill-black font-mono'>
                RJA
              </text>
              <text x='700' y='150' className='text-xs fill-black font-mono'>
                FUS
              </text>

              {/* More technical annotations */}
              <text x='450' y='180' className='text-xs fill-black font-mono'>
                REXAT3300
              </text>

              <text x='200' y='200' className='text-xs fill-black font-mono'>
                SUPERNUMERARY FOR. A
              </text>
              <text x='650' y='200' className='text-xs fill-black font-mono'>
                LAD
              </text>
              <text x='620' y='215' className='text-xs fill-black font-mono'>
                TO
              </text>
              <text x='550' y='230' className='text-xs fill-black font-mono'>
                UPBRENT
              </text>

              {/* Central coordinate system */}
              <line x1='250' y1='200' x2='450' y2='200' stroke='black' strokeWidth='2' />
              <line x1='350' y1='150' x2='350' y2='250' stroke='black' strokeWidth='2' />

              {/* Curved tracking lines */}
              <path
                d='M 150 250 Q 250 200 350 220 Q 450 240 550 200'
                fill='none'
                stroke='black'
                strokeWidth='1'
                strokeDasharray='3,3'
              />
              <path
                d='M 200 280 Q 300 240 400 260 Q 500 280 600 240'
                fill='none'
                stroke='black'
                strokeWidth='1'
                strokeDasharray='3,3'
              />

              {/* Technical labels */}
              <text x='120' y='280' className='text-xs fill-black font-mono'>
                RETJ APPARATUS PER
              </text>
              <text x='120' y='300' className='text-xs fill-black font-mono'>
                EXABES TET
              </text>
              <text x='180' y='320' className='text-xs fill-black font-mono'>
                FRIDAY
              </text>

              <text x='450' y='280' className='text-xs fill-black font-mono'>
                COINCIDENT
              </text>
              <text x='520' y='300' className='text-xs fill-black font-mono'>
                MODULES
              </text>

              {/* Bottom technical data */}
              <text x='50' y='350' className='text-xs fill-black font-mono'>
                AERECHT
              </text>
              <text x='150' y='350' className='text-xs fill-black font-mono'>
                TEATLED
              </text>
              <text x='250' y='350' className='text-xs fill-black font-mono'>
                TEAR.L
              </text>
              <text x='450' y='350' className='text-xs fill-black font-mono'>
                EVIDENCE
              </text>

              {/* Coordinate markers */}
              <circle cx='200' cy='180' r='3' fill='black' />
              <circle cx='350' cy='200' r='3' fill='black' />
              <circle cx='500' cy='220' r='3' fill='black' />
            </svg>
          </div>

          {/* Bottom Section */}
          <div className='border-t-2 border-gray-800 pt-4'>
            <div className='flex justify-between items-start'>
              <div className='text-xs text-black space-y-2'>
                <p>FormInited</p>
                <p className='bg-black text-black px-16'>XXXXXXXXXXXXXX</p>
                <p>CRABYURA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; INOOCHKA</p>
                <p>ZYRYRDUMA TUAA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; XEPTEXAB</p>
              </div>

              <div className='text-xs text-black text-right space-y-1'>
                <p>INTERESUCCI TEAAHA, RESLICL AAR TO CLASTIRGI C ISI</p>
                <p>AMERICASCO INOSRASASELL CCAP.ROOD COM THOGI HATERED</p>
                <p>DXTEACSAIA A CAPO EEMELLS Y</p>
              </div>
            </div>

            <div className='mt-6 text-center'>
              <div className='flex justify-between text-xs text-black'>
                <span>ON DLL CCARD LELLAIDPCOECT</span>
                <span>LIA ACD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
