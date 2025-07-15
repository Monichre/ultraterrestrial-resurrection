'use client';

import { AssistantRuntimeProvider, Thread, useAssistantInstructions } from "@assistant-ui/react";
import { useResearchRuntime } from "./research-runtime";
import { useMindMap } from '@/contexts/mindmap/mindmap-context';
import { SessionNotesProvider } from '@/contexts/mindmap/session-notes-context';
import { useEffect } from 'react';

interface ResearchInterfaceProps {
  onCommandChange?: (command: string | null) => void;
  onModelChange?: (model: string) => void;
  className?: string;
}

function ResearchCanvas() {
  const { getNodes, getEdges } = useMindMap();
  
  // Provide dynamic context to the assistant
  useAssistantInstructions(`
    Current research context:
    - Total nodes: ${getNodes().length}
    - Total connections: ${getEdges().length}
    - Node types: ${[...new Set(getNodes().map(n => n.type))].join(', ')}
    
    You can help users:
    1. Create new research nodes by searching the UFO/UAP database
    2. Analyze spatial relationships between selected nodes
    3. Generate historical tours through significant events
    4. Cross-reference testimonies and witness accounts
    5. Explore connections between entities
    
    When users ask about UFO/UAP topics, use the available tools to provide comprehensive, data-driven insights.
  `);

  return (
    <div className="research-canvas">
      <Thread />
    </div>
  );
}

export function ResearchInterface({ 
  onCommandChange, 
  onModelChange, 
  className = '' 
}: ResearchInterfaceProps) {
  const runtime = useResearchRuntime();

  return (
    <SessionNotesProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <div className={`research-interface ${className}`}>
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[500px]">
            <div className="p-0 flex flex-col w-full h-auto relative">
              <div className="p-4 flex flex-col w-full border border-neutral-700/30 text-neutral-500 bg-black bg-gradient-to-b from-black relative rounded-xl">
                <ResearchCanvas />
              </div>
            </div>
          </div>
        </div>
      </AssistantRuntimeProvider>
    </SessionNotesProvider>
  );
}

export default ResearchInterface;