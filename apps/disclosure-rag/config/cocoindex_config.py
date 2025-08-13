"""
Configuration management for UAP CocoIndex Knowledge Graph Flow
Handles environment variables, database connections, and flow settings.
"""

import os
from dataclasses import dataclass
from typing import Optional, Dict, Any
from pathlib import Path

@dataclass
class DatabaseConfig:
    """Database connection configuration"""
    host: str
    port: int
    database: str
    username: str
    password: str
    
    def __post_init__(self):
        """Validate required fields"""
        if not all([self.host, self.port, self.database, self.username, self.password]):
            raise ValueError("All database connection fields are required")

@dataclass
class Neo4jConfig:
    """Neo4j connection configuration"""
    uri: str
    username: str
    password: str
    
    def __post_init__(self):
        """Validate required fields"""
        if not all([self.uri, self.username, self.password]):
            raise ValueError("All Neo4j connection fields are required")

@dataclass
class OpenAIConfig:
    """OpenAI API configuration"""
    api_key: str
    model: str = "gpt-5"
    max_tokens: int = 4000
    temperature: float = 0.1
    
    def __post_init__(self):
        """Validate API key"""
        if not self.api_key:
            raise ValueError("OpenAI API key is required")

@dataclass
class FlowConfig:
    """CocoIndex flow configuration"""
    batch_size: int = 100
    max_retries: int = 3
    retry_delay: int = 5
    enable_neo4j: bool = True
    log_level: str = "INFO"
    
