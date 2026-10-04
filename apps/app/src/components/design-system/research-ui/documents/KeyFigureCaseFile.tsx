'use client'

export default function KeyFigureCaseFile() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 p-8 font-mono'>
      <div className='max-w-4xl mx-auto'>
        {/* Multiple Document Stack Effect */}
        <div className='relative'>
          {/* Background documents */}
          <div className='absolute top-2 left-2 w-full h-full bg-amber-100 rounded shadow-lg transform rotate-1 opacity-60'></div>
          <div className='absolute top-1 left-1 w-full h-full bg-yellow-100 rounded shadow-lg transform -rotate-1 opacity-80'></div>

          {/* Main Document Container */}
          <div className='relative bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-lg shadow-2xl vintage-paper border-4 border-amber-800/20'>
            {/* Document Wear and Stains */}
            <div className='absolute inset-0 opacity-20 pointer-events-none rounded-lg'>
              <div className='absolute top-12 right-20 w-14 h-14 bg-amber-900/30 rounded-full blur-md'></div>
              <div className='absolute bottom-32 left-12 w-8 h-8 bg-yellow-800/25 rounded-full blur-sm'></div>
              <div className='absolute top-48 left-4 w-6 h-24 bg-amber-800/15 rounded-sm blur-sm'></div>
            </div>

            <div className='flex gap-8'>
              {/* Left Side - Document Info */}
              <div className='flex-1'>
                {/* Header Tab */}
                <div className='bg-amber-200 px-4 py-2 mb-4 border border-amber-800/30 inline-block'>
                  <span className='text-black font-bold text-sm tracking-wide'>
                    EDGAR MITCHELL -<br />
                    APOLLO 14 ASTRONAUT,
                    <br />
                    1971
                  </span>
                </div>

                {/* Handwritten Style Header */}
                <div className='mb-6'>
                  <p
                    className='text-lg text-black transform -rotate-1'
                    style={{fontFamily: 'cursive'}}>
                    Interesting
                  </p>
                </div>

                {/* Typewritten Content */}
                <div className='space-y-4 text-black text-sm leading-relaxed'>
                  <p className='mb-4'>
                    <span className='font-bold'>Debrief transcript:</span>
                  </p>

                  <p className='mb-4'>
                    Debrief insersion. The
                    <br />
                    it note be proceed, in it
                    <br />
                    Earth, observed on ther
                    <br />
                    the counting, we case
                    <br />
                    operate.
                  </p>

                  {/* Dotted lines for missing text */}
                  <div className='grid grid-cols-20 gap-1 opacity-30 my-2'>
                    {Array.from({length: 40}).map((_, i) => (
                      <div key={i} className='w-1 h-1 bg-black rounded-full'></div>
                    ))}
                  </div>

                  <p className='mb-4'>
                    moving to reach. Ferward
                    <br />
                    to reach. Ferward sight,
                  </p>

                  {/* More dotted lines */}
                  <div className='grid grid-cols-20 gap-1 opacity-30 my-4'>
                    {Array.from({length: 60}).map((_, i) => (
                      <div key={i} className='w-1 h-1 bg-black rounded-full'></div>
                    ))}
                  </div>
                </div>

                {/* Classified Stamp - Bottom Left */}
                <div className='absolute bottom-8 left-8 border-4 border-black px-6 py-3 bg-amber-100 transform -rotate-3'>
                  <span className='text-black font-bold text-xl tracking-wider'>CLASSIFIED</span>
                </div>
              </div>

              {/* Right Side - Photo and Tab */}
              <div className='flex-1'>
                {/* Debrief Transcript Tab */}
                <div className='bg-amber-200 px-4 py-2 mb-4 border border-amber-800/30 inline-block float-right'>
                  <span className='text-black font-bold text-sm tracking-wide'>
                    DEBRIEF TRANSCRIPT
                  </span>
                </div>

                <div className='clear-both'></div>

                {/* Earth Photo */}
                <div className='relative mt-8'>
                  <div className='bg-black p-4 inline-block shadow-lg'>
                    <img
                      src='https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop&crop=center'
                      alt='Earth from space'
                      className='w-72 h-54 object-cover'
                    />
                  </div>

                  {/* Photo Border */}
                  <div className='absolute inset-0 border-2 border-gray-400 pointer-events-none'></div>
                </div>

                {/* Additional Text Below Photo */}
                <div className='mt-6 text-sm text-black leading-relaxed'>
                  <div className='grid grid-cols-25 gap-1 opacity-30 mb-2'>
                    {Array.from({length: 50}).map((_, i) => (
                      <div key={i} className='w-1 h-1 bg-black rounded-full'></div>
                    ))}
                  </div>

                  <p className='mb-2'>orbital sight,</p>

                  <div className='grid grid-cols-25 gap-1 opacity-30 mb-4'>
                    {Array.from({length: 75}).map((_, i) => (
                      <div key={i} className='w-1 h-1 bg-black rounded-full'></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
