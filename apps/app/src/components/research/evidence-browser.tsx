'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FileText, Calendar, MapPin, Users } from 'lucide-react'

interface ResearchRecord {
  id: string
  type: "events" | "personnel" | "documents" | "locations" | "organizations" | 
        "topics" | "sightings" | "testimonies" | "artifacts" | "key-figures" |
        "users" | "user-notes" | "mindmaps" | "summary-files"
  title: string
  description?: string
  metadata?: Record<string, any>
}

interface EvidenceBrowserProps {
  records: ResearchRecord[]
  selectedRecord: ResearchRecord | null
  onRecordSelect: (record: ResearchRecord) => void
  adjacentRecords: ResearchRecord[]
  className?: string
}

export function EvidenceBrowser({
  records,
  selectedRecord,
  onRecordSelect,
  adjacentRecords,
  className
}: EvidenceBrowserProps) {
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'events': return <Calendar className="w-4 h-4" />
      case 'personnel': return <Users className="w-4 h-4" />
      case 'documents': return <FileText className="w-4 h-4" />
      case 'locations': return <MapPin className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'events': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'personnel': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      case 'documents': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'locations': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {records.map((record) => (
        <div
          key={record.id}
          onClick={() => onRecordSelect(record)}
          className={cn(
            'border rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.02]',
            selectedRecord?.id === record.id
              ? 'border-green-400/50 bg-green-400/10'
              : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
          )}
        >
          <div className="flex items-start space-x-3">
            <div className={cn('p-2 rounded border', getRecordTypeColor(record.type))}>
              {getRecordIcon(record.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white text-sm font-medium truncate">
                  {record.title}
                </h4>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded border',
                  getRecordTypeColor(record.type)
                )}>
                  {record.type}
                </span>
              </div>
              
              {record.description && (
                <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                  {record.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>ID: {record.id}</span>
                {selectedRecord?.id === record.id && adjacentRecords.length > 0 && (
                  <span className="text-green-400">
                    {adjacentRecords.length} related
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {records.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-8">
          No evidence records found
        </div>
      )}
    </div>
  )
}