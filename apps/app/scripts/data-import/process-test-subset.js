#!/usr/bin/env node

/**
 * This script processes a subset of UFO Intelligence markdown files for testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../../docs/ufo-intelligence-docs');
const OUTPUT_DIR = path.join(__dirname, 'output');
const EVENT_FILE_PATTERN = /UFOsandIntelligence-1\.md/; // Just process the first file for testing

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Extract event from a markdown section
function extractEvent(content) {
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) return null;
  
  const titleLine = lines[0];
  const dateMatch = titleLine.match(/^[#\s-]*([\d]{3,4}(?:,\s+[\w\s\-]+(?:\s+\d+)?)?)/);
  
  if (!dateMatch) return null;
  
  const dateText = dateMatch[1];
  const description = lines.slice(1).join('\n').trim();
  
  return {
    title: `UFO Event ${dateText}`,
    date: new Date(`January 1, ${dateText.split(',')[0]}`).toISOString(),
    description,
    location: null,
    category: ['historical'],
    metadata: {
      source: 'UFOs and Intelligence: A Timeline',
      dateText,
      originalFormat: 'markdown'
    }
  };
}

// Process a markdown file and extract events
function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
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
    
    // Extract events from each section - limit to first 10 for testing
    return eventSections
      .slice(0, 10)
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
function processAllFiles() {
  try {
    // Get just the first markdown file
    const files = fs.readdirSync(DOCS_DIR)
      .filter(file => EVENT_FILE_PATTERN.test(file))
      .map(file => path.join(DOCS_DIR, file));
    
    console.log(`Found ${files.length} files to process`);
    
    let allEvents = [];
    for (const file of files) {
      const events = processMarkdownFile(file);
      allEvents = [...allEvents, ...events];
    }
    
    console.log(`Extracted ${allEvents.length} events`);
    
    // Write output files
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'events.json'),
      JSON.stringify(allEvents, null, 2),
      'utf8'
    );
    
    console.log('Processing complete!');
    console.log(`Events written to: ${path.join(OUTPUT_DIR, 'events.json')}`);
    
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Run the script
processAllFiles();