import type { DocumentOneProps } from "./types/documents"
import { DocumentFrame } from "./DocumentFrame"

const defaultProps: Required<DocumentOneProps> = {
  header: {
    title: "INCFRESEMEMENT . 263 ...........",
    subtitle: "n sæs .45762 ALL c cændere osaal.",
    reference: "Res 120        S Aktvo",
    classification: "INQ UNNEIQ . . 1.6",
  },
  metadata: {
    justeret: "justeret 22553005     lunfs.e. srat . 46256",
    sektm: "s.sektm                                                          §",
    udkstra: "u) usd.p.udkstra.sæs95",
    hjhabo: "hjhabo:",
    location: "Monåsmaschliucovi  ined 52 05. 1995",
  },
  footer: {
    leftColumn: {
      stehat: "stehat .. 4..",
      studio: "ESilloonstudio.",
      items: [
        "ArkaLAr 234 i.(05-aax",
        "InoaLAoers0940inc.)   ) M4604. 107arc",
        "Hlralptegsfar..544- B.c :  3a ( 11 (978711)",
        "Aosrarkodik&45050",
        "Ss sg)1st.!&s*glesss.",
        "solsthast.",
      ],
    },
    rightColumn: {
      dseys: "A..Dseys.6147rane",
      astso: "= astso3     le Gers.   066 78   S   Se .",
    },
  },
}

export function DocumentOne(props: DocumentOneProps = {}) {
  const config = {
    header: { ...defaultProps.header, ...props.header },
    metadata: { ...defaultProps.metadata, ...props.metadata },
    footer: {
      leftColumn: { ...defaultProps.footer.leftColumn, ...props.footer?.leftColumn },
      rightColumn: { ...defaultProps.footer.rightColumn, ...props.footer?.rightColumn },
    },
  }

  return (
    <DocumentFrame>
      {/* Header Section */}
      <div className="relative p-8 pb-4 font-mono">
        <div className="text-black font-bold text-lg tracking-wider mb-2">{config.header.title}</div>
        <div className="text-xs space-y-1 mb-4">
          <div>{config.header.subtitle}</div>
          <div>{config.header.reference}</div>
          <div>Spots produktion</div>
        </div>
        <div className="border-t border-b border-black py-2 my-4">
          <div className="text-black font-bold text-lg tracking-wider">{config.header.classification}</div>
        </div>
        <div className="text-xs space-y-1">
          <div>{config.metadata.justeret}</div>
          <div>{config.metadata.sektm}</div>
          <div>{config.metadata.udkstra}</div>
          <div>{config.metadata.hjhabo}</div>
          <div>{config.metadata.location}</div>
        </div>
      </div>

      {/* Bottom Section in normal flow */}
      <div className="px-8 pb-8 pt-8 border-t border-black/20">
        <div className="flex justify-between items-end">
          <div className="text-xs space-y-1">
            <div>{config.footer.leftColumn.stehat}</div>
            <div>{config.footer.leftColumn.studio}</div>
            <div className="mt-4 space-y-1">
              {config.footer.leftColumn.items.map((item, index) => (
                <div key={index} className={index === config.footer.leftColumn.items.length - 1 ? "text-right" : ""}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-right">
            <div>{config.footer.rightColumn.dseys}</div>
            <div className="mt-8 space-y-1">
              <div>{config.footer.rightColumn.astso}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scattered stains */}
      <div className="absolute top-12 right-16 w-5 h-5 bg-yellow-600 rounded-full opacity-15 blur-sm" />
      <div className="absolute top-32 left-12 w-2 h-2 bg-amber-700 rounded-full opacity-25" />
      <div className="absolute bottom-24 right-20 w-4 h-4 bg-yellow-700 rounded-full opacity-20 blur-sm" />
      <div className="absolute top-20 left-1/3 w-1 h-1 bg-amber-800 rounded-full opacity-40" />
      <div className="absolute bottom-16 left-16 w-3 h-3 bg-yellow-800 rounded-full opacity-15 blur-sm" />
      <div className="absolute top-40 right-1/3 w-2 h-2 bg-amber-600 rounded-full opacity-20" />
      <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-yellow-900 rounded-full opacity-30" />
      <div className="absolute top-64 right-24 w-6 h-2 bg-amber-500 rounded-full opacity-10 blur-sm rotate-12" />
      <div className="absolute bottom-40 right-16 w-3 h-1 bg-yellow-700 rounded-full opacity-15 blur-sm -rotate-6" />
    </DocumentFrame>
  )
}
