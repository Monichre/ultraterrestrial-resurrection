import ClassificationBanner from "./classification-banner";
import EvidenceBrowser from "./evidence-browser";
import EvidenceCard from "./evidence-card";

export function CaseFileDossier() {
	return (
		<div className="min-h-screen bg-neutral-950 p-12">
			<div className="mx-auto max-w-5xl space-y-8">
				<ClassificationBanner />

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

				<EvidenceBrowser />
			</div>
		</div>
	);
}
