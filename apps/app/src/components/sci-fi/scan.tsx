'use client'

import {useState} from 'react'
import dynamic from 'next/dynamic'
import {Card} from '@/components/ui/card'
import {CanvasBackground} from './canvas-background'
import {SideUI} from './side-ui'
import {RightUI} from './right-ui'
import {ViewLabels} from './view-labels'

const Visualization = dynamic(() => import('./visualization').then((mod) => mod.Visualization), {
  ssr: false,
})
const Comparison = dynamic(() => import('./comparison').then((mod) => mod.Comparison), {
  ssr: false,
})

export function Scan() {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <div className='relative w-full max-w-4xl aspect-square'>
        <Card className='relative w-full h-full bg-black/50 border-cyan-500/20 overflow-hidden'>
          <CanvasBackground />

          <div className='absolute inset-0'>
            <div className='relative w-full h-full'>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  selectedTab === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                <Visualization />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  selectedTab === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                <Comparison />
              </div>
            </div>
          </div>

          <SideUI />
          <RightUI selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <ViewLabels selectedTab={selectedTab} />
        </Card>

        <div className='absolute -bottom-8 left-16 right-16 flex justify-between text-cyan-500 text-xs font-mono'>
          <div>SCAN_ID: XR-2024-0217</div>
          <div>STATUS: ANALYZING</div>
          <div>MATCH: 98.7%</div>
        </div>
      </div>
    </div>
  )
}
