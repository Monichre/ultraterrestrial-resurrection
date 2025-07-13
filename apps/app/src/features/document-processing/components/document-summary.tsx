'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, Hash, Brain } from 'lucide-react'

interface DocumentSummaryProps {
  summary: string
  metadata?: {
    wordCount?: number
    pageCount?: number
    fileName?: string
    readingTime?: number
    entities?: Array<{
      type: string
      name: string
      confidence?: number
    }>
  }
  isLoading?: boolean
}

export function DocumentSummary({ summary, metadata, isLoading }: DocumentSummaryProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-muted/50 rounded-lg border"
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-muted-foreground animate-pulse" />
          <h3 className="font-medium">Analyzing document with UAP research framework...</h3>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </motion.div>
    )
  }

  if (!summary) {
    return null
  }

  const estimateReadingTime = (wordCount: number) => {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/50 rounded-lg border"
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Document Analysis</h3>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {summary}
      </p>

      {metadata?.entities && metadata.entities.length > 0 && (
        <div className="mb-4 p-3 bg-muted/30 rounded-md">
          <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Extracted Entities (UAP Schema)
          </h4>
          <div className="flex flex-wrap gap-2">
            {metadata.entities.map((entity, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
              >
                {entity.type}: {entity.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {metadata && (
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {metadata.wordCount && (
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>{metadata.wordCount.toLocaleString()} words</span>
            </div>
          )}
          {metadata.wordCount && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{estimateReadingTime(metadata.wordCount)} min read</span>
            </div>
          )}
          {metadata.pageCount && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{metadata.pageCount} pages</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}