'use client';

// research-runtime.ts deleted (T-031) — this component was solely a shell for useResearchRuntime.
// Stubbed to null until a Postgres-native replacement is implemented.

interface ResearchInterfaceProps {
  onCommandChange?: (command: string | null) => void;
  onModelChange?: (model: string) => void;
  className?: string;
}

export function ResearchInterface(_props: ResearchInterfaceProps) {
  return null;
}

export default ResearchInterface;
