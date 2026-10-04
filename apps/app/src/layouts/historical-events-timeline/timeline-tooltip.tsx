'use client'
export const TimelineToolTip: React.FC<any> = ( {
  event,
  coordinates,
  onHover,
}: any ) => {
  const handleHover = () => {
    onHover( coordinates )
  }

  return (
    <div className='hint' onMouseEnter={handleHover}>
      <span className='hint-radius'></span>
      <span className='hint-dot'></span>
      <div className='hint-content do--split-children'>
        {/* <Image /> */}
        <p
          style={{ color: '#78efff', letterSpacing: '0.05em' }}
          className={`font-firaCode text-[#78efff]`}
        >
          {coordinates[0]}, {coordinates[1]}
        </p>
      </div>
    </div>
  )
}
