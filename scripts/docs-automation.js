#!/usr/bin/env node

/**
 * Documentation Automation Script
 * 
 * This script helps maintain documentation across the Ultraterrestrial project by:
 * - Generating missing README files
 * - Validating documentation structure
 * - Checking for broken links
 * - Ensuring template compliance
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  packagesDir: path.join(PROJECT_ROOT, 'packages'),
  appsDir: path.join(PROJECT_ROOT, 'apps'),
  templatesDir: path.join(PROJECT_ROOT, 'templates'),
  docsDir: path.join(PROJECT_ROOT, 'docs'),
};

/**
 * Main execution function
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'audit':
      await auditDocumentation();
      break;
    case 'generate':
      await generateMissingDocs();
      break;
    case 'validate':
      await validateDocumentation();
      break;
    case 'check-links':
      await checkLinks();
      break;
    default:
      showHelp();
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
Documentation Automation Tool

Usage: bun run scripts/docs-automation.js <command>

Commands:
  audit        - Audit current documentation coverage
  generate     - Generate missing README files
  validate     - Validate documentation structure
  check-links  - Check for broken internal links
  
Examples:
  bun run scripts/docs-automation.js audit
  bun run scripts/docs-automation.js generate
  `);
}

/**
 * Audit documentation coverage across packages and apps
 */
async function auditDocumentation() {
  console.log('🔍 Auditing documentation coverage...\n');
  
  const results = {
    packages: await auditDirectory(CONFIG.packagesDir, 'package'),
    apps: await auditDirectory(CONFIG.appsDir, 'app'),
  };
  
  // Summary report
  const totalItems = results.packages.length + results.apps.length;
  const missingReadmes = [
    ...results.packages.filter(p => !p.hasReadme),
    ...results.apps.filter(a => !a.hasReadme),
  ];
  
  console.log('\n📊 Documentation Coverage Report');
  console.log('================================');
  console.log(`Total packages/apps: ${totalItems}`);
  console.log(`Missing READMEs: ${missingReadmes.length}`);
  console.log(`Coverage: ${((totalItems - missingReadmes.length) / totalItems * 100).toFixed(1)}%\n`);
  
  if (missingReadmes.length > 0) {
    console.log('❌ Missing README files:');
    missingReadmes.forEach(item => {
      console.log(`  - ${item.type}: ${item.name}`);
    });
  } else {
    console.log('✅ All packages and apps have README files!');
  }
}

/**
 * Audit a specific directory for documentation
 */
