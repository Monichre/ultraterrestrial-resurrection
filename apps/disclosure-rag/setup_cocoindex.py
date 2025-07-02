#!/usr/bin/env python3
"""
CocoIndex Setup Script for UFO Research
Date: June 29, 2025

Quick setup script to test CocoIndex with a few sample documents
"""

import os
import sys
from pathlib import Path

def install_cocoindex():
    """Install CocoIndex if not already installed"""
    try:
        import cocoindex
        print("✓ CocoIndex already installed")
        return True
    except ImportError:
        print("Installing CocoIndex...")
        os.system("pip install cocoindex")
        try:
            import cocoindex
            print("✓ CocoIndex installed successfully")
            return True
        except ImportError:
            print("✗ Failed to install CocoIndex")
            return False

def create_sample_documents():
    """Create some sample UFO documents for testing"""
    docs_dir = Path("./test_ufo_docs")
    docs_dir.mkdir(exist_ok=True)
    
    # Sample documents
    documents = [
        {
            "filename": "phoenix_lights_1997.txt",
            "content": """
Phoenix Lights - March 13, 1997

The Phoenix Lights were a series of widely sighted unidentified flying objects 
observed in the skies over Arizona, Nevada, and the Mexican state of Sonora on 
March 13, 1997.

Two distinct events occurred:
1. A triangular formation of lights seen flying over Arizona
2. A series of stationary lights seen over Phoenix

Thousands of witnesses reported seeing large, silent, triangular craft with 
lights arranged in a V-formation. The craft was described as being over a mile wide.

Key witnesses included:
- Arizona Governor Fife Symington
- Dr. Lynne Kitei (The Phoenix Lights documentary)
- Multiple commercial airline pilots

The U.S. Air Force later claimed the lights were flares dropped during training 
exercises, but many witnesses disputed this explanation.
            """
        },
        {
            "filename": "nimitz_encounter_2004.txt",
            "content": """
USS Nimitz UFO Encounter - November 2004

The USS Nimitz UFO incident refers to a 2004 radar-visual encounter of an 
unidentified flying object by US fighter pilots that occurred off the Pacific 
coast of Mexico.

Details:
- Navy personnel on the USS Princeton detected unknown aerial phenomena on radar
- F/A-18F Super Hornets were dispatched to investigate
- Pilots David Fravor and Jim Slaight encountered a white, oval object
- The object demonstrated flight characteristics beyond known technology

The object:
- Hovered approximately 50 feet above the ocean
- Accelerated at impossible speeds
- Showed no visible means of propulsion
- Appeared to react intelligently to the pilots' presence

This incident was later confirmed by the Pentagon and included in the UAP 
disclosure reports to Congress.
            """
        },
        {
            "filename": "pentagon_uap_report_2021.txt",
            "content": """
Pentagon UAP Report - June 2021

The Pentagon's Unidentified Aerial Phenomena (UAP) report to Congress 
documented 144 instances of UAP sightings by military personnel.

Key findings:
- Most UAP sightings were by military aviators
- Objects demonstrated unusual flight characteristics
- No explanation could be found for most incidents
- Potential national security implications

Categories of UAP:
1. Airborne clutter (birds, balloons, debris)
2. Natural atmospheric phenomena
3. USG or industry developmental programs
4. Foreign adversary systems
5. Other (unexplained)

The report called for increased funding and systematic data collection 
to better understand these phenomena.
            """
        }
    ]
    
    for doc in documents:
        file_path = docs_dir / doc["filename"]
        with open(file_path, 'w') as f:
            f.write(doc["content"].strip())
        print(f"✓ Created {doc['filename']}")
    
    return docs_dir

def setup_cocoindex_flow(docs_dir):
    """Set up CocoIndex flow for UFO documents"""
    try:
        import cocoindex
        
        # Create the flow definition
        flow_code = f'''
import cocoindex

@cocoindex.flow_def(name="UFOResearch")
def ufo_flow(flow_builder, data_scope):
    # Ingest UFO documents
    data_scope["documents"] = flow_builder.add_source(
        cocoindex.sources.LocalFile(path="{docs_dir}")
    )
    
    # Chunk documents for better search
    data_scope["chunks"] = flow_builder.add_transformation(
        cocoindex.transformations.TextChunker(
            chunk_size=500,
            chunk_overlap=100
        )
    )
    
    # Create embeddings using local model
    data_scope["embeddings"] = flow_builder.add_transformation(
        cocoindex.transformations.SentenceTransformer(
            model="all-MiniLM-L6-v2"
        )
    )
    
    # Export to SQLite for local storage
    flow_builder.add_export(
        cocoindex.exports.SQLite(
            database="ufo_research.db",
            table="documents"
        )
    )

if __name__ == "__main__":
    print("Setting up UFO research index...")
    cocoindex.setup(__file__)
    print("Updating index with documents...")
    cocoindex.update(__file__)
    print("UFO research index ready!")
'''
        
        # Write the flow file
        flow_file = Path("ufo_flow.py")
        with open(flow_file, 'w') as f:
            f.write(flow_code)
        
        print(f"✓ Created CocoIndex flow: {flow_file}")
        
        # Run the flow
        print("Setting up CocoIndex flow...")
        os.system(f"python {flow_file}")
        
        print("✓ CocoIndex flow setup complete!")
        return True
        
    except Exception as e:
        print(f"✗ Failed to setup CocoIndex flow: {e}")
        return False

def test_search():
    """Test searching the CocoIndex"""
    try:
        import cocoindex
        
        print("\n" + "="*50)
        print("Testing CocoIndex Search")
        print("="*50)
        
        # Load the flow
        flow = cocoindex.load_flow("UFOResearch")
        
        # Test searches
        test_queries = [
            "triangular craft",
            "Navy pilots",
            "Pentagon report"
        ]
        
        for query in test_queries:
            print(f"\nSearching for: '{query}'")
            results = flow.search(query, k=3)
            
            if results:
                for i, result in enumerate(results, 1):
                    print(f"  {i}. Score: {result.score:.3f}")
                    print(f"     Content: {result.content[:100]}...")
                    if hasattr(result, 'metadata') and result.metadata:
                        source = result.metadata.get('source_file', 'Unknown')
                        print(f"     Source: {source}")
                    print()
            else:
                print("  No results found")
        
        return True
        
    except Exception as e:
        print(f"✗ Search test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("CocoIndex Setup for UFO Research")
    print("="*40)
    
    # Step 1: Install CocoIndex
    if not install_cocoindex():
        return False
    
    # Step 2: Create sample documents
    print("\nCreating sample UFO documents...")
    docs_dir = create_sample_documents()
    
    # Step 3: Setup CocoIndex flow
    print("\nSetting up CocoIndex flow...")
    if not setup_cocoindex_flow(docs_dir):
        return False
    
    # Step 4: Test search
    if not test_search():
        return False
    
    print("\n" + "="*50)
    print("🎉 Setup Complete!")
    print("="*50)
    print(f"Sample documents: {docs_dir}")
    print("Database: ufo_research.db")
    print("Flow file: ufo_flow.py")
    print("\nTo test in your app:")
    print("1. Set COCOINDEX_ENABLED=true in .env")
    print("2. Start disclosure-rag server")
    print("3. Try searching in TipTap editor")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)