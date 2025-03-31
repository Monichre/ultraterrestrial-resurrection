#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateComponentAuditReport, formatReportAsMarkdown } from '../utils/analysis/component-audit.js'

// Get current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../..')

// Define output file path
const outputDir = path.join(rootDir, 'docs')
const outputFilePath = path.join(outputDir, 'component-audit-report.md')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

/**
 * Print a section heading to console
 */
function printHeading(text: string): void {
  console.log(`\n${colors.bright}${colors.cyan}${text}${colors.reset}`)
  console.log('='.repeat(text.length))
}

/**
 * Print a subheading to console
 */
function printSubheading(text: string): void {
  console.log(`\n${colors.bright}${colors.blue}${text}${colors.reset}`)
  console.log('-'.repeat(text.length))
}

/**
 * Print a stat with color-coded severity
 */
function printStat(label: string, value: number, threshold: number, highThreshold?: number): void {
  let color = colors.green
  
  if (highThreshold && value >= highThreshold) {
    color = colors.red
  } else if (value >= threshold) {
    color = colors.yellow
  }
  
  console.log(`${colors.dim}${label}:${colors.reset} ${color}${value}${colors.reset}`)
}

// Main function
async function runComponentAudit() {
  console.log(`${colors.bright}${colors.magenta}Component Audit Tool${colors.reset}`)
  console.log(`${colors.dim}Analyzing components in the codebase...${colors.reset}`)
  console.log(`${colors.dim}Root directory: ${rootDir}${colors.reset}`)
  
  try {
    // Generate the report
    const startTime = Date.now()
    const report = generateComponentAuditReport()
    const endTime = Date.now()
    
    // Print report summary to console
    printHeading('Component Audit Summary')
    console.log(`${colors.dim}Analysis completed in ${(endTime - startTime) / 1000} seconds${colors.reset}`)
    
    printStat('Total Components', report.totalComponents, 50, 100)
    printStat('Large Components', report.largeComponents.length, 5, 10)
    printStat('Small Components', report.smallComponents.length, 10, 20)
    printStat('Consolidation Groups', report.consolidationCandidates.length, 3, 7)
    printStat('Refactoring Candidates', report.refactoringCandidates.length, 10, 20)
    
    // Print categories
    printSubheading('Component Categories')
    const sortedCategories = [...report.categories].sort((a, b) => b.count - a.count)
    
    for (const category of sortedCategories) {
      console.log(`${colors.dim}${category.name}:${colors.reset} ${category.count} components`)
    }
    
    // Print refactoring priorities
    if (report.refactoringCandidates.length > 0) {
      printSubheading('Top Refactoring Priorities')
      
      const highPriorityCandidates = report.refactoringCandidates
        .filter(c => c.severity === 'high')
        .slice(0, 5)
      
      if (highPriorityCandidates.length > 0) {
        for (const candidate of highPriorityCandidates) {
          console.log(`${colors.red}${colors.bright}${path.basename(candidate.component)}${colors.reset}: ${candidate.reason}`)
          console.log(`  ${colors.dim}${candidate.details}${colors.reset}`)
        }
      } else {
        console.log(`${colors.green}No high priority refactoring candidates found${colors.reset}`)
      }
    }
    
    // Format report as markdown
    const markdown = formatReportAsMarkdown(report)
    
    // Write to file
    fs.writeFileSync(outputFilePath, markdown)
    
    console.log(`\n${colors.green}Report generated successfully!${colors.reset}`)
    console.log(`${colors.dim}Full report saved to: ${colors.reset}${outputFilePath}`)
    
    // Print next steps
    printHeading('Next Steps')
    console.log(`1. Review the full report at ${outputFilePath}`)
    console.log(`2. Focus on high-severity refactoring candidates first`)
    console.log(`3. Consider consolidating components in the identified groups`)
    console.log(`4. Address large components by breaking them into smaller components`)
    
  } catch (error) {
    console.error(`${colors.red}Error generating component audit:${colors.reset}`, error)
    process.exit(1)
  }
}

// Run the audit
runComponentAudit()

