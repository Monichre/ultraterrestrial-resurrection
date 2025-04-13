const fs = require('fs');
const path = require('path');
const NodeGeocoder = require('node-geocoder');

// Initialize the geocoder
const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  // No API key needed for OpenStreetMap
});

// Load the JSON data
const inputFilePath = path.join(__dirname, 'output', 'transformed-sightings.json');
const sightings = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

// Utility function to create a small delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeSightings() {
  console.log(`Total sightings to process: ${sightings.length}`);
  
  let processed = 0;
  let successful = 0;
  
  // Process each sighting
  for (const sighting of sightings) {
    processed++;
    
    // Skip if latitude and longitude are already set
    if (sighting.latitude && sighting.longitude) {
      console.log(`Sighting ${processed}/${sightings.length} already has coordinates, skipping.`);
      successful++;
      continue;
    }
    
    // Build the address string from city, state, and country
    // Skip entries with empty city
    if (!sighting.city || sighting.city === '') {
      console.log(`Sighting ${processed}/${sightings.length} has no city, skipping.`);
      continue;
    }
    
    const address = [
      sighting.city.trim(),
      sighting.state?.trim(),
      sighting.country?.trim()
    ].filter(Boolean).join(', ');
    
    if (!address) {
      console.log(`Sighting ${processed}/${sightings.length} has no address information, skipping.`);
      continue;
    }
    
    try {
      console.log(`Geocoding ${processed}/${sightings.length}: ${address}`);
      
      // Geocode the address
      const results = await geocoder.geocode(address);
      
      // If we got a result, update the latitude and longitude
      if (results && results.length > 0) {
        sighting.latitude = results[0].latitude;
        sighting.longitude = results[0].longitude;
        successful++;
        console.log(`  Success: (${sighting.latitude}, ${sighting.longitude})`);
      } else {
        console.log(`  No results found for: ${address}`);
      }
      
      // Add a small delay to avoid rate limiting
      await delay(200);
      
    } catch (error) {
      console.error(`  Error geocoding ${address}: ${error.message}`);
    }
    
    // Save progress every 10 items
    if (processed % 10 === 0) {
      console.log(`Saving progress: ${processed}/${sightings.length} (${successful} with coordinates)`);
      fs.writeFileSync(inputFilePath, JSON.stringify(sightings, null, 2));
    }
  }
  
  // Save the final result
  fs.writeFileSync(inputFilePath, JSON.stringify(sightings, null, 2));
  
  console.log(`
Geocoding completed:
- Total processed: ${processed}
- Successfully geocoded: ${successful}
- Success rate: ${(successful / processed * 100).toFixed(2)}%
  `);
}

// Run the geocoding function
geocodeSightings().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});