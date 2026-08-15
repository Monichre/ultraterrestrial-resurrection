import { DocumentOne } from "../DocumentOne"
import { DocumentA } from "../DocumentA"
import { VintagePosterA, VintagePosterB } from '../vintage-posters'

interface ResponsiveGridProps {
  className?: string
}

export function ResponsiveDocumentGrid({ className = "" }: ResponsiveGridProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Stacked */}
      <div className="block lg:hidden space-y-8">
        <DocumentOne
          header={{
            title: "MOBILE REPORT . 001 ...........",
            classification: "RESPONSIVE . . 1.0",
          }}
        />
        <VintagePosterA pageTitleLine1="MOBILE" pageTitleLine2="VIEW" stampCode="MOB-001" />
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="space-y-6">
          <DocumentOne
            header={{
              title: "GRID LAYOUT . 001 ...........",
              classification: "DESKTOP . . 2.0",
            }}
          />
        </div>

        <div className="flex justify-center">
          <VintagePosterA pageTitleLine1="GRID" pageTitleLine2="SYSTEM" stampCode="GRID-001" />
        </div>

        <div className="xl:block hidden">
          <DocumentA
            header={{
              title: "EXTENDED VIEW",
              subtitle: "XL Breakpoint Active",
              pageNumber: "Page: XL",
            }}
          />
        </div>
      </div>

      {/* Tablet: Alternating */}
      <div className="hidden md:block lg:hidden">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <DocumentOne
                header={{
                  title: "TABLET VIEW . 001 ...........",
                  classification: "MEDIUM . . 1.5",
                }}
              />
            </div>
            <div className="md:w-1/2 flex justify-center">
              <VintagePosterB titleISTA="TABLET" subtitleISTA="Medium breakpoint active" bottomNumber="768" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
