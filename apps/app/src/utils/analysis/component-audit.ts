import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
// Types for component analysis
export interface ComponentInfo {
  path: string
  name: string
  category: string
  size: number // in bytes
  lineCount: number
  dependencies: string[]
  exports: string[]
}

export interface ComponentCategory {
  name: string
  count: number
  components: string[]
  averageSize: number
}

export interface RefactoringCandidate {
  component: string
  reason: string
  severity: 'high' | 'medium' | 'low'
  details: string
}

export interface ConsolidationGroup {
  name: string
  components: string[]
  similarity: number
  reason: string
}

export interface ComponentAuditReport {
  totalComponents: number
  categories: ComponentCategory[]
  largeComponents: ComponentInfo[]
  smallComponents: ComponentInfo[]
  consolidationCandidates: ConsolidationGroup[]
  refactoringCandidates: RefactoringCandidate[]
  timestamp: string
}

// Configuration constants
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx']
const COMPONENT_DIRECTORIES = ['src/components', 'src/features']
const LARGE_COMPONENT_THRESHOLD = 300 // lines
const SMALL_COMPONENT_THRESHOLD = 10 // lines
const SIMILARITY_THRESHOLD = 0.7 // 70% similarity for consolidation candidates

/**
 * Checks if a file is a React component based on its extension and content
 */
export const isReactComponent = (filePath: string): boolean => {
  const ext = path.extname(filePath)
  
  if (!COMPONENT_EXTENSIONS.includes(ext)) {
    return false
  }
  
  // Skip index files as they're usually just re-exports
  if (path.basename(filePath, ext) === 'index') {
    return false
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    // Check for React imports or JSX syntax
    return (
      content.includes('import React') || 
      content.includes('from "react"') || 
      content.includes('from \'react\'') ||
      content.includes('export default function') ||
      content.includes('export function') ||
      content.includes('function') && content.includes('return (') && (content.includes('<') && content.includes('/>'))
    )
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

/**
 * Extract component name from file path
 */
export const extractComponentName = (filePath: string): string => {
  const fileName = path.basename(filePath)
  const componentName = fileName.split('.')[0]
  return componentName
}

/**
 * Determine component category based on its path and contents
 */
export const determineComponentCategory = (filePath: string): string => {
  const pathSegments = filePath.split(path.sep)
  
  // Check if component is in a specific category folder
  if (pathSegments.includes('components')) {
    const componentsIndex = pathSegments.indexOf('components')
    if (componentsIndex < pathSegments.length - 2) {
      return pathSegments[componentsIndex + 1]
    }
  }
  
  // Check for specific prefixes in component name
  const componentName = extractComponentName(filePath)
  
  if (componentName.startsWith('Form') || componentName.endsWith('Form')) {
    return 'forms'
  }
  
  if (componentName.startsWith('Modal') || componentName.endsWith('Modal')) {
    return 'modals'
  }
  
  if (componentName.startsWith('Page') || componentName.endsWith('Page')) {
    return 'pages'
  }
  
  if (componentName.startsWith('Layout') || componentName.endsWith('Layout')) {
    return 'layouts'
  }
  
  if (componentName.startsWith('Card') || componentName.endsWith('Card')) {
    return 'cards'
  }
  
  if (componentName.startsWith('Button') || componentName.endsWith('Button')) {
    return 'buttons'
  }
  
  if (componentName.startsWith('Icon') || componentName.endsWith('Icon')) {
    return 'icons'
  }
  
  if (componentName.startsWith('List') || componentName.endsWith('List') || 
      componentName.startsWith('Table') || componentName.endsWith('Table')) {
    return 'data-display'
  }
  
  // Default to 'other' if no specific category is found
  return 'other'
}

/**
 * Count lines in a file
 */
export const countFileLines = (filePath: string): number => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split('\n').length
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return 0
  }
}

/**
 * Parse imports and exports from a component file
 */
