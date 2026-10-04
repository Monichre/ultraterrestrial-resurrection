import { z } from "zod";

export const parallelResultSchema = z.object({
  task: z.string(),
  result: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const parallelProcessingSchema = z.object({
  results: z.array(parallelResultSchema),
  metadata: z.object({
    inputLength: z.number(),
    processedAt: z.string(),
    workers: z.number(),
    perspectives: z.array(z.string()),
  }),
  usage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }),
});
