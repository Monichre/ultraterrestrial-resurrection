'use client'
import * as React from 'react'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Answer( { prompt, answer }: { prompt: any; answer: any } ) {
  console.log( 'answer: ', answer )
  return (
    <div className='container flex flex-col h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#C2C2C2] bg-white dark:bg-black p-5 '>
      {/* <div className='hidden lg:block'>
        <Image
          unoptimized
          src='/img/Info.svg'
          alt='footer'
          width={24}
          height={24}
        />
      </div> */}
      <div className='w-full'>
        <div className='flex items-center justify-between pb-3'>
          <div className='flex gap-4'>
            {prompt && (
              <h3 className='text-base font-bold uppercase text-black dark:text-white'>
                Question:{prompt}
              </h3>
            )}
            {answer && (
              <h3 className='text-base font-bold uppercase text-black dark:text-white'>
                Answer:
              </h3>
            )}
          </div>
          {answer && (
            <div className='flex items-center gap-1'>
              {/* <Image unoptimized
                src="/img/link.svg"
                alt="footer"
                width={20}
                height={20}
                className="cursor-pointer"
              /> */}

              {/* <Image unoptimized
                src="/img/share.svg"
                alt="footer"
                width={20}
                height={20}
                className="cursor-pointer"
              /> */}
            </div>
          )}
        </div>
        {/* <div className='flex flex-wrap content-center items-center gap-[15px]'> */}
        <div className='w-full font-light text-black dark:text-white bg-black ai-response-markup'>
          {answer}
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
