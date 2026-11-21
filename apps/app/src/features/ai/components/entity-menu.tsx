'use client'
import {
  Apple,
  ArrowRight,
  CheckSquare,
  Grid,
  Info,
  MessageSquare,
  Skull,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

const transformValues = [
  { height: 0, transformY: -200 },
  { height: 252, transformY: 0 },
  { height: 186, transformY: -240 },
  { height: 172, transformY: -430 },
  { height: 168, transformY: -600 },
]

export const EntityMenu = () => {
  const [active, setActive] = useState(-1)

  const { height, transformY } = transformValues[active + 1]

  return (
    <main className='relative w-full flex items-center justify-center p-12'>
      <div className='relative p-3 max-w-xl w-full flex flex-col items-center gap-3'>
        <button
          style={{
            transition: 'transform 0.3s',
            transform: active === -1 ? 'translateY(0)' : 'translateY(-200px)',
            opacity: active === -1 ? 0 : 1,
          }}
          className='p-2 rounded-full bg-slate-100 text-slate-800'
          onClick={() => setActive(-1)}
        >
          <X size={24} />
        </button>
        <div
          className='rounded-full relative w-full bg-slate-100 p-1.5 flex items-center'
          style={{
            transition: 'transform 0.3s',
            transform:
              active === -1 ? 'translateY(-26px)' : 'translateY(-150px)',
          }}
        >
          {['Portfolio', 'Launches', 'Products', 'Company'].map(
            (label, index) => (
              <button
                key={index}
                className='font-semibold rounded-full w-full p-1.5 text-slate-800 z-20'
                onClick={() => setActive(index)}
              >
                {label}
              </button>
            )
          )}
          <div
            className='p-1.5 flex items-center justify-center absolute inset-0 w-1/4 z-10'
            style={{
              transform: `translateX(${active * 100}%)`,
              transition: 'transform 0.3s',
              opacity: active === -1 ? 0 : 1,
            }}
          >
            <div className='bg-white shadow-sm rounded-full w-full h-full'></div>
          </div>
        </div>
        <div
          className='p-3 rounded-3xl w-[620px] flex flex-col items-center gap-4 absolute h-10 bg-white left-1/2 -translate-x-1/2 top-96 overflow-hidden'
          style={{
            transform:
              active === -1 ? 'translate(-50%, 0)' : 'translate(-50%, -390px)',
            opacity: active === -1 ? 0 : 1,
            transition:
              'transform 0.3s, opacity 0.3s, background 0.3s, height 0.3s',
            background: active === 3 ? 'white' : '#f1f5f9',
            height: `${height}px`,
          }}
        >
          <div
            className='text-black rounded-lg w-full'
            style={{
              transform: `translateY(${transformY}px)`,
              transition: 'transform 0.3s',
            }}
          >
            <div className='flex justify-between items-center gap-4'>
              <div className='bg-slate-200 w-1/2 h-28 rounded-xl p-4'>
                <div className='text-sm text-slate-500 mb-2'>My Sales</div>
                <div className='text-sm text-slate-500'>Investment Gain</div>
                <div className='text-3xl font-bold'>$2,580.12</div>
              </div>
              <div className='bg-slate-200 w-1/2 h-28 rounded-xl p-4 flex flex-col justify-between'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-slate-500'>Profile</div>
                  <span>98e3...c463</span>
                </div>
                <div className='flex items-center justify-between space-x-2'>
                  <Skull className='text-green-500 shrink-0 w-10' />
                  <button className='flex items-center justify-between pl-2 pr-4 py-2 bg-green-500 rounded-full gap-3 text-white'>
                    <div className='rounded-full bg-white w-8 h-8 flex items-center justify-center'>
                      <ArrowRight className='text-green-500' />
                    </div>
                    <span className=''>Dashboard</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-4 p-4 bg-slate-200 rounded-xl flex items-center space-x-4'>
              <div>
                <div className='text-sm text-slate-500'>
                  Use the Ape App &amp; earn up to 100% yield on your crypto.
                </div>
                <button className='mt-2 px-4 py-2 bg-green-500 rounded-full text-white'>
                  Try the App
                </button>
              </div>
            </div>
          </div>

          <div
            className='text-black rounded-lg w-full'
            style={{
              transform: `translateY(${transformY}px)`,
              transition: 'transform 0.3s',
            }}
          >
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-xs text-green-500 font-bold'>mix mobs</div>
                <div className='text-lg font-bold'>
                  The Everything App For BRC and Bitcoin.
                </div>
                <button className='mt-4 px-4 py-2 bg-green-500 rounded-full text-white'>
                  Participate
                </button>
              </div>
            </div>

            <div className='mt-4 flex items-center justify-between bg-slate-100 p-4 rounded-lg'>
              <div className='flex items-center space-x-2'>
                <Grid className='text-slate-500' />
                <span>All Launches</span>
              </div>
              <button className='text-sm text-slate-500'>See All</button>
            </div>
          </div>

          <div
            className='text-black rounded-lg w-full flex space-x-4'
            style={{
              transform: `translateY(${transformY}px)`,
              transition: 'transform 0.3s',
            }}
          >
            <div className='flex-1 bg-slate-100 p-4 rounded-lg flex flex-col justify-between'>
              <div>
                <Apple className='w-8 h-8 mb-2' />
                <div className='text-lg font-bold'>Ape & Co.</div>
                <div className='text-sm text-slate-500'>
                  The only Web 3 consultants that deliver results.
                </div>
              </div>
            </div>
            <div className='flex-1 bg-slate-100 p-4 rounded-lg flex flex-col justify-between'>
              <div>
                <Apple className='w-8 h-8 mb-2' />
                <div className='text-lg font-bold'>Ape Arcade</div>
                <div className='text-sm text-slate-500'>
                  Ape into Fun Browser Games and Win Prizes.
                </div>
              </div>
            </div>
          </div>

          <div
            className='text-black rounded-lg w-full flex items-center justify-end'
            style={{
              transform: `translateY(${transformY}px)`,
              transition: 'transform 0.3s',
            }}
          >
            <div className='bg-slate-100 p-4 rounded-lg space-y-4'>
              <div className='flex items-center space-x-3'>
                <Info className='text-slate-500' />
                <span>About</span>
              </div>
              <div className='flex items-center space-x-3'>
                <MessageSquare className='text-slate-500' />
                <span>FAQ</span>
              </div>
              <div className='flex items-center space-x-3'>
                <CheckSquare className='text-slate-500' />
                <span>Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
