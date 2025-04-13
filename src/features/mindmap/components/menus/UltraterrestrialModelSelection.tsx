'use client'

import {Brain, XIcon} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'
import {TextShimmer} from '@/components/animated/text-effect'
import {OracleIcon} from '@/components/icons/entity-icons'
import {ToggleButton} from '@/features/ai/components/ai-inputs/oracle-input'
import {cn, capitalize} from '@/utils'
import {ICON_GREEN} from '@/utils/constants'
import type {RefObject} from 'react'

/**
 * Model information for the search menu
 */
export interface ModelAction {
  icon: React.ReactNode
  label: string
  name: string
  type: string
  description: string
  searchAction: (searchTerm: string) => Promise<void>
}

/**
 * State interface for the model selection component
 */
export interface ModelSelectionState {
  selectedModel: string | null
  isModelMenuOpen: boolean
  deepResearchEnabled: boolean
}

/**
 * Props for the UltraterrestrialModelSelection component
 */
export interface UltraterrestrialModelSelectionProps {
  /** Current component state */
  state: ModelSelectionState
  /** Function to update state */
  updateState: (updates: Partial<ModelSelectionState>) => void
  /** Reference to the menu container */
  menuRef: RefObject<HTMLDivElement>
  /** Currently active command */
  activeCommand: string | null
  /** Function to remove the active command */
  removeActiveCommand: () => void
  /** Model search actions available */
  modelSearchActions: ModelAction[]
  /** Chat status for animation effects */
  chatStatus: string
}

/**
 * A component that handles model selection for the mindmap feature.
 * Shows the currently selected model and provides a dropdown menu to select different models.
 */
export function UltraterrestrialModelSelection({
  state,
  updateState,
  menuRef,
  activeCommand,
  removeActiveCommand,
  modelSearchActions,
  chatStatus,
}: UltraterrestrialModelSelectionProps) {
  const toggleModelMenu = () => {
    updateState({isModelMenuOpen: !state.isModelMenuOpen})
  }

  const closeModelMenu = () => {
    updateState({isModelMenuOpen: false})
  }

  return (
    <div className='relative w-full h-auto overflow-hidden'>
      <div className='flex flex-col justify-between items-center px-2 py-4 text-sm text-zinc-600 dark:text-zinc-400'>
        <div className='relative w-full z-50' ref={menuRef}>
          <div className='flex w-full justify-between items-center content-center px-2'>
            <div className='flex items-center gap-2'>
              <motion.button
                onClick={toggleModelMenu}
                className='flex justify-start items-center gap-1'>
                <div className='cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90'>
                  <OracleIcon
                    className={cn(
                      'w-3 h-3 mr-2',
                      chatStatus === 'in_progress' ? 'animate-spin' : ''
                    )}
                    fill={ICON_GREEN}
                  />
                  <TextShimmer as='span' className='inline-block mr-2'>
                    Oracle{' '}
                    {state?.selectedModel && `| ${capitalize(state.selectedModel as string)}`}{' '}
                  </TextShimmer>
                </div>
              </motion.button>

              {activeCommand && (
                <button
                  type='button'
                  className='cursor-pointer hover:shadow-sm hover:shadow-indigo-500/50 flex hover:ring-indigo-500/50 relative w-fit gap-3\1 rounded-xl align-center items-center content-center px-2 py-1 text-xs ring-1 ring-neutral-200 duration-200 ring-neutral-700 bg-neutral-950 bg-gradient-to-b from-black/90'
                  onClick={removeActiveCommand}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      removeActiveCommand()
                    }
                  }}
                  aria-label='Remove active command'>
                  <XIcon className='w-4 h-4 text-black/50 dark:text-white/50' />
                  <TextShimmer as='span' className='inline-block mr-2'>
                    {activeCommand}
                  </TextShimmer>
                </button>
              )}
            </div>
            <ToggleButton
              icon={<Brain className='w-4 h-4' />}
              label='Deep Research'
              onClick={() => updateState({deepResearchEnabled: !state.deepResearchEnabled})}
              useMemory={state.deepResearchEnabled}
            />
          </div>

          <motion.div
            ref={menuRef}
            className='rounded-xl relative flex gap-2 items-center relative w-full duration-200 text-neutral-500 willChange gpu-transform text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90'
            initial={{
              height: 0,
            }}
            animate={{
              height: state.isModelMenuOpen ? 250 : '0',
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              staggerChildren: 0.1,
              delayChildren: 0.2,
            }}>
            <AnimatePresence>
              {state.isModelMenuOpen && (
                <motion.div
                  key='model-menu'
                  className='pb-0 flex flex-col h-full items-end rounded-xl justify-evenly absolute w-full text-neutral-500 bg-neutral-950 bg-gradient-to-b from-black/90'
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}>
                  {modelSearchActions.map((model) => (
                    <motion.div
                      className='w-full shrink-0 px-2'
                      key={model.name}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}>
                      <button
                        type='button'
                        key={model.name}
                        className='w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-sm transition-colors dark:text-white'
                        onClick={() =>
                          updateState({
                            selectedModel: model.type,
                            isModelMenuOpen: false,
                          })
                        }>
                        <div className='flex items-center justify-start gap-2 flex-1'>
                          {model.icon}
                          <span className='capitalize'>{model.name}</span>
                        </div>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400 capitalize'>
                          {model.label}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
