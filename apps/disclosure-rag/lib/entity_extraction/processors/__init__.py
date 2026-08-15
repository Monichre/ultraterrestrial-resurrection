#!/usr/bin/env python3
"""
Entity Extraction Processors Module
Interactive and UI-based entity processing tools
"""

from .interactive_entity_processor import InteractiveEntityProcessor, process_summary_file_interactive

# Optional UI processor (requires textual and other dependencies)
try:
    from .entity_processor_ui import EntityProcessorUI
    UI_AVAILABLE = True
except ImportError:
    UI_AVAILABLE = False

__all__ = [
    'InteractiveEntityProcessor', 
    'process_summary_file_interactive',
    'UI_AVAILABLE'
]

# Add EntityProcessorUI to __all__ if available
if UI_AVAILABLE:
    __all__.append('EntityProcessorUI')