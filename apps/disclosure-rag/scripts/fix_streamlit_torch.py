#!/usr/bin/env python3
"""
Fix PyTorch/Streamlit Compatibility Issues
Run this script if you encounter torch-related errors with Streamlit
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path


def clear_streamlit_cache():
    """Clear Streamlit cache to resolve conflicts"""
    print("🧹 Clearing Streamlit cache...")
    try:
        subprocess.run(["streamlit", "cache", "clear"], check=True)
        print("✅ Streamlit cache cleared")
    except subprocess.CalledProcessError:
        print("⚠️ Could not clear Streamlit cache via command")

    # Also try to clear cache directories
    cache_dirs = [
        Path.home() / ".streamlit",
        Path.cwd() / ".streamlit",
        Path.cwd() / "__pycache__",
    ]

    for cache_dir in cache_dirs:
        if cache_dir.exists():
            try:
                if cache_dir.name == "__pycache__":
                    shutil.rmtree(cache_dir)
                print(f"✅ Cleared {cache_dir}")
            except Exception as e:
                print(f"⚠️ Could not clear {cache_dir}: {e}")


def set_environment_variables():
    """Set environment variables to prevent conflicts"""
    print("🔧 Setting environment variables...")

    env_vars = {
        "STREAMLIT_WATCHER_LOCAL_SOURCES_EXCLUDE_DIRS": "torch,torchvision,torchaudio",
        "STREAMLIT_SERVER_HEADLESS": "true",
        "STREAMLIT_BROWSER_GATHER_USAGE_STATS": "false",
    }

    for key, value in env_vars.items():
        os.environ[key] = value
        print(f"✅ Set {key}={value}")


def check_torch_installation():
    """Check if PyTorch is properly installed"""
    print("🔍 Checking PyTorch installation...")

    try:
        import torch
        print(f"✅ PyTorch version: {torch.__version__}")
        print(f"✅ CUDA available: {torch.cuda.is_available()}")
        return True
    except ImportError as e:
        print(f"❌ PyTorch import error: {e}")
        return False


def reinstall_torch():
    """Reinstall PyTorch to fix conflicts"""
    print("🔄 Reinstalling PyTorch...")

    try:
        # Uninstall torch packages
        subprocess.run([sys.executable, "-m", "pip", "uninstall", "-y", "torch", "torchvision", "torchaudio"],
                       check=False)

        # Reinstall with specific options
        subprocess.run([sys.executable, "-m", "pip", "install", "torch", "--no-cache-dir"],
                       check=True)

        print("✅ PyTorch reinstalled successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to reinstall PyTorch: {e}")
        return False


def create_streamlit_config():
    """Create Streamlit config to prevent conflicts"""
    print("📝 Creating Streamlit config...")

    config_dir = Path.home() / ".streamlit"
    config_dir.mkdir(exist_ok=True)

    config_content = """
[server]
headless = true
enableCORS = false
enableXsrfProtection = false

[browser]
gatherUsageStats = false

[theme]
base = "dark"
primaryColor = "#1E90FF"
"""

    config_file = config_dir / "config.toml"
    config_file.write_text(config_content.strip())
    print(f"✅ Created config at {config_file}")


def main():
    """Main function to fix PyTorch/Streamlit conflicts"""
    print("🛸 Disclosure RAG - PyTorch/Streamlit Conflict Fixer")
    print("=" * 60)

    # Step 1: Set environment variables
    set_environment_variables()

    # Step 2: Clear caches
    clear_streamlit_cache()

    # Step 3: Create Streamlit config
    create_streamlit_config()

    # Step 4: Check PyTorch
    if not check_torch_installation():
        print("\n🔄 Attempting to fix PyTorch installation...")
        if reinstall_torch():
            check_torch_installation()

    print("\n✅ Fixes applied! Try running the Streamlit app again:")
    print("streamlit run knowledge_base_ui.py")

    print("\n💡 If you still have issues, try:")
    print("1. Restart your terminal/IDE")
    print("2. Run: pip install --upgrade streamlit")
    print("3. Use: streamlit run knowledge_base_ui.py --server.headless true")


if __name__ == "__main__":
    main()