export const parseComponentDependencies = (filePath: string): { dependencies: string[], exports: string[] } => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    
    const dependencies: string[] = []
    const exports: string[] = []
    
    // Extract imports
    for (const line of lines) {
      if (line.trim().startsWith('import ')) {
        const match = line.match(/from ['"](.*)['"]/i)
        if (match && match[1]) {
          dependencies.push(match[1])
        }
      }
      
      // Extract exports
      if (line.includes('export ')) {
        if (line.includes('function ')) {
          const match = line.match(/function\s+(\w+)/i)
          if (match && match[1]) {
            exports.push(match[1])
          }
        } else if (line.includes('const ')) {
          const match = line.match(/const\s+(\w+)/i)
          if (match && match[1]) {
            exports.push(match[1])
          }
        } else if (line.includes('class ')) {
          const match = line.match(/class\s+(\w+)/i)
          if (match && match[1]) {
            exports.push(match[1])
          }
        }
      }
    }
    
    return { dependencies, exports }
  } catch (error) {
    console.error(`Error parsing dependencies in ${filePath}:`, error)
    return { dependencies: [], exports: [] }
  }
}

/**
 * Analyze a single component file
 */
export const analyzeComponent = (filePath: string): ComponentInfo => {
  const fileStats = fs.statSync(filePath)
  const lineCount = countFileLines(filePath)
  const { dependencies, exports } = parseComponentDependencies(filePath)
  
  return {
    path: filePath,
    name: extractComponentName(filePath),
    category: determineComponentCategory(filePath),
    size: fileStats.size,
    lineCount,
    dependencies,
    exports
  }
}

/**
 * Calculate similarity between two components (0-1)
 */
export const calculateComponentSimilarity = (comp1: ComponentInfo, comp2: ComponentInfo): number => {
  // Name similarity (using prefix/suffix matching)
  let nameSimilarity = 0
  const name1 = comp1.name.toLowerCase()
  const name2 = comp2.name.toLowerCase()
  
  // Check for common prefixes/suffixes
  const prefixMatch = (name1.substring(0, 3) === name2.substring(0, 3)) && name1.substring(0, 3).length > 2
  const suffixMatch = (name1.substring(name1.length - 3) === name2.substring(name2.length - 3)) && name1.substring(name1.length - 3).length > 2
  
  if (prefixMatch || suffixMatch) {
    nameSimilarity = 0.3
  }
  
  // Category similarity
  const categorySimilarity = comp1.category === comp2.category ? 0.3 : 0
  
  // Dependency similarity
  const dep1 = new Set(comp1.dependencies)
  const dep2 = new Set(comp2.dependencies)
  
  const commonDeps = new Set([...dep1].filter(x => dep2.has(x)))
  const depSimilarity = commonDeps.size > 0 
    ? (commonDeps.size / Math.max(dep1.size, dep2.size)) * 0.4 
    : 0
  
  return nameSimilarity + categorySimilarity + depSimilarity
}

/**
 * Find components that should be consolidated based on similarity
 */
export const findConsolidationCandidates = (components: ComponentInfo[]): ConsolidationGroup[] => {
  const consolidationGroups: ConsolidationGroup[] = []
  const processedComponents = new Set<string>()
  
  // Compare each component with every other component
  for (let i = 0; i < components.length; i++) {
    if (processedComponents.has(components[i].path)) continue
    
    const similarComponents: string[] = [components[i].path]
    const groupName = components[i].name
    let groupReason = ''
    
    for (let j = 0; j < components.length; j++) {
      if (i === j || processedComponents.has(components[j].path)) continue
      
      const similarity = calculateComponentSimilarity(components[i], components[j])
      
      if (similarity >= SIMILARITY_THRESHOLD) {
        similarComponents.push(components[j].path)
        processedComponents.add(components[j].path)
        
        if (!groupReason) {
          groupReason = `Similar naming pattern and ${Math.round(similarity * 100)}% overall similarity`
        }
      }
    }
    
    // Only create groups with multiple components
    if (similarComponents.length > 1) {
      consolidationGroups.push({
        name: groupName,
        components: similarComponents,
        similarity: SIMILARITY_THRESHOLD,
        reason: groupReason || 'Similar functionality detected'
      })
      
      // Mark the original component as processed
      processedComponents.add(components[i].path)
    }
  }
  
  return consolidationGroups
}

