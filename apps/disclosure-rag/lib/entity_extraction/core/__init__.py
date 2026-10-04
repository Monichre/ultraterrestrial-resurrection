#!/usr/bin/env python3
"""
Entity Extraction Core Module
Core entity creation and management functionality
"""

from .entity_creator import EntityCreator, create_entities_from_results

__all__ = ['EntityCreator', 'create_entities_from_results']