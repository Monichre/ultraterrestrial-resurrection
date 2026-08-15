import { Queue } from '../../src/lib/upstash/queue';
import { processTestimony } from '@/services/processing/testimony-processor';
import type { TestimonyData } from '@/types/testimony';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ 
  path: path.join(
    path.dirname(fileURLToPath(import.meta.url)), 
    '../../.env'
  ) 
});

const queue = new Queue({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

interface QueueItem {
  type: 'testimony';
  action: 'create' | 'update';
  data: TestimonyData;
}

async function processQueueItem(item: QueueItem) {
  console.log(`Processing ${item.type} item with action ${item.action}`);
  
  try {
    switch (item.type) {
      case 'testimony':
        const result = await processTestimony(item.data);
        console.log(`Processed testimony: ${result.status} (${result.id})`);
        return result;
      
      default:
        throw new Error(`Unknown item type: ${item.type}`);
    }
  } catch (error) {
    console.error('Error processing queue item:', error);
    throw error; // Let the queue handle retries
  }
}

// Process queue items
async function startWorker() {
  console.log('Starting testimony queue worker...');
  
  while (true) {
    try {
      // Get next item from queue
      const item = await queue.pop<QueueItem>();
      
      if (!item) {
        // No items in queue, wait before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Process the item
      await processQueueItem(item);
      
    } catch (error) {
      console.error('Worker error:', error);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Start the worker
if (require.main === module) {
  startWorker()
    .catch(error => {
      console.error('Worker failed:', error);
      process.exit(1);
    });
}

export { startWorker };