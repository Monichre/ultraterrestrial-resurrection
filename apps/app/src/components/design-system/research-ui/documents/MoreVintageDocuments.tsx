"use client"

import { FileText, TestTube2, ShieldAlert } from "lucide-react"

// Component 1: The Schematic Blueprint
const SchematicBlueprint = () => (
  <div
    className="w-full min-h-[800px] p-6 relative border-2 border-gray-700 bg-cover bg-center flex flex-col text-gray-300 font-mono"
    style={{ backgroundImage: "url('/textures/schematic-1.png')" }}
  >
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="relative z-10 flex-grow flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-red-500/50 pb-2 mb-4">
        <div className="text-lg">
          <span className="text-red-500 font-bold">SPEC-DOC</span> // 7A-DELTA-9
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tracking-widest">PROJECT AETHERIUS</div>
          <div className="text-xs text-red-400">CORE MATRIX ANALYSIS</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow relative">
        {/* Central SVG overlay for additional details */}
        <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full opacity-60">
          {/* Targeting Reticle */}
          <circle cx="400" cy="300" r="150" stroke="#00ff00" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
          <circle cx="400" cy="300" r="50" stroke="#ff0000" strokeWidth="0.5" fill="none" />
          <line x1="400" y1="0" x2="400" y2="600" stroke="#00ff00" strokeWidth="0.2" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#00ff00" strokeWidth="0.2" />
        </svg>

        {/* Data Annotations */}
        <div className="absolute top-[10%] left-[15%] text-xs p-2 bg-black/50 rounded">
          <div className="text-green-400">INPUT NODE: ALPHA</div>
          <div>&gt; SIG_FREQ: 12.455 THz</div>
          <div>&gt; AMP: 0.89 V</div>
          <div>&gt; STAT: NOMINAL</div>
        </div>

        <div className="absolute bottom-[15%] right-[10%] text-xs p-2 bg-black/50 rounded text-right">
          <div className="text-yellow-400">OUTPUT MANIFOLD: OMEGA</div>
          <div>&gt; PWR_DRAW: 1.21 GW</div>
          <div>&gt; TEMP: 3.4 K</div>
          <div>
            &gt; STAT: <span className="text-red-500 animate-pulse">WARNING</span>
          </div>
        </div>

        <div className="absolute top-[50%] left-[5%] text-xs">
          <div>// PARTICLE TRAJECTORY</div>
          <div>// EIGENVALUE: 4.16e-19 J</div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-red-500/50 pt-2 mt-4 text-xs flex justify-between items-end">
        <div>
          DOC_ID: AE-7A-D9-CM-ANALYSIS-001
          <br />
          AUTH_SIG: DR. ARIS THORNE
        </div>
        <div className="text-4xl font-bold text-red-600/80 border-4 border-red-600/80 p-2 transform -rotate-6">
          CLASSIFIED
        </div>
      </div>
    </div>
  </div>
)

// Component 2: The Field Notes Journal
const FieldNotesJournal = () => (
  <div
    className="w-full min-h-[800px] p-8 relative border-2 border-gray-400 bg-cover bg-center font-serif text-gray-800"
    style={{ backgroundImage: "url('/textures/crumpled-checkered-paper.jpeg')" }}
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Handwritten Notes */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold border-b-2 border-gray-400 pb-2 mb-4">Expedition Log: LV-426</h1>
        <div className="space-y-6 text-sm leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive" }}>
          <p>
            <span className="font-bold text-base">Day 14:</span> We've ventured deeper into the derelict structure. The
            air is thick with an odor I can only describe as ancient dust and ozone. The grid paper texture of this
            journal feels inadequate to capture the sheer alienness of the architecture. Every surface seems to be
            organically grown, yet impossibly rigid.
          </p>
          <p>
            I managed to secure a sample from an outer conduit. See attached sketch. Its composition is unlike anything
            in our databases - a silicon-chitin hybrid? It hums with a low-level energy, causing my instruments to
            falter. The sample is surprisingly light, with a texture like fossilized insect carapace.
          </p>
          <p>
            The team is on edge. We keep hearing sounds, like whispers carried on a wind that doesn't exist within these
            walls. I'm cataloging the atmospheric data, but the readings are erratic. Something is interfering.
          </p>
        </div>
      </div>

      {/* Right Column: Sketch and Data */}
      <div className="space-y-6">
        <div className="border-2 border-gray-400 p-4 bg-white/30 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-2 text-center">Specimen 7-B Sketch</h2>
          <svg viewBox="0 0 200 200" className="w-full stroke-current text-gray-700">
            <path
              d="M 50,150 C 20,100 40,50 100,50 C 160,50 180,100 150,150 C 120,200 80,200 50,150 Z"
              fill="none"
              strokeWidth="2"
            />
            <path d="M 100,50 C 120,80 80,80 100,120" fill="none" strokeWidth="1.5" />
            <path d="M 100,120 C 130,140 70,140 100,170" fill="none" strokeWidth="1" />
            <circle cx="100" cy="100" r="5" fill="currentColor" />
          </svg>
          <p className="text-xs text-center mt-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Note the internal crystalline structures.
          </p>
        </div>

        <div className="p-2 bg-yellow-50/50 border-l-4 border-yellow-700 shadow-md transform rotate-2">
          <h3 className="font-bold text-sm">Atmospheric Data</h3>
          <table className="w-full text-xs mt-1 font-mono">
            <tbody>
              <tr>
                <td>N2:</td>
                <td>78.08%</td>
              </tr>
              <tr>
                <td>O2:</td>
                <td>20.95%</td>
              </tr>
              <tr>
                <td>Ar:</td>
                <td>0.93%</td>
              </tr>
              <tr>
                <td>Xe:</td>
                <td className="text-red-600 font-bold">1.04% (Anomalous)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

