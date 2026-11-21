/** Cuts at the last word boundary at-or-before maxLength — never mid-word. */
export function truncateAtWordBoundary(text: string, maxLength: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= maxLength) return trimmed
  const cut = trimmed.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  const safe = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${safe.trim()}…`
}
