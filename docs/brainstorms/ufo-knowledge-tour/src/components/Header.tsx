import React from 'react';
import { useAgent } from '../contexts/AgentContext';

interface HeaderProps {
  onStartTour: () => void;
  onReset: () => void;
}

export function Header({ onStartTour, onReset }: HeaderProps) {
  const { state, isLoading } = useAgent();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
              <circle cx="20" cy="20" r="8" fill="url(#logoGradient)" />
              <ellipse cx="20" cy="20" rx="14" ry="5" stroke="url(#logoGradient)" strokeWidth="1.5" fill="none" transform="rotate(-20 20 20)" />
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#7B68EE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo-text">
            <h1>UFO Knowledge Graph</h1>
            <span className="subtitle">Multi-Agent Explorer</span>
          </div>
        </div>

        <div className="tour-controls">
          {state.tourStatus === 'idle' ? (
            <button className="btn btn-primary" onClick={onStartTour} disabled={isLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Start Tour
            </button>
          ) : (
            <>
              <div className="tour-progress">
                <span className="progress-text">
                  Step {state.currentStep} of {state.totalSteps || '?'}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${state.totalSteps ? (state.currentStep / state.totalSteps) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
              <button className="btn btn-secondary" onClick={onReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .header {
          background: linear-gradient(180deg, #0A0E1A 0%, #1A2744 100%);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.5)); }
          50% { filter: drop-shadow(0 0 16px rgba(0, 212, 255, 0.8)); }
        }

        .logo-text h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #E8F4FF;
          margin: 0;
          letter-spacing: 2px;
        }

        .subtitle {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #8BA4C7;
          text-transform: uppercase;
          letter-spacing: 3px;
        }

        .tour-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00D4FF 0%, #7B68EE 100%);
          color: #0A0E1A;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(123, 104, 238, 0.1);
          color: #7B68EE;
          border: 1px solid rgba(123, 104, 238, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(123, 104, 238, 0.2);
          border-color: rgba(123, 104, 238, 0.5);
        }

        .tour-progress {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .progress-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #8BA4C7;
        }

        .progress-bar {
          width: 120px;
          height: 4px;
          background: rgba(0, 212, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00D4FF, #7B68EE);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }

          .logo-text h1 {
            font-size: 1rem;
          }

          .subtitle {
            display: none;
          }

          .btn {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}