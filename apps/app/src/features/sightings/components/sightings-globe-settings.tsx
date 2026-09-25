import {useState} from 'react'

export const SightingsFilters = () => {
  const [filters, setFilters] = useState({
    shape: '',
    duration: 0,
    country: '',
    state: '',
    isSignificantEvent: false,
  })
  return (
    <div className='absolute bottom-4 left-4 p-4 bg-black bg-opacity-70 text-white rounded-lg z-10 font-monumentMono'>
      <h3 className='text-lg mb-3 font-bold text-cyan-400'>Visualization Options</h3>

      {/* Filtering Controls */}
      <div className='mb-3'>
        <div className='flex justify-between items-center'>
          <label className='block mb-1'>Filters</label>
          <button
            type='button'
            onClick={() =>
              setFilters({
                shape: '',
                duration: 0,
                country: '',
                state: '',
                isSignificantEvent: false,
              })
            }
            className='text-xs text-cyan-400 hover:text-cyan-300'>
            Reset
          </button>
        </div>

        <div className='flex flex-wrap gap-2 mb-2'>
          {/* Significant Events Toggle */}
          <button
            type='button'
            onClick={() =>
              setFilters({
                ...filters,
                isSignificantEvent: !filters.isSignificantEvent,
              })
            }
            className={`px-3 py-1 rounded ${
              filters.isSignificantEvent ? 'bg-yellow-500 text-black' : 'bg-gray-700'
            }`}>
            {filters.isSignificantEvent ? 'Major Events Only' : 'All Sightings'}
          </button>

          {/* Shape Filter - Common shapes dropdown */}
          <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
            <span className='text-sm'>Shape:</span>
            <select
              value={filters.shape}
              onChange={(e) => setFilters({...filters, shape: e.target.value})}
              className='bg-gray-900 text-white rounded text-sm py-0'>
              <option value=''>Any</option>
              <option value='cylinder'>Cylinder</option>
              <option value='triangle'>Triangle</option>
              <option value='circle'>Circle</option>
              <option value='disc'>Disc</option>
              <option value='oval'>Oval</option>
              <option value='sphere'>Sphere</option>
              <option value='cigar'>Cigar</option>
              <option value='formation'>Formation</option>
              <option value='light'>Light</option>
              <option value='other'>Other</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
            <span className='text-sm'>Min Duration:</span>
            <select
              value={filters.duration}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duration: Number.parseInt(e.target.value),
                })
              }
              className='bg-gray-900 text-white rounded text-sm py-0'>
              <option value='0'>Any</option>
              <option value='60'>1+ min</option>
              <option value='300'>5+ mins</option>
              <option value='600'>10+ mins</option>
              <option value='1800'>30+ mins</option>
              <option value='3600'>1+ hour</option>
            </select>
          </div>
        </div>

        {/* Location Filters */}
        <div className='flex flex-wrap gap-2'>
          {/* Country Filter */}
          <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
            <span className='text-sm'>Country:</span>
            <select
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              className='bg-gray-900 text-white rounded text-sm py-0'>
              <option value=''>Any</option>
              <option value='us'>United States</option>
              <option value='ca'>Canada</option>
              <option value='gb'>United Kingdom</option>
              <option value='au'>Australia</option>
            </select>
          </div>

          {/* State Filter - show only if US is selected */}
          {filters.country === 'us' && (
            <div className='px-3 py-1 rounded bg-gray-800 flex gap-2 items-center'>
              <span className='text-sm'>State:</span>
              <select
                value={filters.state}
                onChange={(e) => setFilters({...filters, state: e.target.value})}
                className='bg-gray-900 text-white rounded text-sm py-0'>
                <option value=''>Any</option>
                <option value='ca'>California</option>
                <option value='tx'>Texas</option>
                <option value='nv'>Nevada</option>
                <option value='az'>Arizona</option>
                <option value='nm'>New Mexico</option>
                <option value='wa'>Washington</option>
                <option value='or'>Oregon</option>
                <option value='fl'>Florida</option>
                <option value='ny'>New York</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
