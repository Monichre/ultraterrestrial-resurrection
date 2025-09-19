#!/usr/bin/env python3
"""
Fix script for disclosure-rag issues:
1. Xata entity creation failures
2. yt-dlp metadata extraction issues
3. Mem0 authentication issues
4. CocoIndex installation
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def print_status(message, status="INFO"):
    colors = {
        "INFO": "\033[94m",
        "SUCCESS": "\033[92m",
        "WARNING": "\033[93m",
        "ERROR": "\033[91m"
    }
    end = "\033[0m"
    print(f"{colors.get(status, '')}[{status}] {message}{end}")

def fix_xata_connection():
    """Fix Xata database connection issues"""
    print_status("Fixing Xata database connection...")
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        env_file_example = Path(".env.example")
        if env_file_example.exists():
            print_status("Creating .env file from .env.example", "WARNING")
            subprocess.run(["cp", ".env.example", ".env"])
    
    # Load .env file
    from dotenv import load_dotenv
    load_dotenv(override=True)
    
    # Test Xata connection with proper environment loading
    test_code = """
import os
from dotenv import load_dotenv
load_dotenv()

# Get credentials
api_key = os.getenv('XATA_API_KEY')
db_url = os.getenv('XATA_DATABASE_URL')
branch = os.getenv('XATA_BRANCH', 'main')

if not api_key or not db_url:
    print(f"ERROR: Missing credentials - API_KEY: {bool(api_key)}, DB_URL: {bool(db_url)}")
    exit(1)

# Test basic connection
import requests
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

# Extract workspace and database from URL
import re
match = re.match(r'https://([^.]+)-([^.]+)\\.([^.]+)\\.xata.sh/db/([^/]+)', db_url)
if match:
    workspace = match.group(1)
    region = match.group(3)
    database = match.group(4)
    
    # Test the connection with a simple query
    test_url = f"{db_url}:branch/{branch}/tables/topics/query"
    
    response = requests.post(
        test_url,
        headers=headers,
        json={"page": {"size": 1}}
    )
    
    if response.status_code == 200:
        print("SUCCESS: Xata connection working!")
    else:
        print(f"ERROR: Xata API returned {response.status_code}: {response.text[:200]}")
else:
    print(f"ERROR: Could not parse database URL: {db_url}")
