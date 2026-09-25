'use client'

/**
 * TechnicalBrandGeometry — Storybook iframe shell around the Neuform
 * "Technical Brand Geometry" HTML donor (Three.js + GSAP ScrollTrigger).
 *
 * Native React/WebGL port is a follow-up; this shell preserves the authored
 * HTML so it can be reviewed in-app without CDN rewrites yet.
 */
export type TechnicalBrandGeometryProps = {
  className?: string
  title?: string
}

const SRC = '/lab-prototypes/technical-brand-geometry-1.html'

export function TechnicalBrandGeometry({
  className = 'h-screen w-screen',
  title = 'Technical Brand Geometry',
}: TechnicalBrandGeometryProps) {
  return (
    <iframe
      title={title}
      src={SRC}
      className={`border-0 ${className}`}
      sandbox='allow-scripts allow-same-origin'
    />
  )
}

export default TechnicalBrandGeometry