// Component 3: The Redacted Report
const RedactedReport = () => (
  <div
    className="w-full min-h-[800px] p-12 relative bg-cover bg-center font-serif text-black"
    style={{ backgroundImage: "url('/textures/graph-paper.png')" }}
  >
    <div className="absolute inset-0 w-full h-full bg-white/20"></div>
    <div className="absolute inset-0 text-red-500/10 text-9xl font-bold flex items-center justify-center transform -rotate-12 select-none pointer-events-none">
      TOP SECRET
    </div>

    <div className="relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">OFFICIAL REPORT</h1>
        <p className="text-sm">INCIDENT 734-ALPHA // "THE PHOENIX EVENT"</p>
      </div>

      <div className="text-justify text-sm leading-loose space-y-4">
        <p>
          On 0800 hours, 14-OCT-2024, containment of Asset-734 was breached. The subject, previously designated
          <span className="bg-black text-black select-none">Dr. Evelyn Reed</span>, exhibited abilities far exceeding
          initial projections. The event originated in{" "}
          <span className="bg-black text-black select-none">Sub-level 4, Research Bay C</span>, during a routine psionic
          resonance test.
        </p>
        <p>
          Initial reports from on-site personnel describe a sudden cascade of energy, measured at over
          <span className="bg-black text-black select-none">1.2 terawatts</span>. This energy wave disabled all
          electronic systems within a five-kilometer radius. Security teams attempting to engage were met with what can
          only be described as
          <span className="bg-black text-black select-none">localized reality distortion</span>. Eyewitness accounts
          mention
          <span className="bg-black text-black select-none">
            hallucinations, temporal loops, and physical transmutations of the environment
          </span>
          .
        </p>
        <p>
          The primary objective shifted from containment to mitigation. Protocol{" "}
          <span className="bg-black text-black select-none">Chimera</span>
          was initiated by Director <span className="bg-black text-black select-none">Alan Cross</span>, but the
          deployed assets proved ineffective. The subject demonstrated control over{" "}
          <span className="bg-black text-black select-none">
            fundamental forces, including gravity and electromagnetism
          </span>
          , rendering conventional weaponry useless.
        </p>
        <p>
          The incident concluded when the subject{" "}
          <span className="bg-black text-black select-none">voluntarily ceased activity and dematerialized</span>. The
          current whereabouts of Asset-734 are unknown. All surviving personnel have been debriefed and administered
          Class-A amnestics. This report is to be sealed under directive 7-Omega.
        </p>
      </div>

      <div className="mt-16 flex justify-end">
        <div className="w-1/2">
          <div className="border-t-2 border-black w-full"></div>
          <p className="text-center text-sm mt-2">Signature, O5-Council</p>
        </div>
      </div>
    </div>
  </div>
)

export default function MoreVintageDocuments() {
  return (
    <div className="space-y-8 p-4 bg-gray-800">
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          Schematic Blueprint
        </h2>
        <SchematicBlueprint />
      </div>
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <TestTube2 className="text-green-500" />
          Field Notes Journal
        </h2>
        <FieldNotesJournal />
      </div>
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="text-yellow-500" />
          Redacted Report
        </h2>
        <RedactedReport />
      </div>
    </div>
  )
}
