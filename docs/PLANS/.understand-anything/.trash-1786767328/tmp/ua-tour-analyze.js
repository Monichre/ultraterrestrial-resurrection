#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function fail(msg) {
  process.stderr.write(String(msg) + '\n');
  process.exit(1);
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    fail('Usage: ua-tour-analyze.js <input.json> <output.json>');
  }

  let raw;
  try {
    raw = fs.readFileSync(inputPath, 'utf8');
  } catch (err) {
    fail(`Failed to read input: ${err.message}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    fail(`Failed to parse input JSON: ${err.message}`);
  }

  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const edges = Array.isArray(data.edges) ? data.edges : [];
  const layers = Array.isArray(data.layers) ? data.layers : [];

  const fanIn = Object.create(null);
  const fanOut = Object.create(null);
  for (const n of nodes) {
    fanIn[n.id] = 0;
    fanOut[n.id] = 0;
  }
  for (const e of edges) {
    if (Object.prototype.hasOwnProperty.call(fanOut, e.source)) fanOut[e.source] += 1;
    else fanOut[e.source] = (fanOut[e.source] || 0) + 1;
    if (Object.prototype.hasOwnProperty.call(fanIn, e.target)) fanIn[e.target] += 1;
    else fanIn[e.target] = (fanIn[e.target] || 0) + 1;
  }

  const fanInRanking = nodes
    .map((n) => ({ id: n.id, fanIn: fanIn[n.id] || 0, name: n.name || n.id }))
    .sort((a, b) => b.fanIn - a.fanIn)
    .slice(0, 20);

  const fanOutRanking = nodes
    .map((n) => ({ id: n.id, fanOut: fanOut[n.id] || 0, name: n.name || n.id }))
    .sort((a, b) => b.fanOut - a.fanOut)
    .slice(0, 20);

  const ENTRY_NAMES = new Set([
    'index.ts', 'index.js', 'main.ts', 'main.js', 'app.ts', 'app.js',
    'server.ts', 'server.js', 'mod.rs', 'main.go', 'main.py', 'main.rs',
    'manage.py', 'app.py', 'wsgi.py', 'asgi.py', 'run.py', '__main__.py',
    'Application.java', 'Main.java', 'Program.cs', 'config.ru', 'index.php',
    'App.swift', 'Application.kt', 'main.cpp', 'main.c',
  ]);

  const fanOutValues = nodes.map((n) => fanOut[n.id] || 0).sort((a, b) => a - b);
  const fanInValues = nodes.map((n) => fanIn[n.id] || 0).sort((a, b) => a - b);
  const fanOutCutoff = percentile(fanOutValues, 0.9);
  const fanInCutoff = percentile(fanInValues, 0.25);

  function depthOf(filePath) {
    if (!filePath) return 99;
    const parts = String(filePath).replace(/\\/g, '/').split('/').filter(Boolean);
    return Math.max(0, parts.length - 1);
  }

  const scored = nodes.map((n) => {
    let score = 0;
    const filePath = n.filePath || n.name || '';
    const base = path.basename(filePath);
    const type = n.type;

    if (type === 'file' || type === 'config' || type === 'service') {
      if (ENTRY_NAMES.has(base)) score += 3;
      if (depthOf(filePath) <= 1) score += 1;
      if ((fanOut[n.id] || 0) >= fanOutCutoff && fanOutCutoff > 0) score += 1;
      if ((fanIn[n.id] || 0) <= fanInCutoff) score += 1;
    }

    if (type === 'document' || /\.md$/i.test(base)) {
      const normalized = String(filePath).replace(/\\/g, '/');
      if (base.toLowerCase() === 'readme.md' && depthOf(normalized) === 0) score += 5;
      else if (/\.md$/i.test(base) && depthOf(normalized) === 0) score += 2;
    }

    return {
      id: n.id,
      score,
      name: n.name || base || n.id,
      summary: n.summary || '',
      type: n.type,
    };
  });

  const entryPointCandidates = scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ id, score, name, summary }) => ({ id, score, name, summary }));

  const topCodeEntry = scored
    .filter((s) => s.type === 'file')
    .sort((a, b) => b.score - a.score)[0];

  const startNode = topCodeEntry ? topCodeEntry.id : (scored.sort((a, b) => b.score - a.score)[0] || {}).id;

  const forwardAdj = Object.create(null);
  for (const n of nodes) forwardAdj[n.id] = [];
  for (const e of edges) {
    if (e.type === 'imports' || e.type === 'calls') {
      if (!forwardAdj[e.source]) forwardAdj[e.source] = [];
      forwardAdj[e.source].push(e.target);
    }
  }

  const bfsTraversal = bfs(startNode, forwardAdj);

  const nonCodeFiles = {
    documentation: [],
    infrastructure: [],
    data: [],
    config: [],
  };
  for (const n of nodes) {
    const item = { id: n.id, name: n.name || n.id, type: n.type, summary: n.summary || '' };
    if (n.type === 'document') nonCodeFiles.documentation.push(item);
    else if (n.type === 'service' || n.type === 'pipeline' || n.type === 'resource') {
      nonCodeFiles.infrastructure.push(item);
    } else if (n.type === 'table' || n.type === 'schema' || n.type === 'endpoint') {
      nonCodeFiles.data.push(item);
    } else if (n.type === 'config') {
      nonCodeFiles.config.push(item);
    }
  }

  const clusters = findClusters(nodes, edges);

  const nodeSummaryIndex = Object.create(null);
  for (const n of nodes) {
    nodeSummaryIndex[n.id] = {
      name: n.name || n.id,
      type: n.type,
      summary: n.summary || '',
    };
  }

  const result = {
    scriptCompleted: true,
    entryPointCandidates,
    fanInRanking,
    fanOutRanking,
    bfsTraversal,
    nonCodeFiles,
    clusters,
    layers: {
      count: layers.length,
      list: layers.map((l) => ({
        id: l.id,
        name: l.name,
        description: l.description || '',
      })),
    },
    nodeSummaryIndex,
    totalNodes: nodes.length,
    totalEdges: edges.length,
  };

  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  } catch (err) {
    fail(`Failed to write output: ${err.message}`);
  }
}

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[idx];
}

function bfs(startNode, adj) {
  const order = [];
  const depthMap = {};
  const byDepth = {};
  if (!startNode) {
    return { startNode: null, order, depthMap, byDepth };
  }
  const seen = new Set();
  const q = [[startNode, 0]];
  seen.add(startNode);
  while (q.length) {
    const [id, depth] = q.shift();
    order.push(id);
    depthMap[id] = depth;
    if (!byDepth[depth]) byDepth[depth] = [];
    byDepth[depth].push(id);
    for (const next of adj[id] || []) {
      if (!seen.has(next)) {
        seen.add(next);
        q.push([next, depth + 1]);
      }
    }
  }
  return { startNode, order, depthMap, byDepth };
}

function findClusters(nodes, edges) {
  const pairCount = Object.create(null);
  const undirected = Object.create(null);
  const forward = Object.create(null);

  function addAdj(map, a, b) {
    if (!map[a]) map[a] = new Set();
    map[a].add(b);
  }

  for (const e of edges) {
    if (!e.source || !e.target || e.source === e.target) continue;
    addAdj(undirected, e.source, e.target);
    addAdj(undirected, e.target, e.source);
    if (!forward[e.source]) forward[e.source] = new Set();
    forward[e.source].add(e.target);
    const key = e.source < e.target ? `${e.source}|${e.target}` : `${e.target}|${e.source}`;
    pairCount[key] = (pairCount[key] || 0) + 1;
  }

  const clusters = [];
  const usedPairs = new Set();

  for (const e of edges) {
    if (!e.source || !e.target) continue;
    const a = e.source;
    const b = e.target;
    const aToB = forward[a] && forward[a].has(b);
    const bToA = forward[b] && forward[b].has(a);
    if (!aToB || !bToA) continue;
    const pairKey = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    const cluster = new Set([a, b]);
    let expanded = true;
    while (expanded && cluster.size < 5) {
      expanded = false;
      const candidates = new Map();
      for (const member of cluster) {
        for (const neigh of undirected[member] || []) {
          if (cluster.has(neigh)) continue;
          candidates.set(neigh, (candidates.get(neigh) || 0) + 1);
        }
      }
      let best = null;
      let bestCount = 0;
      for (const [id, count] of candidates) {
        if (count >= 2 && count > bestCount) {
          best = id;
          bestCount = count;
        }
      }
      if (best && cluster.size < 5) {
        cluster.add(best);
        expanded = true;
      }
    }

    let edgeCount = 0;
    const arr = [...cluster];
    for (const e2 of edges) {
      if (cluster.has(e2.source) && cluster.has(e2.target)) edgeCount += 1;
    }
    clusters.push({ nodes: arr, edgeCount });
  }

  clusters.sort((a, b) => b.edgeCount - a.edgeCount);
  const unique = [];
  const seenKey = new Set();
  for (const c of clusters) {
    const key = [...c.nodes].sort().join(',');
    if (seenKey.has(key)) continue;
    seenKey.add(key);
    unique.push(c);
    if (unique.length >= 10) break;
  }
  return unique;
}

try {
  main();
} catch (err) {
  fail(err && err.stack ? err.stack : err);
}
