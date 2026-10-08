/**
 * Agent-named entities sit in rows above the answer. Record cards are laid out
 * below it. The row step is a fixed 160px, so a card taller than that can
 * still overlap the answer.
 */
export function placeAgentNodeAboveAnswer(
  index: number,
  basePosition: {x: number; y: number},
  sourceWidth: number
): {x: number; y: number} {
  return {
    x: basePosition.x + sourceWidth / 2 - 90 + ((index % 4) - 1.5) * 260,
    y: basePosition.y - (Math.floor(index / 4) + 1) * 160,
  }
}
