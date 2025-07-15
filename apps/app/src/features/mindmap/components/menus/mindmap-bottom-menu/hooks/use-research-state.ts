import { useState, useCallback, useRef, useEffect } from 'react';
import { useMindMap } from '@/contexts/mindmap/mindmap-context';
import { useSessionNotes } from '@/contexts/mindmap/session-notes-context';
import { v4 as uuidv4 } from 'uuid';

export interface ResearchState {
  sessionId: string;
  activeMode: 'research' | 'tour' | 'analysis' | null;
  isProcessing: boolean;
  selectedNodes: string[];
  tourState: {
    isActive: boolean;
    currentStep: number;
    totalSteps: number;
    theme: string | null;
  };
  analysisResults: any[];
}

export function useResearchState() {
  const mindmapContext = useMindMap();
  const { addNoteFromMessage } = useSessionNotes();
  
  // Session management
  const sessionId = useRef<string>(
    typeof window !== 'undefined' 
      ? localStorage.getItem('researchSessionId') || uuidv4() 
      : uuidv4()
  );

  // Core state
  const [state, setState] = useState<ResearchState>({
    sessionId: sessionId.current,
    activeMode: null,
    isProcessing: false,
    selectedNodes: [],
    tourState: {
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      theme: null
    },
    analysisResults: []
  });

  // Save session ID to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('researchSessionId')) {
      localStorage.setItem('researchSessionId', sessionId.current);
    }
  }, []);

  // Update selected nodes when mindmap selection changes
  useEffect(() => {
    const selectedNodeIds = mindmapContext.getNodes()
      .filter(node => node.selected)
      .map(node => node.id);
    
    setState(prev => ({
      ...prev,
      selectedNodes: selectedNodeIds
    }));
  }, [mindmapContext.getNodes]);

  // Actions
  const setActiveMode = useCallback((mode: ResearchState['activeMode']) => {
    setState(prev => ({ ...prev, activeMode: mode }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  const updateTourState = useCallback((tourUpdate: Partial<ResearchState['tourState']>) => {
    setState(prev => ({
      ...prev,
      tourState: { ...prev.tourState, ...tourUpdate }
    }));
  }, []);

  const addAnalysisResult = useCallback((result: any) => {
    setState(prev => ({
      ...prev,
      analysisResults: [...prev.analysisResults, result]
    }));
  }, []);

  const clearAnalysisResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      analysisResults: []
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeMode: null,
      isProcessing: false,
      selectedNodes: [],
      tourState: {
        isActive: false,
        currentStep: 0,
        totalSteps: 0,
        theme: null
      },
      analysisResults: []
    }));
  }, []);

  return {
    state,
    actions: {
      setActiveMode,
      setProcessing,
      updateTourState,
      addAnalysisResult,
      clearAnalysisResults,
      resetState
    },
    context: {
      sessionId: sessionId.current,
      mindmapContext,
      addNoteFromMessage
    }
  };
}