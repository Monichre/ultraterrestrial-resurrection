'use client'

import React from 'react'
import { Hash, Tag, Calendar, User } from 'lucide-react'

interface TopicCardProps {
  card: {
    id?: string
    name?: string
    title?: string
    summary?: string
    photo?: any
    photos?: any[]
    embedding?: any
    // Legacy fields for fallback
    description?: string
    content?: string
    category?: string
    tags?: string[]
    created_at?: string
    updated_at?: string
    author?: string
    source?: string
    relevance_score?: number
    [key: string]: any
  }
}

export const TopicCard: React.FC<TopicCardProps> = ({ card }) => {
  console.log("🚀 ~ TopicCard ~ card:", card)
  
  // Extract topic information using correct database schema fields
  const topicName = card.title || card.name || 'Untitled Topic'
  const topicDescription = card.summary || card.description || card.content || ''
  const topicPhoto = card.photo || (card.photos && card.photos[0])
  
  // Legacy fields for backward compatibility
  const category = card.category || 'Topic'
  const tags = card.tags || []
  const author = card.author || card.source
  const createdDate = card.created_at || card.updated_at
  const relevanceScore = card.relevance_score

  // Format date if available
  const formattedDate = createdDate ? new Date(createdDate).toLocaleDateString() : null

  return (
    <div className="p-3 topic-card min-h-[120px] flex flex-col">
      {/* Topic Title with optional photo */}
      <div className="flex items-start gap-2 mb-2">
        {topicPhoto && topicPhoto.url ? (
          <img 
            src={topicPhoto.url} 
            alt={topicName}
            className="w-8 h-8 rounded object-cover flex-shrink-0 mt-0.5"
          />
        ) : (
          <Hash className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
        )}
        <h3 className="font-monumentMono text-base text-white leading-tight">
          {topicName}
        </h3>
      </div>

      {/* Category Badge - only show if not default */}
      {category && category !== 'Topic' && (
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>
      )}

      {/* Topic Description */}
      {topicDescription && (
        <p className="text-sm text-neutral-300 mb-3 line-clamp-3 flex-grow">
          {topicDescription}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="text-xs text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-neutral-500 mt-auto pt-2 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          {author && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{author}</span>
            </div>
          )}
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
        
        {relevanceScore && (
          <div className="text-cyan-400">
            {Math.round(relevanceScore * 100)}% relevant
          </div>
        )}
      </div>
    </div>
  )
}