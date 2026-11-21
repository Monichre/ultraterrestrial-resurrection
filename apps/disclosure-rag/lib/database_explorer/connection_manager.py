#!/usr/bin/env python3
"""
Database Connection Manager
Multi-database connection support for PostgreSQL (wire/local), Xata API, SQLite
Date: July 13, 2025
"""

import os
import ssl
import logging
import asyncio
from typing import Dict, List, Any, Optional, Union, Tuple
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum
import json

# Database connection libraries
try:
    import asyncpg
    import psycopg2
    from psycopg2.extras import RealDictCursor
    POSTGRESQL_AVAILABLE = True
except ImportError:
    POSTGRESQL_AVAILABLE = False
    asyncpg = None
    psycopg2 = None
    RealDictCursor = None

try:
    import sqlite3
    SQLITE_AVAILABLE = True
except ImportError:
    SQLITE_AVAILABLE = False
    sqlite3 = None

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    requests = None

logger = logging.getLogger(__name__)

class DatabaseType(Enum):
    """Database type enumeration"""
    POSTGRESQL_WIRE = "postgresql_wire"
    POSTGRESQL_LOCAL = "postgresql_local" 
    XATA_API = "xata_api"
    SQLITE = "sqlite"
    MYSQL = "mysql"
    MONGODB = "mongodb"

class ConnectionStatus(Enum):
    """Connection status enumeration"""
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ERROR = "error"
    TESTING = "testing"

@dataclass
class DatabaseConnection:
    """Database connection configuration"""
    name: str
    db_type: DatabaseType
    host: str = "localhost"
    port: int = 5432
    database: str = ""
    username: str = ""
    password: str = ""
    ssl_mode: str = "prefer"
    ssl_cert_path: Optional[str] = None
    api_key: Optional[str] = None
    workspace: Optional[str] = None
    region: Optional[str] = None
    file_path: Optional[str] = None
    connection_string: Optional[str] = None
    status: ConnectionStatus = ConnectionStatus.DISCONNECTED
    last_connected: Optional[str] = None
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

