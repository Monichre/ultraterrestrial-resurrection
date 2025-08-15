'use client'

import {useState, useRef, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {SunMoon, Plus, Sparkles, MousePointerClick, X} from 'lucide-react'
import {NodeDropdown} from './NodeDropdown'
import {ModelDropdown} from './ModelDropdown'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {Badge} from '@/components/ui/badge'

const iconClass = 'w-4 h-4 text-[#adf0dd]'

const nodeTypeColors: {[key: string]: string} = {
  default: '#777',
  event: '#ff69b4',
  keyFigure: '#00ffff',
  organization: '#ffa500',
  caseFile: '#90ee90',
  artifact: '#add8e6',
  testimony: '#f0e68c',
  topic: '#e6e6fa',
}

export function DynamicToolbar() {
  const [clickedButton, setClickedButton] = useState<string | null>(null)
  const [isNodeDropdownOpen, setIsNodeDropdownOpen] = useState(false)
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const nodeDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  const mindmap = useMindMap()
  const selectedNodes = (mindmap?.nodes || []).filter((n: any) => n.selected)
  const clearSelectedNodes = () =>
    mindmap?.setNodes(mindmap.nodes.map((n: any) => ({...n, selected: false})))
  const deselectNode = (id: string) =>
    mindmap?.setNodes(mindmap.nodes.map((n: any) => (n.id === id ? {...n, selected: false} : n)))

  const options = [
    'Topics',
    'Events',
    'Key Figures',
    'Testimonies',
    'Organizations',
    'Case Files',
    'Artifacts',
  ]
  const [selectedOption, setSelectedOption] = useState('Model')

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === 'Plus') {
      setIsNodeDropdownOpen((prev) => !prev)
    } else if (buttonName === 'Dropdown') {
      setIsModelDropdownOpen((prev) => !prev)
    } else {
      setClickedButton(buttonName)
      setTimeout(() => setClickedButton(null), 1000)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (nodeDropdownRef.current && !nodeDropdownRef.current.contains(event.target as Node)) {
        setIsNodeDropdownOpen(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='bg-neutral-950 bg-gradient-to-b from-black/90 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-lg h-fit relative'>
      <div className='absolute -top-8 left-1/2 -translate-x-1/2 text-blue-600 font-medium rounded-md text-xs'>
        <AnimatePresence>
          {clickedButton && (
            <motion.div
              className='relative flex flex-col items-center'
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}>
              <div>{clickedButton} clicked</div>
              <div className='relative w-24 h-0.5 bg-slate-200 mt-1'>
                <motion.div
                  className='absolute left-0 h-full bg-blue-500'
                  initial={{width: 0}}
                  animate={{width: '100%'}}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleButtonClick('Theme toggle')}
          className='h-10 w-10'>
          <SunMoon className={iconClass} />
        </Button>
        <div className='h-px w-6 bg-zinc-200 dark:bg-zinc-800' />
        <div className='relative' ref={nodeDropdownRef}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleButtonClick('Plus')}
            className={cn('h-10 w-10', isNodeDropdownOpen && 'bg-zinc-800')}>
            <Plus className={iconClass} />
            {selectedNodes.length > 0 && (
              <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#adf0dd] text-[10px] font-medium text-black'>
                {selectedNodes.length}
              </span>
            )}
          </Button>
          <NodeDropdown isOpen={isNodeDropdownOpen} onClose={() => setIsNodeDropdownOpen(false)} />
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleButtonClick('Sparkles')}
          className='h-10 w-10'>
          <Sparkles className={iconClass} />
        </Button>
        <div className='relative' ref={modelDropdownRef}>
          <Button
            variant='ghost'
            onClick={() => handleButtonClick('Dropdown')}
            className={cn('h-10 w-10 relative group', isModelDropdownOpen && 'bg-zinc-800')}>
            <div className='relative flex items-center justify-center'>
              <MousePointerClick className={iconClass} />
              <span className='absolute -bottom-5 text-[10px] font-medium text-zinc-400'>
                {selectedOption}
              </span>
            </div>
          </Button>
          <ModelDropdown
            isOpen={isModelDropdownOpen}
            onClose={() => setIsModelDropdownOpen(false)}
            options={options}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
          />
        </div>
        <div className='h-px w-6 bg-zinc-900 text-zinc-100' />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => handleButtonClick('User')}
          className='h-10 w-10 p-0'>
          {/* SVG omitted for brevity */}
          <span className='sr-only'>User</span>
        </Button>
      </div>

      {/* Selected Nodes Display */}
      <AnimatePresence>
        {selectedNodes.length > 0 && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            className='mt-2 pt-2 border-t border-zinc-800 overflow-hidden'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='text-xs font-medium text-zinc-400'>Selected Nodes</h4>
              <button
                onClick={clearSelectedNodes}
                className='text-xs text-[#adf0dd] hover:underline'>
                Clear All
              </button>
            </div>
            <div className='flex flex-wrap gap-1 max-w-[200px]'>
              {selectedNodes.map((node: any) => (
                <Badge
                  key={node.id}
                  variant='outline'
                  className='bg-zinc-800 text-zinc-100 border-zinc-700 flex items-center gap-1'>
                  <span
                    className='w-2 h-2 rounded-full'
                    style={{backgroundColor: nodeTypeColors[node.type]}}
                  />
                  <span className='text-xs truncate max-w-[100px]'>
                    {node.data?.label || node.id}
                  </span>
                  <button
                    onClick={() => deselectNode(node.id)}
                    className='ml-1 text-zinc-400 hover:text-zinc-100'>
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
