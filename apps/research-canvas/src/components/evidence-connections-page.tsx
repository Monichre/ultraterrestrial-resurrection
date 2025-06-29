import ClassificationBanner from "./classification-banner"
import EvidenceNetwork from "./evidence-network"
import EvidenceCard from "./evidence-card"
import DataGrid from "./data-grid"
export default function EvidenceConnectionsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-20 p-12 relative">
      {/* Graph Paper Background */}
      <div
        className="graph-paper-bg absolute inset-0 opacity-30 z-[-5]"
        style={{
          backgroundImage: "url(https://www.transparenttextures.com/patterns/graphy.png)",
        }}
      />

      <div className="mx-auto max-w-6xl space-y-8 relative">
        <ClassificationBanner level="top-secret" warning="EVIDENCE CORRELATION SYSTEM - AUTHORIZED PERSONNEL ONLY" />


        <div className="grid gap-6">
          <h1 className="text-2xl font-mono font-bold text-neutral-200">Evidence Connection Analysis</h1>
          <p className="text-neutral-400">
            This system visualizes connections between evidence records, testimonies, events, and artifacts. Select
            nodes to explore relationships and analyze the strength of connections between different pieces of evidence.
          </p>

                <div className="grid gap-6 md:grid-cols-2">
          <EvidenceCard
            caseNumber="X-37B"
            classification="top-secret"
            timestamp="2077-03-15T21:27:18"
            title="Quantum State Collapse"
            description="Probability wave function deviation detected in quantum system observation."
            credibilityScore={undefined}
            sourceVerified={false}
          />
          <EvidenceCard
            caseNumber="X-38C"
            classification="classified"
            timestamp="2077-03-15T18:15:32"
            title="Eigenvalue Anomaly"
            description="Linear transformation matrices showing unexpected eigenvalue patterns."
            credibilityScore={0.92}
            sourceVerified={true}
          />
        </div>
        <DataGrid />

          <EvidenceNetwork />
        </div>
      </div>
    </div>
  )
}
