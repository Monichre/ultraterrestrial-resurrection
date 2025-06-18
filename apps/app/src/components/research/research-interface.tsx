"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ResearchEditor } from "./research-editor";
import { EvidenceBrowser } from "./evidence-browser";
import { DocumentViewer } from "./document-viewer";
import { cn } from "@/lib/utils";
import { useResearch } from "@/contexts/research/research-context";
import { PinnedCardsCanvas } from "./pinned-cards-canvas";

interface ResearchRecord {
  id: string;
  type: "events" | "personnel" | "documents" | "locations" | "organizations" | 
        "topics" | "sightings" | "testimonies" | "artifacts" | "key-figures" |
        "users" | "user-notes" | "mindmaps" | "summary-files";
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface ResearchInterfaceProps {
  className?: string;
}

export function ResearchInterface({ className }: ResearchInterfaceProps) {
  // Use research context for mind map integration
  const { 
    selectedCard, 
    pinnedCards, 
    pinCard, 
    unpinCard, 
    canvasData, 
    updateCanvasNotes,
    getAIInsights 
  } = useResearch();
  
  const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null);
  const [adjacentRecords, setAdjacentRecords] = useState<ResearchRecord[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [contextualRecords, setContextualRecords] = useState<ResearchRecord[]>([]);
  const [showPinnedCards, setShowPinnedCards] = useState(true);

  // Mock data - replace with actual API calls
  const mockContextualRecords = [
    {
      id: "7A-X119",
      type: "event" as const,
      title: "Quantum State Collapse",
      description: "Probability wave function deviation detected in quantum system observation.",
    },
    {
      id: "7A-X120",
      type: "event" as const,
      title: "Eigenvalue Anomaly", 
      description: "Linear transformation matrices showing unexpected eigenvalue patterns.",
    },
    {
      id: "7A-X121",
      type: "document" as const,
      title: "Agent Field Report",
      description: "Operation Stardust observations.",
    },
  ];

  useEffect(() => {
    setContextualRecords(mockContextualRecords);
  }, []);

  const handleRecordSelect = useCallback(async (record: ResearchRecord) => {
    setSelectedRecord(record);
    
    // Fetch adjacent/related records
    // This would be an API call to get related records based on the selected record
    const mockAdjacent = [
      {
        id: "rel-1",
        type: "personnel" as const,
        title: "Agent Smith",
        description: "Field operative",
      },
      {
        id: "rel-2", 
        type: "location" as const,
        title: "Recovered Material",
        description: "Unknown alloy composition",
      },
    ];
    setAdjacentRecords(mockAdjacent);
  }, []);

  const handleDocumentSelect = useCallback((document: any) => {
    setSelectedDocument(document);
  }, []);

  const handleAtMention = useCallback((query: string) => {
    // Filter contextual records based on query
    const filtered = contextualRecords.filter(record => 
      record.title.toLowerCase().includes(query.toLowerCase()) ||
      record.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    // If we have a selected card, also include its connected records
    if (selectedCard?.connectedRecords) {
      const connectedSuggestions = selectedCard.connectedRecords
        .filter((record: any) => 
          record.name?.toLowerCase().includes(query.toLowerCase()) ||
          record.label?.toLowerCase().includes(query.toLowerCase()) ||
          record.description?.toLowerCase().includes(query.toLowerCase())
        )
        .map((record: any) => ({
          id: record.id,
          type: record.type || "unknown",
          title: record.name || record.label || record.id,
          description: record.description
        }));
      
      filtered.push(...connectedSuggestions);
    }
    
    return filtered;
  }, [contextualRecords, selectedCard]);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="bg-black border-b border-green-400/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-400">RESEARCH BASE</h1>
            <div className="text-sm text-green-400/70">
              AUTHORIZED PERSONNEL ONLY
            </div>
          </div>
          <div className="text-xs text-green-400/50 flex items-center space-x-4">
            {selectedCard && (
              <span>Mind Map: {selectedCard.data?.name || selectedCard.id}</span>
            )}
            {selectedRecord && (
              <span>Record: {selectedRecord.title}</span>
            )}
            {pinnedCards.length > 0 && (
              <span>Pinned: {pinnedCards.length}</span>
            )}
            {!selectedCard && !selectedRecord && "No selection"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Mind Map Cards & Evidence Database */}
        <div className="w-1/3 border-r border-green-400/20 bg-gray-900/50">
          <div className="p-4">
            {/* Selected Card from Mind Map */}
            {selectedCard && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-green-400 mb-3">
                  Selected Card
                </h2>
                <div className="bg-blue-900/20 border border-blue-400/30 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-400 text-sm font-semibold">
                      {selectedCard.type}
                    </span>
                    <button
                      onClick={() => pinCard(selectedCard)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      📌 Pin to Canvas
                    </button>
                  </div>
                  <div className="text-white text-sm">
                    {selectedCard.data?.name || selectedCard.data?.label}
                  </div>
                  {selectedCard.aiAnalysis && (
                    <div className="text-gray-400 text-xs mt-2">
                      {selectedCard.aiAnalysis.summary}
                    </div>
                  )}
                  {selectedCard.connectedRecords && selectedCard.connectedRecords.length > 0 && (
                    <div className="text-green-400 text-xs mt-2">
                      ✓ {selectedCard.connectedRecords.length} connected records
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Research Canvas - Full Experience */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-green-400">
                  Research Canvas
                </h2>
                <div className="flex items-center space-x-2">
                  {pinnedCards.length > 0 && (
                    <span className="text-xs text-green-400/70">
                      {pinnedCards.length} pinned
                    </span>
                  )}
                  <button
                    onClick={() => setShowPinnedCards(!showPinnedCards)}
                    className="text-xs text-green-400/70 hover:text-green-400"
                  >
                    {showPinnedCards ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {showPinnedCards && (
                <div className="h-80 border border-green-400/20 rounded-lg overflow-hidden">
                  <PinnedCardsCanvas 
                    pinnedCards={pinnedCards}
                    onUnpinCard={unpinCard}
                    onCardAnalyze={async (card) => {
                      // Trigger AI analysis for the specific card
                      console.log('Analyzing card:', card)
                      // This would integrate with your AI analysis system
                    }}
                    onCardConnect={async (sourceCard, targetCard) => {
                      // Handle connection between cards
                      console.log('Connecting cards:', sourceCard.id, '→', targetCard.id)
                      // This would create relationships in your research
                    }}
                    onCardMove={(cardId, position) => {
                      // Handle card repositioning for spatial analysis
                      console.log('Card moved:', cardId, position)
                    }}
                    className="h-full"
                  />
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold text-green-400 mb-4">
              Evidence Analysis
            </h2>
            
            {/* Mock credibility cards */}
            <div className="space-y-3 mb-6">
              <div className="bg-red-900/20 border border-red-400/30 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-400 text-sm font-semibold">top-secret</span>
                  <span className="text-red-400 text-xs">0.92</span>
                </div>
                <div className="text-white text-sm mt-1">Quantum State Collapse</div>
                <div className="text-gray-400 text-xs mt-1">
                  Probability wave function deviation detected in quantum system observation.
                </div>
                <div className="text-green-400 text-xs mt-2 flex items-center">
                  ✓ Verifying • 2077-03-15T23:27:18
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-400/30 rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 text-sm font-semibold">classified</span>
                  <span className="text-yellow-400 text-xs">—</span>
                </div>
                <div className="text-white text-sm mt-1">Eigenvalue Anomaly</div>
                <div className="text-gray-400 text-xs mt-1">
                  Linear transformation matrices showing unexpected eigenvalue patterns.
                </div>
                <div className="text-yellow-400 text-xs mt-2 flex items-center">
                  ⚬ Source Verified • 2077-03-15T18:10:32
                </div>
              </div>
            </div>

            <h3 className="text-md font-semibold text-green-400 mb-3">
              Evidence Database
            </h3>
            
            <EvidenceBrowser
              records={contextualRecords}
              selectedRecord={selectedRecord}
              onRecordSelect={handleRecordSelect}
              adjacentRecords={adjacentRecords}
            />
          </div>
        </div>

        {/* Center Panel - Editor */}
        <div className="flex-1 flex flex-col">
          <ResearchEditor
            content={editorContent}
            onContentChange={setEditorContent}
            contextualRecords={contextualRecords}
            onAtMention={handleAtMention}
            selectedRecord={selectedRecord}
          />
        </div>

        {/* Right Panel - Document Viewer */}
        <div className="w-1/3 border-l border-green-400/20 bg-gray-900/50">
          <DocumentViewer
            selectedDocument={selectedDocument}
            onDocumentSelect={handleDocumentSelect}
            adjacentRecords={adjacentRecords}
          />
        </div>
      </div>
    </div>
  );
}