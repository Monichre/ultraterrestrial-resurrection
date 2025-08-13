'use client'

import {useState} from 'react'
import {CanvasMenu, type MenuAction} from './CanvasMenu'

/**
 * Demo page for the CanvasMenu component
 * This can be used for testing and showcasing the component
 */
export function CanvasMenuDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [actionLog, setActionLog] = useState<Array<{timestamp: Date; action: MenuAction}>>([])
  const [position, setPosition] = useState({x: window.innerWidth / 2, y: window.innerHeight / 2})

  const handleAction = (action: MenuAction) => {
    console.log('Menu action triggered:', action)
    setActionLog((prev) => [...prev, {timestamp: new Date(), action}].slice(-10)) // Keep last 10 actions
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-black'>
      {/* Background Effects */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      {/* Canvas Menu Component */}
      <CanvasMenu
        position={position}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAction={handleAction}
      />

      {/* Demo Content */}
      <div className='relative z-10 container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
              Canvas Menu Demo
            </h1>
            <p className='text-xl text-white/60'>
              A beautiful command palette for the Ultraterrestrial mindmap
            </p>
          </div>

          {/* Instructions */}
          <div className='bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10'>
            <h2 className='text-2xl font-semibold text-white mb-4'>How to Use</h2>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-medium text-purple-400 mb-2'>Opening the Menu</h3>
                <ul className='space-y-2 text-white/70'>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    Click the floating button (bottom-right)
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    Press <kbd className='px-2 py-1 bg-white/10 rounded text-xs'>⌘/Ctrl</kbd> +{' '}
                    <kbd className='px-2 py-1 bg-white/10 rounded text-xs'>K</kbd>
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    Click "Open at Position" buttons below
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-lg font-medium text-purple-400 mb-2'>Available Actions</h3>
                <ul className='space-y-2 text-white/70'>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    AI Chat & Deep Research
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    Add Entities (Topics, Events, etc.)
                  </li>
                  <li className='flex items-center gap-2'>
                    <span className='text-cyan-400'>•</span>
                    Navigation & Tours
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className='grid md:grid-cols-3 gap-4 mb-8'>
            <button
              onClick={() => {
                setPosition({x: window.innerWidth / 2, y: window.innerHeight / 3})
                setIsOpen(true)
              }}
              className='px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity'>
              Open at Top
            </button>
            <button
              onClick={() => {
                setPosition({x: window.innerWidth / 2, y: window.innerHeight / 2})
                setIsOpen(true)
              }}
              className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity'>
              Open at Center
            </button>
            <button
              onClick={() => {
                setPosition({x: window.innerWidth / 2, y: (window.innerHeight * 2) / 3})
                setIsOpen(true)
              }}
              className='px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity'>
              Open at Bottom
            </button>
          </div>

          {/* Action Log */}
          {actionLog.length > 0 && (
            <div className='bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10'>
              <h2 className='text-2xl font-semibold text-white mb-4'>Action Log</h2>
              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {actionLog.reverse().map((log, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-4 p-3 bg-black/20 rounded-lg text-sm'>
                    <span className='text-white/40 text-xs'>
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <div className='flex-1'>
                      <span className='inline-block px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs mr-2'>
                        {log.action.type}
                      </span>
                      <span className='text-white/60 text-xs'>
                        {JSON.stringify(log.action.data)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              {emoji: '🎨', title: 'Beautiful Design', desc: 'Glassmorphic UI'},
              {emoji: '⚡', title: 'Fast & Smooth', desc: 'Optimized animations'},
              {emoji: '🤖', title: 'AI Powered', desc: 'Smart assistance'},
              {emoji: '⌨️', title: 'Keyboard First', desc: 'Full shortcuts'},
            ].map((feature) => (
              <div
                key={feature.title}
                className='bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-colors'>
                <div className='text-3xl mb-3'>{feature.emoji}</div>
                <h3 className='text-white font-medium mb-1'>{feature.title}</h3>
                <p className='text-white/50 text-xs'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