/**
 * Identify components that might need refactoring
 */
export const findRefactoringCandidates = (components: ComponentInfo[]): RefactoringCandidate[] => {
  const candidates: RefactoringCandidate[] = []
  
  for (const component of components) {
    // Large file size candidates
    if (component.lineCount > LARGE_COMPONENT_THRESHOLD) {
      candidates.push({
        component: component.path,
        reason: 'Large component size',
        severity: component.lineCount > LARGE_COMPONENT_THRESHOLD * 1.5 ? 'high' : 'medium',
        details: `Component has ${component.lineCount} lines of code (threshold: ${LARGE_COMPONENT_THRESHOLD})`
      })
    }
    
    // Too many dependencies
    if (component.dependencies.length > 15) {
      candidates.push({
        component: component.path,
        reason: 'Too many dependencies',
        severity: component.dependencies.length > 25 ? 'high' : 'medium',
        details: `Component has ${component.dependencies.length} dependencies`
      })
    }
    
    // Too few lines (might be better as part of another component)
    if (component.lineCount < SMALL_COMPONENT_THRESHOLD && component.dependencies.length > 3) {
      candidates.push({
        component: component.path,
        reason: 'Very small component with many dependencies',
        severity: 'low',
        details: `Component has only ${component.lineCount} lines but ${component.dependencies.length} dependencies`
      })
    }
  }
  
  return candidates
}

/**
 * Find all component files in the specified directories
 */
export const findAllComponentFiles = (directories = COMPONENT_DIRECTORIES): string[] => {
  const componentFiles: string[] = []
  
  // Get the current file directory
  const currentFilePath = fileURLToPath(import.meta.url)
  const currentDir = path.dirname(currentFilePath)
  const rootDir = path.resolve(currentDir, '../../../')
  
  for (const dir of directories) {
    try {
      const absoluteDir = path.join(rootDir, dir)
      if (!fs.existsSync(absoluteDir)) {
        console.warn(`Directory not found: ${absoluteDir}`)
        continue
      }
      
      const traverse = (currentPath: string) => {
        const items = fs.readdirSync(currentPath)
        
        for (const item of items) {
          const itemPath = path.join(currentPath, item)
          const stats = fs.statSync(itemPath)
          
          if (stats.isDirectory()) {
            traverse(itemPath) // Recursively check subdirectories
          } else if (stats.isFile() && isReactComponent(itemPath)) {
            componentFiles.push(itemPath)
          }
        }
      }
      
      traverse(dir)
    } catch (error) {
      console.error(`Error traversing directory ${dir}:`, error)
    }
  }
  
  return componentFiles
}

/**
 * Generate component categories from component info
 */
export const generateComponentCategories = (components: ComponentInfo[]): ComponentCategory[] => {
  const categoriesMap = new Map<string, { count: number, components: string[], totalSize: number }>()
  
  // Group components by category
  for (const component of components) {
    const category = component.category
    const existing = categoriesMap.get(category) || { count: 0, components: [], totalSize: 0 }
    
    categoriesMap.set(category, {
      count: existing.count + 1,
      components: [...existing.components, component.path],
      totalSize: existing.totalSize + component.size
    })
  }
  
  // Convert map to array of categories
  return Array.from(categoriesMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    components: data.components,
    averageSize: Math.round(data.totalSize / data.count)
  }))
}

/**
 * Generate a comprehensive component audit report
 */
