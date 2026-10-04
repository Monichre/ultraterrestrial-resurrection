'use client'

export const SuggestedSearchItem = ( { value, onClick }: any ) => {
  const handleClick = () => {
    onClick( value )
  }
  return (
    <li onClick={handleClick}>
      <span className='flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-white outline-none'>
        <svg
          className='w-4 h-4'
          viewBox='0 0 82 84'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M41.5816 1.21606C39.7862 5.82482 40.3852 10.0977 40.5593 14.9633C40.7854 21.2812 40.9774 27.5593 41.4363 33.8661'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M41.0651 45.1798C39.7505 51.5096 40.3418 57.6794 40.8893 64.0791C41.4093 70.1568 42.1389 76.2117 42.8566 82.2682'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M1.13413 46.6647C5.16696 44.8703 8.96881 44.7974 13.3092 44.5029C19.8761 44.0572 26.2025 43.2089 32.656 41.952'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M47.2629 40.0959C58.4139 39.3819 69.3895 37.5305 80.4472 35.9965'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M49.3429 34.6508L52.917 28.1667'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M32.9786 50.3504L28.6387 54.6391'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M52.6361 48.6656L56.9506 51.5758'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
          <path
            d='M31.549 30.8471C26.8741 29.4323 22.7143 27.3543 18.2738 25.3586'
            stroke='currentColor'
            strokeWidth='1.90596'
            stroke-linecap='round'
          />
        </svg>
        <span className='inline-block ml-2'>{value}</span>
      </span>
    </li>
  )
}
