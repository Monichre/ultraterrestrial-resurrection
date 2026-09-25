#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function fail(msg) {
  process.stderr.write(String(msg) + "\n");
  process.exit(1);
}

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    fail(`Failed to read JSON ${filePath}: ${err.message}`);
  }
}

const DIR_PATTERNS = [
  { re: /^(routes|api|controllers|endpoints|handlers|controller|routers|serializers|blueprints)$/i, label: "api" },
  { re: /^(services|core|lib|domain|logic|internal|signals|composables|mailers|jobs|channels)$/i, label: "service" },
  { re: /^(models|db|data|persistence|repository|entities|migrations|entity|sql|database|schema)$/i, label: "data" },
  { re: /^(components|views|pages|ui|layouts|screens)$/i, label: "ui" },
  { re: /^(middleware|plugins|interceptors|guards)$/i, label: "middleware" },
  { re: /^(utils|helpers|common|shared|tools|templatetags|pkg)$/i, label: "utility" },
  { re: /^(config|constants|env|settings|management|commands)$/i, label: "config" },
  { re: /^(__tests__|test|tests|spec|specs)$/i, label: "test" },
  { re: /^(types|interfaces|schemas|contracts|dtos|dto|request|response)$/i, label: "types" },
  { re: /^hooks$/i, label: "hooks" },
  { re: /^(store|state|reducers|actions|slices)$/i, label: "state" },
  { re: /^(assets|static|public)$/i, label: "assets" },
  { re: /^cmd$/i, label: "entry" },
  { re: /^bin$/i, label: "entry" },
  { re: /^(docs|documentation|wiki)$/i, label: "documentation" },
  { re: /^(deploy|deployment|infra|infrastructure|k8s|kubernetes|helm|charts|terraform|tf|docker)$/i, label: "infrastructure" },
  { re: /^(\.github|\.gitlab|\.circleci)$/i, label: "ci-cd" },
];

