'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Scan, Database, Network, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  description?: string
  result?: any
}

interface DocumentProcessingProps {
  steps: ProcessingStep[]
  isProcessing?: boolean
  onComplete?: (results: any) => void
}

const stepIcons = {
  'text-extraction': Scan,
  'entity-recognition': Brain,
  'schema-mapping': Database,
  'relationship-analysis': Network,
}

const defaultSteps: ProcessingStep[] = [
  {
    id: 'text-extraction',
    name: 'Text Extraction',
    status: 'pending',
    description: 'Extracting text content from document'
  },
  {
    id: 'entity-recognition',
    name: 'Entity Recognition',
    status: 'pending',
    description: 'Identifying UAP-related entities using domain-specific NER'
  },
  {
    id: 'schema-mapping',
    name: 'Schema Mapping',
    status: 'pending',
    description: 'Mapping entities to UAP disclosure database schema'
  },
  {
    id: 'relationship-analysis',
    name: 'Relationship Analysis',
    status: 'pending',
    description: 'Analyzing connections between entities'
  }
]

export function DocumentProcessing({ 
  steps = defaultSteps, 
  isProcessing = false,
  onComplete 
}: DocumentProcessingProps) {
  if (!isProcessing && steps.every(step => step.status === 'pending')) {
    return null
  }

  const getStatusIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/50 rounded-lg border"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">UAP Document Processing Pipeline</h3>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.id as keyof typeof stepIcons] || Brain
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                step.status === 'running' 
                  ? 'bg-blue-50 dark:bg-blue-950/20' 
                  : step.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-950/20'
                  : step.status === 'error'
                  ? 'bg-red-50 dark:bg-red-950/20'
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">{step.name}</h4>
                </div>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
                {step.result && step.status === 'completed' && (
                  <div className="mt-2 p-2 bg-background/50 rounded text-xs">
                    <pre className="text-xs text-muted-foreground">
                      {typeof step.result === 'string' 
                        ? step.result 
                        : JSON.stringify(step.result, null, 2)
                      }
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-blue-700 dark:text-blue-300">
              Processing document using UAP domain-specific pipeline...
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}