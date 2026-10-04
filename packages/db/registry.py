"""
Database Provider Registry for Python
Mirrors the TypeScript registry with Python-native patterns
"""

from typing import Dict, Any, Optional
from dataclasses import dataclass

from .src.xata_python_sdk.client import get_xata_client


@dataclass
class ProviderConfig:
    """Configuration for a database provider"""
    client: Any
    connection_string: str = ""
    options: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.options is None:
            self.options = {}


class ProviderRegistry:
    """
    Registry for database providers
    Provides centralized access to database connections
    """
    
    def __init__(self):
        self._providers: Dict[str, ProviderConfig] = {}
        self._initialize_default_providers()
    
    def _initialize_default_providers(self):
        """Initialize default providers"""
        self._providers["xata"] = ProviderConfig(
            client=get_xata_client(),
            connection_string="xata://database",
            options={}
        )
        # Future additions:
        # self._providers["supabase"] = ProviderConfig(client=supabase_client)
        # self._providers["convex"] = ProviderConfig(client=convex_client)
    
    def get_provider(self, name: str) -> ProviderConfig:
        """Get a provider by name"""
        if name not in self._providers:
            raise ValueError(f"Provider {name} not found")
        return self._providers[name]
    
    def register_provider(self, name: str, config: ProviderConfig):
        """Register a new provider"""
        self._providers[name] = config
    
    def list_providers(self) -> list[str]:
        """List all available providers"""
        return list(self._providers.keys())
    
    @property
    def xata(self):
        """Get Xata client directly"""
        return self._providers["xata"].client
    
    # Future provider properties:
    # @property
    # def supabase(self):
    #     return self._providers["supabase"].client
    
    # @property 
    # def convex(self):
    #     return self._providers["convex"].client


# Global registry instance
PROVIDERS = ProviderRegistry()

# Type aliases
ProviderKey = str  # Will be literal type in future: Literal["xata", "supabase", "convex"]