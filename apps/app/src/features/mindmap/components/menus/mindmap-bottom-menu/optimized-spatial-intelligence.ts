import { useMemo, useCallback, useRef, useEffect } from 'react';
import { debounce, throttle } from './utils/research-helpers';

// R-Tree implementation for spatial indexing
class RTreeNode {
  constructor(
    public bounds: { x: number; y: number; width: number; height: number },
    public nodeId?: string,
    public children: RTreeNode[] = []
  ) {}

  contains(point: { x: number; y: number }): boolean {
    return (
      point.x >= this.bounds.x &&
      point.x <= this.bounds.x + this.bounds.width &&
      point.y >= this.bounds.y &&
      point.y <= this.bounds.y + this.bounds.height
    );
  }

  intersects(other: { x: number; y: number; width: number; height: number }): boolean {
    return !(
      this.bounds.x > other.x + other.width ||
      this.bounds.x + this.bounds.width < other.x ||
      this.bounds.y > other.y + other.height ||
      this.bounds.y + this.bounds.height < other.y
    );
  }
}

class SpatialIndex {
  private root: RTreeNode;
  private nodeMap: Map<string, RTreeNode>;

  constructor() {
    this.root = new RTreeNode({ x: 0, y: 0, width: 10000, height: 10000 });
    this.nodeMap = new Map();
  }

  insert(nodeId: string, position: { x: number; y: number }, size: { width: number; height: number } = { width: 50, height: 50 }): void {
    const bounds = {
      x: position.x - size.width / 2,
      y: position.y - size.height / 2,
      width: size.width,
      height: size.height
    };

    const node = new RTreeNode(bounds, nodeId);
    this.nodeMap.set(nodeId, node);
    this.insertNode(this.root, node);
  }

  private insertNode(parent: RTreeNode, node: RTreeNode): void {
    if (parent.children.length === 0) {
      parent.children.push(node);
      return;
    }

    // Find best child to insert into
    let bestChild = parent.children[0];
    let bestOverlap = this.calculateOverlap(bestChild.bounds, node.bounds);

    for (let i = 1; i < parent.children.length; i++) {
      const overlap = this.calculateOverlap(parent.children[i].bounds, node.bounds);
      if (overlap < bestOverlap) {
        bestOverlap = overlap;
        bestChild = parent.children[i];
      }
    }

    this.insertNode(bestChild, node);
  }

  private calculateOverlap(bounds1: any, bounds2: any): number {
    const overlapX = Math.max(0, Math.min(bounds1.x + bounds1.width, bounds2.x + bounds2.width) - Math.max(bounds1.x, bounds2.x));
    const overlapY = Math.max(0, Math.min(bounds1.y + bounds1.height, bounds2.y + bounds2.height) - Math.max(bounds1.y, bounds2.y));
    return overlapX * overlapY;
  }

  findNearby(nodeId: string, threshold: number): string[] {
    const node = this.nodeMap.get(nodeId);
    if (!node) return [];

    const searchArea = {
      x: node.bounds.x - threshold,
      y: node.bounds.y - threshold,
      width: node.bounds.width + threshold * 2,
      height: node.bounds.height + threshold * 2
    };

    const nearby: string[] = [];
    this.searchArea(this.root, searchArea, nearby, nodeId);
    return nearby;
  }

  private searchArea(node: RTreeNode, searchArea: any, results: string[], excludeId: string): void {
    if (!node.intersects(searchArea)) return;

    if (node.nodeId && node.nodeId !== excludeId) {
      results.push(node.nodeId);
    }

    for (const child of node.children) {
      this.searchArea(child, searchArea, results, excludeId);
    }
  }

  remove(nodeId: string): void {
    this.nodeMap.delete(nodeId);
    this.removeFromTree(this.root, nodeId);
  }

