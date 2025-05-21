import { ReadableStreamDefaultController } from "stream/web";

// Store active connections that can be shared across route files
export const clients = new Set<ReadableStreamDefaultController>(); 