import './sightings-report.css'

export default function UfoSightingReport() {
  return (
    <div className='min-h-screen bg-gray-100 p-0 font-mono'>
      <div className='relative mx-auto w-full max-w-4xl shadow-2xl document-texture min-h-screen'>
        {/* Aged paper texture overlay */}
        <div className='absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-200 via-transparent to-amber-200 pointer-events-none'></div>
        <div className='absolute inset-0 opacity-10 noise-pattern pointer-events-none'></div>

        {/* Document crease/fold line */}
        <div className='absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 opacity-30 transform -translate-x-px'></div>

        {/* Header Section */}
        <div className='relative p-8 pb-4'>
          <div className='text-black font-bold text-lg tracking-wider mb-2'>
            INCFRESEMEMENT . 263 ...........
          </div>
          <div className='text-xs space-y-1 mb-4'>
            <div>n sæs .45762 ALL c cændere osaal.</div>
            <div>Res 120&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S Aktvo</div>
            <div>Spots produktion</div>
          </div>
          <div className='border-t border-b border-black py-2 my-4'>
            <div className='text-black font-bold text-lg tracking-wider'>INQ UNNEIQ . . 1.6</div>
          </div>
          <div className='text-xs space-y-1'>
            <div>justeret&nbsp;22553005&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lunfs.e. srat . 46256</div>
            <div>
              s.sektm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;§
            </div>
            <div>u) usd.p.udkstra.sæs95</div>
            <div>hjhabo:</div>
            <div>Monåsmaschliucovi&nbsp;&nbsp;ined 52 05. 1995</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='absolute bottom-0 left-0 right-0 px-8 pb-8'>
          <div className='flex justify-between items-end'>
            <div className='text-xs space-y-1'>
              <div>stehat .. 4..</div>
              <div>ESilloonstudio.</div>
              <div className='mt-4 space-y-1'>
                <div>ArkaLAr 234 i.(05-aax</div>
                <div>InoaLAoers0940inc.)&nbsp;&nbsp;&nbsp;) M4604. 107arc</div>
                <div>Hlralptegsfar..544- B.c :&nbsp;&nbsp;3a ( 11 (978711)</div>
                <div>Aosrarkodik&45050</div>
                <div>Ss sg)1st.!&s*glesss.</div>
                <div className='text-right'>solsthast.</div>
              </div>
            </div>
            <div className='text-xs text-right'>
              <div>A..Dseys.6147rane</div>
              <div className='mt-8 space-y-1'>
                <div>
                  = astso3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;le Gers.&nbsp;&nbsp;&nbsp;066
                  78&nbsp;&nbsp;&nbsp;S&nbsp;&nbsp;&nbsp;Se .
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced age spots and stains */}
        <div className='absolute top-12 right-16 w-5 h-5 bg-yellow-600 rounded-full opacity-15 blur-sm'></div>
        <div className='absolute top-32 left-12 w-2 h-2 bg-amber-700 rounded-full opacity-25'></div>
        <div className='absolute bottom-24 right-20 w-4 h-4 bg-yellow-700 rounded-full opacity-20 blur-sm'></div>
        <div className='absolute top-20 left-1/3 w-1 h-1 bg-amber-800 rounded-full opacity-40'></div>
        <div className='absolute bottom-16 left-16 w-3 h-3 bg-yellow-800 rounded-full opacity-15 blur-sm'></div>
        <div className='absolute top-40 right-1/3 w-2 h-2 bg-amber-600 rounded-full opacity-20'></div>
        <div className='absolute bottom-32 left-1/4 w-1 h-1 bg-yellow-900 rounded-full opacity-30'></div>
        <div className='absolute top-64 right-24 w-6 h-2 bg-amber-500 rounded-full opacity-10 blur-sm transform rotate-12'></div>
        <div className='absolute bottom-40 right-16 w-3 h-1 bg-yellow-700 rounded-full opacity-15 blur-sm transform -rotate-6'></div>
      </div>
    </div>
  )
}
