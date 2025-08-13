import {useState} from 'react'
import UfoDocument from './components/UfoDocument'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'collage' | 'ufo'>('collage')

  if (currentPage === 'ufo') {
    return (
      <div className='relative'>
        <button
          onClick={() => setCurrentPage('collage')}
          className='absolute top-6 left-6 z-50 bg-zinc-900 text-white px-4 py-2 text-xs tracking-wider hover:bg-zinc-800 transition-colors'>
          ← RETURN
        </button>
        <UfoDocument />
      </div>
    )
  }

  return (
    <div className='relative w-full h-screen bg-zinc-50 overflow-hidden'>
      {/* Grid System Overlay */}
      <div className='absolute inset-0 opacity-5'>
        <div className='grid grid-cols-24 grid-rows-24 h-full w-full'>
          {Array.from({length: 576}).map((_, i) => (
            <div key={i} className='border border-zinc-300'></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrentPage('ufo')}
        className='absolute top-6 right-6 z-50 bg-zinc-900 text-white px-4 py-2 text-xs tracking-wider hover:bg-zinc-800 transition-colors'>
        DOCUMENT →
      </button>

      {/* Main Container */}
      <div className='relative z-10 p-12'>
        {/* Header Section - Grid Row 1-3 */}
        <div className='grid grid-cols-12 gap-6 mb-12'>
          {/* Title Block */}
          <div className='col-span-6 border-l-2 border-zinc-900 pl-6'>
            <div className='text-xs tracking-[0.3em] text-zinc-500 mb-2'>PROJECT</div>
            <h1 className='text-2xl tracking-[0.1em] text-zinc-900 mb-1'>MINIMAL ARCHIVE</h1>
            <div className='text-xs text-zinc-600'>Reference: MA-001.2024</div>
          </div>

          {/* Metadata Block */}
          <div className='col-span-3 col-start-10'>
            <div className='border border-zinc-300 p-4 bg-white'>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>COORDINATES</div>
              <div className='space-y-1'>
                <div className='flex justify-between text-xs'>
                  <span>LAT</span>
                  <span className='font-mono'>40.7128</span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span>LNG</span>
                  <span className='font-mono'>-74.0060</span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span>ALT</span>
                  <span className='font-mono'>10M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Main Layout */}
        <div className='grid grid-cols-12 gap-6 h-[calc(100vh-240px)]'>
          {/* Left Column - Text Content */}
          <div className='col-span-4 space-y-8'>
            {/* Primary Content Block */}
            <div className='border-t border-zinc-300 pt-6'>
              <h2 className='text-lg tracking-[0.05em] text-zinc-900 mb-4'>Design Systems</h2>
              <p className='text-sm leading-relaxed text-zinc-700 mb-4'>
                Systematic approach to spatial organization through geometric principles and modular
                construction methodologies.
              </p>
              <p className='text-sm leading-relaxed text-zinc-700'>
                Implementation of architectural standards with contemporary digital application
                frameworks.
              </p>
            </div>

            {/* Technical Specifications */}
            <div className='border border-zinc-300 p-4 bg-zinc-50'>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>SPECIFICATIONS</div>
              <div className='grid grid-cols-2 gap-3 text-xs'>
                <div>
                  <div className='text-zinc-500'>GRID</div>
                  <div className='font-mono'>24×24</div>
                </div>
                <div>
                  <div className='text-zinc-500'>UNIT</div>
                  <div className='font-mono'>24PX</div>
                </div>
                <div>
                  <div className='text-zinc-500'>RATIO</div>
                  <div className='font-mono'>1:1.618</div>
                </div>
                <div>
                  <div className='text-zinc-500'>SCALE</div>
                  <div className='font-mono'>1:100</div>
                </div>
              </div>
            </div>

            {/* Component Index */}
            <div>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>INDEX</div>
              <div className='space-y-2'>
                <div className='flex justify-between text-xs border-b border-zinc-200 pb-1'>
                  <span>001</span>
                  <span>Primary Structure</span>
                </div>
                <div className='flex justify-between text-xs border-b border-zinc-200 pb-1'>
                  <span>002</span>
                  <span>Secondary Elements</span>
                </div>
                <div className='flex justify-between text-xs border-b border-zinc-200 pb-1'>
                  <span>003</span>
                  <span>Annotation System</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Geometric Forms */}
          <div className='col-span-5 relative'>
            {/* Main Geometric Composition */}
            <div className='relative h-full border border-zinc-300 bg-white p-8'>
              {/* Primary Rectangle */}
              <div className='absolute top-12 left-12 w-48 h-32 border-2 border-zinc-900'>
                <div className='absolute -top-4 -left-4 text-xs text-zinc-500'>A1</div>
              </div>

              {/* Secondary Circle */}
              <div className='absolute top-24 right-16 w-24 h-24 border border-zinc-600 rounded-full'>
                <div className='absolute top-6 left-8 w-2 h-2 bg-zinc-900 rounded-full'></div>
                <div className='absolute -bottom-6 left-8 text-xs text-zinc-500'>B2</div>
              </div>

              {/* Diagonal Line Element */}
              <div className='absolute bottom-20 left-8 w-32 h-px bg-zinc-400 transform rotate-45 origin-left'></div>

              {/* Grid Reference Points */}
              <div className='absolute top-4 left-4 w-1 h-1 bg-zinc-900'></div>
              <div className='absolute top-4 right-4 w-1 h-1 bg-zinc-900'></div>
              <div className='absolute bottom-4 left-4 w-1 h-1 bg-zinc-900'></div>
              <div className='absolute bottom-4 right-4 w-1 h-1 bg-zinc-900'></div>

              {/* Dimension Lines */}
              <div className='absolute -left-8 top-12 bottom-44 w-px bg-zinc-400'></div>
              <div className='absolute -left-10 top-12 w-2 h-px bg-zinc-400'></div>
              <div className='absolute -left-10 bottom-44 w-2 h-px bg-zinc-400'></div>
              <div className='absolute -left-12 top-1/2 transform -translate-y-1/2 text-xs text-zinc-500 -rotate-90'>
                320
              </div>

              {/* Annotation */}
              <div className='absolute bottom-8 left-12 text-xs text-zinc-600'>
                Geometric study 001.A
              </div>
            </div>
          </div>

          {/* Right Column - Data & References */}
          <div className='col-span-3 space-y-6'>
            {/* Data Table */}
            <div className='border border-zinc-300 bg-white'>
              <div className='bg-zinc-100 px-4 py-2 text-xs tracking-wider text-zinc-700'>
                PARAMETERS
              </div>
              <div className='p-4 space-y-3'>
                <div className='flex justify-between text-xs'>
                  <span className='text-zinc-500'>WIDTH</span>
                  <span className='font-mono'>192px</span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-zinc-500'>HEIGHT</span>
                  <span className='font-mono'>128px</span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-zinc-500'>MARGIN</span>
                  <span className='font-mono'>48px</span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-zinc-500'>PADDING</span>
                  <span className='font-mono'>32px</span>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className='border border-zinc-300 bg-zinc-50 p-4'>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>STATUS</div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span className='text-xs'>ACTIVE</span>
                </div>
                <div className='text-xs text-zinc-600'>Last modified: 08.07.2025</div>
              </div>
            </div>

            {/* Reference Notes */}
            <div>
              <div className='text-xs tracking-wider text-zinc-500 mb-3'>NOTES</div>
              <div className='space-y-2 text-xs text-zinc-600 leading-relaxed'>
                <p>• Maintains 1:1.618 golden ratio</p>
                <p>• 24px baseline grid system</p>
                <p>• Modular scale implementation</p>
                <p>• Architectural annotation standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Grid References */}
        <div className='absolute bottom-6 left-12 right-12 flex justify-between items-center border-t border-zinc-300 pt-4'>
          <div className='text-xs text-zinc-500'>GRID: 24×24 | SCALE: 1:100 | VERSION: 2.1.0</div>
          <div className='text-xs text-zinc-500'>© 2025 MINIMAL SYSTEMS</div>
        </div>
      </div>
    </div>
  )
}
