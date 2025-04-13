import { parseSummaryFile, findSummaryFiles } from './import-testimonies-to-xata';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processTestimonies() {
  const summaryFiles = findSummaryFiles();
  console.log(`Found ${summaryFiles.length} testimony files to process`);

  for (const file of summaryFiles) {
    try {
      const testimony = parseSummaryFile(file);
      if (!testimony) {
        console.error(`Failed to parse file: ${file}`);
        continue;
      }

      // Send to processing endpoint
      const response = await fetch('http://localhost:3000/api/processing/testimony', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimony)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`Error processing ${testimony.title}:`, error);
        continue;
      }

      const result = await response.json();
      console.log(`Successfully queued ${testimony.title} for processing:`, result);

    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }
}

// Run the processor
processTestimonies()
  .then(() => console.log('Processing complete'))
  .catch(error => {
    console.error('Processing failed:', error);
    process.exit(1);
  });