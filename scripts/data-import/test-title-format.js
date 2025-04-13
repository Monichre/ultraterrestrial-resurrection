#!/usr/bin/env node

/**
 * Test script for the updated title generation that omits dates
 */

// Mock functions for testing
function extractKeywords(description) {
  return ['ufo', 'sighting'];
}

function extractLocation(description) {
  // Basic location extraction for testing
  const match = description.match(/\b(in|at|near|over)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)?)\b/);
  return match ? match[2] : null;
}

function determineCategories(description) {
  return ['historical'];
}

function generateSummary(description) {
  return description.split('.')[0];
}

// Imported from prepare-ufo-events-enhanced.js (simplified for test)
function generateDescriptiveTitle(dateText, description, location) {
  // First check if the event description already has a clear year reference at the beginning
  const firstYearMatch = description.match(/^(\d{3,4})(?:,\s+|\s+)(?:[A-Za-z]+(?:\s+\d{1,2})?)?/);
  let yearFromDesc = null;
  
  if (firstYearMatch) {
    yearFromDesc = firstYearMatch[1];
  }
  
  // Extract date components - handle more formats
  let year, month, day;
  
  // Try to parse full date if available - "1947, July 12"
  const fullDateMatch = dateText.match(/(\d{3,4})(?:,\s*|\s+)(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+(\d{1,2}))?/i);
  
  if (fullDateMatch) {
    year = fullDateMatch[1];
    month = fullDateMatch[2];
    day = fullDateMatch[3];
  } else {
    // Just extract year as fallback
    const yearMatch = dateText.match(/\b(\d{3,4})\b/);
    year = yearMatch ? yearMatch[1] : dateText;
  }
  
  // If we found a year in the description and it matches the dateText year, use that
  // This helps ensure consistent years between title and content
  if (yearFromDesc && year && yearFromDesc === year) {
    // Use the year from the description since it's likely more accurate
    year = yearFromDesc;
  }
  
  // Format the date for the title (we'll keep this for reference, but don't use it in final title)
  let dateForTitle = year;
  if (month) {
    // Format just month and year
    const monthAbbrev = month.substring(0, 3);
    dateForTitle = `${monthAbbrev} ${year}`;
    
    // Add day if available
    if (day) {
      dateForTitle = `${monthAbbrev} ${day}, ${year}`;
    }
  }
  
  // Define patterns for event types
  const phenomenaPatterns = [
    // Very specific descriptors first
    { pattern: /cigar.?shaped/i, label: "Cigar-shaped Object", priority: 10 },
    { pattern: /triangular|triangle.?shaped/i, label: "Triangular Craft", priority: 10 },
    { pattern: /disc.?shaped|disk.?like/i, label: "Disc-shaped Object", priority: 10 },
    { pattern: /crash.?landing|crash.?recovery|crashed/i, label: "Crash Retrieval", priority: 9 },
    { pattern: /landing|landed/i, label: "Landing", priority: 9 },
    { pattern: /abduction|abducted|taken.aboard/i, label: "Abduction", priority: 9 },
    { pattern: /close.encounter/i, label: "Close Encounter", priority: 9 },
    { pattern: /document|publication|publishes|writes|book|journal/i, label: "Document", priority: 6 },
    { pattern: /flying (saucer|disc|disk|object)/i, label: "Flying Object", priority: 6 },
    { pattern: /objects flying/i, label: "Flying Object", priority: 6 },
    { pattern: /aerial (craft|vessel|ship|battle)/i, label: "Aerial Craft", priority: 6 },
    { pattern: /radar|tracked/i, label: "Radar Detection", priority: 5 },
    { pattern: /ufo|unidentified.flying/i, label: "UFO", priority: 3 },
    { pattern: /uap|unidentified.aerial/i, label: "UAP", priority: 3 },
    { pattern: /light|orb|glow|luminous/i, label: "Luminous Phenomenon", priority: 2 },
    { pattern: /encounter|sighting/i, label: "Sighting", priority: 1 }
  ];
  
  // Find the highest priority matching pattern
  let phenomenon = "UFO Incident";
  let highestPriority = 0;
  
  for (const { pattern, label, priority } of phenomenaPatterns) {
    if (pattern.test(description) && priority > highestPriority) {
      phenomenon = label;
      highestPriority = priority;
    }
  }
  
  // Simple location extraction for the test
  let locationText = location;
  if (location && location.includes(',')) {
    locationText = location.split(',')[0].trim();
  }
  
  // Create title without date
  // Format: [Phenomenon] [Location]
  let title = phenomenon;
  if (locationText) title += ` in ${locationText}`;
  
  return title;
}

