'use client'

import React, {useState} from 'react'
import {EntrancePreloader} from './index'

/**
 * Example usage of the EntrancePreloader component
 */
export const EntrancePreloaderExample: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false)

  return (
    <div>
      <EntrancePreloader
        title='System Access'
        subtitle='Authorization Required'
        footerLeft='Security Protocols Active'
        footerRight='Access Granted'
        progressLabel='Verifying'
        progressAction='Identity Confirmed'
        duration={5}
        onComplete={() => {
          console.log('Animation complete')
          setAnimationComplete(true)
        }}>
        <div className='flex flex-col items-center justify-center min-h-screen bg-black text-white p-8'>
          <h1 className='text-3xl font-bold mb-6'>Welcome to the System</h1>
          <p className='text-xl mb-8'>
            This content appears after the entrance animation completes.
          </p>

          <div className='bg-slate-800 p-6 rounded-lg max-w-lg'>
            <h2 className='text-xl font-semibold mb-4'>Animation Status</h2>
            <div className='flex items-center'>
              <div
                className={`w-3 h-3 rounded-full ${animationComplete ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span>{animationComplete ? 'Animation Complete' : 'Animation in Progress'}</span>
            </div>

            <div className='mt-4'>
              <p className='text-sm'>
                This example demonstrates how the EntrancePreloader component can be used to create
                an engaging loading experience before revealing your content.
              </p>
            </div>
          </div>
        </div>
      </EntrancePreloader>
    </div>
  )
}