"""
    
    # Write test script
    with open("test_xata.py", "w") as f:
        f.write(test_code)
    
    # Run test
    result = subprocess.run([sys.executable, "test_xata.py"], capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print_status(result.stderr, "ERROR")
    
    # Clean up
    os.remove("test_xata.py")
    
    if "SUCCESS" in result.stdout:
        print_status("Xata connection fixed!", "SUCCESS")
        
        # Fix the entity creator to properly use environment variables
        fix_entity_creator()
    else:
        print_status("Xata connection still has issues - check your API key and database URL", "ERROR")

def fix_entity_creator():
    """Fix the entity creator to properly handle Xata operations"""
    print_status("Fixing entity creator for proper Xata integration...")
    
    # Create a wrapper script that properly loads environment variables
    wrapper_code = '''#!/usr/bin/env python3
"""
Fixed Xata client wrapper that properly loads environment variables
"""
import os
from dotenv import load_dotenv

# Force reload of environment variables
load_dotenv(override=True)

# Now import the xata client with proper env vars loaded
XATA_API_KEY = os.getenv("XATA_API_KEY")
XATA_DATABASE_URL = os.getenv("XATA_DATABASE_URL")
XATA_BRANCH = os.getenv("XATA_BRANCH", "main")

if not XATA_API_KEY or not XATA_DATABASE_URL:
    raise EnvironmentError(f"Missing Xata credentials: API_KEY={bool(XATA_API_KEY)}, DB_URL={bool(XATA_DATABASE_URL)}")

# Import and initialize the Xata client
try:
    from xata import Client
    xata_client = Client(
        api_key=XATA_API_KEY,
        db_url=XATA_DATABASE_URL,
        branch_name=XATA_BRANCH
    )
    print(f"Xata client initialized successfully for database: {XATA_DATABASE_URL}")
except ImportError:
    print("WARNING: xata package not installed, trying xata.py")
    try:
        from xata.client import XataClient
        xata_client = XataClient(
            api_key=XATA_API_KEY,
            db_url=XATA_DATABASE_URL
        )
    except ImportError:
        xata_client = None
        print("ERROR: No Xata client available")

# Export for use
__all__ = ["xata_client", "XATA_API_KEY", "XATA_DATABASE_URL", "XATA_BRANCH"]
'''
    
    # Save the wrapper
    wrapper_path = Path("lib/xata_client_fixed.py")
    wrapper_path.write_text(wrapper_code)
    print_status(f"Created fixed Xata client wrapper at {wrapper_path}", "SUCCESS")

def fix_ytdlp():
    """Update yt-dlp to latest version to fix YouTube extraction issues"""
    print_status("Updating yt-dlp to fix YouTube extraction issues...")
    
    # Update yt-dlp
    result = subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        # Check version
        version_result = subprocess.run(["yt-dlp", "--version"], capture_output=True, text=True)
        print_status(f"yt-dlp updated to version: {version_result.stdout.strip()}", "SUCCESS")
        
        # Clear yt-dlp cache
        cache_dir = Path.home() / ".cache" / "yt-dlp"
        if cache_dir.exists():
            subprocess.run(["rm", "-rf", str(cache_dir)])
            print_status("Cleared yt-dlp cache", "SUCCESS")
    else:
        print_status("Failed to update yt-dlp", "ERROR")
        print(result.stderr)

def fix_mem0():
    """Fix or disable Mem0 integration"""
    print_status("Checking Mem0 integration...")
    
    # Check if Mem0 is configured
    from dotenv import load_dotenv
    load_dotenv()
    
    mem0_key = os.getenv("MEM0_API_KEY")
    
    if not mem0_key:
        print_status("Mem0 API key not configured - disabling Mem0 integration", "WARNING")
        
        # Create a flag file to disable Mem0
        flag_file = Path("lib/.disable_mem0")
        flag_file.touch()
        print_status("Created flag file to disable Mem0", "SUCCESS")
    else:
        # Install mem0ai package if needed
        try:
            import mem0ai
            print_status("Mem0 package already installed", "SUCCESS")
        except ImportError:
            print_status("Installing mem0ai package...", "INFO")
            subprocess.run([sys.executable, "-m", "pip", "install", "mem0ai"])

def install_cocoindex():
    """Install CocoIndex for knowledge graph support"""
    print_status("Checking CocoIndex installation...")
    
    try:
        import cocoindex
        print_status("CocoIndex already installed", "SUCCESS")
    except ImportError:
        print_status("CocoIndex not found - this is optional for knowledge graphs", "WARNING")
        response = input("Would you like to install CocoIndex? (y/n): ")
        if response.lower() == 'y':
            # CocoIndex might be a custom package - check if it's in requirements
            req_file = Path("requirements.txt")
            if req_file.exists():
                with open(req_file) as f:
                    if "cocoindex" in f.read():
                        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
                    else:
                        print_status("CocoIndex not in requirements.txt - skipping", "WARNING")

def update_entity_write_mode():
    """Update entity write mode to 'auto' for immediate writes"""
    print_status("Updating entity write mode for automatic database writes...")
    
    # Add to .env file
    env_file = Path(".env")
    if env_file.exists():
        content = env_file.read_text()
        if "ENTITY_WRITE_MODE" not in content:
            with open(env_file, "a") as f:
                f.write("\n# Entity creation mode: off|staging|auto\n")
                f.write("ENTITY_WRITE_MODE=auto\n")
                f.write("ENTITY_WRITE_MIN_CONFIDENCE=0.7\n")
                f.write("ENTITY_WRITE_RATE_LIMIT=30\n")
            print_status("Added entity write configuration to .env", "SUCCESS")
        else:
            print_status("Entity write mode already configured", "INFO")

def main():
    """Run all fixes"""
    print("\n" + "="*60)
    print("🔧 DISCLOSURE-RAG FIX SCRIPT")
    print("="*60 + "\n")
    
    # Check we're in the right directory
    if not Path("lib/youtube_handler.py").exists():
        print_status("Please run this script from the disclosure-rag directory", "ERROR")
        sys.exit(1)
    
    # Install required packages
    print_status("Installing required packages...")
    subprocess.run([sys.executable, "-m", "pip", "install", "python-dotenv", "requests"], 
                  capture_output=True)
    
    # Run fixes
    fix_xata_connection()
    fix_ytdlp()
    fix_mem0()
    install_cocoindex()
    update_entity_write_mode()
    
    print("\n" + "="*60)
    print("✅ FIX SCRIPT COMPLETE")
    print("="*60)
    print("\nRecommendations:")
    print("1. Test with: dy https://www.youtube.com/watch?v=LGQkkHuwm6w")
    print("2. Check entity creation in your Xata dashboard")
    print("3. Monitor logs for any remaining issues")
    print("\nIf issues persist:")
    print("- Verify your Xata API key is valid")
    print("- Check that your database name and branch are correct")
    print("- Ensure you have write permissions on the Xata database")

if __name__ == "__main__":
    main()