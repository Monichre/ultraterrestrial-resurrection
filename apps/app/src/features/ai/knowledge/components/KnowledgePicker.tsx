'use client'

import React, { useState, useEffect } from 'react'
import { useKnowledge } from '../KnowledgeContext'
import { KnowledgeItem, KnowledgeSources } from '../types'

interface KnowledgePickerProps {
  onSelect?: (item: KnowledgeItem) => void
  filter?: {
    sources?: KnowledgeSources[]
    contentTypes?: string[]
    tags?: string[]
  }
  multiSelect?: boolean
  onMultiSelect?: (items: KnowledgeItem[]) => void
  className?: string
}

export function KnowledgePicker({ 
  onSelect, 
  filter, 
  multiSelect = false,
  onMultiSelect,
  className = ''
}: KnowledgePickerProps) {
  const { items, listItems, search, selectItem } = useKnowledge()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<KnowledgeItem[]>([])
  const [activeSource, setActiveSource] = useState<KnowledgeSources | 'all'>('all')
  
  // Filter items based on props and active source
  const filteredItems = items.filter(item => {
    if (activeSource !== 'all' && item.sourceType !== activeSource) return false
    if (filter?.sources && !filter.sources.includes(item.sourceType)) return false
    if (filter?.contentTypes && !filter.contentTypes.includes(item.contentType)) return false
    if (filter?.tags && item.tags && !item.tags.some(tag => filter.tags?.includes(tag))) return false
    return true
  })
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await listItems()
      return
    }
    
    await search(searchQuery, {
      sources: filter?.sources || Object.values(KnowledgeSources)
    })
  }
  
  // Handle item selection
  const handleSelectItem = (item: KnowledgeItem) => {
    if (multiSelect) {
      // Toggle selection in multi-select mode
      const isSelected = selectedItems.some(i => i.id === item.id)
      let newSelectedItems
      
      if (isSelected) {
        newSelectedItems = selectedItems.filter(i => i.id !== item.id)
      } else {
        newSelectedItems = [...selectedItems, item]
      }
      
      setSelectedItems(newSelectedItems)
      
      // Call onMultiSelect if provided
      if (onMultiSelect) {
        onMultiSelect(newSelectedItems)
      }
    } else {
      // Single select mode
      selectItem(item)
      if (onSelect) onSelect(item)
    }
  }
  
  // Group items by source type for better organization
  const itemsBySource = Object.values(KnowledgeSources).reduce((acc, source) => {
    acc[source] = filteredItems.filter(item => item.sourceType === source)
    return acc
  }, {} as Record<KnowledgeSources, KnowledgeItem[]>)
  
  // Count items by source for the tabs
  const itemCounts = {
    all: filteredItems.length,
    ...Object.fromEntries(
      Object.values(KnowledgeSources).map(source => 
        [source, itemsBySource[source].length]
      )
    )
  }
  
  // Function to format source type for display
  const formatSourceType = (sourceType: KnowledgeSources | 'all'): string => {
    if (sourceType === 'all') return 'All Sources'
    
    switch (sourceType) {
      case KnowledgeSources.LOCAL:
        return 'Local Files'
      case KnowledgeSources.VECTOR:
        return 'Vector DB'
      case KnowledgeSources.R2R:
        return 'R2R'
      case KnowledgeSources.DATABASE:
        return 'Database'
      default:
        return sourceType.charAt(0).toUpperCase() + sourceType.slice(1)
    }
  }
  
  return (
    <div className={`knowledge-picker ${className}`}>
      <div className="search-bar flex mb-4">
        <input 
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search knowledge..."
          className="w-full p-2 border rounded"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
      
      <div className="source-tabs mb-4 border-b">
        <div className="flex">
          <button 
            onClick={() => setActiveSource('all')}
            className={`px-3 py-2 ${activeSource === 'all' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          >
            All Sources ({itemCounts.all})
          </button>
          
          {Object.values(KnowledgeSources).map(source => (
            <button
              key={source}
              onClick={() => setActiveSource(source)}
              className={`px-3 py-2 ${activeSource === source ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
            >
              {formatSourceType(source)} ({itemCounts[source]})
            </button>
          ))}
        </div>
      </div>
      
      <div className="items-list max-h-96 overflow-y-auto p-1">
        {activeSource === 'all' ? (
          // All sources grouped view
          Object.entries(itemsBySource).map(([source, sourceItems]) => (
            sourceItems.length > 0 && (
              <div key={source} className="source-group mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                  {formatSourceType(source as KnowledgeSources)}
                </h3>
                <ul className="space-y-2">
                  {sourceItems.map(item => (
                    <li 
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors
                        ${selectedItems.some(i => i.id === item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {item.summary || item.content.substring(0, 100)}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-400 space-x-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5">{item.contentType}</span>
                        <span>•</span>
                        <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                        {item.tags && item.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1 overflow-x-auto">
                              {item.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5">
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && <span>+{item.tags.length - 3}</span>}
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))
        ) : (
          // Single source view
          <ul className="space-y-2">
            {itemsBySource[activeSource as KnowledgeSources].length === 0 ? (
              <li className="p-8 text-center text-gray-500">
                No items found in this source. Try another source or modify your search.
              </li>
            ) : (
              itemsBySource[activeSource as KnowledgeSources].map(item => (
                <li 
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedItems.some(i => i.id === item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {item.summary || item.content.substring(0, 100)}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-400 space-x-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">{item.contentType}</span>
                    <span>•</span>
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    {item.tags && item.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-1 overflow-x-auto">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && <span>+{item.tags.length - 3}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      
      {multiSelect && selectedItems.length > 0 && (
        <div className="selected-items mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Selected Items ({selectedItems.length})</h3>
            <button 
              onClick={() => {
                setSelectedItems([])
                if (onMultiSelect) onMultiSelect([])
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedItems.map(item => (
              <div 
                key={item.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
              >
                <span className="mr-1 text-sm truncate max-w-[120px]">{item.title}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation() // Prevent triggering the parent's onClick
                    const newSelectedItems = selectedItems.filter(i => i.id !== item.id)
                    setSelectedItems(newSelectedItems)
                    if (onMultiSelect) onMultiSelect(newSelectedItems)
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => {
              if (onMultiSelect && selectedItems.length > 0) {
                onMultiSelect(selectedItems)
              }
              if (onSelect && selectedItems.length > 0) {
                onSelect(selectedItems[0])
              }
            }}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Use Selected
          </button>
        </div>
      )}
    </div>
  )
}