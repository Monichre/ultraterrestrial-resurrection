
import { getXataClient } from '@/db/xata'

import { Particles } from '@/components/animated/particles/Particles'
import SwipeGrid from '@/components/animated/swipe-grid/SwipeGrid'
import { TextEffect } from '@/components/animated/text-effect'
import { Loading } from '@/components/loaders/loading'
import { cn } from '@/utils'
import { Suspense } from 'react'

type photo = {
  signedUrl: string
  enablePublicUrl: boolean
}
type KeyFigure = {
  name: string
  bio: string
  role: string
  photo: photo | photo[]
  facebook: string
  twitter: string
  website: string
  instagram: string
  rank: number
  credibility: number
  popularity: number
}
export type KeyFiguresArray = KeyFigure[]
export default async function Index() {
  const xata = getXataClient()
  const data: any = await xata.db.personnel
    .select( [
      'name',
      'bio',
      'role',
      'photo',

      'rank',
      'credibility',
      'popularity',
      'photo.signedUrl',
      'photo.enablePublicUrl',
    ] )
    .getAll()

  const personnel = data.toSerializable()
  console.log( 'personnel: ', personnel )
  return (
    <Suspense fallback={<Loading />}>
      <div className='key-figures relative'>
        <div
          className={cn(
            `fixed`,
            'top-[100px]',
            'left-[50px]',

            'w-min',
            'h-min',
            'z-50'
          )}
        >
          <TextEffect
            per='char'
            preset='fade'
            className='text-white text-6xl header-style'
            as='h1'
          >
            Key Figures
          </TextEffect>
        </div>
        <SwipeGrid items={personnel}>
          {/* <BoxReveal boxColor={'#5046e6'} duration={0.5}>
            <p className='text-[3.5rem] font-semibold'>
              Key Figures<span className='text-[#5046e6]'>.</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor={'#5046e6'} duration={0.5}>
            <h2 className='mt-[.5rem] text-[1rem]'>
              These are the need-to-know or who's-who of Ufology
              <span className='text-[#5046e6]'>Subject Matter Experts</span>
              <span className='text-[#5046e6]'>Critical Personnel</span>
            </h2>
          </BoxReveal>

          <BoxReveal boxColor={'#5046e6'} duration={0.5}>
            <div className='mt-[1.5rem]'>
              <p>
                Help us verify the credibility of these individuals' <br />
                <span className='font-semibold text-[#5046e6]'> Claims</span>,
                <span className='font-semibold text-[#5046e6]'> Expertise</span>
                ,
                <span className='font-semibold text-[#5046e6]'>
                  {' '}
                  Testimony CSS
                </span>
              </p>
            </div>
          </BoxReveal>

          <BoxReveal boxColor={'#5046e6'} duration={0.5}>
            <p>
              <span className='font-semibold text-[#5046e6]'>
                {' '}
                Not seeing someone
              </span>
              submit a request to add a key figure <br />
              . <br />
              <Button className='mt-[1.6rem] bg-[#5046e6]'>Add Now</Button>
            </p>
          </BoxReveal> */}
        </SwipeGrid>
        <Particles />
      </div>
    </Suspense>
  )
}
