"""In-memory vector retrieval over the on-disk archive (agent / tool read path).

Not the ingest writer and not the filesystem CRUD. Layer map:
apps/disclosure-rag/docs/KNOWLEDGE_BASE_LAYERS.md
"""

import os
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any, Union

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# Try to use Agno's vectorstore if available, otherwise use LangChain
try:
    from agno.vectorstore import VectorStore
    from agno.document_loaders import DirectoryLoader, TextLoader, MarkdownLoader, PDFLoader
    from agno.embedding import OpenAIEmbedding
    USING_AGNO = True
    logger.info("Using Agno vectorstore implementation")
except ImportError:
    # Fallback imports if agno doesn't have these modules
    from langchain_community.vectorstores import FAISS
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.document_loaders import DirectoryLoader, TextLoader
    from langchain_community.document_loaders import UnstructuredMarkdownLoader as MarkdownLoader
    from langchain_community.document_loaders import PyPDFLoader as PDFLoader
    USING_AGNO = False
    logger.info("Using LangChain vectorstore implementation")


class KnowledgeBase:
    """Vector store knowledge base for UAP research data."""

    def __init__(self, kb_path=None):
        """Initialize the knowledge base with paths to knowledge sources."""
        # Define paths to knowledge sources - point to packages/knowledge-base
        if kb_path is None:
            # Navigate to the packages/knowledge-base directory
            # Go up from apps/disclosure-rag/lib/
            current_dir = Path(__file__).parent.parent.parent.parent.parent
            self.kb_path = current_dir / "packages" / "knowledge-base"
        else:
            self.kb_path = Path(kb_path)

        # Update paths to use sources/ directory structure
        self.sources_path = self.kb_path / "sources"
        self.files_path = self.sources_path / "files"
        self.transcripts_path = self.sources_path / "transcripts"
        self.vector_store = None

        # Initialize the knowledge base
        self._initialize_knowledge_base()

    def _initialize_knowledge_base(self):
        """Initialize the vector store with documents from files and transcripts."""
        logger.info(
            "Initializing knowledge base from case files and transcripts...")

        # Define paths to check if they exist
        files_path = Path(self.files_path)
        transcripts_path = Path(self.transcripts_path)

        # Collection to store all documents
        all_documents = []

        # Load case files if directory exists
        if files_path.exists() and files_path.is_dir():
            try:
                logger.info(f"Loading case files from {files_path}")
                # Check for markdown directory
                markdown_dir = files_path / "markdown"
                if markdown_dir.exists():
                    md_loader = DirectoryLoader(
                        str(markdown_dir), glob="**/*.md", loader_cls=MarkdownLoader)
                    md_docs = md_loader.load()
                    all_documents.extend(md_docs)
                    logger.info(
                        f"Loaded {len(md_docs)} markdown documents from case files")

                # Load any other text files directly in files
                txt_loader = DirectoryLoader(
                    str(files_path), glob="**/*.txt", loader_cls=TextLoader)
                txt_docs = txt_loader.load()
                all_documents.extend(txt_docs)

                # Load PDF files if any
                pdf_loader = DirectoryLoader(
                    str(files_path), glob="**/*.pdf", loader_cls=PDFLoader)
                pdf_docs = pdf_loader.load()
                all_documents.extend(pdf_docs)

                logger.info(
                    f"Total documents loaded from case files: {len(all_documents)}")
            except Exception as e:
                logger.error(f"Error loading case files: {e}")

        # Load transcripts if directory exists
        if transcripts_path.exists() and transcripts_path.is_dir():
            try:
                logger.info(f"Loading transcripts from {transcripts_path}")
                # Get all transcript directories (they're organized by date)
                transcript_dirs = [
                    d for d in transcripts_path.glob("*/*") if d.is_dir()]

                for transcript_dir in transcript_dirs:
                    # For each transcript directory, load all text and markdown files
                    for file_pattern in ["**/*.txt", "**/*.md"]:
                        loader = DirectoryLoader(
                            str(transcript_dir),
                            glob=file_pattern,
                            loader_cls=TextLoader if "txt" in file_pattern else MarkdownLoader
                        )
                        dir_docs = loader.load()
                        all_documents.extend(dir_docs)

                logger.info(
                    f"Loaded documents from transcripts, total count: {len(all_documents)}")
            except Exception as e:
                logger.error(f"Error loading transcripts: {e}")

        # Create vector store if documents were loaded
        if all_documents:
            logger.info(
                f"Creating vector store with {len(all_documents)} total documents")
            try:
                # Check if using agno's VectorStore or fallback implementation
                if USING_AGNO:
                    # Using agno's implementation
                    embedding = OpenAIEmbedding(model="text-embedding-3-small")
                    self.vector_store = VectorStore(
                        documents=all_documents,
                        embedding=embedding
                    )
                else:
                    # Fallback to langchain implementation
                    embeddings = OpenAIEmbeddings()
                    self.vector_store = FAISS.from_documents(
                        all_documents, embeddings)

                logger.info("Vector store successfully created")
            except Exception as e:
                logger.error(f"Error creating vector store: {e}")
        else:
            logger.warning("No documents loaded, vector store not created")

    def save_vector_store(self, directory: str = "vector_storage"):
        """Save the vector store to disk for later reuse."""
        if not self.vector_store:
            logger.warning("No vector store to save")
            return False

        try:
            # Create directory if it doesn't exist
            os.makedirs(directory, exist_ok=True)

            if USING_AGNO:
                # Agno implementation
                self.vector_store.save(os.path.join(directory, "agno_vectors"))
            else:
                # LangChain implementation
                self.vector_store.save_local(directory)

            logger.info(f"Vector store saved to {directory}")
            return True
        except Exception as e:
            logger.error(f"Error saving vector store: {e}")
            return False

    def load_vector_store(self, directory: str = "vector_storage"):
        """Load a previously saved vector store."""
        try:
            if USING_AGNO:
                # Agno implementation
                embedding = OpenAIEmbedding(model="text-embedding-3-small")
                self.vector_store = VectorStore.load(
                    os.path.join(directory, "agno_vectors"),
                    embedding=embedding
                )
            else:
                # LangChain implementation
                embeddings = OpenAIEmbeddings()
                self.vector_store = FAISS.load_local(directory, embeddings)

            logger.info(f"Vector store loaded from {directory}")
            return True
        except Exception as e:
            logger.error(f"Error loading vector store: {e}")
            return False

    async def retrieve(self, query: str, top_k: int = 5) -> Union[str, List[Dict[str, Any]]]:
        """Retrieve relevant information from the knowledge base."""
        if not self.vector_store:
            logger.warning(
                "Vector store not initialized, knowledge base retrieval not available")
            return "Knowledge base not available."

        try:
            if USING_AGNO:
                # If using agno implementation
                results = await self.vector_store.search(query, top_k=top_k)
                return "\n\n".join([result.text for result in results])
            else:
                # If using langchain implementation
                results = self.vector_store.similarity_search(query, k=top_k)
                return "\n\n".join([doc.page_content for doc in results])
        except Exception as e:
            logger.error(f"Error retrieving from knowledge base: {e}")
            return f"Error retrieving information from knowledge base: {str(e)}"

# Create the knowledge base tool function


def create_kb_retrieval_tool(knowledge_base):
    """Create a tool for retrieving information from the knowledge base."""
    if not knowledge_base.vector_store:
        logger.warning(
            "Vector store not initialized, knowledge base retrieval tool not available")
        return None

    async def retrieve_from_kb(query, top_k=5):
        """Retrieve relevant information from the knowledge base."""
        return await knowledge_base.retrieve(query, top_k)

    # Return a tool that can be used by agents
    return {
        "name": "knowledge_base",
        "description": "Retrieves relevant information from the UAP/UFO knowledge base",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to find relevant information"
                },
                "top_k": {
                    "type": "integer",
                    "description": "Number of results to return",
                    "default": 5
                }
            },
            "required": ["query"]
        },
        "func": retrieve_from_kb
    }