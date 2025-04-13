// scripts/data-import/import-sightings-to-xata.ts
import { getXataClient } from '../../src/db/xata/xata';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the sightings from the JSON file
const sightingsFile = path.join(__dirname, '../../output/transformed-sightings.json');
const sightingsData = fs.readFileSync(sightingsFile, 'utf8');
const sightings = JSON.parse(sightingsData);

// TypeScript interface for the sighting data structure
interface SightingData {
  date: string;
  description: string;
  media_link: string;
  city: string;
  state: string;
  country: string;
  shape: string;
  duration_seconds: string;
  duration_hours_min: string;
  comments: string;
  date_posted: string;
  latitude: number | null;
  longitude: number | null;
}

// Data quality validation function
function validateDataQuality(sighting: SightingData): { isValid: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100; // Start with perfect score and deduct points for issues
  
  // Check description quality
  if (!sighting.description) {
    issues.push("Description missing");
    score -= 40;
  } else {
    // Check description length
    if (sighting.description.length < 20) {
      issues.push("Description too short (< 20 chars)");
      score -= 20;
    }
  }
  
  // Check date quality
  if (!sighting.date) {
    issues.push("Date missing");
    score -= 15;
  } else {
    // Check if date is valid
    const dateObj = new Date(sighting.date);
    if (isNaN(dateObj.getTime())) {
      issues.push("Invalid date format");
      score -= 15;
    }
  }
  
  // Check location quality
  if (!sighting.city && !sighting.state && !sighting.country) {
    issues.push("Location information missing");
    score -= 15;
  }
  
  // Check coordinates quality
  if (sighting.latitude === null || sighting.longitude === null) {
    issues.push("Coordinates missing");
    score -= 10;
  }
  
  // Check shape quality
  if (!sighting.shape) {
    issues.push("Shape missing");
    score -= 5;
  }
  
  // Normalize score to 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return {
    isValid: score >= 50, // Consider records with score >= 50 as valid
    score,
    issues
  };
}

// Check for duplicate sightings based on date, location, and description
async function checkForDuplicates(xata: ReturnType<typeof getXataClient>, sighting: SightingData): Promise<{ isDuplicate: boolean; method: string }> {
  // Check for exact matches on date, city, state, and country
  if (sighting.date && sighting.city && sighting.state && sighting.country) {
    const exactMatches = await xata.db.sightings
      .filter({
        date: sighting.date,
        city: sighting.city,
        state: sighting.state,
        country: sighting.country
      })
      .getMany();
      
    if (exactMatches.length > 0) {
      return { isDuplicate: true, method: "exact_match" };
    }
  }
  
  // Check for similarity in description and location
  if (sighting.description && (sighting.city || sighting.state)) {
    const descriptionMatches = await xata.db.sightings
      .filter({
        $any: [
          { city: sighting.city },
          { state: sighting.state }
        ]
      })
      .getMany();
    
    // Check for similar descriptions (simplified approach)
    for (const dbSighting of descriptionMatches) {
      if (dbSighting.description && 
          dbSighting.description.length > 20 &&
          sighting.description.length > 20 &&
          (dbSighting.description.includes(sighting.description.substring(0, 20)) ||
           sighting.description.includes(dbSighting.description.substring(0, 20)))) {
        return { isDuplicate: true, method: "similar_description" };
      }
    }
  }
  
  return { isDuplicate: false, method: "none" };
}

