/**
 * Marginalia — handwritten cursive scrawl in the bottom-right, mimicking
 * archival annotations (image 3). Decorative & aria-hidden.
 */
export function Marginalia() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        right: "7%",
        bottom: "9%",
        transform: "rotate(-6deg)",
        zIndex: 50,
        color: "rgba(40,55,90,0.7)",
        fontFamily: '"Caveat", "Just Another Hand", cursive',
        fontSize: 15,
        lineHeight: 1.15,
        maxWidth: 160,
      }}
    >
      <div>notes recovered from</div>
      <div>the field archive —</div>
      <div>margin partly lost</div>
    </div>
  )
}
