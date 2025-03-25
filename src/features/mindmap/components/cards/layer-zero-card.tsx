'use client'
import * as React from 'react'

interface LazyerZeroCardProps {}

export const LazyerZeroCard = () => {
  return (
    <div className='text-white border-t-neutral-800 border-t-2 flex-col pb-16 pt-3 flex border-solid gap-[1.63rem] bg-neutral-950 text-sm min-[600px]:flex-row'>
      <div className='text-neutral-500 flex-grow pl-20 min-[1440px]:pl-28  min-[600px]:pl-11'>
        <div className='text-zinc-100 text-[1.75rem] leading-8 mb-2'>
          Receive
        </div>
      </div>
      <div className='text-neutral-500 flex-grow pt-3 min-[600px]:pt-0'>
        <div className='flex mb-4 gap-3'>
          <img
            className='w-10 h-10 max-w-full'
            src='https://layerzero.network/static/features/how-it-works/endpoint.svg'
          />
          <div>
            <div className='text-zinc-100'>LayerZero Endpoint</div>
            <div className='text-xs uppercase mt-1'>Onchain / DESTINATION</div>
          </div>
        </div>
        The Destination Endpoint enforces that the packet being delivered by the
        Executor matches the message verified by the DVNs.
      </div>
      <div className='text-neutral-500 flex-grow pt-3 min-[600px]:pt-0'>
        <div className='flex mb-4 gap-3'>
          <img
            className='w-10 h-10 max-w-full'
            src='https://layerzero.network/static/features/how-it-works/executor.svg'
          />
          <div>
            <div className='text-zinc-100'>Executor</div>
            <div className='text-xs uppercase mt-1'>Offchain</div>
          </div>
        </div>
        An Executor calls the ‘lzReceive’ function on the committed message to
        process the packet using the Receiver OApp's logic.
      </div>
      <div className='text-neutral-500 flex-grow pt-3 min-[600px]:pt-0'>
        <div className='flex mb-4 gap-3'>
          <img
            className='w-10 h-10 max-w-full'
            src='https://layerzero.network/static/features/how-it-works/contract.svg'
          />
          <div>
            <div className='text-zinc-100'>Receiver Contract</div>
            <div className='text-xs uppercase mt-1'>Onchain / DESTINATION</div>
          </div>
        </div>
        The message is received by the Receiver OApp Contract on the destination
        chain.
      </div>
    </div>
  )
}
