import React, { useState, useCallback } from 'react';
import { AgentProvider, useAgent } from '../contexts/AgentContext';
import { Header } from './Header';
import { KnowledgeGraph } from './KnowledgeGraph';
import { TourGuidePanel } from './TourGuidePanel';
import { DataInsightsPanel } from './DataInsightsPanel';
import { NavigationPanel } from './NavigationPanel';
import { defaultTourConfig, getNodeById } from '../data/ufoData';

function TourApp() {
  const {
    state,
    responses,
    isLoading,
    startTour,
    navigateToNode,
    handleQuestion,
    resetTour
  } = useAgent();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleStartTour = useCallback(async () => {
    await startTour(defaultTourConfig.startNodeId);
  }, [startTour]);

  const handleReset = useCallback(() => {
    resetTour();
    setSelectedNodeId(null);
  }, [resetTour]);

  const handleNodeSelect = useCallback(async (nodeId: string) => {
    setSelectedNodeId(nodeId);
    if (state.tourStatus === 'idle') {
      await startTour(nodeId);
    } else {
      await navigateToNode(nodeId);
    }
  }, [state.tourStatus, startTour, navigateToNode]);

  const handleNavigate = useCallback(async (nodeId: string) => {
    setSelectedNodeId(nodeId);
    await navigateToNode(nodeId);
  }, [navigateToNode]);

  const onAskQuestion = useCallback(async (question: string) => {
    await handleQuestion(question);
  }, [handleQuestion]);

  return (
    <div className="app">
      <Header onStartTour={handleStartTour} onReset={handleReset} />

      <main className="main-content">
        {/* Hero Section */}
        {state.tourStatus === 'idle' && responses.guide === '' && (
          <div className="hero-section">
            <div className="hero-content">
              <h2>Welcome to the UFO Knowledge Graph Explorer</h2>
              <p>
                Embark on a journey through the most significant events, locations, and concepts
                in UFO history. Our multi-agent AI team will guide you through interconnected
                data points, providing narrative context, deep analysis, and visual insights.
              </p>
              <div className="hero-features">
                <div className="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>5 AI Agents</span>
                </div>
                <div className="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B68EE" strokeWidth="2">
                    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                    <line x1="12" y1="22" x2="12" y2="15.5" />
                    <polyline points="22,8.5 12,15.5 2,8.5" />
                  </svg>
                  <span>20+ Nodes</span>
                </div>
                <div className="feature">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Interactive Tour</span>
                </div>
              </div>
              <button className="cta-button" onClick={handleStartTour} disabled={isLoading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Begin Journey
              </button>
            </div>
          </div>
        )}

        {/* Graph Visualization */}
        <div className="graph-section">
          <KnowledgeGraph
            selectedNodeId={selectedNodeId}
            visitedNodes={state.visitedNodes}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Agent Panels */}
        <div className="panels-grid">
          <div className="panel-column main-column">
            <TourGuidePanel
              narrative={responses.guide}
              isLoading={isLoading}
            />
          </div>

          <div className="panel-column">
            <DataInsightsPanel
              insights={responses.analyst}
              visualData={responses.visualizer}
              isLoading={isLoading}
            />

            <NavigationPanel
              recommendations={state.responses.navigatorPath || []}
              visitedNodes={state.visitedNodes}
              onNavigate={handleNavigate}
              onAskQuestion={onAskQuestion}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>UFO Knowledge Graph Explorer • Multi-Agent AI System</p>
        <div className="agent-status-bar">
          {['guide', 'navigator', 'analyst', 'visualizer', 'coordinator'].map((agent) => (
            <div
              key={agent}
              className={`agent-indicator ${responses[agent as keyof typeof responses] ? 'active' : ''}`}
            >
              <span className="agent-dot" />
              <span className="agent-name">{agent}</span>
            </div>
          ))}
        </div>
      </footer>

      <style>{`
        .app {
          min-height: 100vh;
          background: #0A0E1A;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding: 1.5rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-section {
          text-align: center;
          padding: 2rem 0 3rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .hero-content h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          color: #E8F4FF;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #00D4FF, #7B68EE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-content p {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
          color: #8BA4C7;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #E8F4FF;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #00D4FF 0%, #7B68EE 100%);
          color: #0A0E1A;
          border: none;
          border-radius: 12px;
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 212, 255, 0.4);
        }

        .cta-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .graph-section {
          margin-bottom: 1.5rem;
        }

        .panels-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
        }

        .panel-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main-column {
          max-width: none;
        }

        .footer {
          background: linear-gradient(180deg, #1A2744 0%, #0A0E1A 100%);
          border-top: 1px solid rgba(0, 212, 255, 0.1);
          padding: 1rem 2rem;
          text-align: center;
        }

        .footer p {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #8BA4C7;
          margin: 0 0 0.75rem 0;
        }

        .agent-status-bar {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .agent-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .agent-dot {
          width: 8px;
          height: 8px;
          background: #2A3F5F;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .agent-indicator.active .agent-dot {
          background: #4ECDC4;
          box-shadow: 0 0 8px rgba(78, 205, 196, 0.5);
        }

        .agent-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: #8BA4C7;
          text-transform: capitalize;
        }

        @media (max-width: 1200px) {
          .panels-grid {
            grid-template-columns: 1fr;
          }

          .panel-column:not(.main-column) {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 1rem;
          }

          .hero-content h2 {
            font-size: 1.5rem;
          }

          .hero-features {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .feature span {
            display: none;
          }

          .panel-column:not(.main-column) {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export function App() {
  return (
    <AgentProvider>
      <TourApp />
    </AgentProvider>
  );
}