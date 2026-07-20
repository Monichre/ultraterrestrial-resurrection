import { DocumentOne } from "@/components/DocumentOne"
import { DocumentA } from "@/components/DocumentA"
import { DocumentB } from "@/components/DocumentB"
import { VintagePosterA, VintagePosterB, VintagePosterC, VintagePosterD } from "@/components/vintage-posters"

interface MixedLayoutProps {
  variant?: "stacked" | "grid" | "alternating" | "archive"
  documents?: Array<{
    type: "document-one" | "document-a" | "document-b" | "poster-a" | "poster-b" | "poster-c" | "poster-d"
    props?: any
    transform?: string
  }>
}

export function MixedDocumentLayout({ variant = "stacked", documents = [] }: MixedLayoutProps) {
  const renderDocument = (doc: MixedLayoutProps["documents"][0], index: number) => {
    const baseProps = doc.props || {}
    const wrapperStyle = doc.transform ? { transform: doc.transform } : {}

    switch (doc.type) {
      case "document-one":
        return (
          <div key={index} style={wrapperStyle}>
            <DocumentOne {...baseProps} />
          </div>
        )
      case "document-a":
        return (
          <div key={index} style={wrapperStyle}>
            <DocumentA {...baseProps} />
          </div>
        )
      case "document-b":
        return (
          <div key={index} style={wrapperStyle}>
            <DocumentB {...baseProps} />
          </div>
        )
      case "poster-a":
        return (
          <div key={index} style={wrapperStyle}>
            <VintagePosterA {...baseProps} />
          </div>
        )
      case "poster-b":
        return (
          <div key={index} style={wrapperStyle}>
            <VintagePosterB {...baseProps} />
          </div>
        )
      case "poster-c":
        return (
          <div key={index} style={wrapperStyle}>
            <VintagePosterC {...baseProps} />
          </div>
        )
      case "poster-d":
        return (
          <div key={index} style={wrapperStyle}>
            <VintagePosterD {...baseProps} />
          </div>
        )
      default:
        return null
    }
  }

  const getLayoutClasses = () => {
    switch (variant) {
      case "grid":
        return "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4"
      case "alternating":
        return "space-y-12"
      case "archive":
        return "relative space-y-2"
      default:
        return "space-y-8"
    }
  }

  const getWrapperClasses = () => {
    if (variant === "archive") {
      return "relative"
    }
    return "bg-gray-100 p-0 font-mono"
  }

  return (
    <div className={getWrapperClasses()}>
      {variant === "archive" && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/50 to-gray-300/80 pointer-events-none" />
      )}
      <div className={getLayoutClasses()}>{documents.map((doc, index) => renderDocument(doc, index))}</div>
    </div>
  )
}
