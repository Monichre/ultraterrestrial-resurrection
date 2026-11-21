import React from 'react'

/**
 * Renders a self-contained HTML design document from
 * apps/app/public/design-sandbox/ inside an iframe.
 *
 * The artifacts are full documents (own <html>/<head>/<style>,
 * some pull the Tailwind CDN or Google Fonts), so an iframe via a
 * static URL is the only leak-free way to show them in Storybook —
 * no CSS or script can escape into the canvas document.
 */
const HtmlDesignFrame = ({ src, title }: { src: string; title: string }) => (
  <iframe
    src={src}
    title={title}
    style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
  />
)

export default HtmlDesignFrame
