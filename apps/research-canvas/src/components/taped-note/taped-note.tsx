import Image from 'next/image'

export const TapedNote = ({record}: {record: any}) => {
  return (
    <div className='relative h-[400px] overflow-visible'>
      <div className='torn-paper h-full relative overflow-hidden'>
        {/* Masking tape elements */}
        <div className='masking-tape masking-tape-top-left' />
        <div className='masking-tape masking-tape-top-right' />
        {/* Project year tag */}
        <div className='project-year'>
          {"'"}
          {record.year.slice(-2)}
        </div>
        {/* Category header */}
        <div className='project-header bg-[#f4f1e8] text-black pt-6 pb-2'>
          {record.type.includes('Entertainment')
            ? 'ENTERTAINMENT'
            : record.category}
        </div>
        {/* Project image container */}
        <div className='relative h-[280px] mx-4 mt-1 mb-3 overflow-hidden bg-black'>
          <div className='grid-bg-card' />
          {record.isLocked && (
            <div className='absolute top-4 left-4 z-10 bg-black/80 px-3 py-1 rounded-md'>
              <span className='text-xs font-mono'>
                {record.id === 6 ? 'COMING SOON' : 'LOCKED'}
              </span>
            </div>
          )}
          <Image
            src={record.image}
            alt={record.title}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105 opacity-80'
          />
        </div>
        {/* Project title footer */}
        <div className='project-footer bg-[#f4f1e8] text-red-DEFAULT pb-5 pt-1'>
          {record.title}
        </div>
      </div>
    </div>
  )
}
