'use client'

export default function NationalSecurityActDocument() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 p-8 font-mono'>
      <div className='max-w-4xl mx-auto'>
        {/* Document Container */}
        <div className='relative bg-gradient-to-br from-amber-50 to-yellow-100 p-8 rounded-lg shadow-2xl vintage-paper border-4 border-amber-800/20'>
          {/* Document Wear and Stains */}
          <div className='absolute inset-0 opacity-20 pointer-events-none rounded-lg'>
            <div className='absolute top-16 right-24 w-18 h-18 bg-amber-900/30 rounded-full blur-lg'></div>
            <div className='absolute bottom-24 left-16 w-10 h-10 bg-yellow-800/25 rounded-full blur-sm'></div>
            <div className='absolute top-40 left-6 w-8 h-28 bg-amber-800/15 rounded-sm blur-sm'></div>
            <div className='absolute bottom-16 right-20 w-14 h-6 bg-amber-700/10 rounded-full blur-sm'></div>
          </div>

          <div className='flex gap-8'>
            {/* Left Side - Newspaper Clipping */}
            <div className='flex-1'>
              {/* Newspaper Header */}
              <div className='bg-gray-100 p-4 border-2 border-gray-600 shadow-lg transform -rotate-1'>
                <div className='text-xs text-black mb-2 opacity-75'>
                  WASHINGTON POST JULY 26 1947
                </div>

                <div className='mb-4'>
                  <h2 className='text-lg font-bold text-black mb-2'>
                    NATIONAL
                    <br />
                    SECURITY ACT
                    <br />
                    OF 947 SIGNED
                    <br />
                    BY PRESIDENT
                  </h2>

                  <div className='text-xs text-black leading-tight space-y-1'>
                    <p>Army Transferred to New</p>
                    <p>Ivas ∼ New Sangs</p>
                  </div>
                </div>

                {/* Newspaper Article Text */}
                <div className='text-xs text-black leading-tight space-y-2'>
                  <p className='mb-2'>
                    <span className='bg-red-200 px-1'>1.</span> "National Intelligence" was defined
                    to
                    <br />
                    to include nuclear weapons—related
                    <br />
                    information.
                  </p>

                  <p className='mb-2'>
                    In its definitions (at what is now 50 U.S.C. §<br />
                    § 3009(3)(BILL)), "national intelligence" covers
                    <br />
                    weapons of mass destruction," explicitly
                    <br />
                    re—the development, proliferation, or use of
                    <br />
                    of weapons of mass-technology matters. o
                  </p>

                  <p className='mb-2'>
                    <span className='font-bold'>Probe elecibensment</span>
                    <br />
                    <span className='font-bold'>ranergence amucli ∼</span>
                    <br />
                    <span className='font-bold'>after of Aoon hard un</span>
                  </p>

                  <div className='text-xs opacity-60'>
                    <p>∼ MIC UD BY 9600 2 10</p>
                    <p>IASFM ACAIICBKLY LIEB AIIS 19 AMICAIGS</p>
                    <p>JU ICY NOJII PASIN 19 4 9 AAAIAFIN ISAINAGIN</p>
                  </div>
                </div>

                {/* Tape effect on newspaper */}
                <div className='absolute top-2 left-8 w-8 h-6 bg-yellow-200 opacity-60 transform rotate-12'></div>
                <div className='absolute bottom-4 right-6 w-6 h-8 bg-yellow-200 opacity-60 transform -rotate-12'></div>
              </div>

              {/* Classified Stamp */}
              <div className='mt-8 border-4 border-black px-6 py-3 bg-amber-100 transform -rotate-2 inline-block'>
                <span className='text-black font-bold text-2xl tracking-wider'>CLASSIFIED</span>
              </div>
            </div>

            {/* Right Side - Main Document */}
            <div className='flex-1'>
              {/* Circled Roswell */}
              <div className='text-right mb-6'>
                <div className='inline-block relative'>
                  <span className='text-2xl text-black font-bold px-4 py-2'>Roswell</span>
                  <svg className='absolute inset-0 w-full h-full' viewBox='0 0 100 40'>
                    <ellipse
                      cx='50'
                      cy='20'
                      rx='45'
                      ry='18'
                      fill='none'
                      stroke='black'
                      strokeWidth='2'
                    />
                  </svg>
                </div>
              </div>

              {/* Document Content */}
              <div className='text-sm text-black leading-relaxed space-y-4'>
                <p className='mb-4'>
                  The National Security Act of 1947
                  <br />
                  established the Central Intelligence Agency
                </p>

                <div className='mb-4'>
                  <p className='mb-2'>
                    <span className='bg-red-200 px-1 rounded'>1.</span> "National Intelligence" was
                    defined
                    <br />
                    to include nuclear weapons—related
                    <br />
                    information.
                  </p>

                  <p className='mb-4'>
                    In its definitions (at what is now 50 U.S.C. §<br />
                    § 3009(3)(BILL)), "national intelligence" covers
                    <br />
                    weapons of mass destruction," explicitly
                    <br />
                    re—the development, proliferation, or use
                    <br />
                    of weapons of mass-technology matters. o
                  </p>
                </div>

                <p className='mb-4'>
                  <span className='font-bold'>2. Coordination of atomic-energy resources</span>
                  <br />
                  resources under the NSC.
                </p>

                <p className='mb-4'>
                  Title i established the National Security
                  <br />
                  board—an NSC Advisory body charged with
                  <br />
                  coordinating military, industrial, and civilian
                  <br />
                  mobilization with the field of research and
                </p>

                <p className='mb-4'>
                  <span className='font-bold'>3. Legislative carve-out for the</span>
                  <br />
                  Atomic Energy Commission.
                </p>

                {/* Dotted lines for missing text */}
                <div className='grid grid-cols-25 gap-1 opacity-30 my-4'>
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
  )
}
