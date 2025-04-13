
import { getXataClient } from '../../src/db/xata/xata';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const events = require('./output/events.json');

// More precise implementation of fuzzy matching for title comparison
function fuzzyMatch(str1, str2, threshold = 0.8) {
  if (!str1 || !str2) return false;
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Simple case: exact match
  if (s1 === s2) return true;
  
  // Extract years from both titles
  const yearPattern = /\b(\d{3,4})\b/;
  const year1 = s1.match(yearPattern)?.[1];
  const year2 = s2.match(yearPattern)?.[1];
  
  // If years are different, not a match
  if (year1 && year2 && year1 !== year2) {
    return false;
  }
  
  // Check for significant word overlap (more than just "UFO" or "Event")
  const words1 = s1.split(/\s+/).filter(w => w.length > 3 && !['incident', 'event', 'object', 'report', 'ufo'].includes(w));
  const words2 = s2.split(/\s+/).filter(w => w.length > 3 && !['incident', 'event', 'object', 'report', 'ufo'].includes(w));
  
  // Count matching significant words
  const matchingWords = words1.filter(w => words2.includes(w)).length;
  
  // If we have at least 3 matching significant words, consider it a match
  if (matchingWords >= 3) {
    return true;
  }
  
  // Otherwise, not a match
  return false;
}

// Improved title/content matching helper
function contentMatch(event1, event2) {
  if (!event1 || !event2) return false;
  
  // Extract and compare years
  const year1 = event1.date ? new Date(event1.date).getFullYear() : null;
  const year2 = event2.date ? new Date(event2.date).getFullYear() : null;
  
  // If years are different, not a match
  if (year1 && year2 && year1 !== year2) {
    return false;
  }
  
  // Compare locations if both exist
  if (event1.location && event2.location) {
    const loc1 = event1.location.toLowerCase().trim();
    const loc2 = event2.location.toLowerCase().trim();
    
    // If locations are completely different, likely not a match
    if (loc1 !== loc2 && !loc1.includes(loc2) && !loc2.includes(loc1)) {
      // Check if at least the country/state part matches
      const loc1Parts = loc1.split(',').map(p => p.trim());
      const loc2Parts = loc2.split(',').map(p => p.trim());
      
      // If even the country/state doesn't match, not a duplicate
      if (loc1Parts.length > 1 && loc2Parts.length > 1 && 
          loc1Parts[loc1Parts.length-1] !== loc2Parts[loc2Parts.length-1]) {
        return false;
      }
    }
  }
  
  // Compare description content (first 100 chars)
  if (event1.description && event2.description) {
    const desc1 = event1.description.toLowerCase().substring(0, 100);
    const desc2 = event2.description.toLowerCase().substring(0, 100);
    
    // If descriptions are very similar, likely a match
    if (desc1 === desc2 || 
        (desc1.includes(desc2) && desc1.length > desc2.length * 0.9) || 
        (desc2.includes(desc1) && desc2.length > desc1.length * 0.9)) {
      return true;
    }
  }
  
  return false;
}

async function checkForDuplicates(xata, event) {
  // First, try exact title match (strict)
  const exactMatches = await xata.db.events
    .filter({ title: event.title })
    .getMany();
    
  if (exactMatches.length > 0) {
    return { isDuplicate: true, method: "exact_title_match" };
  }
  
  // Next, try matching by year + location (if both are present and specific)
  if (event.date && event.location && event.location.length > 5) {
    const dateObj = new Date(event.date);
    const year = dateObj.getFullYear();
    
    // Search for events in the same year with the same location
    const sameYearLocationEvents = await xata.db.events
      .filter({
        date: {
          $ge: new Date(`${year}-01-01`).toISOString(),
          $le: new Date(`${year}-12-31`).toISOString()
        }
      })
      .getMany();
      
    // Check for location match within same year 
    for (const dbEvent of sameYearLocationEvents) {
      if (dbEvent.location && 
          (dbEvent.location === event.location || 
           dbEvent.location.includes(event.location) || 
           event.location.includes(dbEvent.location))) {
        
        // Further validate with content match to avoid false positives
        if (contentMatch(event, dbEvent)) {
          return { isDuplicate: true, method: "year_location_content_match" };
        }
      }
    }
  }
  
  // For documents/reports with exact same date - might be duplicates
  if (event.date && event.title.includes('Report')) {
    const exactDateEvents = await xata.db.events
      .filter({ date: event.date })
      .getMany();
      
    for (const dbEvent of exactDateEvents) {
      if (dbEvent.title.includes('Report') && contentMatch(event, dbEvent)) {
        return { isDuplicate: true, method: "same_date_report_match" };
      }
    }
  }
  
  // If we got this far, it's probably not a duplicate
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

async function importEventsToXata(options = {}) {
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
        date: event.date,
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
  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(
    path.join(__dirname, 'skipped-events-report.json'),
    JSON.stringify(skippedEvents, null, 2)
  );
  
  console.log("Report of skipped events written to: skipped-events-report.json");
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceImport = args.includes('--force') || args.includes('-f');
const skipDuplicates = !args.includes('--no-skip-duplicates');

// Export the function to make it available for direct import
export default importEventsToXata;

// Start import if called directly
if (require.main === module) {
  importEventsToXata({ 
    forceImport,
    skipDuplicates
  })
    .then(() => console.log('Done'))
    .catch(err => console.error('Import failed:', err));
}
