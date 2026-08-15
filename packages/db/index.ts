/**
 * Database module entry point
 *
 * This file exports all database functionality from the package.
 * 
 * Available import paths:
 * - @db - Main exports (registry and providers)
 * - @db/registry - Provider registry exports
 * - @db/xata - Complete Xata client, models, and API
 * - @db/xata/client - Xata client only
 * - @db/xata/models - Database models only
 * - @db/xata/api - API functions only
 * - @db/types - All type definitions
 */

// Export registry (main package exports)
export * from "./registry";

// Export types for convenience
export * from "./types";

// Re-export the provider registry for easy access
export { PROVIDERS } from "./registry";

// Re-export commonly used types from xata
export type {
  // Core types
  XataClient,
  DatabaseSchema,
  
  // Common record types
  TopicsRecord,
  PersonnelRecord,
  EventsRecord,
  OrganizationsRecord,
  TestimoniesRecord,
  SightingsRecord,
  DocumentsRecord,
  UsersRecord,
  
  // Base entity types
  Topics,
  Personnel,
  Events,
  Organizations,
  Testimonies,
  Sightings,
  Documents,
  Users,
} from "./src/xata-typescript-sdk/xata";

// Re-export the client instance and factory function for direct use
export { xata } from "./src/xata-typescript-sdk/client";
export { getXataClient } from "./src/xata-typescript-sdk/xata";
