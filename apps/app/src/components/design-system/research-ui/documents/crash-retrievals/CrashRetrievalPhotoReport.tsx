import {ImageWithFallback} from './figma/ImageWithFallback'

export default function UfoDocument() {
  return (
    <div className='relative w-full h-screen bg-zinc-50 overflow-hidden'>
      {/* Grid System Overlay */}
      <div className='absolute inset-0 opacity-3'>
        <div className='grid grid-cols-24 grid-rows-16 h-full w-full'>
          {Array.from({length: 384}).map((_, i) => (
            <div key={i} className='border border-zinc-200'></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 p-8'>
        {/* Document Header */}
        <div className='grid grid-cols-12 gap-6 mb-8 border-b border-zinc-300 pb-6'>
          {/* Classification */}
          <div className='col-span-3'>
            <div className='border-l-4 border-red-600 pl-4'>
              <div className='text-xs tracking-[0.3em] text-red-600 mb-1'>CLASSIFIED</div>
              <div className='text-xs text-zinc-500'>LEVEL: RESTRICTED</div>
            </div>
          </div>

          {/* Document Title */}
          <div className='col-span-6 text-center'>
            <h1 className='text-3xl tracking-[0.1em] text-zinc-900 mb-2'>INCIDENT REPORT</h1>
            <div className='text-sm text-zinc-600'>UNIDENTIFIED AERIAL PHENOMENON</div>
            <div className='text-xs text-zinc-500 mt-1'>REF: UAP-2024-001A</div>
          </div>

          {/* Document Info */}
          <div className='col-span-3 text-right'>
            <div className='text-xs text-zinc-500 space-y-1'>
              <div>DATE: 15.07.2024</div>
              <div>TIME: 14:30 UTC</div>
              <div>FILE: 11/2024</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-12 gap-8'>
          {/* Left Sidebar - Technical Data */}
          <div className='col-span-3 space-y-6'>
            {/* Location Data */}
            <div className='border border-zinc-300 bg-white'>
              <div className='bg-zinc-100 px-4 py-2 text-xs tracking-wider text-zinc-700'>
                COORDINATES
              </div>
              <div className='p-4 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>LAT</span>
                  <span className='font-mono'>14°40'N</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>LON</span>
                  <span className='font-mono'>161°03'W</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>ALT</span>
                  <span className='font-mono'>1230M</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>AREA</span>
                  <span className='font-mono'>PACIFIC</span>
                </div>
              </div>
            </div>

            {/* Flight Conditions */}
            <div className='border border-zinc-300 bg-white'>
              <div className='bg-zinc-100 px-4 py-2 text-xs tracking-wider text-zinc-700'>
                CONDITIONS
              </div>
              <div className='p-4 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>VISIBILITY</span>
                  <span className='font-mono'>CLEAR</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>WIND</span>
                  <span className='font-mono'>15KT</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>CLOUD</span>
                  <span className='font-mono'>NONE</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>TEMP</span>
                  <span className='font-mono'>22°C</span>
                </div>
              </div>
            </div>

            {/* Observer Data */}
            <div className='border border-zinc-300 bg-zinc-50 p-4'>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>OBSERVER</div>
              <div className='w-full h-24 bg-zinc-300 mb-3 border border-zinc-400'></div>
              <div className='space-y-1 text-xs'>
                <div className='text-zinc-500'>ID: [REDACTED]</div>
                <div className='text-zinc-500'>RANK: PILOT</div>
                <div className='text-zinc-500'>EXP: 2400hrs</div>
              </div>
            </div>
          </div>

          {/* Center - Main Image */}
          <div className='col-span-6'>
            <div className='border-2 border-zinc-900 bg-white p-2 h-[500px]'>
              <div className='relative w-full h-full'>
                <ImageWithFallback
                  src='https://images.unsplash.com/photo-1682685797742-42c9987a2c34?w=700&h=500&fit=crop'
                  alt='Incident location'
                  className='w-full h-full object-cover grayscale'
                />

                {/* Object Overlay - Geometric UFO */}
                <div className='absolute top-[120px] left-1/2 transform -translate-x-1/2'>
                  <div
                    className='w-32 h-8 bg-zinc-400 border-2 border-zinc-700'
                    style={{
                      clipPath: 'ellipse(50% 100% at 50% 50%)',
                    }}></div>
                  <div
                    className='w-20 h-3 bg-zinc-300 border border-zinc-600 mx-auto -mt-1'
                    style={{
                      clipPath: 'ellipse(50% 100% at 50% 50%)',
                    }}></div>
                </div>

                {/* Technical Measurements */}
                <div className='absolute top-[110px] left-1/2 w-px h-[300px] bg-red-500 transform -translate-x-1/2'></div>
                <div className='absolute bottom-0 left-0 w-full h-px bg-red-500'></div>

                {/* Scale Reference */}
                <div className='absolute bottom-4 left-4 text-xs text-white bg-black px-2 py-1'>
                  SCALE: 1:1000
                </div>

                {/* Object Annotations */}
                <div className='absolute top-[100px] right-[100px] text-xs text-black'>
                  <div className='bg-white px-2 py-1 border border-zinc-400'>
                    OBJECT: UNIDENTIFIED
                  </div>
                </div>

                <div className='absolute bottom-[80px] left-[80px] text-xs text-black'>
                  <div className='bg-white px-2 py-1 border border-zinc-400'>EST. SIZE: 30M</div>
                </div>
              </div>
            </div>

            {/* Image Caption */}
            <div className='mt-4 text-center text-xs text-zinc-600'>
              FIGURE 1: Aerial phenomenon recorded at 14:30 UTC, Pacific region
            </div>
          </div>

          {/* Right Sidebar - Analysis */}
          <div className='col-span-3 space-y-6'>
            {/* Object Data */}
            <div className='border border-zinc-300 bg-white'>
              <div className='bg-zinc-100 px-4 py-2 text-xs tracking-wider text-zinc-700'>
                OBJECT DATA
              </div>
              <div className='p-4 space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>SHAPE</span>
                  <span className='font-mono'>DISC</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>SIZE</span>
                  <span className='font-mono'>~30M</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>SPEED</span>
                  <span className='font-mono'>MACH 2+</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-zinc-500'>DURATION</span>
                  <span className='font-mono'>15SEC</span>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className='border border-zinc-300 bg-red-50'>
              <div className='bg-red-100 px-4 py-2 text-xs tracking-wider text-red-700'>
                CLASSIFICATION
              </div>
              <div className='p-4 space-y-2 text-xs'>
                <div className='text-red-600'>UNIDENTIFIED</div>
                <div className='text-zinc-600'>No known aircraft match</div>
                <div className='text-zinc-600'>Anomalous flight characteristics</div>
                <div className='text-zinc-600'>Requires further investigation</div>
              </div>
            </div>

            {/* Evidence Log */}
            <div className='border border-zinc-300 bg-zinc-50 p-4'>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>EVIDENCE</div>
              <div className='space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span>PHOTO</span>
                  <span className='text-green-600'>✓</span>
                </div>
                <div className='flex justify-between'>
                  <span>RADAR</span>
                  <span className='text-green-600'>✓</span>
                </div>
                <div className='flex justify-between'>
                  <span>VIDEO</span>
                  <span className='text-red-600'>✗</span>
                </div>
                <div className='flex justify-between'>
                  <span>WITNESS</span>
                  <span className='text-green-600'>✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Analysis Section */}
        <div className='mt-8 border-t border-zinc-300 pt-6'>
          <div className='grid grid-cols-12 gap-8'>
            {/* Analysis Text */}
            <div className='col-span-8'>
              <h3 className='text-lg tracking-[0.05em] text-zinc-900 mb-4'>PRELIMINARY ANALYSIS</h3>
              <p className='text-sm leading-relaxed text-zinc-700 mb-4'>
                Object exhibited flight characteristics inconsistent with known aircraft or natural
                phenomena. Rapid acceleration from stationary position to supersonic speeds within
                2-3 seconds. No visible propulsion system or exhaust signature detected.
              </p>
              <p className='text-sm leading-relaxed text-zinc-700'>
                Radar data confirms object presence and trajectory. Multiple sensor verification
                completed. Case classified as Unidentified Aerial Phenomenon pending further
                investigation by specialized units.
              </p>
            </div>

            {/* Status Panel */}
            <div className='col-span-4'>
              <div className='border border-zinc-300 bg-white p-4'>
                <div className='text-xs tracking-wider text-zinc-500 mb-3'>CASE STATUS</div>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                    <span className='text-xs'>UNDER INVESTIGATION</span>
                  </div>
                  <div className='text-xs text-zinc-600'>Priority: HIGH</div>
                  <div className='text-xs text-zinc-600'>Next review: 22.07.2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className='absolute bottom-0 left-0 right-0 bg-zinc-50 border-t border-zinc-300 px-8 py-4'>
          <div className='flex justify-between items-center text-xs text-zinc-500'>
            <div>CLASSIFICATION: RESTRICTED | DISTRIBUTION: LIMITED</div>
            <div>PAGE 1 OF 1 | UAP-2024-001A</div>
          </div>
        </div>
      </div>
    </div>
  )
}
