import React from 'react'
import { motion } from 'framer-motion'
import { X, Users, MapPin, Calendar, Building, Cpu, Tag } from 'lucide-react'
import type { AnalysisResult } from '@/lib/ai/analyze-content'

interface EntitiesDisplayProps {
  fileName: string
  entities: AnalysisResult['entities']
  onClose: () => void
}

export function EntitiesDisplay({ fileName, entities, onClose }: EntitiesDisplayProps) {
  const entityTypes = [
    { key: 'people', label: 'People', icon: Users, color: 'text-blue-400' },
    { key: 'organizations', label: 'Organizations', icon: Building, color: 'text-orange-400' },
    { key: 'locations', label: 'Locations', icon: MapPin, color: 'text-green-400' },
    { key: 'dates', label: 'Dates', icon: Calendar, color: 'text-purple-400' },
    { key: 'events', label: 'Events', icon: Tag, color: 'text-pink-400' },
    { key: 'technologies', label: 'Technologies', icon: Cpu, color: 'text-cyan-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity