#!/usr/bin/env python3
"""
Library Consolidation Tool
Consolidate your scattered UFO document libraries into one unified local system
"""

import os
import sys
from pathlib import Path
from typing import List
import argparse

# Add the lib directory to the path
sys.path.append(str(Path(__file__).parent / "lib"))

from storage.local_vector_library import LocalVectorLibrary

def find_potential_libraries() -> List[str]:
    """Scan for potential document libraries in common locations"""
    
    potential_paths = []
    
    # Common library locations
    search_dirs = [
        ".",
        "./documents",
        "./data", 
        "./downloads",
        "./transcripts",
        "./case_files",
        "./research",
        "../documents",
        "~/Documents",
        "~/Downloads"
    ]
    
    for search_dir in search_dirs:
        try:
            search_path = Path(search_dir).expanduser()
            if search_path.exists() and search_path.is_dir():
                
                # Look for directories with documents
                for subdir in search_path.iterdir():
                    if subdir.is_dir():
                        # Count text files
                        text_files = list(subdir.glob("*.txt")) + list(subdir.glob("*.md")) + list(subdir.glob("*.html"))
                        if len(text_files) > 2:  # Has multiple text files
                            potential_paths.append(str(subdir))
                            
                # Also check the directory itself
                text_files = list(search_path.glob("*.txt")) + list(search_path.glob("*.md")) + list(search_path.glob("*.html"))
                if len(text_files) > 5:  # Has many text files
                    potential_paths.append(str(search_path))
                    
        except Exception as e:
            continue
    
    # Remove duplicates and sort
    potential_paths = sorted(list(set(potential_paths)))
    
    return potential_paths

def interactive_consolidation():
    """Interactive tool for consolidating libraries"""
    
    print("🛸 UFO Document Library Consolidation Tool")
    print("=" * 50)
    
    # Find potential libraries
    print("\n🔍 Scanning for potential document libraries...")
    potential_libs = find_potential_libraries()
    
    if potential_libs:
        print(f"\n📁 Found {len(potential_libs)} potential libraries:")
        for i, path in enumerate(potential_libs, 1):
            file_count = len(list(Path(path).glob("*.txt"))) + len(list(Path(path).glob("*.md")))
            print(f"  {i}. {path} ({file_count} text files)")
        
        print("\n" + "=" * 50)
        
        # Let user select which ones to consolidate
        print("\nSelect libraries to consolidate:")
        print("Enter numbers separated by commas (e.g., 1,3,5) or 'all' for everything:")
        
        selection = input("Selection: ").strip()
        
        selected_paths = []
        if selection.lower() == 'all':
            selected_paths = potential_libs
        else:
            try:
                indices = [int(x.strip()) - 1 for x in selection.split(',')]
                selected_paths = [potential_libs[i] for i in indices if 0 <= i < len(potential_libs)]
            except ValueError:
                print("❌ Invalid selection format")
                return
        
        if not selected_paths:
            print("❌ No libraries selected")
            return
            
    else:
        # Manual entry
        print("\n📁 No libraries found automatically.")
        print("Enter library paths manually (one per line, empty line to finish):")
        
        selected_paths = []
        while True:
            path = input("Library path: ").strip()
            if not path:
                break
            if Path(path).exists():
                selected_paths.append(path)
                print(f"  ✅ Added: {path}")
            else:
                print(f"  ❌ Path not found: {path}")
        
        if not selected_paths:
            print("❌ No valid paths entered")
            return
    
    # Set up output library
    print(f"\n📚 Setting up unified library...")
    output_dir = input("Output directory [./unified_ufo_library]: ").strip() or "./unified_ufo_library"
    
    # Initialize library
    try:
        library = LocalVectorLibrary(output_dir)
        print(f"✅ Library initialized: {output_dir}")
    except Exception as e:
        print(f"❌ Failed to initialize library: {e}")
        return
    
    # Consolidate
    print(f"\n🔄 Consolidating {len(selected_paths)} libraries...")
    print("This may take a while for large collections...")
    
    total_consolidated = 0
    for i, lib_path in enumerate(selected_paths, 1):
        print(f"\n📂 Processing library {i}/{len(selected_paths)}: {lib_path}")
        try:
            count = library.consolidate_libraries([lib_path])
            total_consolidated += count
            print(f"  ✅ Added {count} documents")
        except Exception as e:
            print(f"  ❌ Error processing {lib_path}: {e}")
    
    # Show final stats
    print(f"\n🎉 Consolidation complete!")
    print(f"📊 Total documents consolidated: {total_consolidated}")
    
    stats = library.get_library_stats()
    print(f"\n📈 Final Library Statistics:")
    for key, value in stats.items():
        print(f"  • {key.replace('_', ' ').title()}: {value}")
    
    # Export options
    print(f"\n💾 Export Options:")
    print("1. Export as ZIP archive")
    print("2. Export as JSON")
    print("3. Skip export")
    
    export_choice = input("Choice [3]: ").strip() or "3"
    
    if export_choice == "1":
        export_path = input("ZIP export path [./library_backup.zip]: ").strip() or "./library_backup.zip"
        library.export_library(export_path, "zip")
    elif export_choice == "2":
        export_path = input("JSON export path [./library_backup.json]: ").strip() or "./library_backup.json"
        library.export_library(export_path, "json")
    
    print(f"\n✨ Your unified library is ready at: {output_dir}")
    print("🔍 You can now search and manage all your documents in one place!")

def batch_consolidation(source_paths: List[str], output_dir: str):
    """Non-interactive batch consolidation"""
    
    print(f"🛸 Batch consolidation: {len(source_paths)} libraries -> {output_dir}")
    
    # Initialize library
    library = LocalVectorLibrary(output_dir)
    
    # Consolidate all at once
    total_count = library.consolidate_libraries(source_paths)
    
    # Show results
    stats = library.get_library_stats()
    print(f"\n✅ Consolidation complete: {total_count} documents")
    print(f"📊 Library stats: {stats}")
    
    return library

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Consolidate UFO document libraries")
    parser.add_argument("--interactive", "-i", action="store_true", 
                       help="Interactive mode (default)")
    parser.add_argument("--output", "-o", default="./unified_ufo_library",
                       help="Output directory")
    parser.add_argument("--sources", "-s", nargs="+",
                       help="Source library directories")
    parser.add_argument("--auto-find", "-a", action="store_true",
                       help="Automatically find and consolidate all libraries")
    
    args = parser.parse_args()
    
    if args.auto_find:
        # Auto-find and consolidate everything
        potential_libs = find_potential_libraries()
        if potential_libs:
            print(f"🔍 Auto-found {len(potential_libs)} libraries")
            batch_consolidation(potential_libs, args.output)
        else:
            print("❌ No libraries found automatically")
    
    elif args.sources:
        # Batch mode with specified sources
        batch_consolidation(args.sources, args.output)
    
    else:
        # Interactive mode (default)
        interactive_consolidation()

if __name__ == "__main__":
    main()