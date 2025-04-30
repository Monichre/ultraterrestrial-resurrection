'use client'

import React, { useState, useEffect } from 'react'
import { useKnowledge } from '../KnowledgeContext'
import { KnowledgeItem, KnowledgeSources } from '../types'
import { markdownToText } from '../utilities'

interface KnowledgeViewerProps {
  item?: KnowledgeItem
  itemId?: string
  className?: string
  showActions?: boolean
  onAddToPipeline?: (item: KnowledgeItem, pipelineType: 'document' | 'web' | 'agent') => void
}

export function KnowledgeViewer({ 
  item: propItem, 
  itemId, 
  className = '',
  showActions = false,
  onAddToPipeline
}: KnowledgeViewerProps) {
  const { selectedItem, getItem, updateItem } = useKnowledge()
  const [item, setItem] = useState<KnowledgeItem | null>(propItem || selectedItem)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedContent, setEditedContent] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'content' | 'metadata'>('content')
  
  // Fetch item if not provided and itemId is specified
  useEffect(() => {
    if (!propItem && !selectedItem && itemId) {
      setIsLoading(true)
      getItem(itemId)
        .then(fetchedItem => {
          if (fetchedItem) {
            setItem(fetchedItem)
          } else {
            setError(`Item with ID ${itemId} not found`)
          }
        })
        .catch(err => {
          setError(`Error fetching item: ${err.message}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [propItem, selectedItem, itemId, getItem])
  
  // Update item when propItem or selectedItem changes
  useEffect(() => {
    const newItem = propItem || selectedItem
    setItem(newItem)
    if (newItem) {
      setEditedContent(newItem.content)
    }
  }, [propItem, selectedItem])
  
  // Function to save edited content
  const handleSaveContent = async () => {
    if (!item) return
    
    setIsLoading(true)
    try {
      const updatedItem = await updateItem(item.id, { content: editedContent })
      setItem(updatedItem)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating content:', error)
      setError('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading) {
    return <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  }
  
  if (error) {
    return <div className={`p-4 text-red-500 ${className}`}>{error}</div>
  }
  
  if (!item) {
    return <div className={`p-4 text-gray-500 ${className}`}>No item selected</div>
  }
  
  // Format source type for display
  const formatSourceType = (sourceType: KnowledgeSources): string => {
    switch (sourceType) {
      case KnowledgeSources.LOCAL:
        return 'Local File'
      case KnowledgeSources.VECTOR:
        return 'Vector Database'
      case KnowledgeSources.R2R:
        return 'R2R System'
      case KnowledgeSources.DATABASE:
        return 'Database Record'
      default:
        return sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
    }
  }
  
  // Render content based on content type and active tab
  const renderContent = () => {
    if (activeTab === 'metadata') {
      return (
        <div className="metadata-viewer p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium mb-2">Item Metadata</h3>
          <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <dt className="text-gray-600 font-medium">ID</dt>
            <dd className="text-gray-800">{item.id}</dd>
            
            <dt className="text-gray-600 font-medium">Source Type</dt>
            <dd className="text-gray-800">{formatSourceType(item.sourceType)}</dd>
            
            <dt className="text-gray-600 font-medium">Content Type</dt>
            <dd className="text-gray-800">{item.contentType}</dd>
            
            <dt className="text-gray-600 font-medium">Source</dt>
            <dd className="text-gray-800 truncate">{item.source}</dd>
            
            <dt className="text-gray-600 font-medium">Created</dt>
            <dd className="text-gray-800">{new Date(item.createdAt).toLocaleString()}</dd>
            
            <dt className="text-gray-600 font-medium">Updated</dt>
            <dd className="text-gray-800">{new Date(item.updatedAt).toLocaleString()}</dd>
            
            {item.tags && item.tags.length > 0 && (
              <>
                <dt className="text-gray-600 font-medium">Tags</dt>
                <dd className="text-gray-800">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs rounded-full bg-gray-200 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </dd>
              </>
            )}
            
            {Object.entries(item.metadata).map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="text-gray-600 font-medium">{key}</dt>
                <dd className="text-gray-800 truncate">{String(value)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      )
    }
    
    if (isEditing) {
      return (
        <div className="content-editor">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-80 p-2 border rounded font-mono text-sm"
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedContent(item.content)
              }}
              className="px-3 py-1 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContent}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Save
            </button>
          </div>
        </div>
      )
    }
    
    switch (item.contentType.toLowerCase()) {
      case 'pdf':
        return (
          <div className="pdf-viewer">
            <div className="p-4 text-center bg-gray-100 rounded border">
              <p className="text-gray-500">PDF preview not available</p>
              <p className="text-sm text-gray-400 mt-1">Content extracted from PDF is shown below</p>
            </div>
            <div className="mt-4 whitespace-pre-wrap font-mono text-sm">
              {item.content}
            </div>
          </div>
        )
      case 'html':
        return (
          <div className="html-viewer">
            <div 
              dangerouslySetInnerHTML={{ __html: item.content }} 
              className="prose max-w-none"
            />
          </div>
        )
      case 'markdown':
      case 'md':
        return (
          <div className="markdown-viewer prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }} />
          </div>
        )
      default:
        return (
          <div className="text-viewer whitespace-pre-wrap font-mono text-sm">
            {item.content}
          </div>
        )
    }
  }
  
  // Helper function to convert markdown to HTML
  // In a real implementation, you would use a proper markdown library
  function markdownToHtml(markdown: string): string {
    // This is a very simplistic markdown converter for demonstration
    let html = markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n\n/g, '<br><br>')
    
    return html
  }
  
  return (
    <div className={`knowledge-viewer border rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="header bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-medium">{item.title}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span className="mr-4">
            Source: {formatSourceType(item.sourceType)}
          </span>
          <span className="mr-4">
            Type: {item.contentType.toUpperCase()}
          </span>
          <span>
            Updated: {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="tabs border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('metadata')}
        >
          Metadata
        </button>
      </div>
      
      <div className="content p-4">
        {renderContent()}
      </div>
      
      {showActions && onAddToPipeline && (
        <div className="actions border-t p-3 bg-gray-50 flex justify-end">
          <div className="dropdown relative inline-block">
            <button 
              className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
              onClick={() => {
                const dropdown = document.getElementById(`dropdown-${item.id}`)
                if (dropdown) {
                  dropdown.classList.toggle('hidden')
                }
              }}
            >
              Add to Pipeline
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div id={`dropdown-${item.id}`} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
              <div className="py-1">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    onAddToPipeline(item, 'document')
                    document.getElementById(`dropdown-${item.id}`)?.classList.add('hidden')
                  }}
                >
                  Document Processing
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    onAddToPipeline(item, 'web')
                    document.getElementById(`dropdown-${item.id}`)?.classList.add('hidden')
                  }}
                >
                  Web Processing
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    onAddToPipeline(item, 'agent')
                    document.getElementById(`dropdown-${item.id}`)?.classList.add('hidden')
                  }}
                >
                  Agent Execution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}