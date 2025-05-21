#!/usr/bin/env node

/**
 * Table-Based Event Importer for the new directory structure
 * 
 * This script imports processed events data from the insertion directory
 * into the Xata events table.
 * 
 * Usage: node importers/events.js [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getXataClient } from '../../../src/db/xata/xata.js';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory is one level up from importers/
const BASE_DIR = path.join(__dirname, '..');
const INSERTION_DIR = path.join(BASE_DIR, 'insertion/events');
const EVENTS_FILE = path.join(INSERTION_DIR, 'events.json');

// Check if the events file exists
if (!fs.existsSync(EVENTS_FILE)) {
  console.error(`Error: Events file not found at ${EVENTS_FILE}`);
  console.error("Run the event processor first or check the file path.");
  process.exit(1);
}

// Load the events from the insertion directory
const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));

// More precise implementation of fuzzy matching for title comparison
function fuzzyMatch(str1, str2, threshold = 0.8) {
  if (!str1 || !str2) return false;
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Simple case: exact match
  if (s1 === s2) return true;
  
  // For the new title format (without dates), we need to be more precise
  // Split titles into parts (typically "Phenomenon in Location")
  const s1Parts = s1.split(' in ');
  const s2Parts = s2.split(' in ');
  
  // If both have phenomenon and location parts
  if (s1Parts.length > 1 && s2Parts.length > 1) {
    const s1Phenomenon = s1Parts[0].trim();
    const s2Phenomenon = s2Parts[0].trim();
    const s1Location = s1Parts[1].trim();
    const s2Location = s2Parts[1].trim();
    
    // If both phenomenon and location match
    const phenomenonMatch = s1Phenomenon === s2Phenomenon;
    const locationMatch = s1Location === s2Location;
    
    // If both match exactly, it's a duplicate
    if (phenomenonMatch && locationMatch) {
      return true;
    }
    
    // If phenomenon matches and locations are similar
    if (phenomenonMatch && (s1Location.includes(s2Location) || s2Location.includes(s1Location))) {
      return true;
    }
  }
  
  // For old-style "UFO Event YYYY" titles matching with new format titles
  // This helps during transition period
  if (s1.startsWith('ufo event') || s2.startsWith('ufo event')) {
    // Extract year and check for it in the other title
    const yearRegex = /\b(\d{4})\b/;
    const year1Match = s1.match(yearRegex);
    const year2Match = s2.match(yearRegex);
    
    if (year1Match && year2Match && year1Match[1] === year2Match[1]) {
      // Same year, now check for matching location
      if (s1.includes(' in ') && s2.includes(' in ')) {
        const loc1 = s1.split(' in ')[1].trim();
        const loc2 = s2.split(' in ')[1].trim();
        
        if (loc1 === loc2 || loc1.includes(loc2) || loc2.includes(loc1)) {
          return true;
        }
      }
    }
  }
  
  // Otherwise, be very strict to avoid false duplicates
  return false;
}

// Updated regex-based title matching helper for new title format
function regexTitleMatch(eventTitle, dbTitle) {
  if (!eventTitle || !dbTitle) return false;
  
  // Don't consider it a match if using the new title format without dates
  // This prevents old regex from incorrectly matching new format titles
  if (!eventTitle.match(/\b\d{4}\b/) || !dbTitle.match(/\b\d{4}\b/)) {
    return false;
  }
  
  // Extract date information for comparison (old format had "UFO Event YYYY")
  const dateRegex = /UFO Event (\d{3,4}(?:,\s+[\w]+(?:\s+\d+)?)?)/;
  const eventMatch = eventTitle.match(dateRegex);
  const dbMatch = dbTitle.match(dateRegex);
  
  if (eventMatch && dbMatch) {
    // If the dates match, consider it the same event
    return eventMatch[1] === dbMatch[1];
  }
  
  return false;
}

// Advanced duplicate detection logic
async function checkForDuplicates(xata, event) {
  // First, try exact title match
  const exactMatches = await xata.db.events
    .filter({ title: event.title })
    .getMany();
    
  if (exactMatches.length > 0) {
    return { isDuplicate: true, method: "exact_title_match" };
  }
  
  // Next, try fingerprint match if available - most reliable method
  if (event.metadata && event.metadata.fingerprint) {
    try {
      const fingerprintMatches = await xata.db.events
        .filter('contains(metadata, ?)', { fingerprint: event.metadata.fingerprint })
        .getMany();
        
      if (fingerprintMatches.length > 0) {
        return { isDuplicate: true, method: "fingerprint_match" };
      }
    } catch (error) {
      // If the filter expression fails, try a more basic approach
      console.warn("Fingerprint filtering failed, falling back to simpler checks");
    }
  }
  
  // Try precise date and description matching
  if (event.date && event.description) {
    const dateObj = new Date(event.date);
    const year = dateObj.getFullYear();
    
    // Get events from the same year
    const sameYearEvents = await xata.db.events
      .filter({
        date: {
          $ge: new Date(`${year}-01-01`).toISOString(),
          $le: new Date(`${year}-12-31`).toISOString()
        }
      })
      .getMany();
    
    // Compare descriptions to find similar events
    for (const dbEvent of sameYearEvents) {
      if (dbEvent.description) {
        // For identical description starts (first ~50 chars), it's likely the same event
        const eventStart = event.description.substring(0, 50).toLowerCase();
        const dbEventStart = dbEvent.description.substring(0, 50).toLowerCase();
        
        if (eventStart === dbEventStart) {
          return { isDuplicate: true, method: "matching_description" };
        }
      }
    }
  }
  
  // Try location-based matching only when location is specific enough
  if (event.date && event.location && event.location.length > 5 && !/^(US|USA|UK)$/.test(event.location)) {
    const dateObj = new Date(event.date);
    const year = dateObj.getFullYear();
    
    // Search for events in the same year with the same location
    const sameYearLocationEvents = await xata.db.events
      .filter({
        date: {
          $ge: new Date(`${year}-01-01`).toISOString(),
          $le: new Date(`${year}-12-31`).toISOString()
        },
        location: event.location
      })
      .getMany();
      
    if (sameYearLocationEvents.length > 0) {
      // Further validate with simple content check
      for (const dbEvent of sameYearLocationEvents) {
        if (dbEvent.description && event.description) {
          // Compare first 20 chars of description as sanity check
          const dbEventStart = dbEvent.description.substring(0, 20).toLowerCase();
          const eventStart = event.description.substring(0, 20).toLowerCase();
          
          // If descriptions start the same, likely the same event
          if (dbEventStart === eventStart) {
            return { isDuplicate: true, method: "year_location_content_match" };
          }
        }
      }
    }
  }
  
  // Finally, try more sophisticated title matching for events in the same year
  if (event.date) {
    const dateObj = new Date(event.date);
    const year = dateObj.getFullYear();
    
    // Search for events in the same year
    const sameYearEvents = await xata.db.events
      .filter({
        date: {
          $ge: new Date(`${year}-01-01`).toISOString(),
          $le: new Date(`${year}-12-31`).toISOString()
        }
      })
      .getMany();
    
    // Check each event for title similarity
    for (const dbEvent of sameYearEvents) {
      if (fuzzyMatch(event.title, dbEvent.title)) {
        // Do an additional sanity check on the content
        if (dbEvent.description && event.description) {
          const dbWordSet = new Set(dbEvent.description.toLowerCase().split(/\W+/).filter(w => w.length > 3));
          const eventWordSet = new Set(event.description.toLowerCase().split(/\W+/).filter(w => w.length > 3));
          
          // Count matching significant words
          let matchCount = 0;
          for (const word of eventWordSet) {
            if (dbWordSet.has(word)) matchCount++;
          }
          
          // If we have several matching words, likely the same content
          if (matchCount >= 5) {
            return { isDuplicate: true, method: "sophisticated_match" };
          }
        }
      }
      
      // Check for old-style title pattern matches
      if (regexTitleMatch(event.title, dbEvent.title)) {
        return { isDuplicate: true, method: "regex_title_match" };
      }
    }
  }
  
  return { isDuplicate: false, method: "none" };
}

// Function to truncate text to a specific byte limit
function truncateToByteLimit(text, byteLimit = 204800) {
  // If the text is already short enough, return it as is
  if (!text) return '';
  if (Buffer.byteLength(text, 'utf8') <= byteLimit) {
    return text;
  }
  
  // Start with a large chunk that's likely under the limit
  let truncated = text.substring(0, Math.floor(byteLimit * 0.9));
  
  // Keep adding characters until we reach the limit
  let currentSize = Buffer.byteLength(truncated, 'utf8');
  let index = truncated.length;
  
  while (currentSize < byteLimit && index < text.length) {
    truncated += text[index];
    currentSize = Buffer.byteLength(truncated, 'utf8');
    index++;
  }
  
  // If we've gone over the limit, remove characters until we're under
  while (currentSize > byteLimit) {
    truncated = truncated.substring(0, truncated.length - 1);
    currentSize = Buffer.byteLength(truncated, 'utf8');
  }
  
  // Add an ellipsis to indicate truncation
  const ellipsis = '... (truncated)';
  if (Buffer.byteLength(truncated + ellipsis, 'utf8') <= byteLimit) {
    return truncated + ellipsis;
  }
  
  // If adding the ellipsis would exceed the limit, remove more text
  truncated = truncated.substring(0, truncated.length - Buffer.byteLength(ellipsis, 'utf8'));
  return truncated + ellipsis;
}

// Main import function
async function importEventsToXata(options = {}) {
  console.log("Table-Based Event Importer");
  console.log(`Loading events from ${EVENTS_FILE}`);
  
  const xata = getXataClient();
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;
  
  // Default options
  const skipDuplicates = options.skipDuplicates ?? true;
  const forceImport = options.forceImport ?? false;
  
  console.log(`Preparing to import ${events.length} events to Xata`);
  console.log(forceImport ? "FORCE IMPORT MODE: Will import even if duplicates are detected" : 
             (skipDuplicates ? "Normal mode: Will skip duplicates" : "Will check duplicates but import anyway"));
  
  // Tracking for skipped events
  const skippedEvents = [];
  
  for (const event of events) {
    try {
      // Skip events without required data
      if (!event.date) {
        console.log(`Event lacking date, skipping: ${event.title}`);
        skippedEvents.push({
          title: event.title,
          reason: "Missing required date field"
        });
        skippedCount++;
        continue;
      }
      
      // Enhanced duplicate detection
      const { isDuplicate, method } = await checkForDuplicates(xata, event);
      
      if (isDuplicate && skipDuplicates && !forceImport) {
        console.log(`Duplicate event detected: ${event.title} (method: ${method})`);
        skippedEvents.push({
          title: event.title,
          reason: `Duplicate (detected by: ${method})`
        });
        duplicateCount++;
        continue;
      }
      
      // Truncate the description if it's too long
      const truncatedDescription = truncateToByteLimit(event.description);
      
      // Insert new event with all fields
      await xata.db.events.create({
        title: event.title,
        name: event.name || event.title,
        date: event.date ? new Date(event.date) : undefined,
        description: truncatedDescription,
        location: event.location,
        latitude: event.latitude,
        longitude: event.longitude,
        summary: event.summary,
        category: event.category,
        metadata: event.metadata
      });
      
      successCount++;
      if (successCount % 10 === 0) {
        console.log(`Imported ${successCount} events...`);
      }
    } catch (error) {
      console.error(`Error importing event: ${event.title}`, error);
      errorCount++;
    }
  }
  
  console.log(`
Import complete.
Successfully imported: ${successCount} events
Duplicates skipped:    ${duplicateCount} events
Other skipped events:  ${skippedCount} events
Errors encountered:    ${errorCount} events
`);

  // Write report of skipped events
  fs.writeFileSync(
    path.join(BASE_DIR, 'skipped-events-report.json'),
    JSON.stringify(skippedEvents, null, 2)
  );
  
  console.log("Report of skipped events written to: skipped-events-report.json");
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceImport = args.includes('--force') || args.includes('-f');
const skipDuplicates = !args.includes('--no-skip-duplicates');

// Run the import
importEventsToXata({ 
  forceImport,
  skipDuplicates
})
  .then(() => console.log('Done'))
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });