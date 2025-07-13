'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Tag, Hash, Users, Building2, Calendar, MapPin, FileText, Activity } from 'lucide-react'

interface DocumentTopicsProps {
  topics: string[]
  entityTypes?: {
    personnel?: number
    organizations?: number
    events?: number
    locations?: number
    testimonies?: number
    artifacts?: number
  }
  isLoading?: boolean
}

const entityIcons = {
  personnel: Users,
  organizations: Building2,
  events: Calendar,
  locations: MapPin,
  testimonies: FileText,
  artifacts: Activity,
}

export function DocumentTopics({ topics, entityTypes, isLoading }: DocumentTopicsProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-muted/50 rounded-lg border"
      >
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-muted-foreground animate-pulse" />
          <h3 className="font-medium">Extracting UAP-related topics...</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-muted rounded-full animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (!topics || topics.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/50 rounded-lg border"
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Extracted Topics</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {topics.map((topic, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
          >
            <Hash className="h-3 w-3" />
            {topic}
          </motion.span>
        ))}
      </div>

      {entityTypes && Object.keys(entityTypes).length > 0 && (
        <div className="pt-3 border-t">
          <h4 className="text-xs font-medium mb-2 text-muted-foreground">Entity Distribution</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(entityTypes).map(([type, count]) => {
              const Icon = entityIcons[type as keyof typeof entityIcons]
              return count > 0 ? (
                <div
                  key={type}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Icon className="h-3 w-3" />
                  <span className="capitalize">{type}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}