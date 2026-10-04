import React, { useState, useMemo, useCallback } from 'react';
import { KGNode, KGEdge, NODE_COLORS, NODE_SHAPES } from '../types/graph';
import { ufoNodes, ufoEdges, getNodeById } from '../data/ufoData';

interface KnowledgeGraphProps {
  selectedNodeId: string | null;
  visitedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
}

export function KnowledgeGraph({ selectedNodeId, visitedNodes, onNodeSelect }: KnowledgeGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate node positions based on connections
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 450;
    const centerY = 300;

    // Position nodes in a radial layout
    ufoNodes.forEach((node, index) => {
      const angle = (index / ufoNodes.length) * 2 * Math.PI - Math.PI / 2;
      const radius = 200 + (index % 2) * 50;
      positions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    return positions;
  }, []);

  // Filter edges for rendering
  const visibleEdges = useMemo(() => {
    return ufoEdges.filter(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      return sourcePos && targetPos;
    });
  }, [nodePositions]);

  const handleNodeHover = useCallback((nodeId: string, event: React.MouseEvent) => {
    setHoveredNodeId(nodeId);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const renderNode = (node: KGNode) => {
    const position = nodePositions[node.id];
    if (!position) return null;

    const isSelected = selectedNodeId === node.id;
    const isVisited = visitedNodes.includes(node.id);
    const isHovered = hoveredNodeId === node.id;
    const color = NODE_COLORS[node.type];
    const shape = NODE_SHAPES[node.type];

    const nodeSize = isSelected ? 35 : isHovered ? 32 : 28;
    const glowIntensity = isSelected ? 1 : isVisited ? 0.6 : 0.3;

    return (
      <g
        key={node.id}
        transform={`translate(${position.x}, ${position.y})`}
        onClick={() => onNodeSelect(node.id)}
        onMouseEnter={(e) => handleNodeHover(node.id, e)}
        onMouseLeave={handleNodeLeave}
        style={{ cursor: 'pointer' }}
      >
        {/* Glow effect */}
        <circle
          r={nodeSize + 10}
          fill={`url(#glow-${node.type})`}
          opacity={glowIntensity * 0.5}
        />

        {/* Node shape based on type */}
        {shape === 'circle' && (
          <circle
            r={nodeSize}
            fill={color}
            stroke={isSelected ? '#FFFFFF' : color}
            strokeWidth={isSelected ? 3 : 2}
            opacity={isVisited ? 1 : 0.6}
          />
        )}
        {shape === 'diamond' && (
          <polygon
            points={`0,${-nodeSize} ${nodeSize},0 0,${nodeSize} ${-nodeSize},0`}
            fill={color}
            stroke={isSelected ? '#FFFFFF' : color}
            strokeWidth={isSelected ? 3 : 2}
            opacity={isVisited ? 1 : 0.6}
          />
        )}
        {shape === 'hexagon' && (
          <polygon
            points={`${nodeSize * 0.87},${-nodeSize * 0.5} ${nodeSize * 0.87},${nodeSize * 0.5} 0,${nodeSize} ${-nodeSize * 0.87},${nodeSize * 0.5} ${-nodeSize * 0.87},${-nodeSize * 0.5} 0,${-nodeSize}`}
            fill={color}
            stroke={isSelected ? '#FFFFFF' : color}
            strokeWidth={isSelected ? 3 : 2}
            opacity={isVisited ? 1 : 0.6}
          />
        )}
        {shape === 'rectangle' && (
          <rect
            x={-nodeSize * 0.8}
            y={-nodeSize * 0.6}
            width={nodeSize * 1.6}
            height={nodeSize * 1.2}
            rx={4}
            fill={color}
            stroke={isSelected ? '#FFFFFF' : color}
            strokeWidth={isSelected ? 3 : 2}
            opacity={isVisited ? 1 : 0.6}
          />
        )}

        {/* Node label */}
        <text
          y={nodeSize + 20}
          textAnchor="middle"
          fill="#E8F4FF"
          fontSize={isSelected ? 14 : 12}
          fontFamily="IBM Plex Mono, monospace"
          fontWeight={isSelected ? 'bold' : 'normal'}
        >
          {node.name.length > 20 ? node.name.slice(0, 18) + '...' : node.name}
        </text>

        {/* Type indicator */}
        <circle
          r={6}
          fill="#0A0E1A"
          stroke={color}
          strokeWidth={2}
        />
        <text
          y={1}
          textAnchor="middle"
          fill={color}
          fontSize={8}
          fontWeight="bold"
          fontFamily="IBM Plex Mono, monospace"
        >
          {node.type[0].toUpperCase()}
        </text>
      </g>
    );
  };

  const renderEdge = (edge: KGEdge, index: number) => {
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    if (!sourcePos || !targetPos) return null;

    const isHighlighted = selectedNodeId === edge.source || selectedNodeId === edge.target;
    const bothVisited = visitedNodes.includes(edge.source) && visitedNodes.includes(edge.target);

    const midX = (sourcePos.x + targetPos.x) / 2;
    const midY = (sourcePos.y + targetPos.y) / 2;

    // Add slight curve
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const curveOffset = Math.sqrt(dx * dx + dy * dy) * 0.1;
    const ctrlX = midX - dy * 0.1;
    const ctrlY = midY + dx * 0.1;

    return (
      <g key={`edge-${index}`}>
        <path
          d={`M ${sourcePos.x} ${sourcePos.y} Q ${ctrlX} ${ctrlY} ${targetPos.x} ${targetPos.y}`}
          stroke={isHighlighted ? '#00D4FF' : bothVisited ? '#7B68EE' : '#2A3F5F'}
          strokeWidth={isHighlighted ? 2 : 1}
          fill="none"
          opacity={isHighlighted ? 0.8 : bothVisited ? 0.5 : 0.2}
          strokeDasharray={bothVisited ? 'none' : '4,4'}
        />
        {isHighlighted && (
          <text
            x={ctrlX}
            y={ctrlY - 5}
            textAnchor="middle"
            fill="#8BA4C7"
            fontSize={10}
            fontFamily="IBM Plex Mono, monospace"
          >
            {edge.relationship}
          </text>
        )}
      </g>
    );
  };

  const hoveredNode = hoveredNodeId ? getNodeById(hoveredNodeId) : null;

  return (
    <div className="knowledge-graph-container">
      <svg
        viewBox="0 0 900 600"
        className="knowledge-graph-svg"
      >
        {/* Definitions */}
        <defs>
          <radialGradient id="glow-event">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-location">
            <stop offset="0%" stopColor="#7B68EE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7B68EE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-entity">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-concept">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
          </radialGradient>

          {/* Background pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#1A2744" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="#0A0E1A" />
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={Math.random() * 900}
            cy={Math.random() * 600}
            r={Math.random() * 1.5}
            fill="#E8F4FF"
            opacity={Math.random() * 0.5 + 0.2}
          />
        ))}

        {/* Edges layer */}
        <g className="edges-layer">
          {visibleEdges.map((edge, i) => renderEdge(edge, i))}
        </g>

        {/* Nodes layer */}
        <g className="nodes-layer">
          {ufoNodes.map(node => renderNode(node))}
        </g>

        {/* Legend */}
        <g transform="translate(20, 520)">
          <rect x="-5" y="-15" width="180" height="70" rx="8" fill="rgba(26, 39, 68, 0.9)" />
          <text x="0" y="5" fill="#8BA4C7" fontSize="11" fontFamily="IBM Plex Mono, monospace">Node Types:</text>
          {[
            { type: 'event', label: 'Event', color: NODE_COLORS.event },
            { type: 'location', label: 'Location', color: NODE_COLORS.location },
            { type: 'entity', label: 'Entity', color: NODE_COLORS.entity },
            { type: 'concept', label: 'Concept', color: NODE_COLORS.concept }
          ].map((item, i) => (
            <g key={item.type} transform={`translate(${i * 45}, 25)`}>
              <circle r="8" fill={item.color} />
              <text x="12" y="4" fill="#E8F4FF" fontSize="10" fontFamily="IBM Plex Mono, monospace">
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="node-tooltip"
          style={{
            left: tooltipPosition.x + 20,
            top: tooltipPosition.y - 10
          }}
        >
          <h4>{hoveredNode.name}</h4>
          <span className={`type-badge ${hoveredNode.type}`}>{hoveredNode.type}</span>
          <p>{hoveredNode.description.slice(0, 120)}...</p>
          <div className="tooltip-stats">
            <span>Significance: {hoveredNode.properties.significance || '?'}/10</span>
            <span>Connections: {hoveredNode.connections.length}</span>
          </div>
        </div>
      )}

      <style>{`
        .knowledge-graph-container {
          background: #0A0E1A;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0, 212, 255, 0.2);
          position: relative;
        }

        .knowledge-graph-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .node-tooltip {
          position: fixed;
          background: rgba(26, 39, 68, 0.95);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          max-width: 280px;
          pointer-events: none;
          z-index: 1000;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .node-tooltip h4 {
          color: #E8F4FF;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          margin: 0 0 8px 0;
        }

        .type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase;
        }

        .type-badge.event {
          background: rgba(0, 212, 255, 0.2);
          color: #00D4FF;
        }

        .type-badge.location {
          background: rgba(123, 104, 238, 0.2);
          color: #7B68EE;
        }

        .type-badge.entity {
          background: rgba(255, 107, 107, 0.2);
          color: #FF6B6B;
        }

        .type-badge.concept {
          background: rgba(78, 205, 196, 0.2);
          color: #4ECDC4;
        }

        .node-tooltip p {
          color: #8BA4C7;
          font-size: 0.8rem;
          line-height: 1.4;
          margin: 8px 0;
        }

        .tooltip-stats {
          display: flex;
          gap: 16px;
          color: #00D4FF;
          font-size: 0.75rem;
          font-family: 'IBM Plex Mono', monospace;
        }

        .nodes-layer g:hover circle,
        .nodes-layer g:hover polygon,
        .nodes-layer g:hover rect {
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
}