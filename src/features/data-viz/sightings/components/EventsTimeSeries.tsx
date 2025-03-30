export const EventsTimeSeries = () => {
  return (
    <div className='flex flex-wrap gap-2'>
      <button
        type='button'
        onClick={() => getUserLocation(mapConfig, setMapConfig)}
        className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
        Go to My Location
      </button>

      {/* Example locations for demo purposes */}
      <button
        type='button'
        onClick={() => flyToLocation(-112.074, 33.4484, 8, mapConfig, setMapConfig)}
        className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
        Phoenix Lights
      </button>
      <button
        type='button'
        onClick={() => flyToLocation(-104.523, 33.3943, 8, mapConfig, setMapConfig)}
        className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
        Roswell
      </button>
      <button
        type='button'
        onClick={() => {
          setVisualizationMode('native')
          setMapConfig({
            center: [-98.5795, 39.8283] as [number, number],
            zoom: [3] as [number],
            pitch: [45] as [number],
          })
        }}
        className='px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 transition-colors'>
        Reset View
      </button>
    </div>
  )
}
