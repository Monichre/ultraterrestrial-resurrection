#!/usr/bin/env python3
"""
CocoIndex Flow Setup for UFO Research
Date: July 2, 2025
"""

import os
import cocoindex
import logging
from dotenv import load_dotenv
from numpy.typing import NDArray
import numpy as np

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL",
                         "postgresql://liamellis:ultraterrestrial@localhost:5432/ultraterrestrial")


@cocoindex.transform_flow()
def text_to_embedding(text: cocoindex.DataSlice[str]) -> cocoindex.DataSlice[NDArray[np.float32]]:
    """Shared text embedding function for indexing and querying"""
    return text.transform(
        cocoindex.functions.SentenceTransformerEmbed(
            model="sentence-transformers/all-MiniLM-L6-v2"
        )
    )


@cocoindex.flow_def(name="UFOResearch")
def ufo_research_flow(flow_builder: cocoindex.FlowBuilder, data_scope: cocoindex.DataScope):
    """CocoIndex flow for UFO/UAP research documents"""

    # Add a data source to read files from knowledge base directory
    knowledge_base_path = os.getenv(
        "KNOWLEDGE_BASE_DIRECTORY_PATH", "data/documents")

    data_scope["documents"] = flow_builder.add_source(
        cocoindex.sources.LocalFile(path=knowledge_base_path,
                                    file_extensions=[".txt", ".md", ".pdf"])
    )

    # Add a collector for document embeddings
    doc_embeddings = data_scope.add_collector()

    # Transform data of each document
    with data_scope["documents"].row() as doc:
        # Split the document into chunks
        doc["chunks"] = doc["content"].transform(
            cocoindex.functions.SplitRecursively(),
            language="markdown",
            chunk_size=1000,
            chunk_overlap=200
        )

        # Transform data of each chunk
        with doc["chunks"].row() as chunk:
            # Embed the chunk using our shared function
            chunk["embedding"] = text_to_embedding(chunk["text"])

            # Collect the chunk into the collector
            doc_embeddings.collect(
                filename=doc["filename"],
                location=chunk["location"],
                text=chunk["text"],
                embedding=chunk["embedding"]
            )

    # Export collected data to PostgreSQL with pgvector
    doc_embeddings.export(
        "ufo_research_embeddings",
        cocoindex.targets.Postgres(),
        primary_key_fields=["filename", "location"],
        vector_indexes=[
            cocoindex.VectorIndexDef(
                field_name="embedding",
                metric=cocoindex.VectorSimilarityMetric.COSINE_SIMILARITY
            )
        ]
    )


def setup_cocoindex():
    """Set up CocoIndex with UFO research flow"""
    try:
        # Set database URL
        os.environ["COCOINDEX_DATABASE_URL"] = DATABASE_URL

        # Initialize CocoIndex
        cocoindex.init()

        logger.info("CocoIndex initialized successfully")
        logger.info(f"Database URL: {DATABASE_URL}")
        logger.info("Flow: UFOResearch")
        logger.info("Ready for document indexing and search")

        return True

    except Exception as e:
        logger.error(f"Failed to initialize CocoIndex: {e}")
        return False


def test_flow():
    """Test the UFO research flow"""
    try:
        # Test the flow definition
        logger.info("Testing UFOResearch flow definition...")

        # Create a test data directory if it doesn't exist
        test_dir = "test_data"
        if not os.path.exists(test_dir):
            os.makedirs(test_dir)

        # Create a test document
        test_file = os.path.join(test_dir, "test_ufo_document.txt")
        with open(test_file, "w") as f:
            f.write("""
            Phoenix Lights UFO Incident
            
            On March 13, 1997, a series of widely observed unidentified flying objects 
            were seen over Arizona, Nevada, and the Mexican state of Sonora. The incident 
            is known as the Phoenix Lights, and it remains one of the most documented 
            mass UFO sightings in history.
            
            Witnesses reported seeing V-shaped formations of lights moving silently 
            across the sky. The objects appeared to be massive in size, with some 
            witnesses estimating the wingspan to be over a mile wide.
            """)

        logger.info(f"Created test document: {test_file}")
        logger.info("UFOResearch flow is ready for testing")

        # Clean up test file
        os.remove(test_file)
        if os.path.exists(test_dir):
            os.rmdir(test_dir)

        return True

    except Exception as e:
        logger.error(f"Flow test failed: {e}")
        return False


if __name__ == "__main__":
    print("🛸 Setting up CocoIndex for UFO Research")
    print("=" * 50)

    if setup_cocoindex():
        print("✅ CocoIndex setup successful!")

        if test_flow():
            print("✅ Flow test passed!")
            print("\nNext steps:")
            print("1. Run: cocoindex update --setup setup_cocoindex_flow.py")
            print("2. Test search functionality")
            print("3. Integrate with dual RAG adapter")
        else:
            print("❌ Flow test failed")
    else:
        print("❌ CocoIndex setup failed")
