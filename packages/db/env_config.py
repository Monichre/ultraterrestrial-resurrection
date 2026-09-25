"""
Shared environment configuration for @packages/db/
Provides unified environment variable management for both TypeScript and Python SDKs
"""

import os
from typing import Optional
from pathlib import Path


class XataEnvironmentConfig:
    """
    Centralized Xata environment configuration
    Ensures consistent environment variables between @packages/db/ and @apps/disclosure-rag/
    """
    
    def __init__(self):
        # Load environment variables with fallbacks
        self.api_key = os.getenv("XATA_API_KEY")
        self.database_url = os.getenv("XATA_DATABASE_URL") 
        self.branch = os.getenv("XATA_BRANCH", "main")
        self.workspace = os.getenv("XATA_WORKSPACE")
        
        # Validate required environment variables
        self._validate_config()
    
    def _validate_config(self):
        """Validate that required environment variables are set"""
        if not self.api_key:
            raise ValueError(
                "XATA_API_KEY environment variable is required. "
                "Please set it in your .env file or environment."
            )
        
        if not self.database_url:
            raise ValueError(
                "XATA_DATABASE_URL environment variable is required. "
                "Please set it in your .env file or environment."
            )
    
    @property
    def database_name(self) -> str:
        """Extract database name from URL"""
        if not self.database_url:
            return ""
        
        # Example: https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial
        # Should return: ultraterrestrial
        parts = self.database_url.rstrip('/').split('/')
        if len(parts) >= 2 and parts[-2] == 'db':
            return parts[-1]
        return ""
    
    @property
    def base_url(self) -> str:
        """Extract base URL for API calls"""
        if not self.database_url:
            return "https://api.xata.io"
        
        # Extract workspace URL from database URL
        # https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial
        # -> https://UltraTerrestrial-kgubvq.us-east-1.xata.sh
        parts = self.database_url.split('/db/')
        if len(parts) >= 1:
            return parts[0]
        return "https://api.xata.io"
    
    def get_client_config(self) -> dict:
        """Get configuration dict for Xata client initialization"""
        return {
            "api_key": self.api_key,
            "database_url": self.database_url,
            "database_name": self.database_name,
            "base_url": self.base_url,
            "branch": self.branch,
            "workspace": self.workspace
        }
    
    def to_dict(self) -> dict:
        """Export all configuration as dictionary"""
        return {
            "api_key": self.api_key,
            "database_url": self.database_url,
            "database_name": self.database_name,
            "base_url": self.base_url,
            "branch": self.branch,
            "workspace": self.workspace
        }


# Global instance - singleton pattern for consistent configuration
_xata_config: Optional[XataEnvironmentConfig] = None


def get_xata_config() -> XataEnvironmentConfig:
    """
    Get the global Xata configuration instance
    This ensures consistent environment variables across all imports
    """
    global _xata_config
    if _xata_config is None:
        _xata_config = XataEnvironmentConfig()
    return _xata_config


def reset_xata_config():
    """Reset the global configuration (useful for testing)"""
    global _xata_config
    _xata_config = None


# Convenience exports
def get_xata_api_key() -> str:
    """Get Xata API key from environment"""
    return get_xata_config().api_key


def get_xata_database_url() -> str:
    """Get Xata database URL from environment"""
    return get_xata_config().database_url


def get_xata_database_name() -> str:
    """Get Xata database name from environment"""
    return get_xata_config().database_name


# Export all public APIs
__all__ = [
    "XataEnvironmentConfig",
    "get_xata_config",
    "reset_xata_config",
    "get_xata_api_key", 
    "get_xata_database_url",
    "get_xata_database_name"
]