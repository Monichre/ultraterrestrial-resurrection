// Test script to check the new title generation logic
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load a few sample events from the JSON file
const eventsFile = path.join(__dirname, './output/events.json');
const allEvents = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));

// Take 20 sample events at different positions
const sampleEvents = [
  allEvents[0],                           // First event
  allEvents[1],                           // Second event
  allEvents[Math.floor(allEvents.length * 0.1)],  // 10% through the list
  allEvents[Math.floor(allEvents.length * 0.25)], // 25% through the list
  allEvents[Math.floor(allEvents.length * 0.5)],  // 50% through the list
  allEvents[Math.floor(allEvents.length * 0.75)], // 75% through the list
  allEvents[allEvents.length - 2],        // Second to last event
  allEvents[allEvents.length - 1]         // Last event
];

// Generate a more descriptive title based on event details
function generateDescriptiveTitle(dateText, description, location) {
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
  
  // Format the date for the title
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
  
  // Define more precise patterns for event types, with priorities (higher number = higher priority)
  const phenomenaPatterns = [
    // Very specific descriptors first
    { pattern: /cigar.?shaped/i, label: "Cigar-shaped Object", priority: 10 },
    { pattern: /triangular|triangle.?shaped/i, label: "Triangular Craft", priority: 10 },
    { pattern: /disc.?shaped|disk.?like/i, label: "Disc-shaped Object", priority: 10 },
    { pattern: /dome.?shaped/i, label: "Domed Object", priority: 10 },
    { pattern: /cylinder|cylindrical/i, label: "Cylindrical Object", priority: 10 },
    { pattern: /sphere|spherical/i, label: "Spherical Object", priority: 10 },
    { pattern: /crash.?landing|crash.?recovery|crashed/i, label: "Crash Retrieval", priority: 9 },
    { pattern: /landing|landed/i, label: "Landing", priority: 9 },
    { pattern: /abduction|abducted|taken.aboard/i, label: "Abduction", priority: 9 },
    { pattern: /close.encounter/i, label: "Close Encounter", priority: 9 },
    { pattern: /congress|hearing|testimony|committee/i, label: "Government Hearing", priority: 8 },
    { pattern: /experiment|testing|test/i, label: "Experiment", priority: 8 },
    { pattern: /formation|fleet|multiple/i, label: "Formation Sighting", priority: 7 },
    // Less specific descriptors
    { pattern: /document|declassified|report|paper|article|publication|publishes|writes|book|journal|thesis|author|publish/i, label: "Document", priority: 6 },
    { pattern: /flying (saucer|disc|disk|object)/i, label: "Flying Object", priority: 6 },
    { pattern: /aerial (craft|vessel|ship)/i, label: "Aerial Craft", priority: 6 },
    { pattern: /strange|mysterious|unusual|unknown/i, label: "Mysterious Object", priority: 5 },
    { pattern: /radar.detection|tracked.on.radar/i, label: "Radar Detection", priority: 5 },
    { pattern: /photograph|photo|image|picture/i, label: "Photographed Object", priority: 5 },
    { pattern: /military|navy|air.force|army|base|intelligence/i, label: "Military Sighting", priority: 4 },
    { pattern: /pilot|aircraft|plane|jet|airline|aviation/i, label: "Aerial Sighting", priority: 4 },
    { pattern: /ufo|unidentified.flying/i, label: "UFO", priority: 3 },
    { pattern: /uap|unidentified.aerial/i, label: "UAP", priority: 3 },
    { pattern: /light|orb|glow|luminous/i, label: "Luminous Phenomenon", priority: 2 },
    { pattern: /encounter|sighting/i, label: "Sighting", priority: 1 },
    { pattern: /observation|witnessed|reported/i, label: "Observation", priority: 1 }
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
  
  // Check for known place names directly in the description
  const placeNameRegex = /\b(in|at|near|over)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)?)\b/g;
  let placeNameMatches = [];
  let match;
  
  // Find all place name mentions
  while ((match = placeNameRegex.exec(description)) !== null) {
    if (match[2] && match[2].length > 2) {
      // Filter out common non-place words
      const nonPlaceWords = /^(The|A|An|In|At|On|By|UFO|UAP|Capt|Col|Lt|Dr|Mr|Mrs|Ms|Prof|January|February|March|April|May|June|July|August|September|October|November|December)$/;
      if (!nonPlaceWords.test(match[2])) {
        placeNameMatches.push(match[2]);
      }
    }
  }
  
  // Also check for country names
  const countryRegex = /\b(US|USA|America|United States|Russia|USSR|Soviet|China|France|Britain|England|UK|Germany|Japan|Canada|Australia|Mexico)\b/i;
  const countryMatch = description.match(countryRegex);
  if (countryMatch) {
    placeNameMatches.push(countryMatch[1]);
  }
  
  // Use the first valid place name found
  let locationText = "";
  if (placeNameMatches.length > 0) {
    // Prefer location names that aren't just one word
    const multiWordLocations = placeNameMatches.filter(loc => loc.includes(' ') || loc.includes(','));
    
    if (multiWordLocations.length > 0) {
      locationText = multiWordLocations[0];
    } else {
      locationText = placeNameMatches[0];
    }
    
    // Clean up the location text
    locationText = locationText.replace(/^(the|a|an)\s+/i, '').replace(/\s*[.,:;]$/, '');
  } else if (location) {
    // Try to extract from location field as fallback
    const cleanedLocation = location.replace(/^(the|a|an|in|at|near|over|above)\s+/i, '');
    
    // If it contains common words/conjunctions, it's probably not a good location
    if (!/\b(and|with|from|to|by|for|but|or|if|then|else|while)\b/.test(cleanedLocation)) {
      // Take just the first part up to a reasonable length
      const parts = cleanedLocation.split(',');
      locationText = parts[0].trim();
      
      // Limit length
      locationText = locationText.substring(0, 30);
    }
  }
  
  // Special case: Don't include location for documents unless we have a good one
  const isDocument = (phenomenon === "Document" || phenomenon === "Government Hearing");
  if (isDocument && locationText.length < 5) {
    locationText = "";
  }
  
  // Create title pattern with better formatting
  // Format: [Date] [Phenomenon] [Location]
  let title = dateForTitle;
  if (phenomenon) title += `: ${phenomenon}`;
  if (locationText) title += ` in ${locationText}`;
  
  return title;
}

