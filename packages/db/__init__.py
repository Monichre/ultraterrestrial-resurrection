"""
Database package for UFO research platform
Provides unified access to TypeScript and Python database SDKs
"""

# Registry (matches TypeScript structure)
from .registry import PROVIDERS, ProviderRegistry, ProviderKey

# Python SDK exports
from .src.xata_python_sdk import *

# Re-export the provider registry for easy access
__all__ = [
    "PROVIDERS",
    "ProviderRegistry", 
    "ProviderKey",
    
    # All Python SDK exports are included via *
]