class UAPKnowledgeGraphConfig:
    """Main configuration class for UAP Knowledge Graph flow"""
    
    def __init__(self):
        self.postgres = self._load_postgres_config()
        self.neo4j = self._load_neo4j_config()
        self.openai = self._load_openai_config()
        self.flow = self._load_flow_config()
        self.project_root = self._get_project_root()
        
    def _load_postgres_config(self) -> DatabaseConfig:
        """Load PostgreSQL configuration from environment"""
        return DatabaseConfig(
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=int(os.getenv("POSTGRES_PORT", "5432")),
            database=os.getenv("POSTGRES_DATABASE", "disclosure_rag"),
            username=os.getenv("POSTGRES_USER", "postgres"),
            password=os.getenv("POSTGRES_PASSWORD", "password")
        )
    
    def _load_neo4j_config(self) -> Optional[Neo4jConfig]:
        """Load Neo4j configuration from environment"""
        try:
            return Neo4jConfig(
                uri=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
                username=os.getenv("NEO4J_USER", "neo4j"),
                password=os.getenv("NEO4J_PASSWORD", "password")
            )
        except ValueError:
            return None
    
    def _load_openai_config(self) -> OpenAIConfig:
        """Load OpenAI configuration from environment"""
        return OpenAIConfig(
            api_key=os.getenv("OPENAI_API_KEY", ""),
            model=os.getenv("OPENAI_MODEL", "gpt-5"),
            max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "4000")),
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.1"))
        )
    
    def _load_flow_config(self) -> FlowConfig:
        """Load flow configuration from environment"""
        return FlowConfig(
            batch_size=int(os.getenv("COCOINDEX_BATCH_SIZE", "100")),
            max_retries=int(os.getenv("COCOINDEX_MAX_RETRIES", "3")),
            retry_delay=int(os.getenv("COCOINDEX_RETRY_DELAY", "5")),
            enable_neo4j=os.getenv("COCOINDEX_ENABLE_NEO4J", "true").lower() == "true",
            log_level=os.getenv("COCOINDEX_LOG_LEVEL", "INFO")
        )
    
    def _get_project_root(self) -> Path:
        """Get the project root directory"""
        return Path(__file__).parent.parent
    
    def get_postgres_connection_string(self) -> str:
        """Get PostgreSQL connection string"""
        return (
            f"postgresql://{self.postgres.username}:{self.postgres.password}"
            f"@{self.postgres.host}:{self.postgres.port}/{self.postgres.database}"
        )
    
    def get_neo4j_connection_string(self) -> Optional[str]:
        """Get Neo4j connection string"""
        if not self.neo4j:
            return None
        return f"{self.neo4j.uri}"
    
    def get_ner_prompt_path(self) -> Path:
        """Get path to NER prompt file"""
        return self.project_root / "prompts" / "named_entity_recognition_prompt.py"
    
    def get_schema_sql_path(self) -> Path:
        """Get path to schema SQL file"""
        return self.project_root / "setup" / "cocoindex_tables_corrected.sql"
    
    def validate(self) -> Dict[str, Any]:
        """Validate configuration and return status"""
        status = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Check PostgreSQL config
        try:
            self.postgres.__post_init__()
        except ValueError as e:
            status["valid"] = False
            status["errors"].append(f"PostgreSQL config: {e}")
        
        # Check OpenAI config
        try:
            self.openai.__post_init__()
        except ValueError as e:
            status["valid"] = False
            status["errors"].append(f"OpenAI config: {e}")
        
        # Check Neo4j config (optional)
        if self.flow.enable_neo4j and not self.neo4j:
            status["warnings"].append("Neo4j enabled but configuration missing")
        
        # Check file paths
        if not self.get_ner_prompt_path().exists():
            status["warnings"].append(f"NER prompt file not found: {self.get_ner_prompt_path()}")
        
        if not self.get_schema_sql_path().exists():
            status["warnings"].append(f"Schema SQL file not found: {self.get_schema_sql_path()}")
        
        return status
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary (excluding sensitive data)"""
        return {
            "postgres": {
                "host": self.postgres.host,
                "port": self.postgres.port,
                "database": self.postgres.database,
                "username": self.postgres.username,
                "password": "***" if self.postgres.password else None
            },
            "neo4j": {
                "uri": self.neo4j.uri if self.neo4j else None,
                "username": self.neo4j.username if self.neo4j else None,
                "password": "***" if self.neo4j and self.neo4j.password else None
            } if self.neo4j else None,
            "openai": {
                "model": self.openai.model,
                "max_tokens": self.openai.max_tokens,
                "temperature": self.openai.temperature,
                "api_key": "***" if self.openai.api_key else None
            },
            "flow": {
                "batch_size": self.flow.batch_size,
                "max_retries": self.flow.max_retries,
                "retry_delay": self.flow.retry_delay,
                "enable_neo4j": self.flow.enable_neo4j,
                "log_level": self.flow.log_level
            }
        }

# Global configuration instance
config = UAPKnowledgeGraphConfig()

def load_environment_from_file(env_file: str = ".env") -> None:
    """Load environment variables from file"""
    env_path = Path(env_file)
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

def create_sample_env_file(path: str = ".env.sample") -> None:
    """Create a sample environment file"""
    sample_content = """# UAP CocoIndex Knowledge Graph Configuration

# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=disclosure_rag
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Neo4j Configuration (Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.1

# CocoIndex Flow Configuration
COCOINDEX_BATCH_SIZE=100
COCOINDEX_MAX_RETRIES=3
COCOINDEX_RETRY_DELAY=5
COCOINDEX_ENABLE_NEO4J=true
COCOINDEX_LOG_LEVEL=INFO
"""
    
    with open(path, 'w') as f:
        f.write(sample_content)
    
    print(f"Sample environment file created: {path}")
    print("Copy this to .env and update with your actual values")

if __name__ == "__main__":
    # Create sample environment file if run directly
    create_sample_env_file()
    
    # Validate current configuration
    status = config.validate()
    print("Configuration Status:")
    print(f"Valid: {status['valid']}")
    
    if status['errors']:
        print("Errors:")
        for error in status['errors']:
            print(f"  - {error}")
    
    if status['warnings']:
        print("Warnings:")
        for warning in status['warnings']:
            print(f"  - {warning}")
    
    print("\nCurrent Configuration:")
    import json
    print(json.dumps(config.to_dict(), indent=2))