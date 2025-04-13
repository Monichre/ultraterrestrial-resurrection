#!/usr/bin/env node

/**
 * Test script for verifying the improved location extraction
 */

// Import the extract location function
import { extractLocation } from './events/prepare-ufo-events-enhanced.js';

// Test cases with problematic inputs
const testCases = [
  {
    description: "1290 - October 28. The story of a large silver disk seen in the sky over Byland Abbey, in North Yorkshire, England, is a hoax perpetrated by two British teenagers in 1953. ([Letter], London Times, January 9, 1953; Desmond Leslie and George Adamski, Flying Saucers Have Landed, British Book Centre, 1953, pp. 22-23; Condon, pp. 493-495; Jason Colavito, 'The Byland Abbey UFO Sighting: Anatomy of a Hoax,' Jason Colavito blog, May 4, 2015)",
    expectedLocation: "Byland Abbey, North Yorkshire, England"
  },
  {
    description: "1897 - April 1 - 9:00 p.m. J. E. Gunn, proprietor of the Commercial Hotel, and other residents of Everest, Kansas, watch a 30-foot-long object that looks like a canoe suspended from a balloon. Two wings are visible on each side. Its light appears to dim when the object is moving and glows brightly when hovering.",
    expectedLocation: "Everest, Kansas",
    // Add a debug flag to help us see what's happening
    debug: true
  },
  {
    description: "A former RAF pilot describes three UFOs flying over the Greek island of Zakynthos in the Ionian Sea while he is flying in an Airbus A320 from Athens to London, England.",
    expectedLocation: "Zakynthos"
  },
  {
    description: "1961, Fall. A mysterious submarine is observed several times in the North Atlantic Ocean by the US Navy. It is tracked by unusual, unidentified aircraft with glowing circular red lights. The sub, reported to an intelligence officer at Otis AFB, Massachusetts, apparently is able to travel 150 knots underwater, at over three miles depth, and does not break the sound barrier.",
    expectedLocation: "North Atlantic Ocean"
  },
  {
    description: "American science historian David Jacobs publishes The UFO Controversy in America, tracing the history of UFO phenomena and their cultural impact.",
    expectedLocation: null
  }
];

console.log("Testing improved location extraction...\n");

// Test each case
let successCount = 0;
for (const testCase of testCases) {
  console.log("Input:", testCase.description.substring(0, 100) + "...");
  
  // Extract location
  const location = extractLocation(testCase.description);
  
  console.log("Extracted location:", location || "null");
  console.log("Expected location:", testCase.expectedLocation || "null");
  
  // Add debug info for problematic test cases
  if (testCase.debug) {
    console.log("\nDEBUG INFO:");
    // Show the first sentence after date removal
    const dateRemoved = testCase.description.replace(/^\d{3,4}(?:,|\s-|\s)\s*(?:[A-Za-z]+(?:\s+\d{1,2})?)?(?:\s-\s*[0-9:.]+\s*(?:a\.m\.|p\.m\.|am|pm)?)?\.\s*/, '');
    const firstSentence = dateRemoved.split(/[.!?]/)[0];
    console.log("First sentence:", firstSentence);
    
    // Check specific patterns
    const residentsPattern = /\b(?:residents|citizens|people) of ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/i;
    const residentsMatch = firstSentence.match(residentsPattern);
    console.log("Residents pattern match:", residentsMatch || "null");
    
    const proprietorPattern = /\b(?:proprietor|owner|manager).*?(?:and )?other residents of ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/i;
    const proprietorMatch = firstSentence.match(proprietorPattern);
    console.log("Proprietor pattern match:", proprietorMatch || "null");
    
    // Check if specific strings are present
    console.log("Contains 'Gunn':", firstSentence.includes("Gunn"));
    console.log("Contains 'Everest, Kansas':", firstSentence.includes("Everest, Kansas"));
  }
  
  const isSuccess = (location === testCase.expectedLocation) || 
                   (location && testCase.expectedLocation && 
                    (location.includes(testCase.expectedLocation) || 
                     testCase.expectedLocation.includes(location)));
  
  if (isSuccess) {
    console.log("✅ PASS\n");
    successCount++;
  } else {
    console.log("❌ FAIL\n");
  }
}

console.log(`Results: ${successCount}/${testCases.length} tests passed`);