#!/usr/bin/env bun

import fs from 'node:fs';
import path from 'node:path';

// Interface to match the NUFORC JSON report structure
interface NUFORCReport {
  link: {
    text: string;
    url: string;
  };
  occurred: string;
  city: string;
  state: string;
  country: string;
  shape: string;
  summary: string;
  reported: string;
  media: string;
  explanation: string;
}

interface NUFORCFile {
  url: string;
  reportId: string;
  title: string;
  headers: string[];
  reports: NUFORCReport[];
  total_reports: number;
  scraped_at: string;
}

// Interface for the Xata sightings table schema
interface XataSighting {
  date?: Date;
  description?: string;
  media_link?: string;
  city?: string;
  state?: string;
  country?: string;
  shape?: string;
  duration_seconds?: string;
  duration_hours_min?: string;
  comments?: string;
  date_posted?: Date;
  latitude?: number | null;
  longitude?: number | null;
  // media field is omitted as it's a file[] type that would require file uploads
}

/**
 * Parse a date string in MM/DD/YYYY HH:MM format to a Date object
 */
function parseDate(dateStr: string): Date | undefined {
  try {
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart) return undefined;

    const [month, day, year] = datePart.split('/').map(Number);
    
    // Validate date parts
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return undefined;
    }

    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Validate time parts
      if (isNaN(hours) || isNaN(minutes)) {
        return new Date(year, month - 1, day);
      }
      
      return new Date(year, month - 1, day, hours, minutes);
    } else {
      return new Date(year, month - 1, day);
    }
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error);
    return undefined;
  }
}

/**
 * Parse a date string in MM/DD/YYYY format to a Date object
 */
function parseReportedDate(dateStr: string): Date | undefined {
  try {
    const [month, day, year] = dateStr.split('/').map(Number);
    
    // Validate parts
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      return undefined;
    }
    
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error(`Error parsing reported date: ${dateStr}`, error);
    return undefined;
  }
}

/**
 * Convert a NUFORC report to Xata sighting format
 */
function convertReportToSighting(report: NUFORCReport, reportId: string): XataSighting {
  // Extract potential duration information from summary
  const durationMatch = report.summary.match(/(\d+)\s*(?:minute|min|second|sec)/i);
  const durationSeconds = durationMatch ? durationMatch[1] : '';
  
  // Create a unique identifier based on the report URL and occurred date
  const reportIdentifier = report.link.url.split('=')[1] || '';
  
  return {
    date: parseDate(report.occurred),
    description: report.summary,
    media_link: report.media === 'Y' ? `https://nuforc.org${report.link.url}` : '',
    city: report.city,
    state: report.state,
    country: report.country,
    shape: report.shape,
    duration_seconds: durationSeconds,
    duration_hours_min: '',  // This would need more sophisticated parsing
    comments: report.explanation ? `Explanation: ${report.explanation}` : '',
    date_posted: parseReportedDate(report.reported),
    // We don't have lat/long data in the basic NUFORC data
    latitude: null,
    longitude: null
  };
}

/**
 * Process a NUFORC JSON file and convert it to Xata sightings
 */
async function processNUFORCFile(filePath: string): Promise<XataSighting[]> {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const nuforData: NUFORCFile = JSON.parse(fileContent);
    
    console.log(`Processing ${nuforData.reports.length} reports from ${nuforData.reportId}`);
    
    return nuforData.reports.map(report => 
      convertReportToSighting(report, nuforData.reportId)
    );
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

/**
 * Main function to process NUFORC files and output transformed data
 */
async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: bun transform-nuforc-data.ts <filename.json>');
    console.log('Or: bun transform-nuforc-data.ts --all');
    process.exit(1);
  }
  
  try {
    // Use the correct directory path - go up from the current directory to the project root
    const rootDir = process.cwd();
    const nuforcDir = path.join(rootDir, 'data', 'nuforc');
    console.log(`NUFORC directory: ${nuforcDir}`);
    
    // Check if the directory exists
    if (!fs.existsSync(nuforcDir)) {
      console.error(`Directory not found: ${nuforcDir}`);
      process.exit(1);
    }
    
    let jsonFiles: string[] = [];
    
    if (process.argv[2] === '--all') {
      // Process all files
      const files = await fs.promises.readdir(nuforcDir);
      jsonFiles = files.filter(file => file.endsWith('.json'));
      console.log(`Found ${jsonFiles.length} NUFORC data files to process`);
    } else {
      // Process just the specified file
      const specificFile = process.argv[2];
      const fullPath = path.join(nuforcDir, specificFile);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        process.exit(1);
      }
      
      jsonFiles = [specificFile];
    }
    
    // Process each file and collect sightings
    let allSightings: XataSighting[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(nuforcDir, file);
      const sightings = await processNUFORCFile(filePath);
      allSightings = [...allSightings, ...sightings];
      
      console.log(`Processed ${sightings.length} sightings from ${file}`);
    }
    
    console.log(`Total sightings collected: ${allSightings.length}`);
    
    // Deduplicate by creating a unique key for each sighting
    const uniqueSightings = new Map<string, XataSighting>();
    
    allSightings.forEach(sighting => {
      // Create a unique key based on date, city, and description
      const key = `${sighting.date?.toISOString() || ''}_${sighting.city || ''}_${(sighting.description || '').substring(0, 50)}`;
      if (!uniqueSightings.has(key)) {
        uniqueSightings.set(key, sighting);
      }
    });
    
    const finalSightings = Array.from(uniqueSightings.values());
    console.log(`After deduplication: ${finalSightings.length} unique sightings`);
    
    // Output sample of transformed data
    console.log('\nSample of transformed data:');
    console.log(JSON.stringify(finalSightings.slice(0, 3), null, 2));
    
    // Save to output file
    const outputDir = path.join(rootDir, 'output');
    // Make sure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'transformed-sightings.json');
    await fs.promises.writeFile(outputPath, JSON.stringify(finalSightings, null, 2));
    console.log(`\nTransformed data saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Execute the main function
main().catch(error => {
  console.error('Unhandled error in script:', error);
  process.exit(1);
});
