'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Tag, 
  Heart, 
  Network, 
  Lightbulb, 
  Hash,
  Brain,
  Database,
  Users,
  Building2,
  Calendar,
  MapPin
} from 'lucide-react'

interface DocumentAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  category: 'analysis' | 'extraction' | 'enhancement'
}

const documentActions: DocumentAction[] = [
  {
    id: 'summarize',
    label: 'Summarize',
    icon: FileText,
    description: 'Generate UAP-focused summary',
    category: 'analysis'
  },
  {
    id: 'extractTopics',
    label: 'Extract Topics',
    icon: Tag,
    description: 'Identify UAP-related topics',
    category: 'extraction'
  },
  {
    id: 'analyzeSentiment',
    label: 'Analyze Sentiment',
    icon: Heart,
    description: 'Evaluate disclosure stance',
    category: 'analysis'
  },
  {
    id: 'connectTheDots',
    label: 'Connect The Dots',
    icon: Network,
    description: 'Find entity relationships',
    category: 'enhancement'
  },
  {
    id: 'findInsights',
    label: 'Find Insights',
    icon: Lightbulb,
    description: 'Discover hidden patterns',
    category: 'enhancement'
  },
  {
    id: 'generateTags',
    label: 'Generate Tags',
    icon: Hash,
    description: 'Create schema-based tags',
    category: 'extraction'
  },
  {
    id: 'extractEntities',
    label: 'Extract Entities',
    icon: Brain,
    description: 'NER using UAP domain model',
    category: 'extraction'
  },
  {
    id: 'mapToSchema',
    label: 'Map to Schema',
    icon: Database,
    description: 'Map to disclosure database',
    category: 'enhancement'
  }
]

const entityTypes = [
  { id: 'personnel', label: 'Personnel', icon: Users, description: 'Key figures and witnesses' },
  { id: 'organizations', label: 'Organizations', icon: Building2, description: 'Government and private entities' },
  { id: 'events', label: 'Events', icon: Calendar, description: 'UAP incidents and disclosures' },
  { id: 'locations', label: 'Locations', icon: MapPin, description: 'Geographic references' }
]

interface DocumentActionsProps {
  onActionClick: (actionId: string) => void
  processingAction?: string
  compact?: boolean
}

export function DocumentActions({ 
  onActionClick, 
  processingAction,
  compact = false 
}: DocumentActionsProps) {
  const categories = ['analysis', 'extraction', 'enhancement'] as const

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {documentActions.slice(0, 4).map((action) => {
          const Icon = action.icon
          const isProcessing = processingAction === action.id
          
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActionClick(action.id)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
            >
              <Icon className={`h-4 w-4 ${isProcessing ? 'animate-pulse' : ''}`} />
              {action.label}
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">UAP Document Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Process documents using our specialized UAP/disclosure framework
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium capitalize text-muted-foreground">
            {category}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {documentActions
              .filter(action => action.category === category)
              .map((action) => {
                const Icon = action.icon
                const isProcessing = processingAction === action.id
                
                return (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onActionClick(action.id)}
                    disabled={isProcessing}
                    className="flex flex-col items-start gap-2 p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Icon className={`h-5 w-5 text-primary ${isProcessing ? 'animate-pulse' : ''}`} />
                    <div>
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
          Entity Types in UAP Schema
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {entityTypes.map((entity) => {
            const Icon = entity.icon
            return (
              <div
                key={entity.id}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-md"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium">{entity.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {entity.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}