#!/usr/bin/env python3
"""
Simple delta checker between local knowledge base and OpenAI vector store
Uses existing disclosure-rag tools
"""

import os
import sys
from pathlib import Path
import json

# Add disclosure-rag to path
disclosure_rag_path = Path(__file__).parent.parent / "apps" / "disclosure-rag"
sys.path.append(str(disclosure_rag_path))

def count_local_files():
    """Count files in packages/knowledge-base"""
    kb_path = Path(__file__).parent
    
    # Count PDFs
    pdfs = list(kb_path.glob("case_files/*.pdf"))
    
    # Count transcripts (handle nested structure)
    transcripts = list(kb_path.glob("transcripts/**/*.txt"))
    
    # Count markdown files
    markdown = list(kb_path.glob("**/*.md"))
    
    return {
        "pdfs": len(pdfs),
        "transcripts": len(transcripts), 
        "markdown": len(markdown),
        "total": len(pdfs) + len(transcripts) + len(markdown),
        "pdf_list": [p.name for p in pdfs[:10]],  # First 10 for preview
        "transcript_list": [t.name for t in transcripts[:10]],
    }

def check_openai_files():
    """Check OpenAI vector store files using existing tools"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        vector_store_id = 'vs_meWOEnUiUxtQWf0W6NBsNpCG'
        
        # Get vector store info
        try:
            vector_store = client.beta.vector_stores.retrieve(vector_store_id)
            file_counts = vector_store.file_counts
            
            return {
                "status": "accessible",
                "file_counts": file_counts,
                "name": getattr(vector_store, 'name', 'Unknown'),
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "suggestion": "Check OPENAI_API_KEY or vector store ID"
            }
            
    except ImportError:
        return {
            "status": "no_openai",
            "error": "OpenAI client not available",
            "suggestion": "Install: pip install openai"
        }

def suggest_sync_approach(local_count, openai_info):
    """Suggest sync approach based on current state"""
    suggestions = []
    
    if local_count["total"] == 0:
        suggestions.append("❌ No local files found - check knowledge-base directory")
        return suggestions
    
    if openai_info["status"] != "accessible":
        suggestions.append("❌ Cannot access OpenAI vector store")
        suggestions.append(f"   Error: {openai_info.get('error', 'Unknown')}")
        suggestions.append(f"   Fix: {openai_info.get('suggestion', 'Check configuration')}")
        return suggestions
    
    # We have both local files and OpenAI access
    openai_count = openai_info.get("file_counts", {})
    
    suggestions.append("✅ Both local files and OpenAI vector store accessible")
    suggestions.append(f"📁 Local files: {local_count['total']}")
    suggestions.append(f"☁️  OpenAI files: {openai_count}")
    
    # Recommend using existing disclosure-rag tools
    suggestions.append("")
    suggestions.append("🔄 Recommended sync approach:")
    suggestions.append("1. Use existing consolidation tool:")
    suggestions.append("   cd apps/disclosure-rag")
    suggestions.append("   python3 consolidate_libraries.py --sources ../../packages/knowledge-base")
    suggestions.append("")
    suggestions.append("2. Sync to PostgreSQL:")
    suggestions.append("   python3 main.py --process-directory ./unified_ufo_library")
    suggestions.append("")
    suggestions.append("3. Verify in Streamlit UI:")
    suggestions.append("   ./launch_dashboard.sh")
    
    return suggestions

def main():
    print("🛸 Knowledge Base Delta Analysis")
    print("=" * 50)
    
    # Check local files
    print("📁 Scanning local knowledge base...")
    local_count = count_local_files()
    
    print(f"Local files found:")
    print(f"  📄 PDFs: {local_count['pdfs']}")
    print(f"  📝 Transcripts: {local_count['transcripts']}")
    print(f"  📖 Markdown: {local_count['markdown']}")
    print(f"  📊 Total: {local_count['total']}")
    
    if local_count['pdfs'] > 0:
        print(f"  📄 Sample PDFs: {', '.join(local_count['pdf_list'])}")
    
    print("\n" + "=" * 50)
    
    # Check OpenAI
    print("☁️  Checking OpenAI vector store...")
    openai_info = check_openai_files()
    
    print(f"OpenAI Status: {openai_info['status']}")
    if openai_info['status'] == 'accessible':
        print(f"Vector Store: {openai_info['name']}")
        print(f"File Counts: {openai_info['file_counts']}")
    
    print("\n" + "=" * 50)
    
    # Suggestions
    print("💡 Recommendations:")
    suggestions = suggest_sync_approach(local_count, openai_info)
    for suggestion in suggestions:
        print(suggestion)
    
    # Save report
    report = {
        "timestamp": str(Path().cwd()),
        "local_files": local_count,
        "openai_info": openai_info,
        "suggestions": suggestions
    }
    
    report_path = Path(__file__).parent / "delta-report.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📊 Report saved to: {report_path}")

if __name__ == "__main__":
    main()