  private removeFromTree(node: RTreeNode, nodeId: string): boolean {
    if (node.nodeId === nodeId) {
      return true;
    }

    for (let i = 0; i < node.children.length; i++) {
      if (this.removeFromTree(node.children[i], nodeId)) {
        node.children.splice(i, 1);
        return false;
      }
    }

    return false;
  }

  clear(): void {
    this.root = new RTreeNode({ x: 0, y: 0, width: 10000, height: 10000 });
    this.nodeMap.clear();
  }
}

// Optimized spatial intelligence hook
export function useOptimizedSpatialIntelligence(
  nodes: any[],
  threshold: number = 150,
  enabled: boolean = true
) {
  const spatialIndex = useRef<SpatialIndex>(new SpatialIndex());
  const analysisCache = useRef<Map<string, any>>(new Map());
  const lastAnalysisTime = useRef<number>(0);

  // Build spatial index when nodes change
  useEffect(() => {
    if (!enabled) return;

    spatialIndex.current.clear();
    analysisCache.current.clear();

    for (const node of nodes) {
      if (node.position) {
        spatialIndex.current.insert(node.id, node.position);
      }
    }
  }, [nodes, enabled]);

  // Optimized proximity analysis with caching
  const analyzeProximity = useCallback(
    throttle((nodeId: string) => {
      if (!enabled) return null;

      const now = Date.now();
      const cacheKey = `${nodeId}-${threshold}`;
      
      // Check cache first
      const cached = analysisCache.current.get(cacheKey);
      if (cached && now - cached.timestamp < 1000) { // 1 second cache
        return cached.result;
      }

      // Perform spatial analysis
      const nearbyNodeIds = spatialIndex.current.findNearby(nodeId, threshold);
      const nearbyNodes = nodes.filter(n => nearbyNodeIds.includes(n.id));

      const result = {
        nodeId,
        nearbyNodes,
        proximityScore: nearbyNodes.length,
        suggestedConnections: nearbyNodes.map(n => ({
          id: n.id,
          distance: calculateDistance(
            nodes.find(node => node.id === nodeId)?.position,
            n.position
          ),
          strength: Math.max(0, 1 - calculateDistance(
            nodes.find(node => node.id === nodeId)?.position,
            n.position
          ) / threshold)
        }))
      };

      // Cache result
      analysisCache.current.set(cacheKey, {
        result,
        timestamp: now
      });

      return result;
    }, 100), // Throttle to max 10 calls per second
    [nodes, threshold, enabled]
  );

  // Batch analysis for multiple nodes
  const analyzeBatch = useCallback(
    debounce((nodeIds: string[]) => {
      if (!enabled) return [];

      const results = [];
      for (const nodeId of nodeIds) {
        const result = analyzeProximity(nodeId);
        if (result) {
          results.push(result);
        }
      }
      return results;
    }, 200), // Debounce batch operations
    [analyzeProximity, enabled]
  );

  // Optimized group detection
  const detectGroups = useMemo(() => {
    if (!enabled) return [];

    const groups: any[] = [];
    const visited = new Set<string>();

    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const nearbyIds = spatialIndex.current.findNearby(node.id, threshold);
      if (nearbyIds.length > 0) {
        const group = [node.id, ...nearbyIds];
        group.forEach(id => visited.add(id));
        groups.push({
          id: `group-${groups.length}`,
          nodeIds: group,
          center: calculateGroupCenter(group.map(id => nodes.find(n => n.id === id)).filter(Boolean)),
          strength: group.length / nodes.length
        });
      }
    }

    return groups;
  }, [nodes, threshold, enabled]);

  // Performance monitoring
  const performanceMetrics = useRef({
    analysisCount: 0,
    avgAnalysisTime: 0,
    cacheHitRate: 0,
    totalCacheRequests: 0,
    cacheHits: 0
  });

  const updatePerformanceMetrics = useCallback((analysisTime: number, cacheHit: boolean) => {
    const metrics = performanceMetrics.current;
    metrics.analysisCount++;
    metrics.avgAnalysisTime = (metrics.avgAnalysisTime + analysisTime) / 2;
    metrics.totalCacheRequests++;
    
    if (cacheHit) {
      metrics.cacheHits++;
    }
    
    metrics.cacheHitRate = metrics.cacheHits / metrics.totalCacheRequests;
  }, []);

  return {
    analyzeProximity,
    analyzeBatch,
    detectGroups,
    spatialIndex: spatialIndex.current,
    performanceMetrics: performanceMetrics.current,
    clearCache: () => {
      analysisCache.current.clear();
      performanceMetrics.current = {
        analysisCount: 0,
        avgAnalysisTime: 0,
        cacheHitRate: 0,
        totalCacheRequests: 0,
        cacheHits: 0
      };
    }
  };
}

