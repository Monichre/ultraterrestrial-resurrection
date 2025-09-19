import type {Meta, StoryObj} from '@storybook/react'
import {CanvasMenu, type MenuAction} from './CanvasMenu'
import {useState} from 'react'
import {action} from 'storybook/actions'

/**
 * CanvasMenu is a beautiful floating command palette inspired by CommandK design patterns.
 * It provides a modern interface for accessing AI features, entity management, and navigation controls.
 *
 * ## Features
 * - 🎨 Beautiful glassmorphic design with backdrop blur
 * - ⌨️ Keyboard shortcuts (Cmd/Ctrl + K to open)
 * - 🔍 Real-time search filtering
 * - 💬 Integrated AI chat interface
 * - 🎯 Entity management actions
 * - 🗺️ Tour and navigation controls
 * - ✨ Smooth animations and transitions
 *
 * ## Usage
 * ```tsx
 * <CanvasMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   onAction={(action) => handleMenuAction(action)}
 * />
 * ```
 */
const meta = {
  title: 'Mindmap/Menus/CanvasMenu',
  component: CanvasMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A modern floating command palette for the mindmap interface with AI integration and beautiful animations.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {name: 'dark', value: '#0a0a0a'},
        {name: 'space', value: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)'},
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      description: 'Position of the menu on screen',
      control: {type: 'object'},
      defaultValue: {x: window.innerWidth / 2, y: window.innerHeight / 2},
    },
    isOpen: {
      description: 'Controls whether the menu is open',
      control: {type: 'boolean'},
    },
    onClose: {
      description: 'Callback when menu is closed',
      action: 'closed',
    },
    onAction: {
      description: 'Callback when a menu action is triggered',
      action: 'action',
    },
    className: {
      description: 'Additional CSS classes for the trigger button',
      control: {type: 'text'},
    },
  },
} satisfies Meta<typeof CanvasMenu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state showing the floating trigger button.
 * Click the button or press Cmd/Ctrl + K to open the menu.
 */
export const Default: Story = {
  args: {},
  render: () => {
    const handleAction = action('onAction')

    return (
      <div className='h-screen bg-gradient-to-br from-gray-900 to-black relative'>
        <div className='absolute inset-0 bg-grid-white/[0.02]' />
        <CanvasMenu
          onAction={(menuAction: MenuAction) => {
            console.log('Menu action:', menuAction)
            handleAction(menuAction)
          }}
        />
        <div className='p-8 text-white/60'>
          <h1 className='text-2xl font-bold mb-4'>Canvas Menu Demo</h1>
          <p>
            Press <kbd className='px-2 py-1 bg-white/10 rounded'>⌘</kbd> +{' '}
            <kbd className='px-2 py-1 bg-white/10 rounded'>K</kbd> or click the button to open
          </p>
        </div>
      </div>
    )
  },
}

/**
 * Menu shown in open state with search functionality.
 * Try typing to filter commands in real-time.
 */
export const OpenWithSearch: Story = {
  args: {
    isOpen: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)
    const handleAction = action('onAction')

    return (
      <div className='h-screen bg-gradient-to-br from-gray-900 to-black'>
        <CanvasMenu
          {...args}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            action('closed')()
          }}
          onAction={(menuAction: MenuAction) => {
            console.log('Menu action:', menuAction)
            handleAction(menuAction)
            if (menuAction.type !== 'chat' && menuAction.type !== 'search') {
              setIsOpen(false)
            }
          }}
        />
        <div className='p-8 text-white/60'>
          <h1 className='text-2xl font-bold mb-4'>Search Commands</h1>
          <p>The menu is open. Try searching for:</p>
          <ul className='mt-4 space-y-2'>
            <li>• "chat" - AI chat features</li>
            <li>• "add" - Entity creation</li>
            <li>• "tour" - Navigation options</li>
            <li>• "research" - Deep analysis</li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Menu positioned at custom location.
 * The menu can be positioned anywhere on the screen.
 */
