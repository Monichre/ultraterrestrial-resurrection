/**
 * Scopes every rule in a CSS string to a wrapper selector (e.g. '.nsa').
 *
 * Downloaded design artifacts ship global selectors (`body, html`, `*`,
 * `:root`, bare class names) that would bleed into the Storybook canvas
 * document while mounted. This rewrites each rule's selector list so the
 * whole stylesheet only applies inside the wrapper element:
 *
 *   `:root { ... }`        -> `.nsa { ... }`        (CSS vars scoped to wrapper)
 *   `body, html { ... }`   -> `.nsa { ... }`
 *   `* { ... }`            -> `.nsa * { ... }`
 *   `.workspace { ... }`   -> `.nsa .workspace { ... }`
 *
 * At-rules (@media, @keyframes) and keyframe steps (from/to/percentages)
 * are passed through untouched.
 */
export function scopeCss(css: string, scope: string): string {
  return css.replace(/([^{}]+?)\{/g, (match, rawSelector: string) => {
    const selector = rawSelector.trim()

    const isAtRule =
      selector.startsWith('@') ||
      /^(media|supports|keyframes|font-face|charset|import|namespace)\b/i.test(selector)
    const isKeyframeStep = /^(from|to)$/.test(selector) || /^\d+(\.\d+)?%$/.test(selector)

    if (selector.length === 0 || isAtRule || isKeyframeStep) {
      return match
    }

    return (
      selector
        .split(',')
        .map((part) => {
          const s = part.trim()
          // :root/html/body refer to the document — map them onto the wrapper itself
          if (s === ':root' || s === 'html' || s === 'body') {
            return scope
          }
          return `${scope} ${s}`
        })
        .join(', ') + ' {'
    )
  })
}
