import React from 'react'
import {cn} from '../../../../lib/utils'
const TopSecretBanner: React.FC = () => {
  return (
    <div
      className={cn(
        'inline-block px-6 py-2 border-4 border-gray-800',
        'bg-amber-100 shadow-md',
        'transform hover:scale-105 transition-transform duration-200'
      )}>
      <span
        className='text-gray-900 font-black text-lg md:text-xl tracking-[0.3em]'
        style={{
          fontFamily: "'Arial Black', 'Arial', sans-serif",
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        }}>
        TOP SECRET
      </span>
    </div>
  )
}
export default TopSecretBanner