// Optimized distance calculation
function calculateDistance(pos1: { x: number; y: number } | undefined, pos2: { x: number; y: number } | undefined): number {
  if (!pos1 || !pos2) return Infinity;
  
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate center of a group of nodes
function calculateGroupCenter(nodes: any[]): { x: number; y: number } {
  if (nodes.length === 0) return { x: 0, y: 0 };
  
  const sumX = nodes.reduce((sum, node) => sum + (node.position?.x || 0), 0);
  const sumY = nodes.reduce((sum, node) => sum + (node.position?.y || 0), 0);
  
  return {
    x: sumX / nodes.length,
    y: sumY / nodes.length
  };
}

// Web Worker for heavy spatial computations
export function createSpatialWorker() {
  const workerCode = `
    // Web Worker for spatial analysis
    self.onmessage = function(e) {
      const { type, data } = e.data;
      
      switch (type) {
        case 'ANALYZE_PROXIMITY':
          const { nodes, threshold } = data;
          const results = performSpatialAnalysis(nodes, threshold);
          self.postMessage({ type: 'ANALYSIS_COMPLETE', results });
          break;
      }
    };
    
    function performSpatialAnalysis(nodes, threshold) {
      const groups = [];
      const visited = new Set();
      
      for (const node of nodes) {
        if (visited.has(node.id)) continue;
        
        const nearby = nodes.filter(other => 
          other.id !== node.id && 
          calculateDistance(node.position, other.position) <= threshold
        );
        
        if (nearby.length > 0) {
          const group = [node.id, ...nearby.map(n => n.id)];
          group.forEach(id => visited.add(id));
          groups.push(group);
        }
      }
      
      return groups;
    }
    
    function calculateDistance(pos1, pos2) {
      if (!pos1 || !pos2) return Infinity;
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

// Hook for using spatial worker
export function useSpatialWorker() {
  const worker = useRef<Worker | null>(null);
  const pendingAnalysis = useRef<Map<string, (result: any) => void>>(new Map());

  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      worker.current = createSpatialWorker();
      
      worker.current.onmessage = (e) => {
        const { type, results } = e.data;
        
        if (type === 'ANALYSIS_COMPLETE') {
          // Resolve pending promises
          pendingAnalysis.current.forEach((resolve) => {
            resolve(results);
          });
          pendingAnalysis.current.clear();
        }
      };
    }

    return () => {
      if (worker.current) {
        worker.current.terminate();
      }
    };
  }, []);

  const analyzeSpatialAsync = useCallback((nodes: any[], threshold: number = 150): Promise<any> => {
    return new Promise((resolve) => {
      if (!worker.current) {
        resolve([]);
        return;
      }

      const requestId = Date.now().toString();
      pendingAnalysis.current.set(requestId, resolve);

      worker.current.postMessage({
        type: 'ANALYZE_PROXIMITY',
        data: { nodes, threshold }
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        if (pendingAnalysis.current.has(requestId)) {
          pendingAnalysis.current.delete(requestId);
          resolve([]);
        }
      }, 5000);
    });
  }, []);

  return { analyzeSpatialAsync };
}