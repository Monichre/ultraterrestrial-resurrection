// React context for multi-agent system
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AgentType, SystemState, AgentResponse } from '../agents/types';
import { MultiAgentSystem, getMultiAgentSystem } from '../agents/system';
import { KGNode } from '../types/graph';

interface AgentContextType {
  system: MultiAgentSystem;
  state: SystemState;
  responses: Record<AgentType, string>;
  isLoading: boolean;
  error: string | null;

  // Actions
  startTour: (nodeId: string) => Promise<void>;
  navigateToNode: (nodeId: string) => Promise<void>;
  handleQuestion: (question: string) => Promise<string>;
  getRecommendations: () => string[];
  resetTour: () => void;
}

const AgentContext = createContext<AgentContextType | null>(null);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [system] = useState(() => getMultiAgentSystem());
  const [state, setState] = useState<SystemState>(system.getState());
  const [responses, setResponses] = useState<Record<AgentType, string>>({
    guide: '',
    navigator: '',
    analyst: '',
    visualizer: '',
    coordinator: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback(() => {
    setState(system.getState());
  }, [system]);

  const startTour = useCallback(async (nodeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const agentResponses = await system.startTour(nodeId);
      const newResponses: Record<AgentType, string> = {
        guide: '',
        navigator: '',
        analyst: '',
        visualizer: '',
        coordinator: ''
      };
      agentResponses.forEach(r => {
        newResponses[r.agent] = r.content;
      });
      setResponses(newResponses);
      updateState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tour');
    } finally {
      setIsLoading(false);
    }
  }, [system, updateState]);

  const navigateToNode = useCallback(async (nodeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const agentResponses = await system.navigateToNode(nodeId);
      const newResponses: Record<AgentType, string> = {
        guide: '',
        navigator: '',
        analyst: '',
        visualizer: '',
        coordinator: ''
      };
      agentResponses.forEach(r => {
        newResponses[r.agent] = r.content;
      });
      setResponses(newResponses);
      updateState();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to navigate');
    } finally {
      setIsLoading(false);
    }
  }, [system, updateState]);

  const handleQuestion = useCallback(async (question: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await system.handleQuestion(question);
      setResponses(prev => ({ ...prev, analyst: response.content }));
      updateState();
      return response.content;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process question');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [system, updateState]);

  const getRecommendations = useCallback(() => {
    return system.getRecommendations();
  }, [system]);

  const resetTour = useCallback(() => {
    system.resetTour();
    setResponses({
      guide: '',
      navigator: '',
      analyst: '',
      visualizer: '',
      coordinator: ''
    });
    updateState();
  }, [system, updateState]);

  const value: AgentContextType = {
    system,
    state,
    responses,
    isLoading,
    error,
    startTour,
    navigateToNode,
    handleQuestion,
    getRecommendations,
    resetTour
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
}