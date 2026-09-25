'use client'

import type React from 'react'
import {useState, useRef} from 'react'
import {useUnifiedPipeline} from '../unified/AIPipeline'

export function AudioProcessingPipeline() {
  const {addAudioData, setIsProcessing, isProcessing} = useUnifiedPipeline()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [transcription, setTranscription] = useState<string>('')
  const [analysis, setAnalysis] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      // Create URL for audio preview
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
    }
  }

  const processAudio = async () => {
    if (!audioFile) {
      alert('Please upload an audio file')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate audio processing with a delay
      // In a real implementation, this would call a speech-to-text service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock transcription
      const mockTranscription = `This is a simulated transcription of the audio file "${audioFile.name}". 
In a real implementation, we would use a service like Whisper API to transcribe the audio content.
The transcription would capture all spoken words and identify speakers where possible.`

      setTranscription(mockTranscription)

      // Generate mock analysis
      const mockAnalysis = {
        duration: Math.round(Math.random() * 300 + 60), // 1-6 minute audio
        speakers: Math.round(Math.random() * 3 + 1), // 1-4 speakers
        mainTopics: ['Topic A', 'Topic B', 'Topic C'],
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        keyPhrases: [
          'important phrase one',
          'notable statement two',
          'significant expression three',
        ],
        confidence: 0.89,
      }

      setAnalysis(mockAnalysis)

      // Add audio data to the unified pipeline
      addAudioData({
        id: Date.now().toString(),
        filename: audioFile.name,
        transcription: mockTranscription,
        analysis: mockAnalysis,
      })
    } catch (error) {
      console.error('Error processing audio:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setAudioUrl('')
    setTranscription('')
    setAnalysis(null)
  }

  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <h1 className='text-2xl lg:text-3xl font-bold'>Audio Processing Pipeline</h1>
        <p className='text-muted-foreground text-pretty text-sm max-w-2xl'>
          Upload audio files to transcribe them and extract insights through AI analysis.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>Upload Audio File</label>
            <input
              type='file'
              onChange={handleFileUpload}
              accept='audio/*'
              className='w-full border rounded py-2 px-3 bg-transparent'
            />
          </div>

          {audioUrl && (
            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Audio Preview</label>
              <audio ref={audioRef} src={audioUrl} controls className='w-full' />
              <div className='flex space-x-2'>
                <button
                  onClick={clearAudio}
                  className='px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'>
                  Clear
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={processAudio}
              disabled={isProcessing || !audioFile}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'>
              {isProcessing ? 'Processing...' : 'Process Audio'}
            </button>
          </div>
        </div>

        <div className='bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg space-y-6'>
          {transcription ? (
            <>
              <div>
                <h3 className='text-lg font-medium mb-2'>Transcription</h3>
                <div className='bg-slate-100 dark:bg-slate-800 rounded p-4 text-sm max-h-[200px] overflow-y-auto'>
                  {transcription}
                </div>
              </div>

              {analysis && (
                <div>
                  <h3 className='text-lg font-medium mb-2'>Analysis</h3>
                  <div className='bg-slate-100 dark:bg-slate-800 rounded p-4 text-sm'>
                    <dl className='divide-y divide-gray-200 dark:divide-gray-700'>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Duration</dt>
                        <dd>{analysis.duration} seconds</dd>
                      </div>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Speakers</dt>
                        <dd>{analysis.speakers}</dd>
                      </div>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Sentiment</dt>
                        <dd>{analysis.sentiment}</dd>
                      </div>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Topics</dt>
                        <dd>{analysis.mainTopics.join(', ')}</dd>
                      </div>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Key Phrases</dt>
                        <dd>{analysis.keyPhrases.join(', ')}</dd>
                      </div>
                      <div className='grid grid-cols-2 py-2'>
                        <dt>Confidence</dt>
                        <dd>{Math.round(analysis.confidence * 100)}%</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='text-muted-foreground text-sm py-8 text-center'>
              Upload and process an audio file to see the transcription and analysis
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
