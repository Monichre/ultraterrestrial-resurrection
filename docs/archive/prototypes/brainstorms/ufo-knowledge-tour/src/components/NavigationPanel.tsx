import React, { useState } from 'react';
import { KGNode, NODE_COLORS } from '../types/graph';
import { getNodeById } from '../data/ufoData';

interface NavigationPanelProps {
  recommendations: string[];
  visitedNodes: string[];
  onNavigate: (nodeId: string) => void;
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
}

export function NavigationPanel({
  recommendations,
  visitedNodes,
  onNavigate,
  onAskQuestion,
  isLoading
}: NavigationPanelProps) {
  const [question, setQuestion] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskQuestion(question.trim());
      setQuestion('');
    }
  };

  return (
    <div className="navigation-panel">
      {/* Question Input */}
      <form onSubmit={handleSubmit} className="question-form">
        <div className="input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BA4C7" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this topic..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !question.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>
      </form>

      {/* Navigation Recommendations */}
      <div className="recommendations-section">
        <div className="section-header" onClick={() => setShowRecommendations(!showRecommendations)}>
          <h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3,11 22,2 13,21 11,13" />
            </svg>
            Explore Connections
          </h4>
          <span className="toggle-icon">{showRecommendations ? '−' : '+'}</span>
        </div>

        {showRecommendations && (
          <div className="recommendations-list">
            {recommendations.length > 0 ? (
              recommendations.map((nodeId, index) => {
                const node = getNodeById(nodeId);
                if (!node) return null;

                const isVisited = visitedNodes.includes(nodeId);
                const color = NODE_COLORS[node.type];

                return (
                  <button
                    key={nodeId}
                    className={`recommendation-item ${isVisited ? 'visited' : ''}`}
                    onClick={() => onNavigate(nodeId)}
                    disabled={isLoading}
                    style={{ '--node-color': color } as React.CSSProperties}
                  >
                    <span className="node-type">{node.type[0].toUpperCase()}</span>
                    <div className="node-info">
                      <span className="node-name">{node.name}</span>
                      <span className="node-meta">
                        {node.properties.significance}/10 significance
                      </span>
                    </div>
                    {isVisited && (
                      <svg className="visited-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="no-recommendations">
                <p>No more connections from current node</p>
                <p className="hint">Return to a previous node to explore different paths</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visited Nodes History */}
      <div className="visited-history">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="12,8 12,12 14,14" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          Tour Progress
        </h4>
        <div className="visited-list">
          {visitedNodes.map((nodeId, index) => {
            const node = getNodeById(nodeId);
            if (!node) return null;

            return (
              <div key={nodeId} className="visited-node" style={{ '--index': index } as React.CSSProperties}>
                <span className="step-number">{index + 1}</span>
                <span className="visited-name">{node.name}</span>
                <span className="visited-type" style={{ color: NODE_COLORS[node.type] }}>
                  {node.type}
                </span>
              </div>
            );
          })}
          {visitedNodes.length === 0 && (
            <p className="empty-progress">Start the tour to track your journey</p>
          )}
        </div>
      </div>

      <style>{`
        .navigation-panel {
          background: linear-gradient(180deg, rgba(26, 39, 68, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%);
          border: 1px solid rgba(78, 205, 196, 0.2);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-form {
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(78, 205, 196, 0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          transition: border-color 0.3s ease;
        }

        .input-wrapper:focus-within {
          border-color: rgba(78, 205, 196, 0.5);
        }

        .input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #E8F4FF;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.875rem;
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: #8BA4C7;
        }

        .input-wrapper button {
          background: rgba(78, 205, 196, 0.2);
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          color: #4ECDC4;
          transition: all 0.3s ease;
        }

        .input-wrapper button:hover:not(:disabled) {
          background: rgba(78, 205, 196, 0.4);
        }

        .input-wrapper button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .section-header h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #E8F4FF;
          margin: 0;
        }

        .toggle-icon {
          color: #8BA4C7;
          font-size: 1.25rem;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .recommendation-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(78, 205, 196, 0.15);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .recommendation-item:hover:not(:disabled) {
          background: rgba(78, 205, 196, 0.1);
          border-color: rgba(78, 205, 196, 0.3);
          transform: translateX(4px);
        }

        .recommendation-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recommendation-item.visited {
          opacity: 0.6;
        }

        .node-type {
          width: 28px;
          height: 28px;
          background: var(--node-color, #4ECDC4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          font-weight: bold;
          color: #0A0E1A;
        }

        .node-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .node-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #E8F4FF;
        }

        .node-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          color: #8BA4C7;
        }

        .visited-icon {
          color: #4ECDC4;
        }

        .no-recommendations {
          text-align: center;
          padding: 1rem;
          color: #8BA4C7;
        }

        .no-recommendations p {
          margin: 0.25rem 0;
          font-size: 0.8rem;
        }

        .no-recommendations .hint {
          font-size: 0.7rem;
          opacity: 0.7;
        }

        .visited-history {
          border-top: 1px solid rgba(78, 205, 196, 0.1);
          padding-top: 1rem;
        }

        .visited-history h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #8BA4C7;
          margin: 0 0 0.75rem 0;
        }

        .visited-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 150px;
          overflow-y: auto;
        }

        .visited-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .step-number {
          width: 20px;
          height: 20px;
          background: rgba(78, 205, 196, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem;
          color: #4ECDC4;
        }

        .visited-name {
          flex: 1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #E8F4FF;
        }

        .visited-type {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .empty-progress {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #8BA4C7;
          text-align: center;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}