function testTitleGeneration() {
  const testCases = [
    {
      dateText: '1947, July 8',
      description: '1947, Kenneth Arnold, a businessman and pilot from Idaho, reports seeing nine objects flying in formation near Mount Rainier, Washington.',
      location: 'Mount Rainier, Washington',
      expectedOriginal: 'Jul 8, 1947: Flying Object in Mount Rainier',
      expectedNew: 'Flying Object in Mount Rainier'
    },
    {
      dateText: '1947',
      description: 'July 1947, reports emerge of a crashed flying disc recovered near Roswell, New Mexico.',
      location: 'Roswell, New Mexico',
      expectedOriginal: '1947: Crash Retrieval in Roswell',
      expectedNew: 'Crash Retrieval in Roswell'
    },
    {
      dateText: '1952, July 19-20',
      description: '1952, Multiple UFOs are tracked on radar over Washington, D.C., leading to fighter jets being scrambled.',
      location: 'Washington, D.C.',
      expectedOriginal: 'Jul 19, 1952: Radar Detection in Washington',
      expectedNew: 'Radar Detection in Washington'
    },
    {
      dateText: '1976',
      description: 'American science historian David Jacobs publishes "The UFO Controversy in America", tracing the history of UFO phenomena and their cultural impact.',
      location: null,
      expectedOriginal: '1976: Document',
      expectedNew: 'Document'
    }
  ];
  
  console.log('Testing title generation with dates omitted:');
  console.log('===========================================\n');
  
  for (const testCase of testCases) {
    const { dateText, description, location, expectedOriginal, expectedNew } = testCase;
    
    console.log(`Input: ${dateText} - ${description.substring(0, 60)}...`);
    
    const title = generateDescriptiveTitle(dateText, description, location);
    
    console.log(`Generated: "${title}"`);
    console.log(`Expected:  "${expectedNew}"`);
    console.log(`Result:    ${title === expectedNew ? '✅ PASS' : '❌ FAIL'}`);
    
    // Verify that the title doesn't contain the year
    const hasYear = /\b\d{4}\b/.test(title);
    console.log(`No year in title: ${!hasYear ? '✅ PASS' : '❌ FAIL'}`);
    
    // Verify that the title doesn't contain month names
    const hasMonth = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i.test(title);
    console.log(`No month in title: ${!hasMonth ? '✅ PASS' : '❌ FAIL'}\n`);
  }
}

// Create test event objects to see how they would be processed in the main script
function createEventObject(dateText, description) {
  const keywords = extractKeywords(description);
  const location = extractLocation(description);
  const categories = determineCategories(description);
  const summary = generateSummary(description);
  
  // Generate better title and name
  const descriptiveTitle = generateDescriptiveTitle(dateText, description, location);
  
  return {
    title: descriptiveTitle,
    name: descriptiveTitle,
    date: dateText,
    description,
    location,
    summary,
    category: categories,
    metadata: {
      source: 'Test',
      dateText,
      keywords
    }
  };
}

function showSampleEventObjects() {
  console.log('\nSample Event Objects:');
  console.log('====================\n');
  
  const events = [
    createEventObject('1947, July 8', '1947, Kenneth Arnold, a businessman and pilot from Idaho, reports seeing nine objects flying in formation near Mount Rainier, Washington.'),
    createEventObject('1947', 'July 1947, reports emerge of a crashed flying disc recovered near Roswell, New Mexico.'),
    createEventObject('1952, July 19-20', '1952, Multiple UFOs are tracked on radar over Washington, D.C., leading to fighter jets being scrambled.')
  ];
  
  events.forEach((event, index) => {
    console.log(`Event ${index + 1}:`);
    console.log(`- Title: ${event.title}`);
    console.log(`- Name: ${event.name}`);
    console.log(`- Date: ${event.date}`);
    console.log(`- Location: ${event.location}`);
    console.log(`- Summary: ${event.summary}`);
    console.log();
  });
}

// Run tests
testTitleGeneration();
showSampleEventObjects();