'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useCardSelection, type SelectedCardData } from '@/features/mindmap/hooks/use-card-selection'

export interface PinnedCard extends SelectedCardData {
  pinnedAt: Date
  notes?: string
  position: { x: number; y: number }
}

export interface ResearchCanvasData {
  pinnedCards: PinnedCard[]
  activeConnections: any[]
  canvasNotes: string
  lastUpdated: Date
}

export interface ResearchContextType {
  // Selected card from mind map
  selectedCard: SelectedCardData | null
  isAnalyzing: boolean
  selectCard: (node: any) => Promise<void>
  clearSelection: () => void
  refreshAnalysis: () => Promise<void>
  
  // Research canvas management
  canvasData: ResearchCanvasData
  pinnedCards: PinnedCard[]
  pinCard: (card: SelectedCardData, notes?: string) => void
  unpinCard: (cardId: string) => void
  updateCardNotes: (cardId: string, notes: string) => void
  updateCanvasNotes: (notes: string) => void
  
  // Canvas layout
  arrangeCards: () => void
  resetCanvas: () => void
  
  // AI integration
  getAIInsights: () => Promise<string[]>
  findCardConnections: (cardId: string) => Promise<any[]>
}

const ResearchContext = createContext<ResearchContextType | null>(null)

export function useResearch(): ResearchContextType {
  const context = useContext(ResearchContext)
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider')
  }
  return context
}

interface ResearchProviderProps {
  children: ReactNode
}

export function ResearchProvider({ children }: ResearchProviderProps) {
  const cardSelection = useCardSelection()
  const [pinnedCards, setPinnedCards] = useState<PinnedCard[]>([])
  const [canvasNotes, setCanvasNotes] = useState('')

  // Canvas data computed from state
  const canvasData: ResearchCanvasData = {
    pinnedCards,
    activeConnections: pinnedCards.flatMap(card => card.connectedRecords || []),
    canvasNotes,
    lastUpdated: new Date()
  }

  const pinCard = useCallback((card: SelectedCardData, notes?: string) => {
    const existingIndex = pinnedCards.findIndex(p => p.id === card.id)
    
    if (existingIndex >= 0) {
      // Update existing pinned card
      setPinnedCards(prev => prev.map((p, i) => 
        i === existingIndex 
          ? { ...card, pinnedAt: p.pinnedAt, notes: notes || p.notes, position: p.position }
          : p
      ))
    } else {
      // Add new pinned card with automatic positioning
      const newPosition = {
        x: (pinnedCards.length % 3) * 320 + 20, // Grid layout
        y: Math.floor(pinnedCards.length / 3) * 200 + 20
      }
      
      const pinnedCard: PinnedCard = {
        ...card,
        pinnedAt: new Date(),
        notes,
        position: newPosition
      }
      
      setPinnedCards(prev => [...prev, pinnedCard])
    }
  }, [pinnedCards])

  const unpinCard = useCallback((cardId: string) => {
    setPinnedCards(prev => prev.filter(card => card.id !== cardId))
  }, [])

  const updateCardNotes = useCallback((cardId: string, notes: string) => {
    setPinnedCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, notes } : card
    ))
  }, [])

  const updateCanvasNotes = useCallback((notes: string) => {
    setCanvasNotes(notes)
  }, [])

  const arrangeCards = useCallback(() => {
    setPinnedCards(prev => prev.map((card, index) => ({
      ...card,
      position: {
        x: (index % 3) * 320 + 20,
        y: Math.floor(index / 3) * 200 + 20
      }
    })))
  }, [])

  const resetCanvas = useCallback(() => {
    setPinnedCards([])
    setCanvasNotes('')
  }, [])

  const getAIInsights = useCallback(async (): Promise<string[]> => {
    const insights: string[] = []
    
    // Aggregate insights from all pinned cards
    pinnedCards.forEach(card => {
      if (card.aiAnalysis?.insights) {
        insights.push(...card.aiAnalysis.insights)
      }
    })
    
    // Add canvas-level insights
    if (pinnedCards.length > 1) {
      insights.push(`Analyzing ${pinnedCards.length} connected entities`)
      
      const types = new Set(pinnedCards.map(card => card.type))
      if (types.size > 1) {
        insights.push(`Cross-referencing ${types.size} different entity types`)
      }
    }
    
    return insights
  }, [pinnedCards])

  const findCardConnections = useCallback(async (cardId: string): Promise<any[]> => {
    return cardSelection.getConnectedRecords(cardId)
  }, [cardSelection])

  const contextValue: ResearchContextType = {
    // Card selection (delegated to useCardSelection)
    selectedCard: cardSelection.selectedCard,
    isAnalyzing: cardSelection.isAnalyzing,
    selectCard: cardSelection.selectCard,
    clearSelection: cardSelection.clearSelection,
    refreshAnalysis: cardSelection.refreshAnalysis,
    
    // Research canvas
    canvasData,
    pinnedCards,
    pinCard,
    unpinCard,
    updateCardNotes,
    updateCanvasNotes,
    arrangeCards,
    resetCanvas,
    
    // AI integration
    getAIInsights,
    findCardConnections
  }

  return (
    <ResearchContext.Provider value={contextValue}>
      {children}
    </ResearchContext.Provider>
  )
}