async function auditDirectory(dirPath, type) {
  const results = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const itemPath = path.join(dirPath, entry.name);
        const readmePath = path.join(itemPath, 'README.md');
        
        let hasReadme = false;
        try {
          await fs.access(readmePath);
          hasReadme = true;
        } catch {
          // README doesn't exist
        }
        
        results.push({
          name: entry.name,
          path: itemPath,
          type,
          hasReadme,
        });
        
        console.log(`${hasReadme ? '✅' : '❌'} ${type}: ${entry.name}`);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read ${type} directory: ${dirPath}`);
  }
  
  return results;
}

/**
 * Generate missing README files using templates
 */
async function generateMissingDocs() {
  console.log('📝 Generating missing documentation...\n');
  
  const auditResults = {
    packages: await auditDirectory(CONFIG.packagesDir, 'package'),
    apps: await auditDirectory(CONFIG.appsDir, 'app'),
  };
  
  // Load templates
  const packageTemplate = await loadTemplate('package-readme-template.md');
  const appTemplate = await loadTemplate('app-readme-template.md');
  
  // Generate missing package READMEs
  const missingPackages = auditResults.packages.filter(p => !p.hasReadme);
  for (const pkg of missingPackages) {
    await generateReadme(pkg, packageTemplate, 'package');
  }
  
  // Generate missing app READMEs
  const missingApps = auditResults.apps.filter(a => !a.hasReadme);
  for (const app of missingApps) {
    await generateReadme(app, appTemplate, 'app');
  }
  
  const totalGenerated = missingPackages.length + missingApps.length;
  console.log(`\n✅ Generated ${totalGenerated} README files`);
}

/**
 * Load a template file
 */
async function loadTemplate(templateName) {
  const templatePath = path.join(CONFIG.templatesDir, templateName);
  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    console.error(`❌ Could not load template: ${templateName}`);
    throw error;
  }
}

/**
 * Generate a README file from template
 */
async function generateReadme(item, template, type) {
  const readmePath = path.join(item.path, 'README.md');
  
  // Replace template placeholders
  let content = template
    .replace(/\{Package Name\}/g, formatName(item.name))
    .replace(/\{App Name\}/g, formatName(item.name))
    .replace(/\{package-name\}/g, item.name)
    .replace(/\{app-name\}/g, item.name)
    .replace(/\{current-version\}/g, '0.1.0')
    .replace(/\{current-date\}/g, new Date().toISOString().split('T')[0])
    .replace(/\{maintainer-info\}/g, 'Development Team')
    .replace(/\{development-status\}/g, 'In Development');
  
  // Add specific placeholders based on type
  if (type === 'package') {
    content = content
      .replace(/\{Brief description[^}]*\}/g, `A package in the Ultraterrestrial ecosystem for ${item.name} functionality.`);
  } else if (type === 'app') {
    content = content
      .replace(/\{Description[^}]*\}/g, `The ${formatName(item.name)} application for the Ultraterrestrial platform.`)
      .replace(/\{Database requirements\}/g, 'PostgreSQL 14+')
      .replace(/\{Required external services\}/g, 'See environment configuration')
      .replace(/\{port\}/g, '3000')
      .replace(/\{Brief architecture description\}/g, `${formatName(item.name)} is built with modern web technologies.`)
      .replace(/\{Frontend framework[^}]*\}/g, 'Next.js with React')
      .replace(/\{API and service layer\}/g, 'REST API with TypeScript')
      .replace(/\{Database design[^}]*\}/g, 'PostgreSQL with Prisma ORM')
      .replace(/\{Third-party integrations\}/g, 'External API integrations');
  }
  
  try {
    await fs.writeFile(readmePath, content, 'utf-8');
    console.log(`✅ Generated README for ${type}: ${item.name}`);
  } catch (error) {
    console.error(`❌ Failed to generate README for ${item.name}:`, error.message);
  }
}

/**
 * Format name for display (convert kebab-case to Title Case)
 */
function formatName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate documentation structure
 */
async function validateDocumentation() {
  console.log('🔍 Validating documentation structure...\n');
  
  const issues = [];
  
  // Check main docs directory structure
  const requiredDocs = [
    'getting-started',
    'architecture',
    'api',
    'deployment',
    'troubleshooting',
    'contributing',
  ];
  
  for (const docDir of requiredDocs) {
    const dirPath = path.join(CONFIG.docsDir, docDir);
    try {
      await fs.access(dirPath);
      console.log(`✅ docs/${docDir} exists`);
    } catch {
      issues.push(`Missing directory: docs/${docDir}`);
      console.log(`❌ docs/${docDir} missing`);
    }
  }
  
  // Check package structure
  const packages = await auditDirectory(CONFIG.packagesDir, 'package');
  for (const pkg of packages.filter(p => p.hasReadme)) {
    await validatePackageStructure(pkg, issues);
  }
  
  // Check app structure
  const apps = await auditDirectory(CONFIG.appsDir, 'app');
  for (const app of apps.filter(a => a.hasReadme)) {
    await validateAppStructure(app, issues);
  }
  
  // Summary
  if (issues.length === 0) {
    console.log('\n✅ All documentation structure checks passed!');
  } else {
    console.log(`\n❌ Found ${issues.length} structural issues:`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
}

/**
 * Validate package documentation structure
 */
async function validatePackageStructure(pkg, issues) {
  const expectedFiles = ['README.md'];
  const expectedDirs = ['docs', 'src'];
  
  for (const file of expectedFiles) {
    const filePath = path.join(pkg.path, file);
    try {
      await fs.access(filePath);
    } catch {
      issues.push(`${pkg.name}: Missing ${file}`);
    }
  }
  
  // Optional but recommended directories
  for (const dir of expectedDirs) {
    const dirPath = path.join(pkg.path, dir);
    try {
      await fs.access(dirPath);
    } catch {
      // Not an error, just noting
    }
  }
}

/**
 * Validate app documentation structure
 */
async function validateAppStructure(app, issues) {
  const expectedFiles = ['README.md'];
  const expectedDirs = ['docs', 'src'];
  
  for (const file of expectedFiles) {
    const filePath = path.join(app.path, file);
    try {
      await fs.access(filePath);
    } catch {
      issues.push(`${app.name}: Missing ${file}`);
    }
  }
}

/**
 * Check for broken internal links
 */
async function checkLinks() {
  console.log('🔗 Checking internal links...\n');
  
  // This is a simplified version - a full implementation would use a proper markdown parser
  console.log('📝 Link checking functionality coming soon...');
  console.log('For now, manually verify links in key documentation files.');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});