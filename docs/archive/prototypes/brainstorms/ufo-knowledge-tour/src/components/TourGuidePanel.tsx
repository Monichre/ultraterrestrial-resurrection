import React from 'react';
import { AgentType } from '../agents/types';

interface TourGuidePanelProps {
  narrative: string;
  isLoading: boolean;
}

export function TourGuidePanel({ narrative, isLoading }: TourGuidePanelProps) {
  return (
    <div className="tour-guide-panel">
      <div className="panel-header">
        <div className="agent-avatar">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#00D4FF" strokeWidth="2" />
            <circle cx="16" cy="12" r="6" fill="#00D4FF" />
            <path d="M8 26 C8 20 24 20 24 26" fill="#00D4FF" />
          </svg>
        </div>
        <div className="agent-info">
          <h3>Tour Guide</h3>
          <span className="agent-status">
            {isLoading ? 'Speaking...' : 'Ready'}
          </span>
        </div>
        <div className="agent-indicator">
          <span className="pulse" />
        </div>
      </div>

      <div className="narrative-content">
        {isLoading ? (
          <div className="loading-skeleton">
            <div className="skeleton-line" style={{ width: '100%' }} />
            <div className="skeleton-line" style={{ width: '90%' }} />
            <div className="skeleton-line" style={{ width: '85%' }} />
            <div className="skeleton-line" style={{ width: '70%' }} />
          </div>
        ) : narrative ? (
          <div className="narrative-text">
            {narrative.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={i}>{line.replace(/\*\*/g, '')}</h4>;
              }
              if (line.startsWith('- ')) {
                return <li key={i}>{line.slice(2)}</li>;
              }
              if (line.startsWith('*') && line.endsWith('*')) {
                return <p key={i} className="italic">{line.replace(/\*/g, '')}</p>;
              }
              return line ? <p key={i}>{line}</p> : null;
            })}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.5">
              <circle cx="24" cy="24" r="20" stroke="#8BA4C7" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M24 14 L24 24 L32 28" stroke="#8BA4C7" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>Start the tour to hear the guide's narrative</p>
          </div>
        )}
      </div>

      <style>{`
        .tour-guide-panel {
          background: linear-gradient(180deg, rgba(26, 39, 68, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          margin-bottom: 1rem;
        }

        .agent-avatar {
          position: relative;
        }

        .agent-info h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          color: #E8F4FF;
          margin: 0;
        }

        .agent-status {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: #8BA4C7;
        }

        .agent-indicator {
          margin-left: auto;
        }

        .pulse {
          display: block;
          width: 10px;
          height: 10px;
          background: #00D4FF;
          border-radius: 50%;
          animation: pulse-animation 2s ease-in-out infinite;
        }

        @keyframes pulse-animation {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .narrative-content {
          flex: 1;
          overflow-y: auto;
        }

        .narrative-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #E8F4FF;
        }

        .narrative-text h4 {
          color: #00D4FF;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          margin: 1rem 0 0.5rem 0;
        }

        .narrative-text p {
          margin: 0.5rem 0;
        }

        .narrative-text .italic {
          color: #8BA4C7;
          font-style: italic;
        }

        .narrative-text li {
          margin: 0.25rem 0;
          padding-left: 1rem;
        }

        .loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skeleton-line {
          height: 16px;
          background: linear-gradient(90deg, #1A2744 0%, #2A3F5F 50%, #1A2744 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #8BA4C7;
        }

        .empty-state p {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}