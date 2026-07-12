import type { DocumentBProps } from "@/types/documents"
import { DocumentFrame } from "./DocumentFrame"
import { PhotoCaption } from "@/components/ui/PhotoCaption"

const defaultProps: Required<DocumentBProps> = {
  header: {
    title: "Minio Clusso",
    subtitle: "Experimental Debris Survey",
    indexNumber: "Index 889",
    codeNumber: "20.90",
  },
  images: {
    abstract: {
      src: "/images/doc-b-abstract.png",
      alt: "Abstract archival scan with crosshair and flame field",
    },
    textstorm: {
      src: "/images/doc-b-textstorm.png",
      alt: "Typewritten page with particulate tornado plume",
    },
    stamp: {
      src: "/images/doc-b-stamp.png",
      alt: "Clean archival layout with explosions and circular stamp",
    },
  },
  footer: {
    caseReference: "ISTA FRLD • Case 886",
    specimen: "Specimen: Δ-7 • Clearance S4",
  },
}

export function DocumentB(props: DocumentBProps = {}) {
  const config = {
    header: { ...defaultProps.header, ...props.header },
    images: { ...defaultProps.images, ...props.images },
    footer: { ...defaultProps.footer, ...props.footer },
  }

  return (
    <DocumentFrame className="mt-12">
      {/* Sparse header */}
      <header className="px-8 pt-10 pb-4">
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <div className="uppercase tracking-[0.4em] text-sm">{config.header.title}</div>
            <div className="text-[10px] opacity-70">{config.header.subtitle}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{config.header.codeNumber}</div>
            <div className="text-xs tracking-widest">{config.header.indexNumber}</div>
          </div>
        </div>
      </header>

      {/* Main composition area */}
      <div className="relative px-6 pb-12">
        {/* Crosshair lines */}
        <div className="absolute inset-0 px-6" aria-hidden="true">
          <div className="absolute left-1/2 top-20 bottom-24 w-px bg-black/20" />
          <div className="absolute top-1/2 left-8 right-8 h-px bg-black/20" />
        </div>

        <div className="relative grid grid-cols-1 gap-6">
          {/* Background abstract scan */}
          <div className="relative border border-black/40 bg-white">
            <img
              src={config.images.abstract.src || "/placeholder.svg"}
              alt={config.images.abstract.alt}
              className="w-full h-[28rem] object-cover"
            />
            <PhotoCaption
              labelTop="Scan A-1"
              captionNote="Electromagnetic interference patterns suggest non-terrestrial origin"
              className="top-2 right-2"
            />
            <div className="absolute inset-0 ring-1 ring-black/10" aria-hidden="true" />
          </div>

          {/* Lower collage row with two panels */}
          <div className="grid grid-cols-2 gap-6">
            <div className="relative border border-black/50 bg-white">
              <img
                src={config.images.textstorm.src || "/placeholder.svg"}
                alt={config.images.textstorm.alt}
                className="w-full h-64 object-cover"
              />
              <PhotoCaption
                labelTop="Fragment B-2"
                captionNote="Debris field analysis - metallic composition unknown"
                className="bottom-1 left-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
            <div className="relative border border-black/50 bg-white">
              <img
                src={config.images.stamp.src || "/placeholder.svg"}
                alt={config.images.stamp.alt}
                className="w-full h-64 object-cover"
              />
              <PhotoCaption
                labelTop="Archive C-3"
                captionNote="Official documentation - classification pending review"
                className="bottom-1 right-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Marginalia and stamp */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-[10px] tracking-widest">{config.footer.caseReference}</div>
          <div className="text-[10px]">{config.footer.specimen}</div>
        </div>

        {/* Edge burn vignettes */}
        <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.15))]" />
        </div>
      </div>
    </DocumentFrame>
  )
}
