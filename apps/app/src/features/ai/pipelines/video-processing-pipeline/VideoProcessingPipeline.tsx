'use client'

import type React from 'react'
import {useState, useRef} from 'react'
import {useUnifiedPipeline} from '../unified/AIPipeline'

export function VideoProcessingPipeline() {
  const {addVideoData, setIsProcessing, isProcessing} = useUnifiedPipeline()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [currentFrame, setCurrentFrame] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      // Create URL for video preview
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      // Reset states
      setAnalysis(null)
      setCurrentFrame(null)
    }
  }

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const frameUrl = canvas.toDataURL('image/jpeg')
        setCurrentFrame(frameUrl)
        return frameUrl
      }
    }
    return null
  }

  const processVideo = async () => {
    if (!videoFile) {
      alert('Please upload a video file')
      return
    }

    setIsProcessing(true)

    try {
      // Capture a frame for analysis if there's a video playing
      const frameUrl = captureFrame()

      // Simulate multi-stage video processing with delays
      setProcessingStage('Extracting frames...')
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStage('Analyzing content...')
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProcessingStage('Generating summary...')
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock analysis results
      const mockAnalysis = {
        duration: Math.round(Math.random() * 600 + 60), // 1-11 minute video
        resolution: '1920x1080',
        fps: 30,
        sceneCount: Math.round(Math.random() * 8 + 2), // 2-10 scenes
        detectedObjects: [
          {
            name: 'person',
            confidence: 0.92,
            count: Math.round(Math.random() * 5 + 1),
          },
          {
            name: 'car',
            confidence: 0.85,
            count: Math.round(Math.random() * 3),
          },
          {
            name: 'building',
            confidence: 0.78,
            count: Math.round(Math.random() * 2),
          },
        ],
        keyFrameTimestamps: ['00:00:05', '00:00:32', '00:01:17'],
        summary: `This is a simulated analysis of the video "${videoFile.name}". In a real implementation, we would analyze the video content frame by frame to identify objects, scenes, actions, and generate an intelligent summary of what's happening in the video.`,
        sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
        tags: ['tag1', 'tag2', 'tag3'],
      }

      setAnalysis(mockAnalysis)

      // Add to unified pipeline
      addVideoData({
        id: Date.now().toString(),
        filename: videoFile.name,
        frameUrl: frameUrl || '',
        analysis: mockAnalysis,
      })
    } catch (error) {
      console.error('Error processing video:', error)
    } finally {
      setProcessingStage('')
      setIsProcessing(false)
    }
  }

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoFile(null)
    setVideoUrl('')
    setAnalysis(null)
    setCurrentFrame(null)
  }

  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <h1 className='text-2xl lg:text-3xl font-bold'>Video Processing Pipeline</h1>
        <p className='text-muted-foreground text-pretty text-sm max-w-2xl'>
          Upload videos to analyze their content and extract insights through computer vision and
          AI.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>Upload Video File</label>
            <input
              type='file'
              onChange={handleFileUpload}
              accept='video/*'
              className='w-full border rounded py-2 px-3 bg-transparent'
            />
          </div>

          {videoUrl && (
            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Video Preview</label>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className='w-full'
                style={{maxHeight: '300px'}}
              />
              <div className='flex space-x-2'>
                <button onClick={captureFrame} className='px-3 py-1 bg-blue-500 text-white rounded'>
                  Capture Frame
                </button>
                <button
                  onClick={clearVideo}
                  className='px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'>
                  Clear
                </button>
              </div>
            </div>
          )}

          {currentFrame && (
            <div className='space-y-2'>
              <label className='block text-sm font-medium'>Captured Frame</label>
              <img
                src={currentFrame}
                alt='Captured frame'
                className='w-full border rounded'
                style={{maxHeight: '150px', objectFit: 'contain'}}
              />
            </div>
          )}

          <div>
            <button
              onClick={processVideo}
              disabled={isProcessing || !videoFile}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'>
              {isProcessing ? `Processing: ${processingStage}` : 'Process Video'}
            </button>
          </div>
        </div>

        <div className='bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg'>
          {analysis ? (
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium mb-2'>Video Analysis</h3>
                <div className='bg-slate-100 dark:bg-slate-800 rounded p-4 text-sm'>
                  <dl className='divide-y divide-gray-200 dark:divide-gray-700'>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Duration</dt>
                      <dd>{analysis.duration} seconds</dd>
                    </div>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Resolution</dt>
                      <dd>{analysis.resolution}</dd>
                    </div>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Frame Rate</dt>
                      <dd>{analysis.fps} fps</dd>
                    </div>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Scene Count</dt>
                      <dd>{analysis.sceneCount}</dd>
                    </div>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Sentiment</dt>
                      <dd>{analysis.sentiment}</dd>
                    </div>
                    <div className='grid grid-cols-2 py-2'>
                      <dt>Tags</dt>
                      <dd>{analysis.tags.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2'>Detected Objects</h3>
                <div className='bg-slate-100 dark:bg-slate-800 rounded p-4 text-sm'>
                  <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {analysis.detectedObjects.map((obj: any, index: number) => (
                      <li key={index} className='py-2 flex justify-between'>
                        <span>
                          {obj.name} ({obj.count})
                        </span>
                        <span>{Math.round(obj.confidence * 100)}% confidence</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2'>Summary</h3>
                <div className='bg-slate-100 dark:bg-slate-800 rounded p-4 text-sm'>
                  {analysis.summary}
                </div>
              </div>
            </div>
          ) : (
            <div className='text-muted-foreground text-sm py-8 text-center'>
              Upload and process a video file to see the analysis
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
