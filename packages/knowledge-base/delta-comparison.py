#!/usr/bin/env python3
"""
Advanced delta comparison tool for knowledge base
Compares local files with OpenAI vector store and disclosure-rag database
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
import hashlib

# Add apps/disclosure-rag to the path for imports
script_dir = Path(__file__).parent
repo_root = script_dir.parent.parent
disclosure_rag_path = repo_root / "apps" / "disclosure-rag"
sys.path.insert(0, str(disclosure_rag_path))

def analyze_local_files():
    """Analyze all files in the local knowledge base"""
    kb_path = Path(__file__).parent
    analysis = {
        "timestamp": datetime.now().isoformat(),
        "total_files": 0,
        "files_by_type": {},
        "directories": {},
        "file_details": []
    }
    
    # Analyze PDF files in sources/files/
    for pdf in kb_path.glob("sources/files/*.pdf"):
        analysis["file_details"].append({
            "path": str(pdf.relative_to(kb_path)),
            "name": pdf.name,
            "size": pdf.stat().st_size,
            "type": "pdf",
            "modified": datetime.fromtimestamp(pdf.stat().st_mtime).isoformat()
        })
    
    # Analyze transcript files in sources/transcripts/
    for transcript in kb_path.glob("sources/transcripts/**/*.txt"):
        analysis["file_details"].append({
            "path": str(transcript.relative_to(kb_path)),
            "name": transcript.name,
            "size": transcript.stat().st_size,
            "type": "transcript",
            "modified": datetime.fromtimestamp(transcript.stat().st_mtime).isoformat(),
            "date_folder": transcript.parent.name
        })
    
    # Analyze web content files
    for web_file in kb_path.glob("sources/web/**/*"):
        if web_file.is_file():
            analysis["file_details"].append({
                "path": str(web_file.relative_to(kb_path)),
                "name": web_file.name,
                "size": web_file.stat().st_size,
                "type": "web",
                "modified": datetime.fromtimestamp(web_file.stat().st_mtime).isoformat()
            })
    
    # Analyze metadata files
    for metadata in kb_path.glob("metadata/*.json"):
        analysis["file_details"].append({
            "path": str(metadata.relative_to(kb_path)),
            "name": metadata.name,
            "size": metadata.stat().st_size,
            "type": "metadata",
            "modified": datetime.fromtimestamp(metadata.stat().st_mtime).isoformat()
        })
    
    # Count by type
    for file_detail in analysis["file_details"]:
        file_type = file_detail["type"]
        analysis["files_by_type"][file_type] = analysis["files_by_type"].get(file_type, 0) + 1
    
    analysis["total_files"] = len(analysis["file_details"])
    
    # Directory structure analysis
    analysis["directories"]["sources/files"] = len(list(kb_path.glob("sources/files/*.pdf")))
    analysis["directories"]["sources/transcripts"] = len(list(kb_path.glob("sources/transcripts/**/*.txt")))
    analysis["directories"]["sources/web"] = len([f for f in kb_path.glob("sources/web/**/*") if f.is_file()])
    analysis["directories"]["metadata"] = len(list(kb_path.glob("metadata/*.json")))
    
    return analysis

def check_openai_vector_store():
    """Check OpenAI vector store status"""
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        vector_store_id = 'vs_meWOEnUiUxtQWf0W6NBsNpCG'
        
        try:
            vector_store = client.beta.vector_stores.retrieve(vector_store_id)
            return {
                "status": "accessible",
                "id": vector_store_id,
                "name": getattr(vector_store, 'name', 'Unnamed'),
                "file_counts": vector_store.file_counts,
                "created_at": getattr(vector_store, 'created_at', None)
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "suggestion": "Check API key and vector store ID"
            }
    except ImportError:
        return {
            "status": "no_client",
            "error": "OpenAI client not available",
            "suggestion": "pip install openai"
        }

def check_disclosure_rag_db():
    """Check disclosure-rag database status"""
    try:
        # Try to import disclosure-rag components
        from lib.connectors.ultraterrestrial_db import UltraterrestrialDB
        
        # Check if we can connect (would need env vars)
        return {
            "status": "importable",
            "suggestion": "Can import UltraterrestrialDB - check .env for DATABASE_URL"
        }
    except ImportError as e:
        return {
            "status": "import_error",
            "error": str(e),
            "suggestion": "Check disclosure-rag dependencies"
        }

def generate_sync_recommendations(local_analysis, openai_status, db_status):
    """Generate recommendations based on current state"""
    recommendations = []
    
    # Local files status
    if local_analysis["total_files"] == 0:
        recommendations.append({
            "priority": "high",
            "type": "error",
            "message": "No local files found in knowledge base",
            "action": "Verify knowledge-base directory structure"
        })
        return recommendations
    
    recommendations.append({
        "priority": "info",
        "type": "status",
        "message": f"Found {local_analysis['total_files']} local files",
        "details": local_analysis["files_by_type"]
    })
    
    # OpenAI status
    if openai_status["status"] == "accessible":
        recommendations.append({
            "priority": "info",
            "type": "status", 
            "message": "OpenAI vector store is accessible",
            "details": openai_status["file_counts"]
        })
    else:
        recommendations.append({
            "priority": "medium",
            "type": "warning",
            "message": f"OpenAI vector store not accessible: {openai_status.get('error', 'Unknown error')}",
            "action": openai_status.get("suggestion", "Fix OpenAI configuration")
        })
    
    # Sync recommendations
    recommendations.append({
        "priority": "high",
        "type": "action",
        "message": "Use existing disclosure-rag consolidation tools",
        "action": "cd apps/disclosure-rag && python3 consolidate_libraries.py --sources ../../packages/knowledge-base"
    })
    
    recommendations.append({
        "priority": "medium", 
        "type": "action",
        "message": "Sync to PostgreSQL database",
        "action": "cd apps/disclosure-rag && python3 main.py --sync-local-library"
    })
    
    recommendations.append({
        "priority": "low",
        "type": "action",
        "message": "Verify integration in Streamlit dashboard",
        "action": "cd apps/disclosure-rag && ./launch_dashboard.sh"
    })
    
    return recommendations

def main():
    print("🔍 Advanced Knowledge Base Delta Analysis")
    print("=" * 60)
    
    # Analyze local files
    print("📁 Analyzing local files...")
    local_analysis = analyze_local_files()
    
    print(f"   Found {local_analysis['total_files']} total files:")
    for file_type, count in local_analysis["files_by_type"].items():
        print(f"     {file_type}: {count}")
    
    # Check OpenAI
    print("\n☁️  Checking OpenAI vector store...")
    openai_status = check_openai_vector_store()
    print(f"   Status: {openai_status['status']}")
    
    # Check disclosure-rag
    print("\n🐍 Checking disclosure-rag database...")
    db_status = check_disclosure_rag_db()
    print(f"   Status: {db_status['status']}")
    
    # Generate recommendations
    print("\n💡 Generating recommendations...")
    recommendations = generate_sync_recommendations(local_analysis, openai_status, db_status)
    
    # Display recommendations
    print("\n📋 Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        priority_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢", "info": "ℹ️"}
        emoji = priority_emoji.get(rec["priority"], "📌")
        print(f"\n{i}. {emoji} {rec['message']}")
        if "action" in rec:
            print(f"   Action: {rec['action']}")
        if "details" in rec:
            print(f"   Details: {rec['details']}")
    
    # Save comprehensive report
    report = {
        "timestamp": datetime.now().isoformat(),
        "local_analysis": local_analysis,
        "openai_status": openai_status,
        "database_status": db_status,
        "recommendations": recommendations
    }
    
    report_path = Path(__file__).parent / "delta-comparison-report.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n📊 Detailed report saved to: {report_path}")
    print(f"📈 Summary: {local_analysis['total_files']} local files analyzed")

if __name__ == "__main__":
    main()