export const generateComponentAuditReport = (directories = COMPONENT_DIRECTORIES): ComponentAuditReport => {
  // Find all component files
  const componentFiles = findAllComponentFiles(directories)
  
  // Analyze each component
  const componentInfoList: ComponentInfo[] = componentFiles.map(filePath => analyzeComponent(filePath))
  
  // Generate categories
  const categories = generateComponentCategories(componentInfoList)
  
  // Find large and small components
  const largeComponents = componentInfoList
    .filter(comp => comp.lineCount > LARGE_COMPONENT_THRESHOLD)
    .sort((a, b) => b.lineCount - a.lineCount)
  
  const smallComponents = componentInfoList
    .filter(comp => comp.lineCount < SMALL_COMPONENT_THRESHOLD)
    .sort((a, b) => a.lineCount - b.lineCount)
  
  // Find consolidation candidates
  const consolidationCandidates = findConsolidationCandidates(componentInfoList)
  
  // Find refactoring candidates
  const refactoringCandidates = findRefactoringCandidates(componentInfoList)
  
  // Compile the final report
  return {
    totalComponents: componentInfoList.length,
    categories,
    largeComponents,
    smallComponents,
    consolidationCandidates,
    refactoringCandidates,
    timestamp: new Date().toISOString()
  }
}

/**
 * Format a component audit report as markdown
 */
export const formatReportAsMarkdown = (report: ComponentAuditReport): string => {
  let markdown = `# Component Audit Report\n\n`
  markdown += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`
  markdown += `## Overview\n\n`
  markdown += `- **Total Components:** ${report.totalComponents}\n`
  markdown += `- **Large Components (>${LARGE_COMPONENT_THRESHOLD} lines):** ${report.largeComponents.length}\n`
  markdown += `- **Small Components (<${SMALL_COMPONENT_THRESHOLD} lines):** ${report.smallComponents.length}\n`
  markdown += `- **Consolidation Candidates:** ${report.consolidationCandidates.length} groups\n`
  markdown += `- **Refactoring Candidates:** ${report.refactoringCandidates.length} components\n\n`
  
  // Component Categories
  markdown += `## Component Categories\n\n`
  markdown += `| Category | Count | Average Size |\n`
  markdown += `|----------|-------|-------------|\n`
  
  for (const category of report.categories.sort((a, b) => b.count - a.count)) {
    markdown += `| ${category.name} | ${category.count} | ${formatBytes(category.averageSize)} |\n`
  }
  
  // Large Components
  if (report.largeComponents.length > 0) {
    markdown += `\n## Large Components\n\n`
    markdown += `| Component | Lines | Category |\n`
    markdown += `|-----------|-------|----------|\n`
    
    for (const comp of report.largeComponents) {
      markdown += `| ${comp.name} | ${comp.lineCount} | ${comp.category} |\n`
    }
  }
  
  // Consolidation Candidates
  if (report.consolidationCandidates.length > 0) {
    markdown += `\n## Consolidation Candidates\n\n`
    
    for (const group of report.consolidationCandidates) {
      markdown += `### ${group.name} Group\n\n`
      markdown += `**Reason:** ${group.reason}\n\n`
      markdown += `**Components:**\n\n`
      
      for (const comp of group.components) {
        markdown += `- \`${comp}\`\n`
      }
      
      markdown += `\n`
    }
  }
  
  // Refactoring Candidates
  if (report.refactoringCandidates.length > 0) {
    markdown += `\n## Refactoring Candidates\n\n`
    markdown += `| Component | Reason | Severity | Details |\n`
    markdown += `|-----------|--------|----------|--------|\n`
    
    for (const candidate of report.refactoringCandidates.sort((a, b) => {
      const severityScore = { high: 3, medium: 2, low: 1 }
      return severityScore[b.severity] - severityScore[a.severity]
    })) {
      markdown += `| ${path.basename(candidate.component)} | ${candidate.reason} | ${candidate.severity} | ${candidate.details} |\n`
    }
  }
  
  return markdown
}

/**
 * Format bytes to a human-readable string
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
