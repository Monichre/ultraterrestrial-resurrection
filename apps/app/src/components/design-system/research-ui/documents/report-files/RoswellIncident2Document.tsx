'use client'

export default function RoswellIncident2Document() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 p-8 font-mono'>
      <div className='max-w-2xl mx-auto'>
        {/* Document Container */}
        <div className='relative bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-lg shadow-2xl vintage-paper border-4 border-amber-800/20'>
          {/* Document Wear and Stains */}
          <div className='absolute inset-0 opacity-20 pointer-events-none rounded-lg'>
            <div className='absolute top-8 right-12 w-16 h-16 bg-amber-900/30 rounded-full blur-md'></div>
            <div className='absolute bottom-20 left-6 w-10 h-10 bg-yellow-800/20 rounded-full blur-sm'></div>
            <div className='absolute top-32 left-2 w-4 h-20 bg-amber-800/15 rounded-sm blur-sm'></div>
            <div className='absolute bottom-8 right-16 w-12 h-8 bg-amber-700/10 rounded-full blur-sm'></div>
          </div>

          {/* Unclassified Stamp - angled */}
          <div className='absolute top-4 right-6 border-2 border-black px-3 py-1 bg-amber-100 transform rotate-12'>
            <span className='text-black font-bold text-sm tracking-wider'>UNCLASSIFIED</span>
          </div>

          {/* Title */}
          <div className='text-center mb-8 mt-6'>
            <h1 className='text-4xl font-bold text-black tracking-wider mb-2'>ROSWELL INCIDENT</h1>
            <h2 className='text-3xl font-bold text-black tracking-wider'>- JULY 1947</h2>
          </div>

          {/* Main Content Area with Background Dots */}
          <div className='relative'>
            {/* Background dot pattern */}
            <div className='absolute inset-0 opacity-15 pointer-events-none'>
              <div className='grid grid-cols-25 gap-2 h-full'>
                {Array.from({length: 400}).map((_, i) => (
                  <div key={i} className='w-1 h-1 bg-black rounded-full'></div>
                ))}
              </div>
            </div>

            {/* Content Container */}
            <div className='relative bg-amber-50/80 p-6 rounded border border-amber-800/30'>
              {/* Arrow pointing to photo */}
              <div className='absolute top-4 left-8 transform -rotate-45'>
                <svg width='60' height='20' className='text-black'>
                  <path
                    d='M0 10 L50 10 L45 5 M50 10 L45 15'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                  />
                </svg>
              </div>

              {/* Witness Reports Header */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-black mb-4'>WITNESS REPORTS:</h3>

                <div className='mb-4'>
                  <p className='text-sm text-black leading-relaxed'>
                    A large circular disc
                    <br />
                    crashed near Roswell,
                    <br />
                    New Mexico.
                  </p>
                </div>

                <p className='text-sm text-black font-semibold mb-4'>Witness reports:</p>

                <p className='text-sm text-black leading-relaxed mb-4'>
                  Reports came in titan crashes
                  <br />
                  near Rospell, New Mexico.
                </p>

                <p className='text-sm text-black font-semibold mb-4'>Witness Reports:</p>
              </div>

              {/* Photo with Paperclip */}
              <div className='float-right ml-4 mb-4'>
                <div className='relative inline-block bg-gray-200 p-1 shadow-lg transform -rotate-2'>
                  <img
                    src='https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=280&h=200&fit=crop&crop=center'
                    alt='Crash site debris'
                    className='w-56 h-40 object-cover sepia grayscale contrast-125'
                  />

                  {/* Paperclip */}
                  <div className='absolute -top-2 -right-1 transform rotate-15'>
                    <svg width='20' height='50' className='text-gray-600'>
                      <path
                        d='M10 4 Q5 4 5 10 L5 38 Q5 44 10 44 Q15 44 15 38 L15 12 Q15 10 13 10 Q11 10 11 12 L11 32'
                        stroke='currentColor'
                        strokeWidth='2'
                        fill='none'
                      />
                    </svg>
                  </div>
                </div>

                {/* Arrow pointing to photo */}
                <div className='absolute -top-8 -right-8 transform rotate-12'>
                  <svg width='40' height='15' className='text-black'>
                    <path
                      d='M0 7 L30 7 L25 3 M30 7 L25 11'
                      stroke='currentColor'
                      strokeWidth='2'
                      fill='none'
                    />
                  </svg>
                </div>
              </div>

              {/* Witness Report Text */}
              <div className='text-sm text-black leading-relaxed'>
                <p className='mb-4'>
                  Large crash site site, burned and, charred,
                  <br />
                  with flames and black smoking ash due
                  <br />
                  to the site there of lang change bring.
                </p>

                <p className='mb-4'>
                  Disc's surface was dull metallic. These
                  <br />
                  netings tistnornfully foil, and no
                  <br />
                  were of glass,like material.
                </p>

                <p className='mb-6'>
                  No scorched marks and signs of being
                  <br />
                  usual on largle and were occurrre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
