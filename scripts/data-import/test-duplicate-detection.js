#!/usr/bin/env node

/**
 * Test script for verifying the improved duplicate detection logic
 * with the new title format (without dates)
 */

// Import the relevant functions from import-events-to-xata.js for testing
// Since we can't directly import ES modules in this context, we'll copy the functions

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

// Function to test different title formats
function testDuplicateDetection() {
  console.log('Testing improved duplicate detection with new title format...\n');

  const testCases = [
    // Test case 1: New format titles with identical phenomenon and location
    {
      title1: 'Flying Object in Mount Rainier',
      title2: 'Flying Object in Mount Rainier',
      expectDuplicate: true,
      category: 'Exact match with new format'
    },
    
    // Test case 2: New format titles with same phenomenon but slightly different location
    {
      title1: 'Flying Object in Mount Rainier',
      title2: 'Flying Object in Mount Rainier, Washington',
      expectDuplicate: true,
      category: 'Similar location with new format'
    },
    
    // Test case 3: New format titles with different phenomenon but same location
    {
      title1: 'Flying Object in Roswell',
      title2: 'Crash Retrieval in Roswell',
      expectDuplicate: false,
      category: 'Different phenomenon with new format'
    },
    
    // Test case 4: Old format title vs. new format title (should not match based on date)
    {
      title1: 'UFO Event 1947, July 8',
      title2: 'Flying Object in Mount Rainier',
      expectDuplicate: false,
      category: 'Old vs new format without year crossover'
    },
    
    // Test case 5: Old format title vs. new format title with matching year and location
    {
      title1: 'UFO Event 1947',
      title2: 'Crash Retrieval in Roswell',
      expectDuplicate: false,
      category: 'Old vs new format without explicit location match'
    },
    
    // Test case 6: Different locations with same phenomenon
    {
      title1: 'UFO in Washington',
      title2: 'UFO in New York',
      expectDuplicate: false,
      category: 'Different locations with same phenomenon'
    },
    
    // Test case 7: Old format titles with same date (should match)
    {
      title1: 'UFO Event 1947, July 8',
      title2: 'UFO Event 1947, July 8',
      expectDuplicate: true,
      category: 'Old format with identical dates'
    },
    
    // Test case 8: Old format with nearly identical date formats
    {
      title1: 'UFO Event 1952, July',
      title2: 'UFO Event 1952, July 2',
      expectDuplicate: false, // With our improved logic, these shouldn't be duplicates
      category: 'Similar dates in old format'
    }
  ];
  
  let passCount = 0;
  
  for (const { title1, title2, expectDuplicate, category } of testCases) {
    console.log(`Category: ${category}`);
    console.log(`Title 1: "${title1}"`);
    console.log(`Title 2: "${title2}"`);
    
    const isFuzzyMatch = fuzzyMatch(title1, title2);
    const isRegexMatch = regexTitleMatch(title1, title2);
    const isDuplicate = isFuzzyMatch || isRegexMatch;
    
    console.log(`Result: ${isDuplicate ? 'DUPLICATE' : 'NOT DUPLICATE'} (fuzzy: ${isFuzzyMatch}, regex: ${isRegexMatch})`);
    console.log(`Expected: ${expectDuplicate ? 'DUPLICATE' : 'NOT DUPLICATE'}`);
    
    if (isDuplicate === expectDuplicate) {
      console.log('✅ TEST PASSED\n');
      passCount++;
    } else {
      console.log('❌ TEST FAILED\n');
    }
  }
  
  console.log(`Results: ${passCount}/${testCases.length} tests passed`);
}

// Run the test
testDuplicateDetection();