
# Simple document indexing
import os
from pathlib import Path

docs_path = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/disclosure-rag/../docs/drstevengreer.com"
print(f"📁 Processing documents from: {docs_path}")

# Count documents
doc_files = []
for ext in [".pdf", ".txt", ".doc", ".docx", ".md", ".html"]:
    doc_files.extend(Path(docs_path).rglob(f"*{ext}"))

print(f"📊 Found {len(doc_files)} documents")

# For now, just list them
for i, doc in enumerate(doc_files[:10]):
    print(f"  {i+1}. {doc.name}")

if len(doc_files) > 10:
    print(f"  ... and {len(doc_files) - 10} more")

print("\n✅ Document scan complete!")
print("\nTo actually index these with CocoIndex:")
print("1. Set up a Python virtual environment")
print("2. Install: pip install cocoindex sentence-transformers")
print("3. Run the full indexing script")
