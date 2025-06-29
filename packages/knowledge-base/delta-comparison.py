#!/usr/bin/env python3
"""
Delta comparison between local knowledge-base and OpenAI vector store
Uses working vector store query from disclosure-rag
Date: December 20, 2024
"""

from lib.openai_client.vector_store_query import list_vector_store_files
import os
import sys
import json
from pathlib import Path
from datetime import datetime
import pandas as pd

# Add disclosure-rag to path to use their working OpenAI integration
disclosure_rag_path = Path(__file__).parent.parent / "apps" / "disclosure-rag"
sys.path.append(str(disclosure_rag_path))


def scan_local_knowledge_base():
    """Scan packages/knowledge-base for all files"""
    kb_path = Path(__file__).parent

    local_files = {
        "pdfs": [],
        "transcripts": [],
        "markdown": [],
        "other": []
    }

    # Scan PDFs in case_files
    for pdf in kb_path.glob("case_files/*.pdf"):
        local_files["pdfs"].append({
            "name": pdf.name,
            "path": str(pdf.relative_to(kb_path)),
            "size": pdf.stat().st_size,
            "modified": pdf.stat().st_mtime
        })

    # Scan transcripts (all nested .txt files)
    for txt in kb_path.glob("transcripts/**/*.txt"):
        # Skip summary files
        if "Summary" in txt.name:
            continue

        local_files["transcripts"].append({
            "name": txt.name,
            "path": str(txt.relative_to(kb_path)),
            "size": txt.stat().st_size,
            "modified": txt.stat().st_mtime
        })

    # Scan markdown files
    for md in kb_path.glob("**/*.md"):
        if "node_modules" not in str(md):
            local_files["markdown"].append({
                "name": md.name,
                "path": str(md.relative_to(kb_path)),
                "size": md.stat().st_size,
                "modified": md.stat().st_mtime
            })

    return local_files


def query_openai_vector_store():
    """Query OpenAI vector store using existing working code"""
    vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"

    try:
        print("🔍 Querying OpenAI vector store...")
        df = list_vector_store_files(vector_store_id, download_contents=False)

        if df is not None:
            return {
                "status": "success",
                "file_count": len(df),
                "files": df.to_dict('records'),
                "total_bytes": df['bytes'].sum() if 'bytes' in df.columns else 0
            }
        else:
            return {"status": "error", "message": "Failed to retrieve files"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def compare_sources(local_files, openai_data):
    """Compare local files with OpenAI vector store"""

    # Flatten local files for comparison
    all_local = []
    for category, files in local_files.items():
        all_local.extend([f["name"] for f in files])

    local_set = set(all_local)

    if openai_data["status"] == "success":
        openai_files = [f["filename"] for f in openai_data["files"]]
        openai_set = set(openai_files)

        comparison = {
            "local_only": sorted(list(local_set - openai_set)),
            "openai_only": sorted(list(openai_set - local_set)),
            "in_both": sorted(list(local_set & openai_set)),
            "local_count": len(local_set),
            "openai_count": len(openai_set),
            "overlap_count": len(local_set & openai_set)
        }
    else:
        comparison = {
            "local_only": sorted(list(local_set)),
            "openai_only": [],
            "in_both": [],
            "local_count": len(local_set),
            "openai_count": 0,
            "overlap_count": 0,
            "openai_error": openai_data["message"]
        }

    return comparison


def generate_report(local_files, openai_data, comparison):
    """Generate comprehensive delta report"""

    timestamp = datetime.now().isoformat()

    report = {
        "analysis_date": timestamp,
        "summary": {
            "local_files_total": sum(len(files) for files in local_files.values()),
            "local_pdfs": len(local_files["pdfs"]),
            "local_transcripts": len(local_files["transcripts"]),
            "local_markdown": len(local_files["markdown"]),
            "openai_status": openai_data["status"],
            "openai_files_total": openai_data.get("file_count", 0),
            "files_in_both": comparison["overlap_count"],
            "files_only_local": len(comparison["local_only"]),
            "files_only_openai": len(comparison["openai_only"])
        },
        "detailed_data": {
            "local_files": local_files,
            "openai_data": openai_data,
            "comparison": comparison
        },
        "recommendations": []
    }

    # Generate recommendations
    if openai_data["status"] == "error":
        report["recommendations"].append(
            "❌ Fix OpenAI API access to complete comparison")
        report["recommendations"].append(
            f"   Error: {openai_data.get('message', 'Unknown error')}")
    else:
        if comparison["overlap_count"] > 0:
            report["recommendations"].append(
                f"✅ {comparison['overlap_count']} files already synced")

        if len(comparison["local_only"]) > 0:
            report["recommendations"].append(
                f"📤 {len(comparison['local_only'])} local files need uploading to OpenAI")

        if len(comparison["openai_only"]) > 0:
            report["recommendations"].append(
                f"📥 {len(comparison['openai_only'])} OpenAI files not in local")

    # Sync strategy recommendations
    report["recommendations"].extend([
        "",
        "🔄 Recommended sync approach:",
        "1. Use existing disclosure-rag consolidation:",
        "   cd apps/disclosure-rag",
        "   python3 consolidate_libraries.py --sources ../../packages/knowledge-base",
        "",
        "2. Process with existing RAG system:",
        "   python3 main.py --process-directory ./unified_ufo_library",
        "",
        "3. Verify sync in Streamlit UI:",
        "   ./launch_dashboard.sh"
    ])

    return report


def main():
    print("🛸 Knowledge Base Delta Comparison")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Scan local files
    print("📁 Scanning local knowledge base...")
    local_files = scan_local_knowledge_base()

    total_local = sum(len(files) for files in local_files.values())
    print(f"Local files found:")
    print(f"  📄 PDFs: {len(local_files['pdfs'])}")
    print(f"  📝 Transcripts: {len(local_files['transcripts'])}")
    print(f"  📖 Markdown: {len(local_files['markdown'])}")
    print(f"  📊 Total: {total_local}")

    print("\n" + "=" * 60)

    # Query OpenAI vector store
    openai_data = query_openai_vector_store()

    if openai_data["status"] == "success":
        print(f"☁️  OpenAI Vector Store: {openai_data['file_count']} files")
        print(f"   Total size: {openai_data['total_bytes']:,} bytes")
    else:
        print(f"❌ OpenAI Error: {openai_data['message']}")

    print("\n" + "=" * 60)

    # Compare sources
    print("🔄 Comparing sources...")
    comparison = compare_sources(local_files, openai_data)

    print(f"Comparison results:")
    print(f"  📊 Local files: {comparison['local_count']}")
    print(f"  ☁️  OpenAI files: {comparison['openai_count']}")
    print(f"  ✅ In both: {comparison['overlap_count']}")
    print(f"  📤 Only local: {len(comparison['local_only'])}")
    print(f"  📥 Only OpenAI: {len(comparison['openai_only'])}")

    # Show sample differences
    if comparison['local_only']:
        print(f"\n📤 Sample files only in local (showing first 10):")
        for file in comparison['local_only'][:10]:
            print(f"   - {file}")

    if comparison['openai_only']:
        print(f"\n📥 Sample files only in OpenAI (showing first 10):")
        for file in comparison['openai_only'][:10]:
            print(f"   - {file}")

    print("\n" + "=" * 60)

    # Generate and save report
    report = generate_report(local_files, openai_data, comparison)

    report_path = Path(__file__).parent / \
        f"delta-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)

    print("💡 Recommendations:")
    for rec in report["recommendations"]:
        print(f"   {rec}")

    print(f"\n📊 Full report saved to: {report_path}")

    return report


if __name__ == "__main__":
    main()
