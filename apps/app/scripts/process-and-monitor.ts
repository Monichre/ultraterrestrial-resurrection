import { processTestimonies } from './data-import/process-testimonies';
import { startWorker } from './workers/testimony-queue-worker';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Start the worker in the background
  startWorker().catch(error => {
    console.error('Worker failed:', error);
    process.exit(1);
  });

  // Process testimonies
  await processTestimonies();
  
  console.log('Processing complete, worker continues running...');
  console.log('Press Ctrl+C to stop');
}

// Run everything
main().catch(error => {
  console.error('Process failed:', error);
  process.exit(1);
});