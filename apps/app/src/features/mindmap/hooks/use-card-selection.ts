import { useCallback, useState } from 'react'
import { useMindMap } from '@/contexts/mindmap/mindmap-context'
import { useAIMindMap } from '@/features/mindmap/components/ai-integration'
import { useMindMapStore } from '@/features/mindmap/store'
import type { Node } from '@xyflow/react'

export interface SelectedCardData {
  id: string
  type: string
  data: any
  position: { x: number; y: number }
  connectedRecords?: any[]
  aiAnalysis?: {
    summary: string
    insights: string[]
    connections: any[]
    isLoading: boolean
  }
}

export interface UseCardSelectionReturn {
  selectedCard: SelectedCardData | null
  isAnalyzing: boolean
  selectCard: (node: Node) => Promise<void>
  clearSelection: () => void
  getConnectedRecords: (cardId: string) => Promise<any[]>
  refreshAnalysis: () => Promise<void>
}

export function useCardSelection(): UseCardSelectionReturn {
  const [selectedCard, setSelectedCard] = useState<SelectedCardData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { updateActiveNode, findConnections } = useMindMap()
  const { loadRecordsWithAI, isAIEnabled } = useAIMindMap()
  const { nodes } = useMindMapStore()

  const getConnectedRecords = useCallback(async (cardId: string) => {
    if (!findConnections) return []
    
    try {
      const connections = await findConnections({ id: cardId })
      return connections || []
    } catch (error) {
      console.error('Error finding connections:', error)
      return []
    }
  }, [findConnections])

  const analyzeCardWithAI = useCallback(async (card: SelectedCardData) => {
    if (!isAIEnabled) return card

    setIsAnalyzing(true)
    
    try {
      // Get connected records
      const connectedRecords = await getConnectedRecords(card.id)
      
      // Use existing AI loading infrastructure to analyze connections
      if (connectedRecords.length > 0) {
        await loadRecordsWithAI({
          entities: connectedRecords,
          type: card.type,
          sourceNodeId: card.id,
          amount: 10
        })
      }

      // Update card with analysis results
      const updatedCard: SelectedCardData = {
        ...card,
        connectedRecords,
        aiAnalysis: {
          summary: `Analysis of ${card.data.name || card.data.label}`,
          insights: [
            `Found ${connectedRecords.length} connected records`,
            `Card type: ${card.type}`,
            'AI analysis completed'
          ],
          connections: connectedRecords,
          isLoading: false
        }
      }

      return updatedCard
    } catch (error) {
      console.error('Error in AI analysis:', error)
      return {
        ...card,
        aiAnalysis: {
          summary: 'Analysis failed',
          insights: ['Error occurred during analysis'],
          connections: [],
          isLoading: false
        }
      }
    } finally {
      setIsAnalyzing(false)
    }
  }, [isAIEnabled, getConnectedRecords, loadRecordsWithAI])

  const selectCard = useCallback(async (node: Node) => {
    // Update active node in existing context
    updateActiveNode?.(node.id)

    // Create selected card data structure
    const cardData: SelectedCardData = {
      id: node.id,
      type: node.data?.type || node.type || 'unknown',
      data: node.data,
      position: node.position,
      aiAnalysis: {
        summary: '',
        insights: [],
        connections: [],
        isLoading: true
      }
    }

    setSelectedCard(cardData)

    // Perform AI analysis asynchronously
    const analyzedCard = await analyzeCardWithAI(cardData)
    setSelectedCard(analyzedCard)
  }, [updateActiveNode, analyzeCardWithAI])

  const refreshAnalysis = useCallback(async () => {
    if (!selectedCard) return

    const refreshedCard = await analyzeCardWithAI(selectedCard)
    setSelectedCard(refreshedCard)
  }, [selectedCard, analyzeCardWithAI])

  const clearSelection = useCallback(() => {
    setSelectedCard(null)
    setIsAnalyzing(false)
  }, [])

  return {
    selectedCard,
    isAnalyzing,
    selectCard,
    clearSelection,
    getConnectedRecords,
    refreshAnalysis
  }
}