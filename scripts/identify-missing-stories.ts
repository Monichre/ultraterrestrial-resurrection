#!/usr/bin/env node
/**
 * This script identifies React components that are missing Storybook stories.
 * It focuses on components in src/components and src/features directories,
 * detects Props interfaces to identify high-priority components,
 * and generates a Markdown report with statistics and recommendations.
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { glob } from 'glob';

// Promisify fs functions
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);

// ANSI color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  // Foreground colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m',
  },
  // Background colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

// Directories to scan for components
const COMPONENT_DIRECTORIES = ['src/components', 'src/features'];

// Output file path
const OUTPUT_FILE = 'docs/component-missing-stories-report.md';

// Helper: Print colored console output
function colorLog(message: string, color: string): void {
  console.log(`${color}${message}${COLORS.reset}`);
}

// Helper: Display a heading in the console
function displayHeading(heading: string): void {
  console.log('\n');
  colorLog(heading, COLORS.fg.cyan + COLORS.bright);
  console.log('='.repeat(heading.length));
}

// Interface to represent a component
interface Component {
  name: string;
  filePath: string;
  directory: string;
  relativePath: string;
  hasStory: boolean;
  hasPropsInterface: boolean;
  usedInApp: boolean;
}

// Interface for scan results
interface ScanResults {
  components: Component[];
  totalComponents: number;
  componentsWithStories: number;
  componentsWithoutStories: number;
  highPriorityComponents: number;
  highPriorityWithoutStories: number;
  componentsUsedInApp: number;
  componentsWithoutStoriesButUsedInApp: number;
}

// Get component name from file path
function getComponentName(filePath: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename;
}

// Check if a file is a component (not a test, utility, or index file)
function isComponentFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  
  // Exclude test files, utility files, and index files
  return (
    filePath.endsWith('.tsx') &&
    !filePath.includes('.test.') &&
    !filePath.includes('.spec.') &&
    !filePath.includes('utils') &&
    !filePath.includes('helpers') &&
    !basename.startsWith('use') &&  // Exclude hooks
    basename !== 'index.tsx'
  );
}

// Check if a component has a corresponding story file
function hasStoryFile(componentPath: string): boolean {
  const dir = path.dirname(componentPath);
  const componentName = getComponentName(componentPath);
  const storyPath = path.join(dir, `${componentName}.stories.tsx`);
  
  return fs.existsSync(storyPath);
}

// Check if a component has a Props interface
async function hasPropsInterface(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Check for interface Props, interface ComponentNameProps, or type Props
    return (
      content.includes('interface Props') ||
      content.includes('type Props') ||
      new RegExp(`interface ${getComponentName(filePath)}Props`).test(content) ||
      new RegExp(`type ${getComponentName(filePath)}Props`).test(content)
    );
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Scan component directories and collect information about components
async function scanAppForComponentUsage(): Promise<Set<string>> {
  const usedComponents = new Set<string>();
  
  try {
    // Use glob with quotes to handle special characters in paths
    const files = await glob('./src/app/**/*.tsx');
    
    // Process each file
    for (const filePath of files) {
      try {
        const content = await readFile(filePath, 'utf-8');
        
        // Find import statements that reference components
        const componentImports = [
          // Match imports from @/components/
          ...content.matchAll(/import\s+[{]?\s*(\w+)(?:\s*,\s*\w+)*\s*[}]?\s+from\s+['"]@\/components\/[^'"]+['"]/g),
          // Match imports from @/features/
          ...content.matchAll(/import\s+[{]?\s*(\w+)(?:\s*,\s*\w+)*\s*[}]?\s+from\s+['"]@\/features\/[^'"]+['"]/g)
        ];
        
        // Extract component names from import statements
        for (const match of componentImports) {
          // Handle named imports like: import { ComponentA, ComponentB } from '@/components/...'
          if (match[0].includes('{')) {
            const importStatement = match[0];
            const importPattern = /{\s*([\w\s,]+)\s*}/;
            const importMatch = importStatement.match(importPattern);
            
            if (importMatch && importMatch[1]) {
              // Split the comma-separated list of components
              const componentNames = importMatch[1].split(',').map(name => name.trim());
              componentNames.forEach(name => usedComponents.add(name));
            }
          } 
          // Handle default imports like: import ComponentName from '@/components/...'
          else if (match[1]) {
            usedComponents.add(match[1]);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
  } catch (error) {
    console.error('Error scanning app directory:', error);
  }
  
  return usedComponents;
}

// Scan component directories and collect information about components
async function scanComponents(): Promise<ScanResults> {
  const components: Component[] = [];
  
  // First scan app directory to identify which components are used
  console.log('Scanning app directory for component usage...');
  const usedComponentNames = await scanAppForComponentUsage();
  console.log(`Found ${usedComponentNames.size} components used in app directory.`);
  
  // Process each component directory
  for (const directory of COMPONENT_DIRECTORIES) {
    try {
      const files = await glob(`${directory}/**/*.tsx`);
      
      // Filter component files
      const componentFiles = files.filter(isComponentFile);
      
      // Process each component file
      for (const filePath of componentFiles) {
        const componentName = getComponentName(filePath);
        const hasStory = hasStoryFile(filePath);
        const hasProps = await hasPropsInterface(filePath);
        const usedInApp = usedComponentNames.has(componentName);
        
        components.push({
          name: componentName,
          filePath,
          directory,
          relativePath: filePath.replace(/^src\//, ''),
          hasStory,
          hasPropsInterface: hasProps,
          usedInApp,
        });
      }
    } catch (error) {
      console.error(`Error scanning directory ${directory}:`, error);
    }
  }
  
  // Calculate statistics
  const totalComponents = components.length;
  const componentsWithStories = components.filter(c => c.hasStory).length;
  const componentsWithoutStories = totalComponents - componentsWithStories;
  const highPriorityComponents = components.filter(c => c.hasPropsInterface).length;
  const highPriorityWithoutStories = components.filter(
    c => c.hasPropsInterface && !c.hasStory
  ).length;
  const componentsUsedInApp = components.filter(c => c.usedInApp).length;
  const componentsWithoutStoriesButUsedInApp = components.filter(
    c => !c.hasStory && c.usedInApp
  ).length;
  
  return {
    components,
    totalComponents,
    componentsWithStories,
    componentsWithoutStories,
    highPriorityComponents,
    highPriorityWithoutStories,
    componentsUsedInApp,
    componentsWithoutStoriesButUsedInApp,
  };
}

// Group components by directory
function groupComponentsByDirectory(components: Component[]): Record<string, Component[]> {
  const grouped: Record<string, Component[]> = {};
  
  for (const component of components) {
    const dir = path.dirname(component.relativePath);
    
    if (!grouped[dir]) {
      grouped[dir] = [];
    }
    
    grouped[dir].push(component);
  }
  
  return grouped;
}

// Generate Markdown report
function generateMarkdownReport(results: ScanResults): string {
  const {
    components,
    totalComponents,
    componentsWithStories,
    componentsWithoutStories,
    highPriorityComponents,
    highPriorityWithoutStories,
    componentsUsedInApp,
    componentsWithoutStoriesButUsedInApp,
  } = results;
  
  // Calculate percentages
  const storyCoverage = (componentsWithStories / totalComponents) * 100;
  const missingStories = (componentsWithoutStories / totalComponents) * 100;
  const highPriorityPercentage = (highPriorityWithoutStories / highPriorityComponents) * 100;
  const usedInAppPercentage = (componentsUsedInApp / totalComponents) * 100;
  const usedWithoutStoriesPercentage = (componentsWithoutStoriesButUsedInApp / componentsUsedInApp) * 100;
  
  // Get components without stories
  const componentsWithoutStoriesList = components.filter(c => !c.hasStory);
  
  // Get components without stories but used in app
  const usedComponentsWithoutStories = components.filter(c => !c.hasStory && c.usedInApp);
  
  // Group them by directory
  const groupedComponents = groupComponentsByDirectory(componentsWithoutStoriesList);
  
  // Sort high priority components first
  const highPriorityComponentsList = componentsWithoutStoriesList
    .filter(c => c.hasPropsInterface)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Build the Markdown content
  let markdown = `# Components Missing Storybook Stories\n\n`;
  
  markdown += `## Summary\n\n`;
  markdown += `- **Total Components**: ${totalComponents}\n`;
  markdown += `- **Components with Stories**: ${componentsWithStories} (${storyCoverage.toFixed(1)}%)\n`;
  markdown += `- **Components without Stories**: ${componentsWithoutStories} (${missingStories.toFixed(1)}%)\n`;
  markdown += `- **High Priority Components** (with Props interfaces): ${highPriorityComponents}\n`;
  markdown += `- **High Priority Components without Stories**: ${highPriorityWithoutStories} (${highPriorityPercentage.toFixed(1)}% of high priority components)\n`;
  markdown += `- **Components Used in App**: ${componentsUsedInApp} (${usedInAppPercentage.toFixed(1)}% of all components)\n`;
  markdown += `- **Components Without Stories but Used in App**: ${componentsWithoutStoriesButUsedInApp} (${usedWithoutStoriesPercentage.toFixed(1)}% of used components)\n\n`;
  
  markdown += `## High Priority Components Missing Stories\n\n`;
  markdown += `These components have Props interfaces and should be prioritized for story creation:\n\n`;
  
  if (highPriorityComponentsList.length > 0) {
    markdown += `| Component | Path |\n`;
    markdown += `| --------- | ---- |\n`;
    
    for (const component of highPriorityComponentsList) {
      markdown += `| ${component.name} | ${component.relativePath} |\n`;
    }
  } else {
    markdown += `*No high priority components missing stories.*\\n`;
  }
  
  markdown += `\n## Components Used in App but Missing Stories\n\n`;
  markdown += `These components are actively used in the app (./src/app directory) but don't have stories:\n\n`;
  
  if (usedComponentsWithoutStories.length > 0) {
    markdown += `| Component | Path | Has Props Interface |\n`;
    markdown += `| --------- | ---- | ------------------ |\n`;
    
    // Sort by name
    usedComponentsWithoutStories.sort((a, b) => a.name.localeCompare(b.name));
    
    for (const component of usedComponentsWithoutStories) {
      markdown += `| ${component.name} | ${component.relativePath} | ${component.hasPropsInterface ? '✅' : '❌'} |\n`;
    }
  } else {
    markdown += `*All components used in the app have stories. Excellent!*\n`;
  }
  
  markdown += `\n## Components Missing Stories by Directory\n\n`;
  // Sort directories alphabetically
  const sortedDirectories = Object.keys(groupedComponents).sort();
  
  for (const directory of sortedDirectories) {
    const dirComponents = groupedComponents[directory];
    
    markdown += `### ${directory}\n\n`;
    
    if (dirComponents.length > 0) {
      markdown += `| Component | Has Props Interface |\n`;
      markdown += `| --------- | ------------------ |\n`;
      
      // Sort by name
      dirComponents.sort((a, b) => a.name.localeCompare(b.name));
      
      for (const component of dirComponents) {
        markdown += `| ${component.name} | ${component.hasPropsInterface ? '✅' : '❌'} |\n`;
      }
    } else {
      markdown += `*No components missing stories in this directory.*\n`;
    }
    
    markdown += `\n`;
  }
  
  markdown += `## Recommendations\n\n`;
  markdown += `Based on this analysis, we recommend the following actions:\n\n`;
  markdown += `1. **Focus on High-Priority Components**: Begin by creating stories for components with Props interfaces, especially those used in the app.\n`;
  markdown += `2. **Address Active Components**: Prioritize components that are actively used in the app (${componentsWithoutStoriesButUsedInApp} components).\n`;
  markdown += `3. **Establish Guidelines**: Create a team standard that all new components should have corresponding stories.\n`;
  markdown += `4. **Incremental Progress**: Set a goal to increase story coverage by at least 10% per sprint.\n`;
  markdown += `5. **Leverage Existing Patterns**: Use existing stories as templates for similar components.\n\n`;
  
  markdown += `*Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n`;
  
  return markdown;
}

// Display console summary of results
function displayConsoleSummary(results: ScanResults): void {
  const {
    totalComponents,
    componentsWithStories,
    componentsWithoutStories,
    highPriorityComponents,
    highPriorityWithoutStories,
    componentsUsedInApp,
    componentsWithoutStoriesButUsedInApp,
  } = results;
  
  // Calculate percentages
  const storyCoverage = (componentsWithStories / totalComponents) * 100;
  const missingStories = (componentsWithoutStories / totalComponents) * 100;
  const highPriorityPercentage = (highPriorityWithoutStories / highPriorityComponents) * 100;
  const usedInAppPercentage = (componentsUsedInApp / totalComponents) * 100;
  const usedWithoutStoriesPercentage = (componentsWithoutStoriesButUsedInApp / componentsUsedInApp) * 100;
  
  displayHeading('Storybook Coverage Analysis');
  
  console.log(`Total Components: ${COLORS.fg.white}${COLORS.bright}${totalComponents}${COLORS.reset}`);
  console.log(`Components with Stories: ${COLORS.fg.green}${componentsWithStories} (${storyCoverage.toFixed(1)}%)${COLORS.reset}`);
  console.log(`Components without Stories: ${COLORS.fg.yellow}${componentsWithoutStories} (${missingStories.toFixed(1)}%)${COLORS.reset}`);
  console.log(`High Priority Components: ${COLORS.fg.white}${highPriorityComponents}${COLORS.reset}`);
  console.log(`High Priority Components without Stories: ${COLORS.fg.red}${highPriorityWithoutStories} (${highPriorityPercentage.toFixed(1)}% of high priority)${COLORS.reset}`);
  console.log(`Components Used in App: ${COLORS.fg.white}${componentsUsedInApp} (${usedInAppPercentage.toFixed(1)}% of all components)${COLORS.reset}`);
  console.log(`Components Without Stories but Used in App: ${COLORS.fg.magenta}${componentsWithoutStoriesButUsedInApp} (${usedWithoutStoriesPercentage.toFixed(1)}% of used components)${COLORS.reset}`);
  
  console.log('\n');
  console.log(`Report generated at: ${COLORS.fg.cyan}${OUTPUT_FILE}${COLORS.reset}`);
}
// Main function
async function main(): Promise<void> {
  try {
    displayHeading('Scanning Components for Missing Stories');
    console.log('Scanning directories:', COMPONENT_DIRECTORIES.join(', '));
    
    // Scan for components
    const results = await scanComponents();
    
    // Generate Markdown report
    const markdown = generateMarkdownReport(results);
    
    // Create docs directory if it doesn't exist
    const docsDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(docsDir)) {
      await mkdir(docsDir, { recursive: true });
    }
    
    // Write the report to file
    await writeFile(OUTPUT_FILE, markdown);
    
    // Display console summary
    displayConsoleSummary(results);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();