// Test the title generation on sample events
console.log("Original vs New Titles:");
console.log("======================");

for (const event of sampleEvents) {
  const newTitle = generateDescriptiveTitle(
    event.metadata.dateText, 
    event.description, 
    event.location
  );
  
  console.log(`\nOriginal: "${event.title}"`);
  console.log(`New:      "${newTitle}"`);
  console.log(`Year: ${event.metadata.dateText}`);
  console.log(`Location: ${event.location ? event.location.substring(0, 60) + "..." : "None"}`);
  console.log(`Description start: ${event.description.substring(0, 100)}...`);
}

// Generate a report of title quality
const allNewTitles = allEvents.map(event => {
  return generateDescriptiveTitle(
    event.metadata.dateText,
    event.description,
    event.location
  );
});

// Count title length statistics
const titleLengths = allNewTitles.map(title => title.length);
const avgLength = titleLengths.reduce((sum, len) => sum + len, 0) / titleLengths.length;
const maxLength = Math.max(...titleLengths);
const minLength = Math.min(...titleLengths);

// Count titles with/without location
const titlesWithLocation = allNewTitles.filter(t => t.includes(" in ")).length;
const percentWithLocation = (titlesWithLocation / allNewTitles.length * 100).toFixed(2);

// Count most common phenomenon types
const phenomenonCounts = {};
allNewTitles.forEach(title => {
  const parts = title.split(" in ")[0].split(" ");
  // Remove the year
  parts.shift();
  const phenomenon = parts.join(" ");
  phenomenonCounts[phenomenon] = (phenomenonCounts[phenomenon] || 0) + 1;
});

// Sort by count descending
const sortedPhenomena = Object.entries(phenomenonCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10); // Top 10

console.log("\n\nTitle Statistics:");
console.log("================");
console.log(`Total events: ${allEvents.length}`);
console.log(`Average title length: ${avgLength.toFixed(2)} characters`);
console.log(`Shortest title: ${minLength} characters`);
console.log(`Longest title: ${maxLength} characters`);
console.log(`Events with location in title: ${titlesWithLocation} (${percentWithLocation}%)`);

console.log("\nTop 10 Phenomenon Types:");
sortedPhenomena.forEach(([phenomenon, count]) => {
  console.log(`- ${phenomenon}: ${count} (${(count/allEvents.length*100).toFixed(2)}%)`);
});

// Write the results to a file for reference
const outputPath = path.join(__dirname, 'title-generation-test-results.txt');
fs.writeFileSync(outputPath, `Title Generation Test Results
=============================

Sample Event Comparisons:
${sampleEvents.map(event => {
  const newTitle = generateDescriptiveTitle(
    event.metadata.dateText, 
    event.description, 
    event.location
  );
  return `
Original: "${event.title}"
New:      "${newTitle}"
Year: ${event.metadata.dateText}
Location: ${event.location ? event.location.substring(0, 60) + "..." : "None"}
Description start: ${event.description.substring(0, 100)}...
`;
}).join('\n')}

Title Statistics:
================
Total events: ${allEvents.length}
Average title length: ${avgLength.toFixed(2)} characters
Shortest title: ${minLength} characters
Longest title: ${maxLength} characters
Events with location in title: ${titlesWithLocation} (${percentWithLocation}%)

Top 10 Phenomenon Types:
${sortedPhenomena.map(([phenomenon, count]) => `- ${phenomenon}: ${count} (${(count/allEvents.length*100).toFixed(2)}%)`).join('\n')}
`);

console.log(`\nDetailed results written to: ${outputPath}`);