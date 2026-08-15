#!/usr/bin/env python3
"""
Setup script for CocoIndex UAP Knowledge Graph Flow
Handles database setup, environment configuration, and flow execution.
"""

import os
import sys
import logging
import subprocess
from pathlib import Path

# Add the disclosure-rag directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_requirements():
    """Check if required packages are installed"""
    required_packages = [
        "cocoindex",
        "psycopg2-binary",
        "neo4j",
        "openai"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        logger.error(f"Missing required packages: {missing_packages}")
        logger.info("Install with: pip install " + " ".join(missing_packages))
        return False
    
    return True

def setup_environment():
    """Setup environment variables with defaults"""
    env_vars = {
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": "5432",
        "POSTGRES_DATABASE": "disclosure_rag", 
        "POSTGRES_USER": "postgres",
        "POSTGRES_PASSWORD": "password",
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "password",
        "OPENAI_API_KEY": ""
    }
    
    for var, default in env_vars.items():
        if var not in os.environ:
            if var == "OPENAI_API_KEY":
                value = input(f"Enter {var} (required): ").strip()
                if not value:
                    logger.error("OpenAI API key is required")
                    sys.exit(1)
            else:
                value = input(f"Enter {var} (default: {default}): ").strip() or default
            os.environ[var] = value
            logger.info(f"Set {var}")

def setup_database():
    """Setup PostgreSQL database tables"""
    logger.info("Setting up PostgreSQL database tables...")
    
    script_path = Path(__file__).parent / "setup" / "cocoindex_tables_corrected.sql"
    
    if not script_path.exists():
        logger.error(f"Database setup script not found: {script_path}")
        return False
    
    try:
        import psycopg2
        
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
            database=os.getenv("POSTGRES_DATABASE"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD")
        )
        
        with conn.cursor() as cursor:
            with open(script_path, 'r') as f:
                cursor.execute(f.read())
        
        conn.commit()
        conn.close()
        
        logger.info("Database tables created successfully")
        return True
        
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False

def test_connections():
    """Test database connections"""
    logger.info("Testing database connections...")
    
    # Test PostgreSQL
    try:
        import psycopg2
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
            database=os.getenv("POSTGRES_DATABASE"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD")
        )
        conn.close()
        logger.info("✓ PostgreSQL connection successful")
    except Exception as e:
        logger.error(f"✗ PostgreSQL connection failed: {e}")
        return False
    
    # Test Neo4j (optional)
    try:
        from neo4j import GraphDatabase
        driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI"),
            auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
        )
        driver.verify_connectivity()
        driver.close()
        logger.info("✓ Neo4j connection successful")
    except Exception as e:
        logger.warning(f"⚠ Neo4j connection failed (optional): {e}")
    
    # Test OpenAI
    try:
        import openai
        client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))
        # Simple test to verify API key
        models = client.models.list()
        logger.info("✓ OpenAI API connection successful")
    except Exception as e:
        logger.error(f"✗ OpenAI API connection failed: {e}")
        return False
    
    return True

def run_flow():
    """Execute the CocoIndex flow"""
    logger.info("Starting CocoIndex UAP Knowledge Graph Flow...")
    
    try:
        from lib.cocoindex_flows import run_uap_kg_flow
        
        logger.info("Executing UAP disclosure knowledge graph flow...")
        run_uap_kg_flow()
        logger.info("Flow completed successfully!")
        
    except Exception as e:
        logger.error(f"Flow execution failed: {e}")
        return False
    
    return True

def main():
    """Main setup and execution function"""
    logger.info("CocoIndex UAP Knowledge Graph Setup")
    logger.info("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Setup environment
    setup_environment()
    
    # Test connections
    if not test_connections():
        logger.error("Connection tests failed. Please check your configuration.")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        logger.error("Database setup failed.")
        sys.exit(1)
    
    # Ask user if they want to run the flow
    run_now = input("\nRun the knowledge graph flow now? (y/N): ").strip().lower()
    
    if run_now == 'y':
        if run_flow():
            logger.info("Setup and execution completed successfully!")
        else:
            logger.error("Flow execution failed.")
            sys.exit(1)
    else:
        logger.info("Setup completed. You can run the flow later with:")
        logger.info("python -c 'from lib.cocoindex_flows import run_uap_kg_flow; run_uap_kg_flow()'")

if __name__ == "__main__":
    main()