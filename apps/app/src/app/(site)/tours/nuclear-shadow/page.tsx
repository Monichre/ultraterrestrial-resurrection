import type {Metadata} from 'next'

import {NuclearShadowTour} from '@/features/guided-tours'

export const metadata: Metadata = {
  title: 'The Nuclear Shadow — Architecture of Secrecy',
  description:
    'Act I guided tour: Manhattan Project secrecy machinery to Roswell as a traversable evidence graph.',
}

export default function NuclearShadowTourPage() {
  return (
    <div className='dark fixed inset-0 z-50 bg-[var(--ut-void,#0b0e0c)]'>
      <NuclearShadowTour />
    </div>
  )
}
