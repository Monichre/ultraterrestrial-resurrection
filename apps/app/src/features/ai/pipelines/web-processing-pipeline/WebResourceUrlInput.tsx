'use client'

import {Check, Loader2, X} from 'lucide-react'
import React, {memo, useCallback, useMemo, useRef, useState, useTransition} from 'react'
import {AnimatePresence, LayoutGroup, motion, useReducedMotion} from 'motion/react'

import {cn} from '@/utils'

interface CultUrlInputFormProps {
  url: string
  setUrl: (url: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  className?: string
}

const IconWrapper = React.memo(({children}: {children: React.ReactNode}) => (
  <motion.div
    className='absolute inset-y-0 right-0 flex items-center pr-4 overflow-hidden'
    initial='hidden'
    animate='visible'
    exit='exit'>
    {children}
  </motion.div>
))

IconWrapper.displayName = 'IconWrapper'

export const WebResourceUrlInput = memo(
  ({url, setUrl, onSubmit, isLoading, className}: CultUrlInputFormProps) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [prevState, setPrevState] = useState<'idle' | 'error' | 'success' | 'loading'>('idle')
    const [isPending, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement>(null)
    const shouldReduceMotion = useReducedMotion()

    const validateURL = useCallback((input: string) => {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' +
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
          '((\\d{1,3}\\.){3}\\d{1,3}))' +
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
          '(\\?[;&a-z\\d%_.~+=-]*)?' +
          '(\\#[-a-z\\d_]*)?$',
        'i'
      )
      return !!input && pattern.test(input)
    }, [])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^(https?:\/\/)/, '')
        setUrl(value)
        startTransition(() => {
          const newIsValid = validateURL(value)
          setIsValid(newIsValid)

          if (value === '') {
            setPrevState('idle')
          } else if (newIsValid && prevState !== 'success') {
            setPrevState('success')
          } else if (!newIsValid && prevState !== 'error') {
            setPrevState('error')
          }
        })
      },
      [setUrl, validateURL, prevState]
    )

    const prefixVariants = useMemo(
      () => ({
        hidden: {opacity: 0, x: -20, width: 0},
        visible: {
          opacity: 1,
          x: 0,
          width: 'auto',
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
            type: 'spring',
            stiffness: 500,
            damping: 25,
          },
        },
        exit: {
          opacity: 0,
          x: -20,
          width: 0,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.1,
            ease: [0.23, 1, 0.32, 1],
          },
        },
      }),
      [shouldReduceMotion]
    )

    const inputVariants = useMemo(
      () => ({
        focused: {
          scale: shouldReduceMotion ? 1 : 1.02,
          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
        },
        blurred: {scale: 1, boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)'},
      }),
      [shouldReduceMotion]
    )

    const buttonVariants = useMemo(
      () => ({
        hidden: {opacity: 0, scale: 0.8},
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: shouldReduceMotion ? 0 : 0.2,
            ease: [0.23, 1, 0.32, 1],
          },
        },
      }),
      [shouldReduceMotion]
    )

    const iconVariants = {
      hidden: {
        opacity: 0,
        y: -20,
        transition: {duration: shouldReduceMotion ? 0 : 0.2},
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 25,
          duration: shouldReduceMotion ? 0 : 0.3,
        },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: {duration: shouldReduceMotion ? 0 : 0.2},
      },
    }

    return (
      <div className='py-2'>
        <LayoutGroup>
          <motion.form
            layout
            onSubmit={onSubmit}
            className={cn(
              'flex space-x-4 items-center justify-start relative rounded-full bg-secondary px-1 py-1 border border-border shadow-inner',
              isFocused || isValid
                ? 'bg-transparent shadow-none border-transparent'
                : 'border-transparent shadow-inner',
              className
            )}>
            <motion.div
              layout
              className={cn(
                'relative w-full rounded-full',
                'before:pointer-events-none before:absolute before:-inset-0.5 before:rounded-full',
                'before:bg-gradient-to-r before:from-blue-200/50 before:to-purple-200/50 before:opacity-0',
                'before:blur-md before:transition-opacity before:duration-300',
                'focus-within:before:opacity-100',
                isFocused && 'before:opacity-100'
              )}
              initial='blurred'
              animate={isFocused ? 'focused' : 'blurred'}
              variants={inputVariants}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}>
              <div className='relative flex items-center'>
                <AnimatePresence>
                  {(isFocused || url !== '') && (
                    <motion.div
                      className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'
                      variants={prefixVariants}
                      initial='hidden'
                      animate='visible'
                      exit='exit'>
                      <motion.div
                        className='border border-stone-400/40 bg-muted shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]'
                        style={{
                          borderRadius: '18px 11px 11px 18px',
                          padding: '2px',
                        }}
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: shouldReduceMotion ? 0 : 0.2}}>
                        <div
                          style={{
                            borderRadius: '14px 8px 8px 14px',
                            boxShadow:
                              'inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.1)',
                          }}
                          className='bg-stone-50 py-1 px-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-stone-800 border border-t-stone-400/60 border-l-stone-400/60 border-r-stone-400/60 border-b-stone-400/60 inset'>
                          <motion.span
                            className={cn(
                              'text-stone-400 font-normal tracking-wide ',
                              isValid ? 'text-[#7DF2F9]' : ''
                            )}
                            animate={{color: isValid ? '#468AF2' : '#9CA3AF'}}
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.2,
                            }}>
                            https://
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type='text'
                  autoComplete='off'
                  className={cn(
                    'w-full rounded-full border border-black/10 bg-card py-3 pr-12 text-base font-medium transition-all duration-300 ease-in-out',
                    'placeholder:text-muted-foreground shadow-sm',
                    'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 text-muted-foreground',
                    'focus:shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_1px_4px_rgba(59,130,246,0.1)]',
                    isValid
                      ? 'border-[#7DF2F9] text-card-foreground focus:border-[#7DF2F9] focus:ring-[#7DF2F9]'
                      : 'border-stone-300 text-stone-800 focus:border-blue-400',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isFocused || url !== '' ? 'pl-24' : 'pl-4'
                  )}
                  ref={inputRef}
                  value={url}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder='Enter URL'
                  aria-label='Enter URL'
                  aria-invalid={!isValid && url !== ''}
                />
              </div>

              <AnimatePresence mode='popLayout'>
                {isLoading && (
                  <IconWrapper>
                    <motion.div
                      variants={iconVariants}
                      // custom={getCustomDirection("loading")}
                      initial='hidden'
                      animate='visible'
                      exit='exit'>
                      <Loader2 className='h-5 w-5 animate-spin text-[#468AF2]' />
                    </motion.div>
                  </IconWrapper>
                )}
              </AnimatePresence>
              <AnimatePresence mode='popLayout'>
                {!isLoading && url !== '' && !isValid && (
                  <IconWrapper>
                    <motion.div
                      variants={iconVariants}
                      initial='hidden'
                      animate='visible'
                      exit='exit'>
                      <X className='h-5 w-5 text-red-400' />
                    </motion.div>
                  </IconWrapper>
                )}
              </AnimatePresence>
              <AnimatePresence mode='popLayout'>
                {!isLoading && url !== '' && isValid && (
                  <IconWrapper>
                    <motion.div
                      variants={iconVariants}
                      initial='hidden'
                      animate='visible'
                      exit='exit'>
                      <Check className='h-5 w-5 text-[#538FEA] fill-[#7DF2F9]' />
                    </motion.div>
                  </IconWrapper>
                )}
              </AnimatePresence>
            </motion.div>
            {/* Submit button */}
            <AnimatePresence>
              {isValid && (
                <motion.div
                  variants={buttonVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                  layout
                  className='flex items-center justify-center bg-secondary py-1 px-1 border border-border shadow-inner rounded-full'>
                  <button
                    type='submit'
                    disabled={isLoading || !isValid}
                    className={cn(
                      'rounded-full px-4 py-2 font-medium text-white transition-colors duration-200',
                      // 'bg-primary/90 hover:bg-primary',
                      'bg-black/80 hover:bg-black',
                      'disabled:bg-stone-400 disabled:cursor-not-allowed',
                      'hover:border-border',
                      'shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                    )}
                    // whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                      }}>
                      {isLoading ? 'Loading' : 'Submit'}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </LayoutGroup>
      </div>
    )
  }
)
