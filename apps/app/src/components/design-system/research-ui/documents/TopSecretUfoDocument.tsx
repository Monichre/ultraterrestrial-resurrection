import React from 'react'
import {cn} from '../../../../lib/utils'
import TypedParagraph from './TypedParagraph'
import HandwrittenNote from './HandwrittenNote'
import DistressedPhoto from '../photography/distressed/DistressedPhoto'
import TopSecretBanner from './TopSecretBanner'
const TopSecretUfoDocument: React.FC = () => {
  return (
    <div className='min-h-screen w-full bg-amber-50 p-4 md:p-8'>
      <div className='mx-auto max-w-4xl'>
        {/* Document Container with Grid Background */}
        <div
          className={cn(
            'relative w-full bg-amber-100/80 p-8 md:p-12',
            'shadow-2xl border border-amber-200',
            'before:absolute before:inset-0 before:opacity-20',
            'before:bg-[linear-gradient(rgba(139,69,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,19,0.1)_1px,transparent_1px)]',
            'before:bg-[size:20px_20px]',
            'filter sepia-[0.3] contrast-[1.1]'
          )}
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,69,19,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,69,19,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}>
          {/* Header Section */}
          <header className='mb-8'>
            <div className='flex items-start justify-between mb-6'>
              <TopSecretBanner />
              <div className='flex flex-col items-end space-y-2'>
                <HandwrittenNote text='11:30 AM' className='text-blue-900 -rotate-2' />
                <HandwrittenNote text='believe' className='text-blue-900 rotate-1' />
                <HandwrittenNote text='parallel' className='text-blue-900 -rotate-1' />
                <HandwrittenNote text='orbit' className='text-blue-900 rotate-2' />
              </div>
            </div>

            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-wider'>
              WASHINGTON D.C. UFO WAVE — JULY 1952
            </h1>

            <div className='absolute top-32 right-16'>
              <HandwrittenNote text='208 by' className='text-blue-900 rotate-3' />
              <HandwrittenNote text='Steele' className='text-blue-900 rotate-1 ml-8' />
            </div>
          </header>

          {/* Main Content Grid */}
          <main className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Typed Content */}
            <div className='lg:col-span-2 space-y-6'>
              <TypedParagraph>
                ATIC logs recorded fast-moving lights reportedly skirting the Capitol dome before
                vanishing at 1 am.
              </TypedParagraph>

              <TypedParagraph>
                Examples note: repeated returns near the Washington National Airport paced and
                intervened with interceptor formation for 20 miles, grouped southward in a V
                formation.
              </TypedParagraph>

              <TypedParagraph className='mt-8'>
                At 2 am, radar signatures resumed, entailing 40 minute intercepts involving
                unidentified flights at 11,000 feet, erratic courses over Andrews AFB and the White
                House. Blips merged into another V heading over the river mouth.
              </TypedParagraph>
            </div>

            {/* Right Column - Photo and Handwritten Notes */}
            <div className='relative space-y-4'>
              {/* Handwritten notes around photo */}
              <div className='absolute -left-8 top-8'>
                <HandwrittenNote text='formation' className='text-blue-900 -rotate-12' />
                <HandwrittenNote text='V mostly' className='text-blue-900 -rotate-6 mt-1' />
              </div>

              <div className='absolute -left-12 top-24'>
                <HandwrittenNote text='targets' className='text-blue-900 -rotate-15' />
                <HandwrittenNote text='moving' className='text-blue-900 -rotate-8 mt-1' />
              </div>

              <div className='absolute -left-6 top-40'>
                <HandwrittenNote text='at' className='text-blue-900 -rotate-20' />
                <HandwrittenNote text='sheer' className='text-blue-900 -rotate-10 mt-1' />
                <HandwrittenNote text='determined' className='text-blue-900 -rotate-5 mt-1' />
                <HandwrittenNote text='pattern' className='text-blue-900 -rotate-12 mt-1' />
                <HandwrittenNote text='flight' className='text-blue-900 -rotate-8 mt-1' />
              </div>

              {/* Photo */}
              <div className='mt-16'>
                <DistressedPhoto />
              </div>

              {/* Bottom right handwritten notes */}
              <div className='absolute right-0 bottom-32'>
                <HandwrittenNote text='C' className='text-blue-900 rotate-12' />
                <HandwrittenNote text='twelve' className='text-blue-900 rotate-8 mt-2' />
                <HandwrittenNote text='moving' className='text-blue-900 rotate-15 mt-1' />
                <HandwrittenNote text='STAG' className='text-blue-900 rotate-10 mt-1' />
                <HandwrittenNote text='limit' className='text-blue-900 rotate-5 mt-1' />
                <HandwrittenNote text='and' className='text-blue-900 rotate-12 mt-1' />
                <HandwrittenNote text='limit' className='text-blue-900 rotate-8 mt-1' />
                <HandwrittenNote text='limit' className='text-blue-900 rotate-15 mt-1' />
              </div>

              <div className='absolute right-8 bottom-8'>
                <HandwrittenNote text='Vanessa' className='text-blue-900 rotate-6' />
                <HandwrittenNote text='2 am' className='text-blue-900 rotate-10 mt-1' />
                <HandwrittenNote text='Potomac' className='text-blue-900 rotate-3 mt-1' />
              </div>

              <div className='absolute right-0 bottom-0'>
                <HandwrittenNote text='faded' className='text-blue-900 rotate-8' />
                <HandwrittenNote text='& gone' className='text-blue-900 rotate-12 mt-1' />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className='mt-12 flex justify-center'>
            <TopSecretBanner />
          </footer>
        </div>
      </div>
    </div>
  )
}
export default TopSecretUfoDocument
