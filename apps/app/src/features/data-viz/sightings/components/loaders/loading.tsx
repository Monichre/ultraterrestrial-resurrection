'use client'

import { Static } from '@/components/animated/static'

export const Loading = ( { children }: any ) => (
  <div className='h-screen w-screen relative'>
    <Static />
    <div className='absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center'>
      {children}
    </div>
  </div>
)
