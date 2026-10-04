import type React from 'react'

function DocumentFrame({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-4xl shadow-2xl document-texture h-auto ${className}`}>
      {/* Aged paper tint + grain overlays */}
      <div
        className='absolute inset-0 opacity-20 bg-gradient-to-br from-yellow-200 via-transparent to-amber-200 pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='absolute inset-0 opacity-10 noise-pattern pointer-events-none'
        aria-hidden='true'
      />
      {/* Center crease */}
      <div
        className='absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 opacity-30 -translate-x-px'
        aria-hidden='true'
      />
      {children}
    </div>
  )
}

/* -------- Existing first document (unchanged except wrapped in DocumentFrame) -------- */
function CrashRetrievalOne() {
  return (
    <DocumentFrame>
      {/* Header Section */}
      <div className='relative p-8 pb-4 font-mono'>
        <div className='text-black font-bold text-lg tracking-wider mb-2'>
          INCFRESEMEMENT . 263 ...........
        </div>
        <div className='text-xs space-y-1 mb-4'>
          <div>n sæs .45762 ALL c cændere osaal.</div>
          <div>Res 120{'        '}S Aktvo</div>
          <div>Spots produktion</div>
        </div>
        <div className='border-t border-b border-black py-2 my-4'>
          <div className='text-black font-bold text-lg tracking-wider'>INQ UNNEIQ . . 1.6</div>
        </div>
        <div className='text-xs space-y-1'>
          <div>justeret&nbsp;22553005{'     '}lunfs.e. srat . 46256</div>
          <div>s.sektm{'                                                          '}§</div>
          <div>u) usd.p.udkstra.sæs95</div>
          <div>hjhabo:</div>
          <div>Monåsmaschliucovi&nbsp;&nbsp;ined 52 05. 1995</div>
        </div>
      </div>

      {/* Bottom Section in normal flow (auto height) */}
      <div className='px-8 pb-8 pt-8 border-t border-black/20'>
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

      {/* Scattered stains */}
      <div className='absolute top-12 right-16 w-5 h-5 bg-yellow-600 rounded-full opacity-15 blur-sm' />
      <div className='absolute top-32 left-12 w-2 h-2 bg-amber-700 rounded-full opacity-25' />
      <div className='absolute bottom-24 right-20 w-4 h-4 bg-yellow-700 rounded-full opacity-20 blur-sm' />
      <div className='absolute top-20 left-1/3 w-1 h-1 bg-amber-800 rounded-full opacity-40' />
      <div className='absolute bottom-16 left-16 w-3 h-3 bg-yellow-800 rounded-full opacity-15 blur-sm' />
      <div className='absolute top-40 right-1/3 w-2 h-2 bg-amber-600 rounded-full opacity-20' />
      <div className='absolute bottom-32 left-1/4 w-1 h-1 bg-yellow-900 rounded-full opacity-30' />
      <div className='absolute top-64 right-24 w-6 h-2 bg-amber-500 rounded-full opacity-10 blur-sm rotate-12' />
      <div className='absolute bottom-40 right-16 w-3 h-1 bg-yellow-700 rounded-full opacity-15 blur-sm -rotate-6' />
    </DocumentFrame>
  )
}

/* -------- New Document A: collage from "UN:DEFECTAL" (3zhc5) + abstract crosshair (LlCHA) -------- */
export function CrashRetrievalTwo() {
  return (
    <DocumentFrame className='mt-12'>
      {/* Header row mimicking bold type */}
      <header className='px-8 pt-8 pb-3 flex items-center justify-between'>
        <div className='flex items-baseline gap-3'>
          <span className='font-black tracking-widest text-2xl'>UN:DE FECTAL</span>
          <span className='text-[10px] tracking-[0.3em] uppercase'>Record 17330 • Steel/Exa</span>
        </div>
        <span className='text-xs'>Page: 08</span>
      </header>

      {/* Split grid with hero scan and margin annotations */}
      <div className='relative px-6 pb-10'>
        <div className='grid grid-cols-[1fr_18rem] gap-4'>
          {/* Large scan block */}
          <div className='relative overflow-hidden border border-black/50 bg-white'>
            {/* Use the provided screenshot as the main scan image */}
            <img
              src='/images/doc-a-main.png'
              alt='Scanned page with UFO hovering over burning field'
              className='w-full h-[32rem] object-cover contrast-110'
            />
            {/* vertical fold line overlay */}
            <div className='absolute inset-y-0 left-1/2 w-px bg-black/30' aria-hidden='true' />
            {/* surface scratches */}
            <div className='pointer-events-none absolute inset-0 mix-blend-multiply opacity-20'>
              <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10' />
            </div>
          </div>

          {/* Right sidebar annotations */}
          <aside className='relative'>
            <div className='absolute -top-6 right-0 w-16 h-20 bg-black/80 text-white text-[9px] flex items-end justify-center pb-1 shadow-md'>
              <span>Fig. 7</span>
            </div>
            <div className='space-y-2 text-[10px] tracking-wider'>
              <div className='border border-black/40 p-2'>
                <div className='font-semibold'>ROCO.TD</div>
                <div className='text-[9px] opacity-70'>ufo: scanned specimen</div>
              </div>
              <div className='border border-black/40 p-2'>
                <div className='uppercase font-semibold'>Index</div>
                <ul className='mt-1 space-y-1'>
                  <li className='flex justify-between'>
                    <span>nero</span>
                    <span>56</span>
                  </li>
                  <li className='flex justify-between'>
                    <span>morro</span>
                    <span>80</span>
                  </li>
                  <li className='flex justify-between'>
                    <span>nenill</span>
                    <span>95</span>
                  </li>
                </ul>
              </div>
              <div className='text-[9px] opacity-70 leading-relaxed'>
                Field notes recovered from damaged archive. Surface temperatures consistent with
                controlled burn across basalt plain. Witness marks indicate lift vector.
              </div>
            </div>
          </aside>
        </div>

        {/* Footer line items */}
        <div className='mt-6 grid grid-cols-6 gap-2 text-[10px] leading-4'>
          {Array.from({length: 6}).map((_, i) => (
            <p key={i} className='col-span-3 border-t pt-2 opacity-80'>
              Transcribed fragments: authorization stamp degraded; perimeter estimate +/- 5m;
              thermal pockets persist despite crosswind conditions.
            </p>
          ))}
        </div>

        {/* bottom right code mark */}
        <div className='absolute bottom-2 right-4 text-sm font-bold tracking-widest'>ISTO: 95</div>
      </div>
    </DocumentFrame>
  )
}

/* -------- New Document B: abstract crosshair layout + two inset panels -------- */
export function CrashRetrievalThree() {
  return (
    <DocumentFrame className='mt-12'>
      {/* Sparse header */}
      <header className='px-8 pt-10 pb-4'>
        <div className='flex items-baseline justify-between'>
          <div className='space-y-1'>
            <div className='uppercase tracking-[0.4em] text-sm'>Minio Clusso</div>
            <div className='text-[10px] opacity-70'>Experimental Debris Survey</div>
          </div>
          <div className='text-right'>
            <div className='text-lg font-semibold'>20.90</div>
            <div className='text-xs tracking-widest'>Index 889</div>
          </div>
        </div>
      </header>

      {/* Main composition area */}
      <div className='relative px-6 pb-12'>
        {/* Crosshair lines */}
        <div className='absolute inset-0 px-6' aria-hidden='true'>
          <div className='absolute left-1/2 top-20 bottom-24 w-px bg-black/20' />
          <div className='absolute top-1/2 left-8 right-8 h-px bg-black/20' />
        </div>

        <div className='relative grid grid-cols-1 gap-6'>
          {/* Background abstract scan (LlCHA) */}
          <div className='relative border border-black/40 bg-white'>
            <img
              src='/images/doc-b-abstract.png'
              alt='Abstract archival scan with crosshair and flame field'
              className='w-full h-[28rem] object-cover'
            />
            <div className='absolute inset-0 ring-1 ring-black/10' aria-hidden='true' />
          </div>

          {/* Lower collage row with two panels */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='relative border border-black/50 bg-white'>
              <img
                src='/images/doc-b-textstorm.png'
                alt='Typewritten page with particulate tornado plume'
                className='w-full h-64 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent' />
            </div>
            <div className='relative border border-black/50 bg-white'>
              <img
                src='/images/doc-b-stamp.png'
                alt='Clean archival layout with explosions and circular stamp'
                className='w-full h-64 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent' />
            </div>
          </div>
        </div>

        {/* Marginalia and stamp */}
        <div className='mt-6 flex items-center justify-between'>
          <div className='text-[10px] tracking-widest'>ISTA FRLD • Case 886</div>
          <div className='text-[10px]'>Specimen: Δ-7 • Clearance S4</div>
        </div>

        {/* Edge burn vignettes */}
        <div className='pointer-events-none absolute inset-0 mix-blend-multiply opacity-25'>
          <div className='absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.15))]' />
        </div>
      </div>
    </DocumentFrame>
  )
}
