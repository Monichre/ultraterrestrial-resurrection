'use client'

import {useState} from 'react'
import {toast} from 'sonner'
import {motion, AnimatePresence} from 'motion/react'

import {Progress} from '@/components/ui/progress'

interface Summary {
  title: string
  summary: string
  keyPoints: string[]
  siteName?: string
}

export default function WebSummarizer() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentUrl) return

    try {
      setIsLoading(true)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 20, 90))
      }, 500)

      const loadingToast = toast.loading('Analyzing webpage@/registry.cheerio-generate-object/')
      const result = await scrapeAndSummarize(currentUrl)
      setSummary(result)

      clearInterval(progressInterval)
      setProgress(100)

      toast.dismiss(loadingToast)
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error('Failed to analyze webpage', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container max-w-3xl py-10 space-y-8'>
      <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Cheerio Scraper & AI Summarizer</h1>
        <p className='text-muted-foreground'>
          Enter a URL to generate an AI-powered summary with key takeaways
        </p>
      </motion.div>

      <CultUrlInputForm
        url={currentUrl}
        setUrl={setCurrentUrl}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {isLoading && (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className='w-full space-y-2'>
          <Progress value={progress} className='h-2' />
          <p className='text-sm text-muted-foreground text-center'>
            Analyzing content... {Math.round(progress)}%
          </p>
        </motion.div>
      )}

      <AnimatePresence mode='wait'>
        {isLoading && <LoadingSkeleton />}

        {summary && !isLoading && (
          <SummaryDisplay
            title={summary.title}
            summary={summary.summary}
            keyPoints={summary.keyPoints}
            siteName={summary.siteName}
            url={currentUrl}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
