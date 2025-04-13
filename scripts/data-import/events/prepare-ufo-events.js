#!/usr/bin/env node

/**
 * This script processes the UFO Intelligence markdown files and prepares them for 
 * insertion into the Xata events table.
 * 
 * Usage: node prepare-ufo-events.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const DOCS_DIR = path.join(__dirname, '../../docs/ufo-intelligence-docs');
const OUTPUT_DIR = path.join(__dirname, '../../scripts/data-import/output');
const EVENT_FILE_PATTERN = /UFOsandIntelligence-\d+\.md/;

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse date from text (e.g., "1945, Summer" or "1945, June 1")
function parseDateFromText(dateText) {
  try {
    // Handle cases like "1945, Summer"
    if (dateText.includes('Summer')) {
      return new Date(`June 21, ${dateText.split(',')[0]}`).toISOString();
    } else if (dateText.includes('Spring')) {
      return new Date(`March 21, ${dateText.split(',')[0]}`).toISOString();
    } else if (dateText.includes('Fall') || dateText.includes('Autumn')) {
      return new Date(`September 21, ${dateText.split(',')[0]}`).toISOString();
    } else if (dateText.includes('Winter')) {
      return new Date(`December 21, ${dateText.split(',')[0]}`).toISOString();
    }
    
    // Try to parse specific dates like "1945, June 1"
    const match = dateText.match(/(\d{3,4})(?:,\s+)?([A-Za-z]+)?(?:\s+)?(\d+)?/);
    if (match) {
      const [_, year, month, day] = match;
      if (month && day) {
        return new Date(`${month} ${day}, ${year}`).toISOString();
      } else if (month) {
        return new Date(`${month} 1, ${year}`).toISOString();
      } else {
        return new Date(`January 1, ${year}`).toISOString();
      }
    }
    
    // Default to first day of the year if only year is specified
    if (/^\d{3,4}$/.test(dateText.trim())) {
      return new Date(`January 1, ${dateText.trim()}`).toISOString();
    }
    
    return null;
  } catch (error) {
    console.error(`Error parsing date: ${dateText}`, error);
    return null;
  }
}

// Extract location from event description
function extractLocation(description) {
  const locationPatterns = [
    /in ([A-Za-z\s]+), ([A-Za-z\s]+)/, // City, State/Country
    /over ([A-Za-z\s]+)/, // Over [Location]
    /near ([A-Za-z\s]+)/, // Near [Location]
    /at ([A-Za-z\s]+)/, // At [Location]
  ];
  
  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Extract event from a markdown section
function extractEvent(content) {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) return null;
  
  const titleLine = lines[0];
  const dateMatch = titleLine.match(/^[#\s-]*([\d]{3,4}(?:,\s+[\w]+(?:\s+\d+)?)?)/);
  
  if (!dateMatch) return null;
  
  const dateText = dateMatch[1];
  const description = lines.slice(1).join('\n').trim();
  
  return {
    title: `UFO Event ${dateText}`,
    date: parseDateFromText(dateText),
    description,
    location: extractLocation(description),
    category: ['historical', 'ufo-sighting'],
    metadata: {
      source: 'UFOs and Intelligence: A Timeline',
      dateText,
      originalFormat: 'markdown'
    }
  };
}

// Process a markdown file and extract events
async function processMarkdownFile(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    
    // Find the beginning of the actual content (skip headers)
    const contentStartIndex = content.indexOf('## ');
    if (contentStartIndex === -1) return [];
    
    const actualContent = content.substring(contentStartIndex);
    
    // Split by markdown headers (## YYYY)
    const eventSections = actualContent.split(/\n## /).filter(Boolean);
    
    // Process first section differently since it includes the title
    const firstSectionLines = eventSections[0].split('\n');
    const titleLine = firstSectionLines[0];
    
    // Check if the first section is actually the document title
    if (!titleLine.match(/^\d{3,4}/)) {
      // This is the document title section, not an event
      eventSections.shift();
    }
    
    // Extract events from each section
    return eventSections
      .map(section => {
        // Prepend ## back to each section except the first one
        const sectionContent = section.startsWith('##') ? section : `## ${section}`;
        return extractEvent(sectionContent);
      })
      .filter(Boolean); // Remove null entries
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

// Process all markdown files
async function processAllFiles() {
  try {
    // Get all markdown files
    const files = fs.readdirSync(DOCS_DIR)
      .filter(file => EVENT_FILE_PATTERN.test(file))
      .map(file => path.join(DOCS_DIR, file));
    
    console.log(`Found ${files.length} files to process`);
    
    // Process each file
    const allEventsPromises = files.map(processMarkdownFile);
    const allEventsByFile = await Promise.all(allEventsPromises);
    
    // Flatten events from all files
    const allEvents = allEventsByFile.flat();
    
    console.log(`Extracted ${allEvents.length} events`);
    
    // Write output files
    await writeFileAsync(
      path.join(OUTPUT_DIR, 'events.json'),
      JSON.stringify(allEvents, null, 2),
      'utf8'
    );
    
    // Also create a CSV for potential spreadsheet import
    const csvHeader = 'title,date,location,category,description\n';
    const csvRows = allEvents.map(event => {
      const title = event.title.replace(/,/g, '');
      const date = event.date || '';
      const location = event.location ? event.location.replace(/,/g, '') : '';
      const category = event.category.join('|');
      const description = event.description.replace(/,/g, ';').replace(/\n/g, ' ');
      
      return `"${title}","${date}","${location}","${category}","${description}"`;
    });
    
    await writeFileAsync(
      path.join(OUTPUT_DIR, 'events.csv'),
      csvHeader + csvRows.join('\n'),
      'utf8'
    );
    
    // Create an import script for Xata
    const xataImportScript = `
const { getXataClient } = require('../../src/db/xata/xata');
const events = require('./output/events.json');

async function importEventsToXata() {
  const xata = getXataClient();
  let successCount = 0;
  let errorCount = 0;
  
  console.log(\`Preparing to import \${events.length} events to Xata\`);
  
  for (const event of events) {
    try {
      // Check if event already exists to avoid duplicates
      const existingEvents = await xata.db.events
        .filter({ title: event.title })
        .getMany();
        
      if (existingEvents.length > 0) {
        console.log(\`Event already exists: \${event.title}\`);
        continue;
      }
      
      // Insert new event
      await xata.db.events.create({
        title: event.title,
        date: event.date,
        description: event.description,
        location: event.location,
        category: event.category,
        metadata: event.metadata
      });
      
      successCount++;
      if (successCount % 10 === 0) {
        console.log(\`Imported \${successCount} events...\`);
      }
    } catch (error) {
      console.error(\`Error importing event: \${event.title}\`, error);
      errorCount++;
    }
  }
  
  console.log(\`Import complete. Successfully imported \${successCount} events. \${errorCount} errors.\`);
}

importEventsToXata()
  .then(() => console.log('Done'))
  .catch(err => console.error('Import failed:', err));
`;
    
    await writeFileAsync(
      path.join(__dirname, 'import-events-to-xata.js'),
      xataImportScript,
      'utf8'
    );
    
    console.log('Processing complete!');
    console.log(`Events written to: ${path.join(OUTPUT_DIR, 'events.json')}`);
    console.log(`CSV written to: ${path.join(OUTPUT_DIR, 'events.csv')}`);
    console.log(`Import script created: ${path.join(__dirname, 'import-events-to-xata.js')}`);
    console.log('\nTo import the events to Xata, run:');
    console.log('  node scripts/data-import/import-events-to-xata.js');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script
processAllFiles();
