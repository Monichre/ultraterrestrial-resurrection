'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FileText, ExternalLink, Download, Eye } from 'lucide-react'

interface ResearchRecord {
  id: string
  type: string
  title: string
  description?: string
  metadata?: Record<string, any>
}

interface DocumentViewerProps {
  selectedDocument: any
  onDocumentSelect: (document: any) => void
  adjacentRecords: ResearchRecord[]
  className?: string
}

export function DocumentViewer({
  selectedDocument,
  onDocumentSelect,
  adjacentRecords,
  className
}: DocumentViewerProps) {
  // Mock documents - would come from your document system
  const mockDocuments = [
    {
      id: 'doc-1',
      title: 'Operation Stardust Field Report',
      type: 'field-report',
      content: 'Classified observations from field operative regarding anomalous readings...',
      createdAt: '2077-03-15T23:27:18Z',
      classification: 'top-secret'
    },
    {
      id: 'doc-2', 
      title: 'Quantum Analysis Results',
      type: 'analysis',
      content: 'Detailed analysis of quantum state fluctuations observed during incident...',
      createdAt: '2077-03-15T18:10:32Z',
      classification: 'classified'
    }
  ]

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="p-4 border-b border-green-400/20">
        <h2 className="text-lg font-semibold text-green-400 mb-3">
          Document Viewer
        </h2>
        
        {/* Document list */}
        <div className="space-y-2 mb-4">
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onDocumentSelect(doc)}
              className={cn(
                'border rounded p-2 cursor-pointer transition-all text-xs',
                selectedDocument?.id === doc.id
                  ? 'border-green-400/50 bg-green-400/10'
                  : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span className="text-white font-medium truncate">
                    {doc.title}
                  </span>
                </div>
                <span className={cn(
                  'text-xs px-1 rounded',
                  doc.classification === 'top-secret' 
                    ? 'text-red-400 bg-red-400/20'
                    : 'text-yellow-400 bg-yellow-400/20'
                )}>
                  {doc.classification}
                </span>
              </div>
              <div className="text-gray-400 text-xs">
                {doc.type} • {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 p-4">
        {selectedDocument ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">
                {selectedDocument.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="text-green-400/70 hover:text-green-400 p-1">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-400/70 hover:text-green-400 p-1">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-green-400/70 hover:text-green-400 p-1">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-green-400/20 rounded p-3">
              <div className="text-green-400 text-xs mb-2">
                Classification: {selectedDocument.classification?.toUpperCase()}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                {selectedDocument.content}
              </div>
            </div>
            
            {/* Related records */}
            {adjacentRecords.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-green-400 text-sm font-medium">
                  Related Records
                </h4>
                <div className="space-y-1">
                  {adjacentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-gray-800/50 border border-gray-600/30 rounded p-2 text-xs"
                    >
                      <div className="text-white font-medium">
                        {record.title}
                      </div>
                      <div className="text-gray-400">
                        {record.type} • {record.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Select a document to view its contents
          </div>
        )}
      </div>
    </div>
  )
}