export const CustomPosition: Story = {
  args: {
    position: {x: 300, y: 300},
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState(args.position)
    const handleAction = action('onAction')

    return (
      <div className='h-screen bg-gradient-to-br from-gray-900 to-black relative'>
        <CanvasMenu
          {...args}
          position={position}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onAction={handleAction}
        />
        <div className='p-8 text-white/60'>
          <h1 className='text-2xl font-bold mb-4'>Custom Positioning</h1>
          <p className='mb-4'>Click anywhere to position the menu at that location</p>
          <div
            className='w-full h-96 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-crosshair'
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setPosition({
                x: e.clientX,
                y: e.clientY,
              })
              setIsOpen(true)
            }}>
            <span className='text-white/40'>Click to open menu at cursor position</span>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Interactive playground showing all menu states and actions.
 * This story demonstrates the full functionality of the CanvasMenu.
 */
export const Playground: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [lastAction, setLastAction] = useState<MenuAction | null>(null)
    const [actionHistory, setActionHistory] = useState<MenuAction[]>([])

    const handleAction = (menuAction: MenuAction) => {
      console.log('Menu action:', menuAction)
      action('onAction')(menuAction)
      setLastAction(menuAction)
      setActionHistory((prev) => [...prev.slice(-4), menuAction])
    }

    return (
      <div className='h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black relative overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl' />
        </div>

        <CanvasMenu isOpen={isOpen} onClose={() => setIsOpen(false)} onAction={handleAction} />

        <div className='relative z-10 p-8 text-white'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent'>
              Canvas Menu Playground
            </h1>
            <p className='text-white/60 mb-8'>Explore all features of the modern command palette</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Controls */}
              <div className='bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10'>
                <h2 className='text-xl font-semibold mb-4'>Controls</h2>
                <div className='space-y-4'>
                  <button
                    onClick={() => setIsOpen(true)}
                    className='w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity'>
                    Open Menu
                  </button>
                  <div className='text-sm text-white/60'>
                    <p>Or use keyboard shortcut:</p>
                    <div className='mt-2 flex items-center gap-2'>
                      <kbd className='px-3 py-1 bg-white/10 rounded border border-white/20'>⌘</kbd>
                      <span>+</span>
                      <kbd className='px-3 py-1 bg-white/10 rounded border border-white/20'>K</kbd>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Action */}
              <div className='bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10'>
                <h2 className='text-xl font-semibold mb-4'>Last Action</h2>
                {lastAction ? (
                  <div className='space-y-2'>
                    <div className='text-sm'>
                      <span className='text-white/60'>Type:</span>
                      <span className='ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs'>
                        {lastAction.type}
                      </span>
                    </div>
                    <div className='text-sm'>
                      <span className='text-white/60'>Data:</span>
                      <pre className='mt-1 p-2 bg-black/30 rounded text-xs overflow-auto'>
                        {JSON.stringify(lastAction.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className='text-white/40 text-sm'>No action triggered yet</p>
                )}
              </div>
            </div>

            {/* Action History */}
            {actionHistory.length> 0 && (
              <div className='mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10'>
                <h2 className='text-xl font-semibold mb-4'>Action History</h2>
                <div className='space-y-2'>
                  {actionHistory.map((action, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 p-2 bg-white/5 rounded-lg text-sm'>
                      <span className='text-white/40'>#{actionHistory.length - index}</span>
                      <span className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'>
                        {action.type}
                      </span>
                      <span className='text-white/60 text-xs truncate flex-1'>
                        {JSON.stringify(action.data)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[
                {icon: '🎨', label: 'Beautiful UI'},
                {icon: '⌨️', label: 'Keyboard First'},
                {icon: '🔍', label: 'Smart Search'},
                {icon: '🤖', label: 'AI Powered'},
              ].map((feature) => (
                <div
                  key={feature.label}
                  className='bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 text-center'>
                  <div className='text-2xl mb-2'>{feature.icon}</div>
                  <div className='text-sm text-white/60'>{feature.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Mobile responsive view of the canvas menu.
 * The menu adapts to smaller screens automatically.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleAction = action('onAction')

    return (
      <div className='h-screen bg-gradient-to-br from-gray-900 to-black relative'>
        <CanvasMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onAction={handleAction}
          className='bottom-4 right-4'
        />
        <div className='p-6 text-white'>
          <h1 className='text-xl font-bold mb-4'>Mobile View</h1>
          <p className='text-sm text-white/60'>
            The canvas menu is fully responsive and works great on mobile devices.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className='mt-4 px-4 py-2 bg-purple-500 rounded-lg text-sm'>
            Open Menu
          </button>
        </div>
      </div>
    )
  },
}