function filePatternLabel(filePath, name) {
  const base = name || path.basename(filePath);
  const p = filePath.replace(/\\/g, "/");
  if (
    /\.test\./i.test(base) ||
    /\.spec\./i.test(base) ||
    /^test_.*\.py$/i.test(base) ||
    /_test\.go$/i.test(base) ||
    /Test\.java$/i.test(base) ||
    /_spec\.rb$/i.test(base) ||
    /Test\.php$/i.test(base) ||
    /Tests\.cs$/i.test(base)
  ) {
    return "test";
  }
  if (/\.d\.ts$/i.test(base)) return "types";
  if (/^(index\.ts|index\.js|__init__\.py)$/i.test(base)) return "entry";
  if (base === "manage.py") return "entry";
  if (/^(wsgi|asgi)\.py$/i.test(base)) return "config";
  if (base === "main.go" && /\/cmd\//.test(p)) return "entry";
  if (/^(main|lib)\.rs$/i.test(base) && /(^|\/)src\//.test(p)) return "entry";
  if (/^(Application\.java|Program\.cs)$/i.test(base)) return "entry";
  if (base === "config.ru") return "entry";
  if (/^(Cargo\.toml|go\.mod|Gemfile|pom\.xml|composer\.json)$/i.test(base) || /build\.gradle/.test(base)) {
    return "config";
  }
  if (/^Dockerfile/i.test(base) || /^docker-compose/i.test(base)) return "infrastructure";
  if (/\.tf(vars)?$/i.test(base)) return "infrastructure";
  if (/\.github\/workflows\//.test(p) || base === ".gitlab-ci.yml" || base === "Jenkinsfile") return "ci-cd";
  if (/\.sql$/i.test(base)) return "data";
  if (/\.(graphql|gql|proto)$/i.test(base)) return "types";
  if (/\.(md|rst)$/i.test(base)) return "documentation";
  if (base === "Makefile") return "infrastructure";
  return null;
}

function commonPrefix(paths) {
  if (!paths.length) return "";
  const split = paths.map((p) => p.replace(/\\/g, "/").split("/").filter(Boolean));
  const minLen = Math.min(...split.map((s) => s.length));
  const prefix = [];
  for (let i = 0; i < minLen; i++) {
    const seg = split[0][i];
    if (split.every((s) => s[i] === seg)) prefix.push(seg);
    else break;
  }
  if (prefix.length && split.every((s) => s.length > prefix.length)) {
    return prefix.join("/") + "/";
  }
  if (prefix.length && split.some((s) => s.length === prefix.length)) {
    return prefix.slice(0, -1).join("/") + (prefix.length > 1 ? "/" : "");
  }
  return prefix.join("/") ? prefix.join("/") + "/" : "";
}

function groupKey(filePath, prefix) {
  const norm = filePath.replace(/\\/g, "/");
  let rest = norm;
  if (prefix && norm.startsWith(prefix)) rest = norm.slice(prefix.length);
  const parts = rest.split("/").filter(Boolean);
  if (parts.length <= 1) {
    const name = parts[0] || path.basename(norm);
    if (/\.understandignore$/i.test(name) || name.startsWith(".")) return "config";
    if (/\.(md|rst)$/i.test(name)) return "documentation";
    const ext = path.extname(name).toLowerCase();
    if (!ext) return "root";
    return ext.replace(".", "") || "root";
  }
  return parts[0];
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) fail("Usage: ua-arch-analyze.js <input.json> <output.json>");

  const input = loadJson(inputPath);
  const fileNodes = Array.isArray(input.fileNodes) ? input.fileNodes : [];
  const importEdges = Array.isArray(input.importEdges) ? input.importEdges : [];
  const allEdges = Array.isArray(input.allEdges) ? input.allEdges : [];

  const paths = fileNodes.map((n) => n.filePath || n.name || "").filter(Boolean);
  const prefix = commonPrefix(paths);

  const directoryGroups = {};
  for (const node of fileNodes) {
    const fp = node.filePath || node.name || "";
    const key = groupKey(fp, prefix);
    if (!directoryGroups[key]) directoryGroups[key] = [];
    directoryGroups[key].push(node.id);
  }

  const nodeTypeGroups = {};
  for (const node of fileNodes) {
    const t = node.type || "file";
    if (!nodeTypeGroups[t]) nodeTypeGroups[t] = [];
    nodeTypeGroups[t].push(node.id);
  }

  const idToGroup = {};
  for (const [g, ids] of Object.entries(directoryGroups)) {
    for (const id of ids) idToGroup[id] = g;
  }
  const idToType = {};
  for (const node of fileNodes) idToType[node.id] = node.type || "file";

  const fileFanOut = {};
  const fileFanIn = {};
  const adj = {};
  for (const e of importEdges) {
    if (!e.source || !e.target) continue;
    fileFanOut[e.source] = (fileFanOut[e.source] || 0) + 1;
    fileFanIn[e.target] = (fileFanIn[e.target] || 0) + 1;
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  }

  const crossMap = {};
  for (const e of allEdges) {
    const fromType = idToType[e.source] || "unknown";
    const toType = idToType[e.target] || "unknown";
    const edgeType = e.type || "unknown";
    const key = `${fromType}\t${toType}\t${edgeType}`;
    crossMap[key] = (crossMap[key] || 0) + 1;
  }
  const crossCategoryEdges = Object.entries(crossMap).map(([k, count]) => {
    const [fromType, toType, edgeType] = k.split("\t");
    return { fromType, toType, edgeType, count };
  });

  const interMap = {};
  for (const e of importEdges) {
    const from = idToGroup[e.source];
    const to = idToGroup[e.target];
    if (!from || !to) continue;
    const key = `${from}\t${to}`;
    interMap[key] = (interMap[key] || 0) + 1;
  }
  const interGroupImports = Object.entries(interMap).map(([k, count]) => {
    const [from, to] = k.split("\t");
    return { from, to, count };
  });

  const intraGroupDensity = {};
  for (const g of Object.keys(directoryGroups)) {
    let internalEdges = 0;
    let totalEdges = 0;
    for (const e of importEdges) {
      const from = idToGroup[e.source];
      const to = idToGroup[e.target];
      const involves = from === g || to === g;
      if (!involves) continue;
      totalEdges += 1;
      if (from === g && to === g) internalEdges += 1;
    }
    intraGroupDensity[g] = {
      internalEdges,
      totalEdges,
      density: totalEdges === 0 ? 0 : internalEdges / totalEdges,
    };
  }

  const patternMatches = {};
  for (const g of Object.keys(directoryGroups)) {
    let label = null;
    for (const { re, label: l } of DIR_PATTERNS) {
      if (re.test(g)) {
        label = l;
        break;
      }
    }
    if (!label) {
      const ids = directoryGroups[g];
      const nodes = fileNodes.filter((n) => ids.includes(n.id));
      const labels = nodes.map((n) => filePatternLabel(n.filePath || "", n.name)).filter(Boolean);
      const counts = {};
      for (const l of labels) counts[l] = (counts[l] || 0) + 1;
      label = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "other";
    }
    patternMatches[g] = label;
  }

  const infraFiles = [];
  let hasDockerfile = false;
  let hasCompose = false;
  let hasK8s = false;
  let hasTerraform = false;
  let hasCI = false;
  for (const node of fileNodes) {
    const fp = (node.filePath || "").replace(/\\/g, "/");
    const base = node.name || path.basename(fp);
    if (/^Dockerfile/i.test(base)) {
      hasDockerfile = true;
      infraFiles.push(fp);
    }
    if (/^docker-compose/i.test(base)) {
      hasCompose = true;
      infraFiles.push(fp);
    }
    if (/\.(tf|tfvars)$/i.test(base)) {
      hasTerraform = true;
      infraFiles.push(fp);
    }
    if (/(^|\/)(k8s|kubernetes|helm|charts)\//.test(fp) || /\.(ya?ml)$/.test(base) && /k8s|kube/i.test(fp)) {
      hasK8s = true;
      infraFiles.push(fp);
    }
    if (/\.github\/workflows\//.test(fp) || base === ".gitlab-ci.yml" || base === "Jenkinsfile") {
      hasCI = true;
      infraFiles.push(fp);
    }
  }

  const schemaFiles = [];
  const migrationFiles = [];
  const dataModelFiles = [];
  const apiHandlerFiles = [];
  for (const node of fileNodes) {
    const fp = node.filePath || "";
    const base = node.name || "";
    if (/\.(sql|graphql|gql|prisma|proto)$/i.test(base) && !/migrat/i.test(fp)) schemaFiles.push(fp);
    if (/migrat/i.test(fp) && /\.sql$/i.test(base)) migrationFiles.push(fp);
    if (/(^|\/)(models|entities)\//.test(fp)) dataModelFiles.push(fp);
    if (/(^|\/)(routes|api|controllers|handlers)\//.test(fp)) apiHandlerFiles.push(fp);
  }

  const groupsWithDocsList = [];
  const undocumentedGroups = [];
  for (const [g, ids] of Object.entries(directoryGroups)) {
    const nodes = fileNodes.filter((n) => ids.includes(n.id));
    const hasDoc = nodes.some((n) => {
      const base = n.name || path.basename(n.filePath || "");
      return /^README\.md$/i.test(base) || n.type === "document" || /\.md$/i.test(base);
    });
    if (hasDoc) groupsWithDocsList.push(g);
    else undocumentedGroups.push(g);
  }
  const totalGroups = Object.keys(directoryGroups).length;
  const docCoverage = {
    groupsWithDocs: groupsWithDocsList.length,
    totalGroups,
    coverageRatio: totalGroups === 0 ? 0 : groupsWithDocsList.length / totalGroups,
    undocumentedGroups,
  };

  const pairCounts = {};
  for (const { from, to, count } of interGroupImports) {
    if (from === to) continue;
    const a = from < to ? from : to;
    const b = from < to ? to : from;
    const key = `${a}\t${b}`;
    if (!pairCounts[key]) pairCounts[key] = { ab: 0, ba: 0, a, b };
    if (from === a && to === b) pairCounts[key].ab += count;
    else pairCounts[key].ba += count;
  }
  const dependencyDirection = [];
  for (const { ab, ba, a, b } of Object.values(pairCounts)) {
    if (ab > ba) dependencyDirection.push({ dependent: a, dependsOn: b });
    else if (ba > ab) dependencyDirection.push({ dependent: b, dependsOn: a });
  }

  const filesPerGroup = {};
  for (const [g, ids] of Object.entries(directoryGroups)) filesPerGroup[g] = ids.length;
  const nodeTypeCounts = {};
  for (const [t, ids] of Object.entries(nodeTypeGroups)) nodeTypeCounts[t] = ids.length;

  const result = {
    scriptCompleted: true,
    directoryGroups,
    nodeTypeGroups,
    crossCategoryEdges,
    interGroupImports,
    intraGroupDensity,
    patternMatches,
    deploymentTopology: {
      hasDockerfile,
      hasCompose,
      hasK8s,
      hasTerraform,
      hasCI,
      infraFiles,
    },
    dataPipeline: {
      schemaFiles,
      migrationFiles,
      dataModelFiles,
      apiHandlerFiles,
    },
    docCoverage,
    dependencyDirection,
    fileStats: {
      totalFileNodes: fileNodes.length,
      filesPerGroup,
      nodeTypeCounts,
    },
    fileFanIn,
    fileFanOut,
    adjacency: adj,
    pathPrefix: prefix,
  };

  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  } catch (err) {
    fail(`Failed to write ${outputPath}: ${err.message}`);
  }
}

main();
