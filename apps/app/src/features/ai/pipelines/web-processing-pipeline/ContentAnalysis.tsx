'use client'

import {toast} from 'sonner'
import {useState} from 'react'
import {motion, AnimatePresence} from 'motion/react'
import {BookOpen, ListChecks, Copy, ExternalLink, ChevronDown} from 'lucide-react'

import {Card} from '@/components/ui/card'
import {Button} from '@/components/ui/button'

interface ContentAnalysisProps {
  title: string
  summary: string
  keyPoints: string[]
  siteName?: string
  url: string
}

export function ContentAnalysis({title, summary, keyPoints, siteName, url}: ContentAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
      if (index !== undefined) {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      }
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -20}}
      className='w-full max-w-3xl mx-auto'>
      <Card className='p-6 space-y-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl  hover:shadow-lg transition-all duration-300 ease-in-out'>
        <motion.div
          className='space-y-2'
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.1}}>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
            {title}
          </h2>
          {siteName && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{siteName}</span>
              <a
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors duration-200'>
                Visit site <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          )}
        </motion.div>

        <div className='space-y-6'>
          <motion.div
            className='space-y-2'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.2}}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
                <BookOpen className='h-5 w-5' />
                <h3>Summary</h3>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(summary)}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200'>
                <Copy className='h-4 w-4 mr-2' />
                Copy
              </Button>
            </div>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{summary}</p>
          </motion.div>

          <motion.div
            className='space-y-2'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
                <ListChecks className='h-5 w-5' />
                <h3>Key Points</h3>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => copyToClipboard(keyPoints.join('\n'))}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200'>
                <Copy className='h-4 w-4 mr-2' />
                Copy all
              </Button>
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.ul
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: 'auto'}}
                  exit={{opacity: 0, height: 0}}
                  transition={{duration: 0.3, ease: 'easeInOut'}}
                  className='space-y-2 mt-2'>
                  {keyPoints.map((point, index) => (
                    <motion.li
                      key={typeof point === 'string' ? point.slice(0, 32) : index}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: index * 0.1}}
                      className='flex items-start gap-2 text-gray-700 dark:text-gray-300 group py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200'>
                      <span className='font-medium text-gray-900 dark:text-gray-100 mr-2'>
                        {index + 1}.
                      </span>
                      <span className='flex-1'>{point}</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => copyToClipboard(point, index)}
                        className='opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                        {copiedIndex === index ? (
                          <span className='text-green-500 dark:text-green-400'>Copied!</span>
                        ) : (
                          <Copy className='h-3 w-3' />
                        )}
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
              className='w-full mt-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200'>
              {isExpanded ? 'Show Less' : 'Show More'}
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
