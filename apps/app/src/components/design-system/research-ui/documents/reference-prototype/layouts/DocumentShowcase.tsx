import { MixedDocumentLayout } from "./MixedDocumentLayout"

export function DocumentShowcase() {
  const showcaseDocuments = [
    {
      type: "poster-a" as const,
      props: {
        pageTitleLine1: "FIRST",
        pageTitleLine2: "CONTACT",
        stampCode: "FC-001-ALPHA",
        dateCode: "14 JUL 1947",
        ledgerParagraphs:
          "Initial contact protocol established. Subject demonstrates advanced intelligence and peaceful intentions. Recommend diplomatic approach.",
      },
    },
    {
      type: "document-one" as const,
      props: {
        header: {
          title: "CONTACT PROTOCOL . 001 ...........",
          subtitle: "First diplomatic exchange documented",
          classification: "COSMIC TOP SECRET . . 1.0",
        },
      },
    },
    {
      type: "poster-b" as const,
      props: {
        titleISTA: "EXCHANGE",
        subtitleISTA: "Communication established",
        verticalTitle: "Phase I",
        bottomNumber: "001",
      },
    },
    {
      type: "document-a" as const,
      props: {
        header: {
          title: "LINGUISTIC ANALYSIS",
          subtitle: "Communication Patterns • Phase I",
          pageNumber: "Page: 01",
        },
        sidebar: {
          figureLabel: "Fig. 1",
          notes:
            "Mathematical concepts successfully exchanged. Universal constants confirmed as communication baseline.",
        },
      },
    },
  ]

  const archiveDocuments = [
    {
      type: "poster-c" as const,
      props: {
        headerLeft: "HISTORICAL ARCHIVE",
        headerRight: "VAULT 001",
      },
      transform: "rotate(1deg)",
    },
    {
      type: "document-one" as const,
      props: {
        header: {
          title: "ARCHIVED RECORD . 847 ...........",
          classification: "HISTORICAL . . 4.2",
        },
      },
      transform: "rotate(-0.5deg) translateY(-2rem)",
    },
    {
      type: "poster-d" as const,
      props: {
        title: "SEALED",
        stampText: "VAULT",
      },
      transform: "rotate(0.5deg) translateY(-4rem)",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Stacked Layout */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">Sequential Documentation</h2>
        <MixedDocumentLayout variant="stacked" documents={showcaseDocuments} />
      </section>

      {/* Grid Layout */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">Comparative Analysis</h2>
        <MixedDocumentLayout variant="grid" documents={showcaseDocuments.slice(0, 4)} />
      </section>

      {/* Archive Effect */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">Archive Stack</h2>
        <MixedDocumentLayout variant="archive" documents={archiveDocuments} />
      </section>
    </div>
  )
}
