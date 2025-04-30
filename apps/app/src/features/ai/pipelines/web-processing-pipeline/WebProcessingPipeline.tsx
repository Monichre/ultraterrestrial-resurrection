'use client'

import React, {useState} from 'react'
import {useUnifiedPipeline} from '../unified/AIPipeline'

export function WebProcessingPipeline() {
  const {addWebData, setIsProcessing, isProcessing} = useUnifiedPipeline()
  const [url, setUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [analysisResults, setAnalysisResults] = useState<string>('')
  const [searchOption, setSearchOption] = useState<'url' | 'search'>('url')

  const processWebContent = async () => {
    if (searchOption === 'url' && !url) {
      alert('Please enter a URL')
      return
    }

    if (searchOption === 'search' && !searchQuery) {
      alert('Please enter a search query')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate web processing with a delay
      // In a real implementation, this would call a web scraping/search service
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Sample analysis results
      const analysis =
        searchOption === 'url'
          ? {
              title: `Page Title for ${url}`,
              summary: 'This is a sample summary of the web page content.',
              mainTopics: ['Topic 1', 'Topic 2', 'Topic 3'],
              entities: ['Entity 1', 'Entity 2', 'Entity 3'],
              sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
            }
          : {
              searchResults: [
                {title: 'Result 1', snippet: 'Snippet from result 1', url: 'https://example.com/1'},
                {title: 'Result 2', snippet: 'Snippet from result 2', url: 'https://example.com/2'},
                {title: 'Result 3', snippet: 'Snippet from result 3', url: 'https://example.com/3'},
              ],
              relatedQueries: ['Related query 1', 'Related query 2', 'Related query 3'],
              topSources: ['Source 1', 'Source 2', 'Source 3'],
            }

      // Format analysis for display
      const formattedAnalysis = JSON.stringify(analysis, null, 2)
      setAnalysisResults(formattedAnalysis)

      // Add web data to the unified pipeline (fix to match WebData interface)
      addWebData({
        url: searchOption === 'url' ? url : searchQuery,
        title: searchOption === 'url' ? analysis.title : `Search results for: ${searchQuery}`,
        content: searchOption === 'url' ? analysis.summary : JSON.stringify(analysis.searchResults),
        summary:
          searchOption === 'url'
            ? analysis.summary
            : `Found ${analysis.searchResults.length} results`,
        keyPoints: searchOption === 'url' ? analysis.mainTopics : analysis.relatedQueries,
      })
    } catch (error) {
      console.error('Error processing web content:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className='container max-w-5xl py-6 space-y-8'>
      <div className='flex flex-col items-start pt-6 pb-4 justify-start text-left'>
        <h1 className='text-2xl lg:text-3xl font-bold'>Web Processing Pipeline</h1>
        <p className='text-muted-foreground text-pretty text-sm max-w-2xl'>
          Analyze web content by URL or search query to extract insights and information.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          <div className='flex space-x-4 mb-4'>
            <button
              onClick={() => setSearchOption('url')}
              className={`px-4 py-2 rounded ${
                searchOption === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
              URL Analysis
            </button>
            <button
              onClick={() => setSearchOption('search')}
              className={`px-4 py-2 rounded ${
                searchOption === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
              Web Search
            </button>
          </div>

          {searchOption === 'url' ? (
            <div>
              <label className='block text-sm font-medium mb-1'>Website URL</label>
              <input
                type='url'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='https://example.com'
                className='w-full border rounded py-2 px-3 bg-transparent'
              />
            </div>
          ) : (
            <div>
              <label className='block text-sm font-medium mb-1'>Search Query</label>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Enter search query'
                className='w-full border rounded py-2 px-3 bg-transparent'
              />
            </div>
          )}

          <div>
            <button
              onClick={processWebContent}
              disabled={isProcessing || (searchOption === 'url' ? !url : !searchQuery)}
              className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'>
              {isProcessing
                ? 'Processing...'
                : searchOption === 'url'
                  ? 'Analyze URL'
                  : 'Search Web'}
            </button>
          </div>
        </div>

        <div className='bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg'>
          <h3 className='text-lg font-medium mb-4'>Analysis Results</h3>
          {analysisResults ? (
            <pre className='text-sm whitespace-pre-wrap overflow-auto max-h-[400px] p-4 bg-slate-100 dark:bg-slate-800 rounded'>
              {analysisResults}
            </pre>
          ) : (
            <div className='text-muted-foreground text-sm py-8 text-center'>
              {searchOption === 'url' ? 'Enter a URL to analyze' : 'Enter a search query'} to see
              results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
