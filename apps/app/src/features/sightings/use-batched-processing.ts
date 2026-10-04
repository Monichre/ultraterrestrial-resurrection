/**
 * A utility hook to process large datasets in batches using a worker
 * to avoid blocking the main thread
 */
import { useCallback, useEffect, useState } from 'react';

type ProcessCallbackFn<T, R> = (data: T[]) => R[];

export function useBatchedProcessing<T, R>(
  processFn: ProcessCallbackFn<T, R>, 
  batchSize = 500
) {
  // Process data in batches to avoid UI freezing
  return useCallback(
    (items: T[]): Promise<R[]> => {
      return new Promise((resolve) => {
        if (!items || items.length === 0) {
          resolve([]);
          return;
        }

        // For small datasets, process directly
        if (items.length < batchSize) {
          resolve(processFn(items));
          return;
        }

        // For larger datasets, process in batches
        let result: R[] = [];
        let currentBatchIndex = 0;
        
        // Function to process a single batch
        const processBatch = () => {
          const start = currentBatchIndex * batchSize;
          const end = Math.min(start + batchSize, items.length);
          const batch = items.slice(start, end);
          
          // Process this batch - use setTimeout to yield to the browser
          setTimeout(() => {
            try {
              const batchResults = processFn(batch);
              result = [...result, ...batchResults];
              
              currentBatchIndex++;
              
              // If there are more batches, process the next one
              if (currentBatchIndex * batchSize < items.length) {
                processBatch();
              } else {
                // All batches processed
                resolve(result);
              }
            } catch (error) {
              console.error("Error processing batch:", error);
              resolve(result); // Return what we have so far
            }
          }, 0);
        };
        
        // Start processing
        processBatch();
      });
    },
    [processFn, batchSize]
  );
}

// Hook to apply filters with batched processing
export function useFilterWithBatching<T>(
  filterFn: (item: T) => boolean, 
  batchSize = 500
) {
  const batchedProcess = useBatchedProcessing<T, T>(
    (batch) => batch.filter(filterFn),
    batchSize
  );
  
  return batchedProcess;
}