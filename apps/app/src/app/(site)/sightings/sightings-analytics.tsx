'use client'

import type React from 'react'
import {useRef, useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'

import {Card, CardContent} from '@/components/ui/card'
import SightingsAIInsights from '@/features/sightings/sightings-ai-insights'
import {AlertCircle, Sparkles} from 'lucide-react'
import type {SightingsAnalysisResult} from '@/services/sightings/actions/sightings-ai-analysis'

interface SightingsAnalyticsProps {
  sightingsData: any[]
  analyzeSightingsData: (sightingsData: any[]) => Promise<{
    analysis: SightingsAnalysisResult
    streamingValue: any
  }>
}

const SightingsAnalytics: React.FC<SightingsAnalyticsProps> = ({
  sightingsData,
  analyzeSightingsData,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SightingsAnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAnalyzeClick = async () => {
    if (!sightingsData || sightingsData.length === 0) {
      setAnalysisError('No sightings data available for analysis')
      return
    }

    try {
      setIsAnalyzing(true)
      setAnalysisError(null)
      // Open the dialog immediately to show loading state
      setDialogOpen(true)

      const {analysis} = await analyzeSightingsData(sightingsData)

      // Update the state with the analysis results
      setAnalysisResult(analysis)
    } catch (error) {
      console.error('Error analyzing sightings:', error)
      setAnalysisError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const terminalLinesRef = useRef<HTMLDivElement[]>([])
  const progressFillRef = useRef<HTMLDivElement>(null)
  const terminalWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show the terminal window
    if (terminalWindowRef.current) {
      setTimeout(() => {
        terminalWindowRef.current!.style.opacity = '1'
        terminalWindowRef.current!.style.width = '100%'
        animateTerminalText()
      }, 500)
    }

    // Fill the progress bar
    if (progressFillRef.current) {
      setTimeout(() => {
        progressFillRef.current!.style.width = '100%'
      }, 1000)
    }
  }, [])

  // Function to animate terminal text
  const animateTerminalText = () => {
    // Make all lines visible with a staggered delay
    terminalLinesRef.current.forEach((line, index) => {
      if (line) {
        setTimeout(() => {
          line.style.opacity = '1'
          line.classList.add('visible')
        }, index * 80) // 80ms delay between each line
      }
    })
  }

  // Function to set terminal line refs
  const setTerminalLineRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      terminalLinesRef.current[index] = el
    }
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div className='terminal-container w-[550px] p-2'>
        {/* Terminal Window */}
        <div className='terminal-window w-full' ref={terminalWindowRef}>
          <div className='terminal-header'>
            <span className='terminal-title'>SYS_TERM_V42.EXE</span>
            <div className='terminal-controls'>
              <span className='terminal-control'></span>
              <span className='terminal-control'></span>
              <span className='terminal-control'></span>
            </div>
          </div>
          <Sparkles className='h-5 w-5' /> AI Sightings Analysis
          <div className='terminal-content'>
            {/* Card to display prompt for analysis if no analysis has been run yet and we're not loading */}
            {!isAnalyzing && !analysisResult && !analysisError && (
              <Card className='bg-black/40 border-[#78efff]/10'>
                <CardContent className='pt-6 text-center'>
                  <p className='mb-4'>
                    Analyzing {sightingsData.length} UFO sightings to reveal patterns and insights
                  </p>
                  <Button
                    onClick={handleAnalyzeClick}
                    className='bg-[#78efff]/20 hover:bg-[#78efff]/30 text-[#78efff]'>
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          <div className='terminal-content'>
            {/* Display error state */}
            {analysisError && (
              <div className='bg-red-900/20 border border-red-800/50 rounded-lg p-6 flex gap-4 items-start'>
                <AlertCircle className='h-5 w-5 text-red-400 mt-0.5' />
                <div>
                  <h3 className='font-medium text-red-400'>Analysis Error</h3>
                  <p className='text-red-300/80 text-sm mt-1'>{analysisError}</p>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mt-4 bg-red-900/30 border-red-800/50 hover:bg-red-900/50 text-red-300'
                    onClick={handleAnalyzeClick}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Display AI insights component */}
            <SightingsAIInsights
              data={analysisResult || undefined}
              isLoading={isAnalyzing}
              error={analysisError || undefined}
            />
          </div>
          {/* Progress bar at bottom */}
          <div className='progress-container'>
            <div className='progress-label'>TERMINAL</div>
            <div className='progress-bar'>
              <div className='progress-fill' ref={progressFillRef}></div>
            </div>
            <div className='progress-close'>[X]</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SightingsAnalytics
