#!/usr/bin/env python3
"""
Entity Extraction Module
Centralized entity extraction, processing, and creation functionality
Date: July 12, 2025
"""

# Core entity extraction classes
from .core.entity_creator import EntityCreator, create_entities_from_results

# Processors 
from .processors.interactive_entity_processor import InteractiveEntityProcessor, process_summary_file_interactive

# Optional UI processor (requires textual)
try:
    from .processors.entity_processor_ui import EntityProcessorUI
    UI_AVAILABLE = True
except ImportError:
    UI_AVAILABLE = False

# Agent integration (import from main agents folder)
try:
    from agents.entity_extraction_agent import (
        EntityExtractionAgent, 
        ExtractedEntity, 
        EntityExtractionResult,
        XataSearchTool,
        AIEntityExtractor,
        get_structured_entities,
        search_entities_with_payload
    )
    AGENT_AVAILABLE = True
except ImportError:
    AGENT_AVAILABLE = False

__all__ = [
    # Core
    'EntityCreator',
    'create_entities_from_results',
    
    # Processors
    'InteractiveEntityProcessor', 
    'process_summary_file_interactive',
    
    # Agent (if available)
    'EntityExtractionAgent',
    'ExtractedEntity',
    'EntityExtractionResult', 
    'XataSearchTool',
    'AIEntityExtractor',
    'get_structured_entities',
    'search_entities_with_payload',
    
    # Availability flags
    'AGENT_AVAILABLE',
    'UI_AVAILABLE'
]

# Add EntityProcessorUI to __all__ if available
if UI_AVAILABLE:
    __all__.append('EntityProcessorUI')