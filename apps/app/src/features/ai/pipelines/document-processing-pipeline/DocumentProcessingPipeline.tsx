'use client'

import type React from 'react'
import {useState} from 'react'
import {useUnifiedPipeline} from '../unified/AIPipeline'

export function DocumentProcessingPipeline() {
  const {addDocumentData, setIsProcessing, isProcessing} = useUnifiedPipeline()
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentContent, setDocumentContent] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string>('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      setDocumentTitle(file.name)

      // Read file contents
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setDocumentContent(event.target.result as string)
        }
      }
      reader.readAsText(file)
    }
  }

  const processDocument = async () => {
    if (!documentTitle || !documentContent) {
      alert('Please provide both title and content')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate document processing with a delay
      // In a real implementation, this would call a document analysis service
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Sample analysis result
      const analysis = {
        wordCount: documentContent.split(/\s+/).length,
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        topicAnalysis: ['topic 1', 'topic 2', 'topic 3'],
        keyPhrases: ['key phrase 1', 'key phrase 2', 'key phrase 3'],
      }

      // Format analysis for display
      const formattedAnalysis = JSON.stringify(analysis, null, 2)
      setAnalysisResult(formattedAnalysis)

      // Add document data to the unified pipeline
      addDocumentData({
        id: Date.now().toString(),
        title: documentTitle,
        content: documentContent,
        analysis,
      })
    } catch (error) {
      console.error('Error processing document:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <h1 className='text-2xl lg:text-3xl font-bold'>Document Processing Pipeline</h1>
        <p className='text-muted-foreground text-pretty text-sm max-w-2xl'>
          Upload and analyze text documents to extract insights, topics, and key information.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Upload Document</label>
            <input
              type='file'
              accept='.txt,.md,.doc,.docx,.pdf'
              onChange={handleFileUpload}
              className='w-full border rounded py-2 px-3 bg-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Document Title</label>
            <input
              type='text'
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder='Enter document title'
              className='w-full border rounded py-2 px-3 bg-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Document Content</label>
            <textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder='Paste or type document content here'
              rows={10}
              className='w-full border rounded py-2 px-3 bg-transparent'
            />
          </div>

          <div>
            <button
              onClick={processDocument}
              disabled={isProcessing || !documentContent || !documentTitle}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'>
              {isProcessing ? 'Processing...' : 'Process Document'}
            </button>
          </div>
        </div>

        <div className='bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg'>
          <h3 className='text-lg font-medium mb-4'>Analysis Results</h3>
          {analysisResult ? (
            <pre className='text-sm whitespace-pre-wrap overflow-auto max-h-[400px] p-4 bg-slate-100 dark:bg-slate-800 rounded'>
              {analysisResult}
            </pre>
          ) : (
            <div className='text-muted-foreground text-sm py-8 text-center'>
              Process a document to see analysis results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
