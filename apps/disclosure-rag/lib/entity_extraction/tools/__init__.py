#!/usr/bin/env python3
"""
Entity Extraction Tools Module
Visualization and utility tools for entity extraction
"""

try:
    from .ner_visualizer import NERVisualizer
    NER_VISUALIZER_AVAILABLE = True
except ImportError:
    NER_VISUALIZER_AVAILABLE = False

__all__ = []

if NER_VISUALIZER_AVAILABLE:
    __all__.extend(['NERVisualizer'])

__all__.extend(['NER_VISUALIZER_AVAILABLE'])