import { DocumentOne } from "@/components/DocumentOne"
import { DocumentA } from "@/components/DocumentA"
import { DocumentB } from "@/components/DocumentB"
import { VintagePosterA } from "@/components/vintage-posters/VintagePosterA"
import { VintagePosterB } from "@/components/vintage-posters/VintagePosterB"
import { VintagePosterC } from "@/components/vintage-posters/VintagePosterC"
import { VintagePosterD } from "@/components/vintage-posters/VintagePosterD"

export default function Page() {
  return (
    <div className="bg-gray-100 p-0 font-mono space-y-12">
      {/* Original UFO Documents */}
      <DocumentOne />

      <DocumentA
        header={{
          title: "UN:DE FECTAL",
          subtitle: "Record 17330 • Steel/Exa",
          pageNumber: "Page: 08",
        }}
        sidebar={{
          figureLabel: "Fig. 7",
          notes:
            "Field notes recovered from damaged archive. Surface temperatures consistent with controlled burn across basalt plain. Witness marks indicate lift vector.",
        }}
      />

      <DocumentB
        header={{
          title: "Minio Clusso",
          subtitle: "Experimental Debris Survey",
        }}
        footer={{
          caseReference: "ISTA FRLD • Case 886",
          specimen: "Specimen: Δ-7 • Clearance S4",
        }}
      />

      {/* Vintage Poster Collection */}
      <div className="space-y-8">
        <VintagePosterA
          pageTitleLine1="CLASSIFIED"
          pageTitleLine2="ENCOUNTER"
          stampCode="UFO-001-ALPHA"
          dateCode="19 JUL 1947"
          ledgerParagraphs="Witness reports metallic disc-shaped object hovering approximately 500 feet above ground level. Object exhibited no visible propulsion system. Duration of sighting: 4 minutes 32 seconds. Recommend immediate investigation and containment protocols."
          rightRail1="URGENT"
          rightRail2="CLASSIFIED"
          rightRail3="INVESTIGATE"
        />

        <VintagePosterB
          titleISTA="ROSWELL"
          subtitleISTA="Incident documentation protocol"
          verticalTitle="Area 51"
          bottomNumber="047"
        />

        <VintagePosterC headerLeft="OPERATION BLUE BOOK" headerRight="CASE 12561" signature="Col. J. Henderson" />

        <VintagePosterD
          title="DISCLOSURE"
          avatarLabel="WITNESS.01"
          colA="Multiple eyewitness accounts corroborate unusual aerial phenomena. Craft exhibited impossible maneuvers."
          colB="Radar confirmation of unidentified objects. Speed calculations exceed known aircraft capabilities."
          colC="Recommend elevation to highest classification level. Potential national security implications."
          stampText="TOP SECRET"
        />
      </div>

      {/* Mixed Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          <DocumentOne
            header={{
              title: "SUPPLEMENTAL REPORT . 847 ...........",
              subtitle: "Addendum to primary investigation",
              classification: "EYES ONLY . . 2.1",
            }}
            footer={{
              leftColumn: {
                stehat: "witness .. 2..",
                studio: "Field Station Alpha.",
                items: [
                  "Coordinates: 37.2431° N, 115.7930° W",
                  "Time: 23:47 UTC",
                  "Duration: 8 minutes",
                  "Weather: Clear, visibility unlimited",
                ],
              },
            }}
          />
        </div>

        <div className="flex justify-center">
          <VintagePosterB
            titleISTA="NEXUS"
            subtitleISTA="Cross-reference analysis complete"
            verticalTitle="Phase II"
            bottomNumber="847"
          />
        </div>
      </div>

      {/* Alternating Layout */}
      <div className="space-y-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4">
          <div className="lg:w-1/2">
            <DocumentA
              header={{
                title: "CORRELATION MATRIX",
                subtitle: "Pattern Analysis • Sector 7",
                pageNumber: "Page: 15",
              }}
              sidebar={{
                figureLabel: "Fig. 12",
                sections: [
                  {
                    title: "FREQUENCY",
                    subtitle: "occurrence patterns",
                    items: [
                      { label: "daily", value: "3.2" },
                      { label: "weekly", value: "22.7" },
                      { label: "monthly", value: "89.1" },
                    ],
                  },
                ],
                notes:
                  "Statistical analysis reveals non-random distribution of sighting events. Correlation with lunar phases: 0.73. Recommend expanded monitoring grid.",
              }}
            />
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <VintagePosterC headerLeft="STATISTICAL ANALYSIS" headerRight="CONF LEVEL: 95%" signature="Dr. M. Sagan" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8 max-w-7xl mx-auto px-4">
          <div className="lg:w-1/2">
            <DocumentB
              header={{
                title: "Final Assessment",
                subtitle: "Comprehensive Evaluation Protocol",
                indexNumber: "Index 999",
                codeNumber: "99.99",
              }}
              footer={{
                caseReference: "PROJECT DISCLOSURE • Final Report",
                specimen: "Classification: BEYOND TOP SECRET",
              }}
            />
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <VintagePosterD
              title="CONCLUSION"
              avatarLabel="FINAL.RPT"
              colA="Evidence suggests non-terrestrial origin. Technology far exceeds current human capabilities."
              colB="Recommend immediate briefing of highest government officials. Public disclosure protocols required."
              colC="Historical precedent established. Humanity must prepare for contact scenario."
              stampText="APPROVED"
            />
          </div>
        </div>
      </div>

      {/* Stacked Archive Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/50 to-gray-300/80 pointer-events-none" />
        <div className="relative space-y-2">
          <div className="transform rotate-1 origin-center">
            <VintagePosterA
              pageTitleLine1="ARCHIVE"
              pageTitleLine2="STACK"
              stampCode="VAULT-001"
              dateCode="CLASSIFIED"
            />
          </div>
          <div className="transform -rotate-0.5 origin-center -mt-8">
            <DocumentOne
              header={{
                title: "HISTORICAL RECORD . 001 ...........",
                classification: "DECLASSIFIED . . 3.7",
              }}
            />
          </div>
          <div className="transform rotate-0.5 origin-center -mt-8">
            <VintagePosterC headerLeft="ARCHIVE COMPLETE" headerRight="STATUS: SEALED" />
          </div>
        </div>
      </div>
    </div>
  )
}
