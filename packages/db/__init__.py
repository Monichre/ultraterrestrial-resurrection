"""
Database package for UFO research platform
Provides unified access to TypeScript and Python database SDKs
"""

# Registry (matches TypeScript structure)
from .registry import PROVIDERS, ProviderRegistry, ProviderKey

# Shared environment configuration
from .env_config import (
    XataEnvironmentConfig,
    get_xata_config,
    get_xata_api_key,
    get_xata_database_url,
    get_xata_database_name,
    reset_xata_config
)

# Python SDK exports - Now using correct flat structure
from .src.xata_python_sdk import *

# Re-export the provider registry and environment config for easy access
__all__ = [
    # Registry
    "PROVIDERS",
    "ProviderRegistry", 
    "ProviderKey",
    
    # Environment configuration
    "XataEnvironmentConfig",
    "get_xata_config",
    "get_xata_api_key",
    "get_xata_database_url", 
    "get_xata_database_name",
    "reset_xata_config",
    
    # All Python SDK exports are included via *
]