async function importSightingsToXata(options: { 
  forceImport?: boolean;
  minQualityScore?: number;
  skipDuplicates?: boolean;
} = {}) {
  const xata = getXataClient();
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  let poorQualityCount = 0;
  
  // Set default options
  const minQualityScore = options.minQualityScore ?? 50;
  const skipDuplicates = options.skipDuplicates ?? true;
  
  console.log(`Preparing to import ${sightings.length} sightings to Xata`);
  console.log(`Minimum quality score: ${minQualityScore}/100`);
  console.log(options.forceImport ? "FORCE IMPORT MODE: Will import even if duplicates are detected" : 
             (skipDuplicates ? "Normal mode: Will skip duplicates" : "Will check duplicates but import anyway"));
  
  // Create quality report arrays
  const qualityIssues: { date: string; location: string; score: number; issues: string[] }[] = [];
  const skippedSightings: { date: string; location: string; reason: string }[] = [];
  
  for (const sighting of sightings as SightingData[]) {
    try {
      // Validate data quality
      const qualityResult = validateDataQuality(sighting);
      
      // Create a location string for reporting
      const location = `${sighting.city || ''}, ${sighting.state || ''}, ${sighting.country || ''}`.replace(/^,\s*|,\s*$/g, '');
      
      // Log quality issues
      if (qualityResult.issues.length > 0) {
        qualityIssues.push({
          date: sighting.date,
          location,
          score: qualityResult.score,
          issues: qualityResult.issues
        });
      }
      
      // Skip poor quality sightings
      if (!qualityResult.isValid && qualityResult.score < minQualityScore) {
        console.log(`Skipping poor quality sighting: ${location} (${sighting.date}) (quality score: ${qualityResult.score}/100)`);
        skippedSightings.push({
          date: sighting.date,
          location,
          reason: `Poor quality score: ${qualityResult.score}/100. Issues: ${qualityResult.issues.join(', ')}`
        });
        poorQualityCount++;
        continue;
      }
      
      // Enhanced duplicate detection
      const { isDuplicate, method } = await checkForDuplicates(xata, sighting);
      
      if (isDuplicate && skipDuplicates && !options.forceImport) {
        console.log(`Duplicate sighting detected: ${location} (${sighting.date}) (method: ${method})`);
        skippedSightings.push({
          date: sighting.date,
          location,
          reason: `Duplicate (detected by: ${method})`
        });
        duplicateCount++;
        continue;
      }
      
      // Insert the sighting into the database
      await xata.db.sightings.create({
        date: sighting.date ? new Date(sighting.date) : undefined,
        description: sighting.description,
        media_link: sighting.media_link,
        city: sighting.city,
        state: sighting.state,
        country: sighting.country,
        shape: sighting.shape,
        duration_seconds: sighting.duration_seconds,
        duration_hours_min: sighting.duration_hours_min,
        comments: sighting.comments,
        date_posted: sighting.date_posted ? new Date(sighting.date_posted) : undefined,
        latitude: sighting.latitude,
        longitude: sighting.longitude
      });
      
      successCount++;
      if (successCount % 10 === 0) {
        console.log(`Imported ${successCount} sightings...`);
      }
    } catch (error) {
      console.error(`Error importing sighting: ${sighting.city}, ${sighting.state} (${sighting.date})`, error);
      errorCount++;
    }
  }
  
  console.log(`
Import complete.
Successfully imported: ${successCount} sightings
Duplicates skipped:    ${duplicateCount} sightings
Poor quality skipped:  ${poorQualityCount} sightings
Errors encountered:    ${errorCount} sightings
`);

  // Generate quality report
  console.log(`\n=== DATA QUALITY REPORT ===`);
  console.log(`Total sightings with quality issues: ${qualityIssues.length}`);
  
  // Top quality issues by frequency
  const issueFrequency: Record<string, number> = {};
  qualityIssues.forEach(item => {
    item.issues.forEach(issue => {
      issueFrequency[issue] = (issueFrequency[issue] || 0) + 1;
    });
  });
  
  console.log(`\nTop quality issues by frequency:`);
  Object.entries(issueFrequency)
    .sort((a, b) => b[1] - a[1])
    .forEach(([issue, count]) => {
      console.log(`- ${issue}: ${count} occurrences`);
    });
  
  // Write detailed reports to files
  fs.writeFileSync(
    path.join(__dirname, 'sightings-quality-report.json'),
    JSON.stringify(qualityIssues, null, 2)
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'skipped-sightings-report.json'),
    JSON.stringify(skippedSightings, null, 2)
  );
  
  console.log(`\nDetailed reports written to:`);
  console.log(`- ${path.join(__dirname, 'sightings-quality-report.json')}`);
  console.log(`- ${path.join(__dirname, 'skipped-sightings-report.json')}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceImport = args.includes('--force') || args.includes('-f');
const minQualityScore = args.includes('--min-quality') ? 
  parseInt(args[args.indexOf('--min-quality') + 1] || '50', 10) : 50;
const skipDuplicates = !args.includes('--no-skip-duplicates');

// Run the import with options
importSightingsToXata({ 
  forceImport,
  minQualityScore,
  skipDuplicates
})
  .then(() => console.log('Done'))
  .catch(err => console.error('Import failed:', err));