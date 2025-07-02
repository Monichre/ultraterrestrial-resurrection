#!/usr/bin/env python3
"""
Auto-Index Stephen Greer Document Collection
Date: June 29, 2025

Non-interactive version for indexing documents
"""

import os
import sys
from pathlib import Path

def create_simple_flow(docs_path):
    """Create a simple indexing script"""
    
    script = f'''
# Simple document indexing
import os
from pathlib import Path

docs_path = "{docs_path}"
print(f"📁 Processing documents from: {{docs_path}}")

# Count documents
doc_files = []
for ext in [".pdf", ".txt", ".doc", ".docx", ".md", ".html"]:
    doc_files.extend(Path(docs_path).rglob(f"*{{ext}}"))

print(f"📊 Found {{len(doc_files)}} documents")

# For now, just list them
for i, doc in enumerate(doc_files[:10]):
    print(f"  {{i+1}}. {{doc.name}}")

if len(doc_files) > 10:
    print(f"  ... and {{len(doc_files) - 10}} more")

print("\\n✅ Document scan complete!")
print("\\nTo actually index these with CocoIndex:")
print("1. Set up a Python virtual environment")
print("2. Install: pip install cocoindex sentence-transformers")
print("3. Run the full indexing script")
'''
    
    with open("scan_docs.py", "w") as f:
        f.write(script)
    
    return "scan_docs.py"

def main():
    docs_path = Path("../docs/drstevengreer.com/").absolute()
    
    print("🚀 Stephen Greer Document Collection Scanner")
    print("=" * 50)
    print(f"📁 Documents location: {docs_path}")
    
    # Create simple scanning script
    script_file = create_simple_flow(str(docs_path))
    
    # Run it
    os.system(f"python3 {script_file}")
    
    # Quick integration guide
    print("\n" + "=" * 50)
    print("📝 Quick Integration Guide")
    print("=" * 50)
    
    print("\n1️⃣ **For immediate use with existing system:**")
    print("   - Your documents can be manually uploaded to Upstash")
    print("   - Or use the existing disclosure-rag ingestion pipeline")
    
    print("\n2️⃣ **For local CocoIndex integration:**")
    print("   ```bash")
    print("   cd apps/disclosure-rag")
    print("   python3 -m venv venv")
    print("   source venv/bin/activate")
    print("   pip install cocoindex sentence-transformers upstash-vector")
    print("   ```")
    
    print("\n3️⃣ **Test the dual RAG system now:**")
    print("   ```bash")
    print("   # Terminal 1")
    print("   cd apps/disclosure-rag")
    print("   python3 api_server.py")
    print("   ")
    print("   # Terminal 2") 
    print("   cd apps/app")
    print("   npm run dev")
    print("   ```")
    
    print("\n4️⃣ **In TipTap Editor:**")
    print("   - Type @ to search documents")
    print("   - Use 🤖 Generate button for AI content")
    print("   - Use 📝 Summarize for document summaries")
    print("   - Use ✅ Fact Check to verify claims")
    
    print("\n💡 The dual RAG system will work with Upstash while CocoIndex is being set up!")

if __name__ == "__main__":
    main()