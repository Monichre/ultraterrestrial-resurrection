import { type PinnedCard } from '@/contexts/research/research-context'

// Define MindmapNode type based on your existing structure
export interface MindmapNode {
  id: string
  type: string
  data: {
    name?: string
    label?: string
    photo?: string
    role?: string
    rank?: number
    [key: string]: any
  }
  position?: { x: number, y: number }
}

export async function transformNodeToPinnedCard(
  node: MindmapNode, 
  dropPosition: { x: number, y: number }
): Promise<PinnedCard> {
  // Add some randomness to the positioning to make it feel more natural
  const randomOffset = {
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20
  }

  // Generate a slight rotation for polaroid-style cards
  const rotation = node.type === 'personnel' ? (Math.random() - 0.5) * 8 : 0

  return {
    id: node.id,
    type: node.type,
    data: node.data,
    pinnedAt: new Date(),
    position: {
      x: Math.max(0, dropPosition.x + randomOffset.x),
      y: Math.max(0, dropPosition.y + randomOffset.y)
    },
    rotation,
    // Initialize empty analysis and connections
    aiAnalysis: undefined,
    connectedRecords: [],
    notes: undefined
  }
}

export function generateCardPosition(
  existingCards: PinnedCard[], 
  canvasWidth: number = 800, 
  canvasHeight: number = 600
): { x: number, y: number } {
  // Simple grid-based positioning with some randomness
  const cardWidth = 200
  const cardHeight = 150
  const padding = 20
  
  const cols = Math.floor((canvasWidth - padding) / (cardWidth + padding))
  const rows = Math.floor((canvasHeight - padding) / (cardHeight + padding))
  
  const gridPosition = existingCards.length
  const col = gridPosition % cols
  const row = Math.floor(gridPosition / cols)
  
  // Add some randomness to make it feel more organic
  const randomOffset = {
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40
  }
  
  return {
    x: Math.max(padding, col * (cardWidth + padding) + padding + randomOffset.x),
    y: Math.max(padding, row * (cardHeight + padding) + padding + randomOffset.y)
  }
}

export function analyzeCardProximity(
  cards: PinnedCard[], 
  proximityThreshold: number = 150
): Array<{ cards: PinnedCard[], distance: number }> {
  const groups: Array<{ cards: PinnedCard[], distance: number }> = []
  
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const card1 = cards[i]
      const card2 = cards[j]
      
      const distance = Math.sqrt(
        Math.pow(card1.position.x - card2.position.x, 2) + 
        Math.pow(card1.position.y - card2.position.y, 2)
      )
      
      if (distance <= proximityThreshold) {
        groups.push({
          cards: [card1, card2],
          distance
        })
      }
    }
  }
  
  return groups
}

export function calculateCardCentroid(cards: PinnedCard[]): { x: number, y: number } {
  if (cards.length === 0) return { x: 0, y: 0 }
  
  const sum = cards.reduce(
    (acc, card) => ({
      x: acc.x + card.position.x,
      y: acc.y + card.position.y
    }),
    { x: 0, y: 0 }
  )
  
  return {
    x: sum.x / cards.length,
    y: sum.y / cards.length
  }
}