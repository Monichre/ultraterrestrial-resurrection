# Xata Tables Analysis vs Entity Creator Mappings

## Analysis Summary

Based on my search through the codebase, I've identified a mismatch between the actual Xata database tables and the entity type mappings in the entity creator.

## Actual Xata Tables (from xata.ts schema)

### Core Entity Tables Available:
1. **topics** ✅ (mapped in entity_creator.py)
2. **personnel** ✅ (mapped in entity_creator.py)  
3. **events** ✅ (mapped in entity_creator.py)
4. **organizations** ✅ (mapped in entity_creator.py)
5. **locations** ✅ (mapped in entity_creator.py)
6. **testimonies** ✅ (mapped in entity_creator.py)
7. **documents** ✅ (mapped in entity_creator.py)
8. **sightings** ✅ (mapped in entity_creator.py)
9. **artifacts** ✅ (mapped in entity_creator.py)

### Additional Tables NOT in Entity Creator:
10. **key-figures** ❌ (not mapped)
11. **summary-files** ❌ (not mapped)
12. **mindmaps** ❌ (not mapped - user-specific)
13. **users** ❌ (not mapped - system table)
14. **tags** ❌ (not mapped - empty table)
15. **theories** ❌ (not mapped - empty table)

### Junction/Relationship Tables:
- event-subject-matter-experts
- topic-subject-matter-experts  
- organization-members
- topics-testimonies
- event-topic-subject-matter-experts
- user-saved-* tables (user bookmarks)

## Entity Creator Current Mappings

```python
self.table_mappings = {
    "topics": "topics",           # ✅ EXISTS
    "personnel": "personnel",     # ✅ EXISTS  
    "events": "events",          # ✅ EXISTS
    "organizations": "organizations", # ✅ EXISTS
    "locations": "locations",    # ✅ EXISTS
    "testimonies": "testimonies", # ✅ EXISTS
    "documents": "documents",    # ✅ EXISTS
    "sightings": "sightings",    # ✅ EXISTS
    "artifacts": "artifacts"     # ✅ EXISTS
}
```

## Missing Entity Types Analysis

### 1. "case_files" - NOT A TABLE
**Finding**: `case_files` is NOT a Xata table. It's a document classification category used in the RAG system.

- Used as `doc_type: 'case_file'` in document processing
- References physical files in `/packages/knowledge-base/case_files/` directory
- Documents with `doc_type: 'case_file'` are stored in the `documents` table

### 2. "key-figures" - MISSING MAPPING
**Finding**: `key-figures` table EXISTS in Xata but is NOT mapped in entity_creator.py

**Columns in key-figures table:**
- name (text)
- bio (text) 
- photo (text)
- role (text)
- rank (int)
- credibility (int)
- popularity (int)  
- authority (int)
- embedding (text)
- xataversion (int)

### 3. Other potentially useful tables:
- **summary-files**: Contains processed document summaries
- **mindmaps**: User-created mindmaps (probably not for entity extraction)

## Recommendations

### 1. Update Entity Creator Mappings
Add support for the missing `key-figures` table:

```python
self.table_mappings = {
    "topics": "topics",
    "personnel": "personnel", 
    "events": "events",
    "organizations": "organizations",
    "locations": "locations",
    "testimonies": "testimonies", 
    "documents": "documents",
    "sightings": "sightings",
    "artifacts": "artifacts",
    "key-figures": "key-figures"  # ADD THIS
}
```

### 2. Handle "case_files" Correctly
When entities are extracted with type "case_files", they should be:
- Mapped to the `documents` table
- Tagged with `doc_type: 'case_file'` in metadata

### 3. Add Key-Figures Record Preparation
Add a new case in `_prepare_record_data()` method:

```python
elif entity_type == "key-figures":
    record_data.update({
        "bio": f"Auto-extracted key figure record for {entity_name}",
        "role": entity_data.get("metadata", {}).get("role", ""),
        "credibility": 50,  # Default neutral credibility
        "popularity": 0,
        "authority": 0
    })
```

## File Locations to Update
- `/apps/disclosure-rag/lib/entity_extraction/core/entity_creator.py` (lines 36-46, 201-292)

## Answer to User's Question
- **documents**: ✅ EXISTS as Xata table and IS mapped in entity_creator.py
- **case_files**: ❌ NOT a Xata table, it's a document classification category  
- **artifacts**: ✅ EXISTS as Xata table and IS mapped in entity_creator.py
- **key-figures**: ❌ EXISTS as Xata table but NOT mapped in entity_creator.py

The entity creator should be updated to support the `key-figures` table and handle `case_files` as documents with appropriate metadata.