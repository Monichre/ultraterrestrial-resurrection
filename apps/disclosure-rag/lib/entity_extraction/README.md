# Entity Extraction Module

**Organized Entity Extraction System for UFO/UAP Research**  
**Created**: July 12, 2025  
**Location**: `lib/entity_extraction/`

## Overview

This module consolidates all entity extraction related functionality into a properly organized structure for the Ultraterrestrial Resurrection project's disclosure RAG system.

## Directory Structure

```
lib/entity_extraction/
├── __init__.py                    # Main module exports
├── README.md                      # This documentation
├── core/                          # Core entity creation functionality
│   ├── __init__.py
│   └── entity_creator.py          # Database record creation for new entities
├── processors/                    # Interactive processing and UI components
│   ├── __init__.py
│   ├── interactive_entity_processor.py  # Rich CLI interactive processor
│   └── entity_processor_ui.py     # Textual TUI for entity processing
├── tools/                         # Visualization and utility tools
│   ├── __init__.py
│   └── ner_visualizer.py          # NER visualization tools (if available)
├── schemas/                       # Schema definitions and prompts
│   ├── __init__.py
│   └── extraction-prompt.md       # Advanced UFO/UAP extraction prompts
├── tests/                         # Test suites
│   ├── __init__.py
│   ├── test_entity_creation.py    # Entity creation workflow tests
│   ├── test_entity_extraction.py  # Extraction functionality tests
│   └── test_extraction_*.py       # Additional extraction tests
└── docs/                          # Implementation documentation
    ├── __init__.py
    ├── ENTITY_CREATION_IMPLEMENTATION_STATUS.md
    ├── ENTITY_EXTRACTION_PRESERVATION_PLAN.md
    └── ENTITY_EXTRACTION_WORKFLOW_ANALYSIS.md
```

## Key Components

### 1. Core Entity Creation (`core/`)
- **EntityCreator**: Creates database records for entities not found in Xata
- **create_entities_from_results**: Batch creation from processing results
- Handles all 9 entity types: topics, personnel, events, organizations, locations, artifacts, sightings, testimonies, documents

### 2. Interactive Processors (`processors/`)
- **InteractiveEntityProcessor**: Rich CLI with progress bars and interactive prompts
- **EntityProcessorUI**: Full Textual TUI application with tables and real-time feedback
- Integration with existing `agents/entity_extraction_agent.py`

### 3. Schema & Configuration (`schemas/`)
- Advanced UFO/UAP-specific extraction prompts
- Domain-focused entity recognition rules
- Confidence-based processing workflows

### 4. Testing (`tests/`)
- Comprehensive test suites for all functionality
- Real-world data validation using Bob Lazar example
- Isolated component testing

## Usage

### Quick Import
```python
from lib.entity_extraction import EntityCreator, InteractiveEntityProcessor
from lib.entity_extraction.core import create_entities_from_results
```

### Full Module Import
```python
import lib.entity_extraction as ee

# Check availability
if ee.AGENT_AVAILABLE:
    agent = ee.EntityExtractionAgent()
    
# Use core functionality
creator = ee.EntityCreator()
processor = ee.InteractiveEntityProcessor()
```

### Running Tests
```bash
# From disclosure-rag root directory
python -m lib.entity_extraction.tests.test_entity_creation
python -m lib.entity_extraction.tests.test_entity_extraction
```

## Integration Points

### With Main Agent System
- **`agents/entity_extraction_agent.py`** remains in place and is imported by processors
- All processors integrate with the main EntityExtractionAgent
- Backward compatibility maintained for existing workflows

### With Database Systems
- **Xata Integration**: Direct integration with `lib/xata_search.py`
- **Entity Creation**: Automated database record creation for missing entities
- **Search Functionality**: Intelligent entity matching and validation

### With CLI/UI Systems
- **`cli.py`**: Main CLI integrates with processors via import
- **`main.sh`**: Shell script workflows continue to work
- **Interactive Mode**: Rich terminal interfaces for entity processing

## Domain Focus

### UFO/UAP Research Specialization
- Extracts historically significant disclosure events (Roswell, Rendlesham, etc.)
- Filters out biographical/personal events in favor of disclosure-relevant entities
- Military/government personnel with proper ranks and roles
- Organizational hierarchies and relationships
- Technical terminology and capabilities

### Entity Types Supported
1. **Topics**: UFO/UAP themes and subjects
2. **Personnel**: Military, government, researchers with roles/ranks
3. **Events**: Historical incidents and investigations
4. **Organizations**: Agencies, military units, research institutions
5. **Locations**: Bases, facilities, incident sites
6. **Artifacts**: Physical evidence and materials
7. **Sightings**: UAP observations with characteristics
8. **Testimonies**: Witness accounts and claims
9. **Documents**: Reports, memos, and official records

## Migration Notes

### Files Moved to New Structure
- `lib/entity_creator.py` → `lib/entity_extraction/core/entity_creator.py`
- `lib/interactive_entity_processor.py` → `lib/entity_extraction/processors/interactive_entity_processor.py`
- `lib/entity_processor_ui.py` → `lib/entity_extraction/processors/entity_processor_ui.py`
- `test_entity_*.py` → `lib/entity_extraction/tests/`
- `ENTITY_*.md` → `lib/entity_extraction/docs/`
- `prompts/extraction-prompt.md` → `lib/entity_extraction/schemas/`

### Import Path Updates
All import paths have been updated to use relative imports within the module and absolute imports for external dependencies.

### Backward Compatibility
- Main module `__init__.py` exports all public APIs
- Legacy import paths can be updated gradually
- All existing functionality preserved

## Future Enhancements

1. **Enhanced Domain Filtering**: More sophisticated UFO/disclosure relevance scoring
2. **Relationship Extraction**: Advanced entity relationship detection and mapping
3. **Confidence Optimization**: Machine learning-based confidence adjustment
4. **Vector Integration**: Entity embedding generation and similarity matching
5. **Real-time Processing**: Live entity extraction from streaming sources

---

**Last Updated**: July 12, 2025  
**Maintainer**: Entity Extraction Team  
**Integration Status**: ✅ Complete - Ready for Production Use