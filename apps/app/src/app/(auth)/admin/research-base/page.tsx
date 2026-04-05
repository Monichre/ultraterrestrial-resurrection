import { ResearchInterface } from "@/features/mindmap/components/menus/mindmap-bottom-menu/research-interface";
import { ResearchProvider } from "@/contexts/research/research-context";
import { AIMindMapProvider } from "@/features/mindmap/components/ai-integration";

export default async function ResearchBasePage() {
  return (
    <div className="h-screen bg-black text-green-400 font-mono">
      <AIMindMapProvider>
        <ResearchProvider>
          <ResearchInterface />
        </ResearchProvider>
      </AIMindMapProvider>
    </div>
  );
}
