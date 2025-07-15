# Database Migration Specialist - Task Assignment

**Agent ID:** `database-migration-specialist`
**Owner:** Week 1 Foundation Stabilization
**Priority:** Critical Infrastructure

## Task 1: Verify Database State & Identify Missing Tables (0.5 days)

### Objective
Confirm migration status and identify which specific tables need seeding.

### Database State Assessment
- [ ] Verify Postgres Wire Enabled Xata instance is accessible
- [ ] Check current record counts across all 29 entity models
- [ ] Identify which tables are empty or missing critical data
- [ ] Validate schema integrity against `packages/db/xata/xata.ts`

### Connection Validation
- [ ] Test database connectivity using current environment variables
- [ ] Verify `xataToXYFlow` can connect (coordinate with Agent 3)
- [ ] Confirm all apps can access the database properly

### Data Assessment
- [ ] Compare current data against expected 230,998+ records
- [ ] Identify specific tables requiring seeding
- [ ] Check data quality and consistency
- [ ] Document any missing or corrupted records

## Task 2: Seed Missing Tables (1-2 days)

### Objective
Populate identified missing tables with data to restore full database functionality.

### Data Seeding Strategy
- [ ] Use existing CSV exports from `apps/app/scripts/xata-exports/exports/`
- [ ] Identify optimal seeding method (SQL inserts, CSV imports, API calls)
- [ ] Prioritize critical tables for `xataToXYFlow` functionality first
- [ ] Handle vector embeddings and file attachments appropriately

### Execution Steps
- [ ] Create backup snapshot before seeding
- [ ] Prepare data files in correct format
- [ ] Execute seeding for priority tables first:
  - `topics`, `personnel`, `events`, `organizations`
- [ ] Seed remaining tables: `sightings`, `testimonies`, `documents`
- [ ] Validate record counts and data integrity
- [ ] Test basic query operations

### Critical Tables to Seed
Based on `xataToXYFlow` requirements:
- `topics` - Core UFO/UAP topic entities
- `personnel` - Key figures and witnesses
- `events` - Historical UFO/UAP incidents  
- `organizations` - Government and research organizations
- `testimonies` - Witness testimonies
- `documents` - Supporting documentation

### Success Criteria
- [ ] All identified missing tables populated with data
- [ ] Record counts match expected totals (230,998+ total)
- [ ] Database queries return expected results
- [ ] `xataToXYFlow` can successfully query entity data
- [ ] Agent 3 can proceed with debugging

### Coordination Points
- **With Agent 3:** Notify when critical tables are seeded for `xataToXYFlow` testing
- **With Agent 2:** Ensure workspace consolidation doesn't interfere with seeding
- **Shared:** Document any environment or configuration changes needed

### Available Resources
- **Export Scripts:** `apps/app/scripts/xata-exports/backup.sh`
- **CSV Data:** `apps/app/scripts/xata-exports/exports/*.csv`
- **Import Tools:** Various scripts in `apps/disclosure-rag/scripts/`