class DatabaseConnectionManager:
    """Multi-database connection manager"""
    
    def __init__(self):
        self.connections: Dict[str, DatabaseConnection] = {}
        self.active_connections: Dict[str, Any] = {}  # Active connection objects
        self.connection_pools: Dict[str, Any] = {}    # Connection pools
        self.config_file = Path("database_connections.json")
        
        # Load saved connections
        self.load_connections()
    
    def add_connection(self, connection: DatabaseConnection) -> bool:
        """Add a new database connection"""
        try:
            # Validate connection configuration
            if not self._validate_connection_config(connection):
                return False
            
            # Add to connections
            self.connections[connection.name] = connection
            
            # Save to config file
            self.save_connections()
            
            logger.info(f"Added database connection: {connection.name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add connection {connection.name}: {e}")
            return False
    
    def remove_connection(self, connection_name: str) -> bool:
        """Remove a database connection"""
        try:
            if connection_name in self.connections:
                # Disconnect if connected
                if connection_name in self.active_connections:
                    self.disconnect(connection_name)
                
                # Remove from connections
                del self.connections[connection_name]
                
                # Save to config file
                self.save_connections()
                
                logger.info(f"Removed database connection: {connection_name}")
                return True
            else:
                logger.warning(f"Connection not found: {connection_name}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to remove connection {connection_name}: {e}")
            return False
    
    def get_connection(self, connection_name: str) -> Optional[DatabaseConnection]:
        """Get connection configuration"""
        return self.connections.get(connection_name)
    
    def list_connections(self) -> List[DatabaseConnection]:
        """List all configured connections"""
        return list(self.connections.values())
    
    def test_connection(self, connection_name: str) -> Tuple[bool, str]:
        """Test a database connection"""
        try:
            connection = self.connections.get(connection_name)
            if not connection:
                return False, f"Connection '{connection_name}' not found"
            
            # Update status
            connection.status = ConnectionStatus.TESTING
            
            # Test based on database type
            if connection.db_type == DatabaseType.POSTGRESQL_WIRE:
                success, message = self._test_postgresql_wire(connection)
            elif connection.db_type == DatabaseType.POSTGRESQL_LOCAL:
                success, message = self._test_postgresql_local(connection)
            elif connection.db_type == DatabaseType.XATA_API:
                success, message = self._test_xata_api(connection)
            elif connection.db_type == DatabaseType.SQLITE:
                success, message = self._test_sqlite(connection)
            else:
                success, message = False, f"Unsupported database type: {connection.db_type}"
            
            # Update connection status
            if success:
                connection.status = ConnectionStatus.DISCONNECTED
                connection.error_message = None
            else:
                connection.status = ConnectionStatus.ERROR
                connection.error_message = message
            
            self.save_connections()
            return success, message
            
        except Exception as e:
            logger.error(f"Connection test failed for {connection_name}: {e}")
            return False, str(e)
    
    async def connect(self, connection_name: str) -> Tuple[bool, str]:
        """Connect to a database"""
        try:
            connection = self.connections.get(connection_name)
            if not connection:
                return False, f"Connection '{connection_name}' not found"
            
            # Check if already connected
            if connection_name in self.active_connections:
                return True, "Already connected"
            
            # Update status
            connection.status = ConnectionStatus.CONNECTING
            
            # Connect based on database type
            if connection.db_type == DatabaseType.POSTGRESQL_WIRE:
                success, conn_obj, message = await self._connect_postgresql_wire(connection)
            elif connection.db_type == DatabaseType.POSTGRESQL_LOCAL:
                success, conn_obj, message = await self._connect_postgresql_local(connection)
            elif connection.db_type == DatabaseType.XATA_API:
                success, conn_obj, message = await self._connect_xata_api(connection)
            elif connection.db_type == DatabaseType.SQLITE:
                success, conn_obj, message = await self._connect_sqlite(connection)
            else:
                success, conn_obj, message = False, None, f"Unsupported database type: {connection.db_type}"
            
            # Update connection status
            if success and conn_obj:
                connection.status = ConnectionStatus.CONNECTED
                connection.last_connected = datetime.now().isoformat()
                connection.error_message = None
                self.active_connections[connection_name] = conn_obj
            else:
                connection.status = ConnectionStatus.ERROR
                connection.error_message = message
            
            self.save_connections()
            return success, message
            
        except Exception as e:
            logger.error(f"Connection failed for {connection_name}: {e}")
            if connection_name in self.connections:
                self.connections[connection_name].status = ConnectionStatus.ERROR
                self.connections[connection_name].error_message = str(e)
            return False, str(e)
    
    def disconnect(self, connection_name: str) -> bool:
        """Disconnect from a database"""
        try:
            if connection_name not in self.active_connections:
                return True  # Already disconnected
            
            conn_obj = self.active_connections[connection_name]
            connection = self.connections.get(connection_name)
            
            # Close connection based on type
            if hasattr(conn_obj, 'close'):
                if asyncio.iscoroutinefunction(conn_obj.close):
                    # Async close
                    asyncio.create_task(conn_obj.close())
                else:
                    # Sync close
                    conn_obj.close()
            
            # Remove from active connections
            del self.active_connections[connection_name]
            
            # Update status
            if connection:
                connection.status = ConnectionStatus.DISCONNECTED
                connection.error_message = None
            
            self.save_connections()
            logger.info(f"Disconnected from: {connection_name}")
            return True
            
        except Exception as e:
            logger.error(f"Disconnect failed for {connection_name}: {e}")
            return False
    
    def get_active_connection(self, connection_name: str) -> Optional[Any]:
        """Get active connection object"""
        return self.active_connections.get(connection_name)
    
    def is_connected(self, connection_name: str) -> bool:
        """Check if connection is active"""
        return connection_name in self.active_connections
    
    async def execute_query(self, connection_name: str, query: str, params: Optional[List] = None) -> Tuple[bool, Any, str]:
        """Execute a query on the specified connection"""
        try:
            if connection_name not in self.active_connections:
                return False, None, "Not connected to database"
            
            conn_obj = self.active_connections[connection_name]
            connection = self.connections[connection_name]
            
            # Execute based on database type
            if connection.db_type in [DatabaseType.POSTGRESQL_WIRE, DatabaseType.POSTGRESQL_LOCAL]:
                return await self._execute_postgresql_query(conn_obj, query, params)
            elif connection.db_type == DatabaseType.XATA_API:
                return await self._execute_xata_query(conn_obj, query, params)
            elif connection.db_type == DatabaseType.SQLITE:
                return await self._execute_sqlite_query(conn_obj, query, params)
            else:
                return False, None, f"Query execution not supported for {connection.db_type}"
                
        except Exception as e:
            logger.error(f"Query execution failed for {connection_name}: {e}")
            return False, None, str(e)
    
    def save_connections(self) -> bool:
        """Save connections to config file"""
        try:
            # Convert connections to serializable format
            config_data = {}
            for name, connection in self.connections.items():
                config_data[name] = asdict(connection)
                # Convert enums to strings
                config_data[name]['db_type'] = connection.db_type.value
                config_data[name]['status'] = connection.status.value
            
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config_data, f, indent=2, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to save connections: {e}")
            return False
    
    def load_connections(self) -> bool:
        """Load connections from config file"""
        try:
            if not self.config_file.exists():
                return True  # No config file yet
            
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
            
            for name, conn_data in config_data.items():
                # Convert strings back to enums
                conn_data['db_type'] = DatabaseType(conn_data['db_type'])
                conn_data['status'] = ConnectionStatus(conn_data['status'])
                
                # Create connection object
                connection = DatabaseConnection(**conn_data)
                self.connections[name] = connection
            
            logger.info(f"Loaded {len(self.connections)} database connections")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load connections: {e}")
            return False
    
    def _validate_connection_config(self, connection: DatabaseConnection) -> bool:
        """Validate connection configuration"""
        if not connection.name.strip():
            return False
        
        if connection.db_type == DatabaseType.POSTGRESQL_WIRE:
            return bool(connection.host and connection.database and connection.username)
        elif connection.db_type == DatabaseType.POSTGRESQL_LOCAL:
            return bool(connection.host and connection.database)
        elif connection.db_type == DatabaseType.XATA_API:
            return bool(connection.api_key and connection.workspace and connection.database)
        elif connection.db_type == DatabaseType.SQLITE:
            return bool(connection.file_path)
        
        return False
    
    def _test_postgresql_wire(self, connection: DatabaseConnection) -> Tuple[bool, str]:
        """Test PostgreSQL wire protocol connection"""
        if not POSTGRESQL_AVAILABLE:
            return False, "PostgreSQL libraries not available"
        
        try:
            # Create SSL context for wire protocol
            ssl_context = ssl.create_default_context()
            if connection.ssl_mode == "require":
                ssl_context.check_hostname = False
                ssl_context.verify_mode = ssl.CERT_NONE
            
            # Build connection string
            conn_string = f"postgresql://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.database}?sslmode={connection.ssl_mode}"
            
            # Test connection
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            return True, "Connection successful"
            
        except Exception as e:
            return False, f"PostgreSQL wire connection failed: {str(e)}"
    
    def _test_postgresql_local(self, connection: DatabaseConnection) -> Tuple[bool, str]:
        """Test local PostgreSQL connection"""
        if not POSTGRESQL_AVAILABLE:
            return False, "PostgreSQL libraries not available"
        
        try:
            conn = psycopg2.connect(
                host=connection.host,
                port=connection.port,
                database=connection.database,
                user=connection.username,
                password=connection.password
            )
            
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            return True, "Connection successful"
            
        except Exception as e:
            return False, f"PostgreSQL local connection failed: {str(e)}"
    
    def _test_xata_api(self, connection: DatabaseConnection) -> Tuple[bool, str]:
        """Test Xata API connection"""
        if not REQUESTS_AVAILABLE:
            return False, "Requests library not available"
        
        try:
            # Test Xata API endpoint
            url = f"https://{connection.workspace}.{connection.region}.xata.sh/db/{connection.database}"
            headers = {
                "Authorization": f"Bearer {connection.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(f"{url}/tables", headers=headers, timeout=10)
            
            if response.status_code == 200:
                return True, "Connection successful"
            else:
                return False, f"Xata API connection failed: HTTP {response.status_code}"
                
        except Exception as e:
            return False, f"Xata API connection failed: {str(e)}"
    
    def _test_sqlite(self, connection: DatabaseConnection) -> Tuple[bool, str]:
        """Test SQLite connection"""
        if not SQLITE_AVAILABLE:
            return False, "SQLite not available"
        
        try:
            if not Path(connection.file_path).exists():
                return False, f"SQLite file not found: {connection.file_path}"
            
            conn = sqlite3.connect(connection.file_path)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            cursor.close()
            conn.close()
            
            return True, "Connection successful"
            
        except Exception as e:
            return False, f"SQLite connection failed: {str(e)}"
    
    async def _connect_postgresql_wire(self, connection: DatabaseConnection) -> Tuple[bool, Any, str]:
        """Connect to PostgreSQL via wire protocol"""
        if not POSTGRESQL_AVAILABLE:
            return False, None, "PostgreSQL libraries not available"
        
        try:
            # Build connection string
            conn_string = f"postgresql://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.database}?sslmode={connection.ssl_mode}"
            
            # Create async connection
            conn = await asyncpg.connect(conn_string)
            
            return True, conn, "Connected successfully"
            
        except Exception as e:
            return False, None, f"PostgreSQL wire connection failed: {str(e)}"
    
    async def _connect_postgresql_local(self, connection: DatabaseConnection) -> Tuple[bool, Any, str]:
        """Connect to local PostgreSQL"""
        if not POSTGRESQL_AVAILABLE:
            return False, None, "PostgreSQL libraries not available"
        
        try:
            conn = await asyncpg.connect(
                host=connection.host,
                port=connection.port,
                database=connection.database,
                user=connection.username,
                password=connection.password
            )
            
            return True, conn, "Connected successfully"
            
        except Exception as e:
            return False, None, f"PostgreSQL local connection failed: {str(e)}"
    
    async def _connect_xata_api(self, connection: DatabaseConnection) -> Tuple[bool, Any, str]:
        """Connect to Xata API"""
        if not REQUESTS_AVAILABLE:
            return False, None, "Requests library not available"
        
        try:
            # Create session object for API calls
            session = requests.Session()
            session.headers.update({
                "Authorization": f"Bearer {connection.api_key}",
                "Content-Type": "application/json"
            })
            
            # Store connection info in session
            session.xata_config = {
                "workspace": connection.workspace,
                "database": connection.database,
                "region": connection.region,
                "base_url": f"https://{connection.workspace}.{connection.region}.xata.sh/db/{connection.database}"
            }
            
            return True, session, "Connected successfully"
            
        except Exception as e:
            return False, None, f"Xata API connection failed: {str(e)}"
    
    async def _connect_sqlite(self, connection: DatabaseConnection) -> Tuple[bool, Any, str]:
        """Connect to SQLite"""
        if not SQLITE_AVAILABLE:
            return False, None, "SQLite not available"
        
        try:
            if not Path(connection.file_path).exists():
                return False, None, f"SQLite file not found: {connection.file_path}"
            
            conn = sqlite3.connect(connection.file_path)
            conn.row_factory = sqlite3.Row  # Enable dict-like access
            
            return True, conn, "Connected successfully"
            
        except Exception as e:
            return False, None, f"SQLite connection failed: {str(e)}"
    
    async def _execute_postgresql_query(self, conn, query: str, params: Optional[List] = None) -> Tuple[bool, Any, str]:
        """Execute PostgreSQL query"""
        try:
            if params:
                result = await conn.fetch(query, *params)
            else:
                result = await conn.fetch(query)
            
            # Convert asyncpg Records to dicts
            result_dicts = [dict(row) for row in result]
            
            return True, result_dicts, "Query executed successfully"
            
        except Exception as e:
            return False, None, f"Query execution failed: {str(e)}"
    
    async def _execute_xata_query(self, session, query: str, params: Optional[List] = None) -> Tuple[bool, Any, str]:
        """Execute Xata API query"""
        try:
            # For Xata API, we'd need to convert SQL to API calls
            # This is a simplified implementation
            config = session.xata_config
            
            # Simple table list query
            if query.lower().strip() == "show tables":
                response = session.get(f"{config['base_url']}/tables")
                if response.status_code == 200:
                    tables = response.json()
                    result = [{"table_name": table["name"]} for table in tables.get("tables", [])]
                    return True, result, "Query executed successfully"
                else:
                    return False, None, f"API error: {response.status_code}"
            
            # For other queries, would need more sophisticated SQL parsing
            return False, None, "Complex SQL queries not yet supported for Xata API"
            
        except Exception as e:
            return False, None, f"Xata query execution failed: {str(e)}"
    
    async def _execute_sqlite_query(self, conn, query: str, params: Optional[List] = None) -> Tuple[bool, Any, str]:
        """Execute SQLite query"""
        try:
            cursor = conn.cursor()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # Get results for SELECT queries
            if query.strip().lower().startswith('select'):
                result = [dict(row) for row in cursor.fetchall()]
            else:
                conn.commit()
                result = {"affected_rows": cursor.rowcount}
            
            cursor.close()
            
            return True, result, "Query executed successfully"
            
        except Exception as e:
            return False, None, f"SQLite query execution failed: {str(e)}"
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        stats = {
            "total_connections": len(self.connections),
            "active_connections": len(self.active_connections),
            "connection_types": {},
            "connection_status": {}
        }
        
        # Count by type
        for connection in self.connections.values():
            db_type = connection.db_type.value
            stats["connection_types"][db_type] = stats["connection_types"].get(db_type, 0) + 1
            
            status = connection.status.value
            stats["connection_status"][status] = stats["connection_status"].get(status, 0) + 1
        
        return stats
    
    def create_quick_connection(self, connection_type: str, **kwargs) -> Optional[DatabaseConnection]:
        """Create quick connection with preset configurations"""
        if connection_type == "xata_wire":
            # Xata wire-enabled PostgreSQL
            return DatabaseConnection(
                name=f"Xata Wire - {kwargs.get('database', 'ultraterrestrial')}",
                db_type=DatabaseType.POSTGRESQL_WIRE,
                host=kwargs.get('host', 'us-east-1.sql.xata.sh'),
                port=kwargs.get('port', 5432),
                database=kwargs.get('database', 'ultraterrestrial-postgres:main'),
                username=kwargs.get('username', os.getenv('XATA_WIRE_USER', '')),
                password=kwargs.get('password', os.getenv('XATA_WIRE_PASSWORD', '')),
                ssl_mode="require",
                metadata={"preset": "xata_wire"}
            )
        
        elif connection_type == "local_postgres":
            # Local PostgreSQL
            return DatabaseConnection(
                name=f"Local PostgreSQL - {kwargs.get('database', 'postgres')}",
                db_type=DatabaseType.POSTGRESQL_LOCAL,
                host=kwargs.get('host', 'localhost'),
                port=kwargs.get('port', 5432),
                database=kwargs.get('database', 'postgres'),
                username=kwargs.get('username', 'postgres'),
                password=kwargs.get('password', ''),
                ssl_mode="prefer",
                metadata={"preset": "local_postgres"}
            )
        
        elif connection_type == "xata_api":
            # Xata REST API
            return DatabaseConnection(
                name=f"Xata API - {kwargs.get('database', 'ultraterrestrial')}",
                db_type=DatabaseType.XATA_API,
                api_key=kwargs.get('api_key', os.getenv('XATA_API_KEY', '')),
                workspace=kwargs.get('workspace', os.getenv('XATA_WORKSPACE', '')),
                database=kwargs.get('database', 'ultraterrestrial'),
                region=kwargs.get('region', 'us-east-1'),
                metadata={"preset": "xata_api"}
            )
        
        return None


# Convenience functions for quick access
def create_connection_manager() -> DatabaseConnectionManager:
    """Create a new connection manager instance"""
    return DatabaseConnectionManager()

def get_default_xata_wire_connection() -> Optional[DatabaseConnection]:
    """Get default Xata wire connection from environment"""
    manager = DatabaseConnectionManager()
    return manager.create_quick_connection("xata_wire")

def get_default_local_postgres_connection() -> Optional[DatabaseConnection]:
    """Get default local PostgreSQL connection"""
    manager = DatabaseConnectionManager()
    return manager.create_quick_connection("local_postgres")

def get_default_xata_api_connection() -> Optional[DatabaseConnection]:
    """Get default Xata API connection from environment"""
    manager = DatabaseConnectionManager()
    return manager.create_quick_connection("xata_api")


if __name__ == "__main__":
    # Test the connection manager
    async def test_connection_manager():
        manager = DatabaseConnectionManager()
        
        # Test creating connections
        xata_wire = manager.create_quick_connection("xata_wire", database="test")
        if xata_wire:
            success = manager.add_connection(xata_wire)
            print(f"Added Xata wire connection: {success}")
            
            # Test connection
            test_success, test_message = manager.test_connection(xata_wire.name)
            print(f"Test result: {test_success} - {test_message}")
        
        # Print stats
        stats = manager.get_connection_stats()
        print(f"Connection stats: {stats}")
    
    # Run test
    import asyncio
    asyncio.run(test_connection_manager())