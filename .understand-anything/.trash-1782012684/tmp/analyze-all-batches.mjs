#!/usr/bin/env node
/**
 * Deterministic batch graph builder for large /understand runs.
 * Uses extract-structure.mjs per batch and emits batch-<n>.json files.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

const PROJECT_ROOT = process.argv[2]
const PLUGIN_SKILL = process.argv[3]
if (!PROJECT_ROOT || !PLUGIN_SKILL) {
  process.stderr.write('Usage: node analyze-all-batches.mjs <projectRoot> <skillDir>\n')
  process.exit(1)
}

const batchesPath = join(PROJECT_ROOT, '.understand-anything/intermediate/batches.json')
const intermediateDir = join(PROJECT_ROOT, '.understand-anything/intermediate')
const tmpDir = join(PROJECT_ROOT, '.understand-anything/tmp')
mkdirSync(tmpDir, { recursive: true })

const batchesDoc = JSON.parse(readFileSync(batchesPath, 'utf8'))
const batches = batchesDoc.batches || []

function nodeTypeForFile(file) {
  const { path, fileCategory } = file
  const base = basename(path)
  if (fileCategory === 'config') return 'config'
  if (fileCategory === 'docs') return 'document'
  if (fileCategory === 'infra') {
    if (base.startsWith('Dockerfile') || base.startsWith('docker-compose') || base === 'compose.yml' || base === 'compose.yaml') return 'service'
    if (path.includes('.github/workflows/') || base === 'Jenkinsfile' || base.endsWith('.gitlab-ci.yml')) return 'pipeline'
    if (path.endsWith('.tf') || path.endsWith('.tfvars')) return 'resource'
    return 'service'
  }
  if (fileCategory === 'data') {
    if (path.endsWith('.sql')) return 'schema'
    if (path.endsWith('.graphql') || path.endsWith('.gql') || path.endsWith('.proto') || path.endsWith('.prisma')) return 'schema'
    return 'schema'
  }
  return 'file'
}

function nodeIdForFile(file) {
  const type = nodeTypeForFile(file)
  return `${type}:${file.path}`
}

function targetNodeIdForPath(path, fileIndex) {
  const file = fileIndex.get(path)
  if (file) return nodeIdForFile(file)
  if (path.endsWith('.md') || path.endsWith('.txt')) return `document:${path}`
  if (path.endsWith('.json') || path.endsWith('.yaml') || path.endsWith('.yml') || path.endsWith('.toml')) return `config:${path}`
  return `file:${path}`
}

function complexityForLines(lines, fnCount = 0, clsCount = 0) {
  if (lines >= 300 || fnCount + clsCount >= 8) return 'complex'
  if (lines >= 100 || fnCount + clsCount >= 3) return 'moderate'
  return 'simple'
}

function tagsForFile(file, result) {
  const tags = new Set()
  const base = basename(file.path)
  const lower = file.path.toLowerCase()

  if (file.fileCategory === 'docs') tags.add('documentation')
  if (file.fileCategory === 'config') tags.add('configuration')
  if (file.fileCategory === 'infra') tags.add('infrastructure')
  if (file.fileCategory === 'data') tags.add('schema-definition')
  if (file.fileCategory === 'script') tags.add('script')
  if (file.fileCategory === 'markup') tags.add('markup')

  if (base === 'index.ts' || base === 'index.tsx' || base === 'index.js' || base === '__init__.py' || base === 'main.py') tags.add('entry-point')
  if (/\.(test|spec)\./.test(base) || base.startsWith('test_') || base.endsWith('_test.go')) tags.add('test')
  if (lower.includes('/api/')) tags.add('api-handler')
  if (lower.includes('/hooks/')) tags.add('hook')
  if (lower.includes('/components/')) tags.add('component')
  if (lower.includes('/services/')) tags.add('service')
  if (lower.includes('/features/mindmap/')) tags.add('mindmap')
  if (lower.includes('/postgres/')) tags.add('database')
  if (lower.includes('packages/db')) tags.add('database')
  if (lower.includes('disclosure-rag')) tags.add('rag')
  if (lower.includes('knowledge-base')) tags.add('knowledge-base')
  if (result?.exports?.length) tags.add('exports')
  if ((result?.metrics?.functionCount || 0) > 5) tags.add('utility')

  const defaults = ['code', 'module', 'source']
  for (const t of defaults) {
    if (tags.size >= 5) break
    tags.add(t)
  }
  return [...tags].slice(0, 5)
}

function summaryForFile(file, result) {
  const base = basename(file.path)
  const fnCount = result?.functions?.length || result?.metrics?.functionCount || 0
  const clsCount = result?.classes?.length || result?.metrics?.classCount || 0
  const exportCount = result?.exports?.length || result?.metrics?.exportCount || 0

  if (file.fileCategory === 'docs') {
    return `${base} is a documentation file (${file.sizeLines || result?.totalLines || 0} lines) in the scoped Ultraterrestrial monorepo.`
  }
  if (file.fileCategory === 'config') {
    return `${base} configures tooling or runtime behavior for the scoped project packages.`
  }
  if (file.fileCategory === 'infra') {
    return `${base} defines infrastructure, deployment, or CI/CD behavior for the project.`
  }
  if (file.fileCategory === 'data') {
    return `${base} defines schema, migration, or structured data used by the platform.`
  }

  const parts = [`${base} is a ${file.language} source file`]
  if (fnCount) parts.push(`with ${fnCount} function${fnCount === 1 ? '' : 's'}`)
  if (clsCount) parts.push(`${fnCount ? 'and ' : 'with '}${clsCount} class${clsCount === 1 ? '' : 'es'}`)
  if (exportCount) parts.push(`exporting ${exportCount} symbol${exportCount === 1 ? '' : 's'}`)
  parts.push('within the scoped Ultraterrestrial codebase.')
  return parts.join(' ')
}

function buildBatchGraph(batch, extractResults) {
  const fileIndex = new Map(batch.files.map((f) => [f.path, f]))
  const resultByPath = new Map((extractResults.results || []).map((r) => [r.path, r]))
  const nodes = []
  const edges = []

  for (const file of batch.files) {
    const result = resultByPath.get(file.path)
    const fileNodeType = nodeTypeForFile(file)
    const fileNodeId = `${fileNodeType}:${file.path}`
    nodes.push({
      id: fileNodeId,
      type: fileNodeType,
      name: basename(file.path),
      filePath: file.path,
      summary: summaryForFile(file, result),
      tags: tagsForFile(file, result),
      complexity: complexityForLines(file.sizeLines || result?.totalLines || 0, result?.functions?.length || 0, result?.classes?.length || 0),
    })

    const imports = batch.batchImportData?.[file.path] || []
    for (const importedPath of imports) {
      edges.push({
        source: fileNodeId,
        target: targetNodeIdForPath(importedPath, fileIndex),
        type: 'imports',
        direction: 'forward',
        weight: 0.7,
      })
    }

    if (!result || file.fileCategory !== 'code') continue

    const exportedNames = new Set((result.exports || []).map((e) => e.name))

    for (const fn of result.functions || []) {
      const lineSpan = (fn.endLine || fn.startLine) - (fn.startLine || 0) + 1
      const isExported = exportedNames.has(fn.name)
      if (!isExported && lineSpan < 10) continue
      const fnId = `function:${file.path}:${fn.name}`
      nodes.push({
        id: fnId,
        type: 'function',
        name: fn.name,
        filePath: file.path,
        lineRange: [fn.startLine, fn.endLine],
        summary: `${fn.name} is a ${file.language} function in ${basename(file.path)}.`,
        tags: ['function', ...(isExported ? ['exports'] : []), 'module'],
        complexity: complexityForLines(lineSpan),
      })
      edges.push({ source: fileNodeId, target: fnId, type: 'contains', direction: 'forward', weight: 1.0 })
      if (isExported) {
        edges.push({ source: fileNodeId, target: fnId, type: 'exports', direction: 'forward', weight: 0.8 })
      }
    }

    for (const cls of result.classes || []) {
      const lineSpan = (cls.endLine || cls.startLine) - (cls.startLine || 0) + 1
      const methodCount = cls.methods?.length || 0
      const isExported = exportedNames.has(cls.name)
      if (!isExported && lineSpan < 20 && methodCount < 2) continue
      const clsId = `class:${file.path}:${cls.name}`
      nodes.push({
        id: clsId,
        type: 'class',
        name: cls.name,
        filePath: file.path,
        lineRange: [cls.startLine, cls.endLine],
        summary: `${cls.name} is a ${file.language} class in ${basename(file.path)}.`,
        tags: ['class', ...(isExported ? ['exports'] : []), 'module'],
        complexity: complexityForLines(lineSpan, 0, methodCount),
      })
      edges.push({ source: fileNodeId, target: clsId, type: 'contains', direction: 'forward', weight: 1.0 })
      if (isExported) {
        edges.push({ source: fileNodeId, target: clsId, type: 'exports', direction: 'forward', weight: 0.8 })
      }
    }
  }

  return { nodes, edges }
}

let completed = 0
for (const batch of batches) {
  const batchIndex = batch.batchIndex
  const outPath = join(intermediateDir, `batch-${batchIndex}.json`)
  if (existsSync(outPath)) {
    completed++
    continue
  }

  const batchFiles = batch.files.map((f) => ({
    path: f.path,
    language: f.language,
    sizeLines: f.sizeLines,
    fileCategory: f.fileCategory,
  }))

  const inputPath = join(tmpDir, `ua-file-analyzer-input-${batchIndex}.json`)
  const extractPath = join(tmpDir, `ua-file-extract-results-${batchIndex}.json`)
  writeFileSync(
    inputPath,
    JSON.stringify({
      projectRoot: PROJECT_ROOT,
      batchFiles,
      batchImportData: batch.batchImportData || {},
    }),
    'utf8',
  )

  const extract = spawnSync(
    'node',
    [join(PLUGIN_SKILL, 'extract-structure.mjs'), inputPath, extractPath],
    { encoding: 'utf8' },
  )
  if (extract.status !== 0) {
    process.stderr.write(`Warning: batch ${batchIndex} extract-structure failed: ${extract.stderr}\n`)
    writeFileSync(outPath, JSON.stringify(buildBatchGraph(batch, { results: [] }), null, 2), 'utf8')
    completed++
    continue
  }

  const extractResults = JSON.parse(readFileSync(extractPath, 'utf8'))
  writeFileSync(outPath, JSON.stringify(buildBatchGraph(batch, extractResults), null, 2), 'utf8')
  completed++
  if (completed % 10 === 0 || completed === batches.length) {
    process.stderr.write(`Analyzed batch ${completed}/${batches.length}\n`)
  }
}

process.stderr.write(`Phase 2 deterministic analysis complete: ${completed}/${batches.length} batches\n`)
