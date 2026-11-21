import React from 'react';

interface DataInsightsPanelProps {
  insights: string;
  visualData?: string;
  isLoading: boolean;
}

export function DataInsightsPanel({ insights, visualData, isLoading }: DataInsightsPanelProps) {
  const parsedData = visualData ? JSON.parse(visualData) : null;

  return (
    <div className="data-insights-panel">
      <div className="panel-header">
        <div className="analyst-avatar">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" stroke="#7B68EE" strokeWidth="2" />
            <line x1="10" y1="16" x2="22" y2="16" stroke="#7B68EE" strokeWidth="2" />
            <line x1="16" y1="10" x2="16" y2="22" stroke="#7B68EE" strokeWidth="2" />
          </svg>
        </div>
        <div className="agent-info">
          <h3>Data Analyst</h3>
          <span className="agent-status">Providing insights</span>
        </div>
      </div>

      <div className="insights-content">
        {isLoading ? (
          <div className="loading-skeleton">
            <div className="skeleton-line" style={{ width: '80%' }} />
            <div className="skeleton-line" style={{ width: '60%' }} />
            <div className="skeleton-stat">
              <div className="skeleton-circle" />
              <div className="skeleton-bar" />
            </div>
          </div>
        ) : insights ? (
          <div className="insights-data">
            {insights.split('\n\n').map((section, i) => {
              if (section.startsWith('**') && section.includes(':**')) {
                const [label, ...rest] = section.split(':**');
                return (
                  <div key={i} className="insight-section">
                    <span className="insight-label">{label.replace(/\*\*/g, '')}</span>
                    <span className="insight-value">{rest.join('').trim()}</span>
                  </div>
                );
              }
              if (section.startsWith('---')) {
                return <hr key={i} className="divider" />;
              }
              if (section.includes(':')) {
                const [label, ...valueParts] = section.split(':');
                return (
                  <div key={i} className="data-row">
                    <span className="data-label">{label.trim()}</span>
                    <span className="data-value">{valueParts.join(':').trim()}</span>
                  </div>
                );
              }
              return <p key={i} className="insight-text">{section}</p>;
            })}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.5">
              <path d="M24 8 L40 38 L8 38 Z" stroke="#8BA4C7" strokeWidth="2" fill="none" />
              <line x1="24" y1="20" x2="24" y2="28" stroke="#8BA4C7" strokeWidth="2" />
              <circle cx="24" cy="32" r="1.5" fill="#8BA4C7" />
            </svg>
            <p>Analyst insights will appear here</p>
          </div>
        )}

        {/* Visual Data Display */}
        {parsedData && !isLoading && (
          <div className="visual-data-display">
            <h4>Data Highlights</h4>
            <div className="highlight-bars">
              {parsedData.highlights?.map((h: any, i: number) => (
                <div key={i} className="highlight-item">
                  <span className="highlight-label">{h.label}</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(h.value / h.max) * 100}%`,
                        backgroundColor: h.color || '#00D4FF'
                      }}
                    />
                  </div>
                  <span className="highlight-value">{h.value}</span>
                </div>
              ))}
            </div>

            {parsedData.tags && parsedData.tags.length > 0 && (
              <div className="tags-display">
                {parsedData.tags.map((tag: string, i: number) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .data-insights-panel {
          background: linear-gradient(180deg, rgba(26, 39, 68, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%);
          border: 1px solid rgba(123, 104, 238, 0.2);
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
          border-bottom: 1px solid rgba(123, 104, 238, 0.1);
          margin-bottom: 1rem;
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

        .insights-content {
          flex: 1;
          overflow-y: auto;
        }

        .insight-section {
          display: flex;
          flex-direction: column;
          margin: 0.75rem 0;
        }

        .insight-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: #8BA4C7;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .insight-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          color: #E8F4FF;
          margin-top: 0.25rem;
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(123, 104, 238, 0.2);
          margin: 1rem 0;
        }

        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(123, 104, 238, 0.1);
        }

        .data-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #8BA4C7;
        }

        .data-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #7B68EE;
        }

        .insight-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          color: #E8F4FF;
          line-height: 1.5;
          margin: 0.5rem 0;
        }

        .loading-skeleton {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skeleton-line {
          height: 14px;
          background: linear-gradient(90deg, #1A2744 0%, #2A3F5F 50%, #1A2744 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .skeleton-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(90deg, #1A2744 0%, #2A3F5F 50%, #1A2744 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-bar {
          flex: 1;
          height: 8px;
          background: linear-gradient(90deg, #1A2744 0%, #2A3F5F 50%, #1A2744 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
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

        .visual-data-display {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(123, 104, 238, 0.2);
        }

        .visual-data-display h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          color: #7B68EE;
          margin: 0 0 0.75rem 0;
        }

        .highlight-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .highlight-item {
          display: grid;
          grid-template-columns: 80px 1fr 40px;
          align-items: center;
          gap: 0.5rem;
        }

        .highlight-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: #8BA4C7;
        }

        .bar-container {
          height: 6px;
          background: rgba(123, 104, 238, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .highlight-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          color: #E8F4FF;
          text-align: right;
        }

        .tags-display {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tag {
          background: rgba(123, 104, 238, 0.2);
          color: #7B68EE;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  );
}