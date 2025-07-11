"""
Interactive Knowledge Base UI
Built with Streamlit for easy navigation and CRUD operations
"""

# Fix for PyTorch/Streamlit compatibility issue
import warnings
from pathlib import Path
import sys
from datetime import datetime
import pandas as pd
import streamlit as st
import os
os.environ["STREAMLIT_WATCHER_LOCAL_SOURCES_EXCLUDE_DIRS"] = "torch,torchvision,torchaudio"


# Suppress PyTorch warnings that can interfere with Streamlit
warnings.filterwarnings('ignore', category=UserWarning, module='torch')

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import with error handling for PyTorch conflicts
try:
    from lib.knowledge_base_crud import KnowledgeBaseCRUD, Document
    KB_CRUD_AVAILABLE = True
except ImportError as e:
    st.warning(f"Knowledge Base CRUD not available: {e}")
    KB_CRUD_AVAILABLE = False

    class KnowledgeBaseCRUD:
        def __init__(self): pass
        def get_statistics(self): return {"total_documents": 0, "total_tags": 0,
                                          "last_updated": None, "documents_by_type": {}, "popular_tags": []}

        def list_documents(self, **kwargs): return []
        def create_document(self, **kwargs): return None
        def get_document(self, doc_id): return None
        def update_document(self, doc_id, **kwargs): return None
        def delete_document(self, doc_id): return False
        def search_documents(self, query): return []
        def bulk_import(self, directory, doc_type): return []
        def export_document(self, doc_id, export_dir): return None

try:
    from lib.knowledge_base import KnowledgeBase
    KB_AVAILABLE = True
except ImportError as e:
    st.warning(f"Knowledge Base not available: {e}")
    KB_AVAILABLE = False

    class KnowledgeBase:
        def __init__(self): pass
        async def retrieve(
            self, query, top_k=5): return "Knowledge base not available - PyTorch dependencies missing"

try:
    from scripts.bulk_folder_ingestion import BulkFolderIngestion, DocumentFile
    BULK_INGESTION_AVAILABLE = True
except ImportError as e:
    st.warning(f"Bulk ingestion not available: {e}")
    BULK_INGESTION_AVAILABLE = False

    class BulkFolderIngestion:
        def __init__(self): pass
        async def process_single_document(self, doc_file): return {
            "success": False, "error": "Bulk ingestion not available"}

    class DocumentFile:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)

try:
    import asyncio
    ASYNCIO_AVAILABLE = True
except ImportError:
    ASYNCIO_AVAILABLE = False

KB_IMPORTS_SUCCESS = True  # Always allow the UI to run, just with limited functionality


def get_available_directories() -> list:
    """Scan file system for available directories suitable for bulk import."""
    directories = []

    # Get current disclosure-rag directory
    current_dir = Path(__file__).parent

    # Add default directories with priority order
    default_paths = [
        current_dir / "data" / "raw",  # Primary default
        current_dir / "data" / "raw" / "greer-document-library",
        current_dir / "data" / "processed",
        current_dir / "unified_ufo_library" / "documents",
        # Add packages/knowledge-base directories
        current_dir.parent.parent / "packages" / "knowledge-base" / "case_files",
        current_dir.parent.parent / "packages" / "knowledge-base" / "transcripts",
        current_dir.parent.parent / "packages" / "knowledge-base" / "articles",
        current_dir.parent.parent / "packages" / "knowledge-base" / "research",
    ]

    # Check each default path and add if it exists and has files
    for path in default_paths:
        if path.exists() and path.is_dir():
            try:
                # Check if directory has files (not empty)
                has_files = any(f.is_file() for f in path.rglob("*"))
                if has_files:
                    directories.append(str(path))
            except PermissionError:
                # Add anyway if we can't read it (user might have access)
                directories.append(str(path))

    # Scan for additional data directories in the current project
    try:
        # Look for common document directories
        for pattern in ["**/data", "**/documents", "**/raw", "**/case_files", "**/transcripts"]:
            for path in current_dir.glob(pattern):
                if path.is_dir() and str(path) not in directories:
                    # Only add if it contains files
                    try:
                        has_files = any(f.is_file() for f in path.rglob("*"))
                        if has_files:
                            directories.append(str(path))
                    except (PermissionError, OSError):
                        pass

        # Look in parent directories for additional sources
        parent_dir = current_dir.parent
        for pattern in ["**/data", "**/documents", "**/knowledge-base"]:
            for path in parent_dir.glob(pattern):
                if path.is_dir() and str(path) not in directories:
                    # Only add if it contains files
                    try:
                        has_files = any(f.is_file() for f in path.rglob("*"))
                        if has_files:
                            directories.append(str(path))
                    except (PermissionError, OSError):
                        pass

    except Exception as e:
        st.warning(f"Error scanning directories: {e}")

    # Sort directories and remove duplicates
    directories = sorted(list(set(directories)))

    # Add custom path option at the end
    directories.append("__CUSTOM_PATH__")

    return directories


def format_directory_option(directory_path: str) -> str:
    """Format directory path for display in dropdown."""
    if directory_path == "__CUSTOM_PATH__":
        return "📝 Enter custom path..."

    path = Path(directory_path)

    # Try to count files for display
    try:
        # Count supported file types only
        supported_extensions = {'.pdf', '.txt', '.docx', '.md', '.rtf'}
        file_count = len([f for f in path.rglob("*")
                         if f.is_file() and f.suffix.lower() in supported_extensions])

        # Create relative path for display if it's within the project
        current_dir = Path(__file__).parent
        try:
            rel_path = path.relative_to(current_dir)
            display_path = f"@/disclosure-rag/{rel_path}"
        except ValueError:
            # Not within current dir, try packages
            try:
                packages_dir = current_dir.parent.parent / "packages"
                rel_path = path.relative_to(packages_dir)
                display_path = f"@/packages/{rel_path}"
            except ValueError:
                # Use full path
                display_path = str(path)

        return f"📁 {path.name} ({file_count} files) - {display_path}"
    except Exception:
        return f"📁 {path.name} - {directory_path}"


def get_default_directory() -> str:
    """Get the default directory (data/raw) if it exists."""
    current_dir = Path(__file__).parent
    default_path = current_dir / "data" / "raw"

    if default_path.exists() and default_path.is_dir():
        return str(default_path)

    # Fallback to first available directory
    available_dirs = get_available_directories()
    if available_dirs and available_dirs[0] != "__CUSTOM_PATH__":
        return available_dirs[0]

    return ""


# Page configuration
st.set_page_config(
    page_title="Disclosure RAG Knowledge Base",
    page_icon="🛸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Check if imports were successful
if not KB_IMPORTS_SUCCESS:
    st.title("🛸 Disclosure RAG Knowledge Base - Import Error")
    st.error("**Critical Error: Failed to import required modules**")

    st.markdown("""
    ### Possible Solutions:
    
    1. **Install missing dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    
    2. **If you're getting PyTorch/Streamlit conflicts:**
    ```bash
    pip install torch --no-cache-dir
    streamlit cache clear
    ```
    
    3. **Try running from the correct directory:**
    ```bash
    cd apps/disclosure-rag
    streamlit run knowledge_base_ui.py
    ```
    
    4. **Check if all environment variables are set properly**
    
    5. **Restart the Streamlit server:**
    ```bash
    streamlit run knowledge_base_ui.py --server.headless true
    ```
    """)

    st.stop()

# Initialize session state
if 'kb_crud' not in st.session_state:
    st.session_state.kb_crud = KnowledgeBaseCRUD()
if 'kb' not in st.session_state:
    st.session_state.kb = KnowledgeBase()
if 'current_page' not in st.session_state:
    st.session_state.current_page = "Browse"
if 'selected_doc' not in st.session_state:
    st.session_state.selected_doc = None


def enhanced_bulk_import_triple_rag(import_dir: str, import_type: str, file_types: list) -> tuple[bool, dict]:
    """Enhanced bulk import using Triple RAG system."""
    try:
        # Initialize Triple RAG ingestion
        ingestion = BulkFolderIngestion()

        # Find files to process
        import_dir_path = Path(import_dir)
        files_to_process = []

        for file_type in file_types:
            files_to_process.extend(
                list(import_dir_path.glob(f"*{file_type}")))
            files_to_process.extend(
                list(import_dir_path.glob(f"**/*{file_type}")))

        if not files_to_process:
            return False, {"error": "No files found"}

        # Remove duplicates and sort
        files_to_process = sorted(list(set(files_to_process)))
        total_files = len(files_to_process)

        # Create progress tracking
        progress_bar = st.progress(0)
        status_container = st.empty()

        processed = 0
        failed = 0

        # Process files asynchronously
        async def process_files():
            nonlocal processed, failed

            for i, file_path in enumerate(files_to_process):
                # Update progress
                progress = (i + 1) / total_files
                progress_bar.progress(progress)
                status_container.text(
                    f"Processing [{i+1}/{total_files}]: {file_path.name}")

                try:
                    # Create document file object
                    doc_file = DocumentFile(
                        path=file_path,
                        name=file_path.name,
                        size=file_path.stat().st_size,
                        extension=file_path.suffix.lower(),
                        mime_type="application/pdf" if file_path.suffix.lower() == '.pdf' else "text/plain"
                    )

                    # Process through Triple RAG
                    result = await ingestion.process_single_document(doc_file)

                    if result.get('success', False):
                        processed += 1

                        # Also add to knowledge base CRUD for UI compatibility
                        try:
                            # Extract text for CRUD
                            text_content = result.get(
                                'document', {}).get('content', '')
                            if text_content:
                                st.session_state.kb_crud.create_document(
                                    title=file_path.stem,
                                    # Limit content size
                                    content=text_content[:10000],
                                    source=str(file_path),
                                    doc_type=import_type,
                                    metadata={"triple_rag_processed": True,
                                              "file_type": file_path.suffix},
                                    tags=[import_type,
                                          "bulk_import", "triple_rag"]
                                )
                        except Exception as crud_error:
                            st.warning(
                                f"Triple RAG succeeded but CRUD failed for {file_path.name}: {crud_error}")
                    else:
                        failed += 1

                except Exception as e:
                    failed += 1
                    st.error(f"Failed to process {file_path.name}: {str(e)}")

        # Run async processing
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            loop.run_until_complete(process_files())
        finally:
            loop.close()

        # Final update
        progress_bar.progress(1.0)
        status_container.text("Processing complete!")

        # Calculate stats
        success_rate = (processed / total_files) * \
            100 if total_files > 0 else 0

        stats = {
            'total': total_files,
            'processed': processed,
            'failed': failed,
            'success_rate': success_rate
        }

        return processed > 0, stats

    except Exception as e:
        st.error(f"Enhanced bulk import failed: {str(e)}")
        return False, {"error": str(e)}


# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1E90FF;
        text-align: center;
        margin-bottom: 2rem;
    }
    .doc-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border-left: 4px solid #1E90FF;
    }
    .tag {
        background-color: #1E90FF;
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 0.3rem;
        margin-right: 0.3rem;
        font-size: 0.8rem;
    }
    .stat-card {
        background-color: #f0f2f6;
        padding: 1.5rem;
        border-radius: 0.5rem;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">🛸 Disclosure RAG Knowledge Base</h1>',
            unsafe_allow_html=True)

# Sidebar navigation
with st.sidebar:
    st.header("Navigation")
    pages = ["Browse", "Search", "Create", "Statistics", "RAG Query"]
    for page in pages:
        if st.button(page, use_container_width=True, type="primary" if st.session_state.current_page == page else "secondary"):
            st.session_state.current_page = page
            st.session_state.selected_doc = None

# Main content area
if st.session_state.current_page == "Browse":
    st.header("📚 Browse Documents")

    col1, col2, col3 = st.columns([2, 2, 1])

    with col1:
        doc_type_filter = st.selectbox(
            "Filter by Type",
            ["All"] + ["case_file", "transcript", "article", "research"],
            key="doc_type_filter"
        )

    with col2:
        # Get all tags
        all_tags = list(st.session_state.kb_crud.index.get("tags", {}).keys())
        tag_filter = st.multiselect("Filter by Tags", all_tags)

    with col3:
        if st.button("🔄 Refresh", use_container_width=True):
            st.rerun()

    # Get documents
    docs = st.session_state.kb_crud.list_documents(
        doc_type=None if doc_type_filter == "All" else doc_type_filter,
        tags=tag_filter if tag_filter else None
    )

    if docs:
        for doc_info in docs:
            with st.container():
                col1, col2 = st.columns([4, 1])

                with col1:
                    if st.button(f"📄 {doc_info['title']}", key=doc_info['id'], use_container_width=True):
                        st.session_state.selected_doc = doc_info['id']

                    # Display metadata
                    st.caption(
                        f"Type: {doc_info['doc_type']} | Created: {doc_info['created_at'][:10]}")

                    # Display tags
                    if doc_info['tags']:
                        tags_html = " ".join(
                            [f'<span class="tag">{tag}</span>' for tag in doc_info['tags']])
                        st.markdown(tags_html, unsafe_allow_html=True)

                with col2:
                    if st.button("🗑️ Delete", key=f"del_{doc_info['id']}"):
                        if st.session_state.kb_crud.delete_document(doc_info['id']):
                            st.success("Document deleted!")
                            st.rerun()

        # Display selected document
        if st.session_state.selected_doc:
            st.divider()
            doc = st.session_state.kb_crud.get_document(
                st.session_state.selected_doc)
            if doc:
                st.subheader(f"📖 {doc.title}")

                # Edit mode toggle
                edit_mode = st.checkbox("Edit Mode", key="edit_mode")

                if edit_mode:
                    # Edit form
                    with st.form("edit_form"):
                        new_title = st.text_input("Title", value=doc.title)
                        new_content = st.text_area(
                            "Content", value=doc.content, height=400)
                        new_tags = st.text_input(
                            "Tags (comma-separated)", value=", ".join(doc.tags))

                        col1, col2 = st.columns(2)
                        with col1:
                            if st.form_submit_button("💾 Save Changes", use_container_width=True):
                                updated_doc = st.session_state.kb_crud.update_document(
                                    doc.id,
                                    title=new_title,
                                    content=new_content,
                                    tags=[tag.strip() for tag in new_tags.split(
                                        ",") if tag.strip()]
                                )
                                if updated_doc:
                                    st.success("Document updated!")
                                    st.rerun()
                        with col2:
                            if st.form_submit_button("❌ Cancel", use_container_width=True):
                                st.rerun()
                else:
                    # View mode
                    st.markdown(f"**Source:** {doc.source}")
                    st.markdown(f"**Type:** {doc.doc_type}")
                    st.markdown(f"**Updated:** {doc.updated_at}")

                    if doc.tags:
                        tags_html = " ".join(
                            [f'<span class="tag">{tag}</span>' for tag in doc.tags])
                        st.markdown(tags_html, unsafe_allow_html=True)

                    st.divider()
                    st.markdown(doc.content)
    else:
        st.info("No documents found. Create your first document!")

elif st.session_state.current_page == "Search":
    st.header("🔍 Search Knowledge Base")

    search_query = st.text_input(
        "Enter search query", placeholder="Search for UFO cases, testimonies, etc...")

    if search_query:
        with st.spinner("Searching..."):
            results = st.session_state.kb_crud.search_documents(search_query)

        if results:
            st.success(f"Found {len(results)} results")

            for result in results:
                with st.expander(f"📄 {result['title']} (Score: {result['score']:.2f})"):
                    st.caption(f"Type: {result['doc_type']}")
                    st.markdown(result['snippet'])
                    if st.button(f"View Full Document", key=f"view_{result['id']}"):
                        st.session_state.selected_doc = result['id']
                        st.session_state.current_page = "Browse"
                        st.rerun()
        else:
            st.warning("No results found. Try different keywords.")

elif st.session_state.current_page == "Create":
    st.header("➕ Create New Document")

    with st.form("create_form"):
        title = st.text_input("Title", placeholder="Enter document title")
        doc_type = st.selectbox(
            "Document Type", ["case_file", "transcript", "article", "research"])
        source = st.text_input(
            "Source", placeholder="URL, file path, or description")
        tags = st.text_input("Tags (comma-separated)",
                             placeholder="ufo, testimony, classified")
        content = st.text_area(
            "Content", height=400, placeholder="Enter or paste document content here...")

        col1, col2, col3 = st.columns([1, 1, 2])

        with col1:
            submitted = st.form_submit_button(
                "📝 Create Document", use_container_width=True)

        with col2:
            # File upload option
            uploaded_file = st.file_uploader(
                "Or upload file", type=['txt', 'md'])

        if submitted and title and content:
            doc = st.session_state.kb_crud.create_document(
                title=title,
                content=content,
                source=source,
                doc_type=doc_type,
                tags=[tag.strip() for tag in tags.split(",") if tag.strip()]
            )
            st.success(f"Document created successfully! ID: {doc.id}")
            st.session_state.selected_doc = doc.id
            st.session_state.current_page = "Browse"
            st.rerun()

        if uploaded_file is not None:
            content = uploaded_file.read().decode("utf-8")
            st.session_state.content = content
            st.info(
                "File loaded! Fill in the other fields and click Create Document.")

elif st.session_state.current_page == "Statistics":
    st.header("📊 Knowledge Base Statistics")

    stats = st.session_state.kb_crud.get_statistics()

    # Overview cards
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown('<div class="stat-card">', unsafe_allow_html=True)
        st.metric("Total Documents", stats["total_documents"])
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="stat-card">', unsafe_allow_html=True)
        st.metric("Total Tags", stats["total_tags"])
        st.markdown('</div>', unsafe_allow_html=True)

    with col3:
        st.markdown('<div class="stat-card">', unsafe_allow_html=True)
        st.metric("Last Updated", stats["last_updated"]
                  [:10] if stats["last_updated"] else "Never")
        st.markdown('</div>', unsafe_allow_html=True)

    # Document type distribution
    st.subheader("Documents by Type")
    if stats["documents_by_type"]:
        df_types = pd.DataFrame(
            list(stats["documents_by_type"].items()),
            columns=["Type", "Count"]
        )
        st.bar_chart(df_types.set_index("Type"))

    # Popular tags
    st.subheader("Popular Tags")
    if stats["popular_tags"]:
        df_tags = pd.DataFrame(stats["popular_tags"], columns=["Tag", "Count"])
        st.dataframe(df_tags, use_container_width=True)

    # Bulk operations
    st.subheader("Bulk Operations")

    col1, col2 = st.columns(2)

    with col1:
        st.write("**Bulk Import (Triple RAG)**")

        # Show dependency status
        if not BULK_INGESTION_AVAILABLE:
            st.warning(
                "⚠️ Bulk ingestion requires PyTorch dependencies. Install requirements to enable full functionality.")

        # Get available directories and set default
        available_dirs = get_available_directories()
        default_dir = get_default_directory()

        # Set default index
        default_index = 0
        if default_dir in available_dirs:
            default_index = available_dirs.index(default_dir)

        import_dir_selection = st.selectbox(
            "Directory to import from:",
            options=available_dirs,
            format_func=format_directory_option,
            index=default_index,
            key="bulk_import_dir_selection",
            help="Select a directory containing documents to import, or choose custom path to enter manually"
        )

        # Handle custom path input
        if import_dir_selection == "__CUSTOM_PATH__":
            import_dir = st.text_input(
                "Enter custom directory path:",
                placeholder="e.g., /path/to/your/documents or data/raw/greer-document-library",
                key="custom_import_dir",
                help="Enter the full path to a directory containing documents"
            )

            # Validate custom path
            if import_dir:
                custom_path = Path(import_dir)
                if custom_path.exists() and custom_path.is_dir():
                    try:
                        # Count files in custom directory
                        supported_extensions = {
                            '.pdf', '.txt', '.docx', '.md', '.rtf'}
                        file_count = len([f for f in custom_path.rglob("*")
                                          if f.is_file() and f.suffix.lower() in supported_extensions])
                        if file_count > 0:
                            st.success(
                                f"✅ Valid directory with {file_count} supported files found")
                        else:
                            st.warning(
                                "⚠️ Directory exists but no supported files found (.pdf, .txt, .docx, .md, .rtf)")
                    except Exception as e:
                        st.warning(f"⚠️ Could not scan directory: {e}")
                elif import_dir.strip():  # Only show error if user has typed something
                    st.error("❌ Directory does not exist or is not accessible")
        else:
            import_dir = import_dir_selection

            # Show directory info for selected directory
            if import_dir:
                dir_path = Path(import_dir)
                try:
                    supported_extensions = {
                        '.pdf', '.txt', '.docx', '.md', '.rtf'}
                    file_count = len([f for f in dir_path.rglob("*")
                                      if f.is_file() and f.suffix.lower() in supported_extensions])
                    st.info(
                        f"📁 Selected: {dir_path.name} with {file_count} supported files")
                except Exception as e:
                    st.warning(f"Could not read directory info: {e}")

        import_type = st.selectbox(
            "Import as type", ["case_file", "transcript", "article", "research"])

        # Triple RAG options
        use_triple_rag = st.checkbox("Use Triple RAG System", value=BULK_INGESTION_AVAILABLE,
                                     disabled=not BULK_INGESTION_AVAILABLE,
                                     help="Process documents through Upstash Vector + LocalRAG FAISS + PostgreSQL pgvector" if BULK_INGESTION_AVAILABLE else "Requires PyTorch dependencies")

        # File type selection
        file_types = st.multiselect(
            "File types to include:",
            [".pdf", ".txt", ".docx", ".md", ".rtf"],
            default=[".pdf", ".txt", ".md"]
        )

        if st.button("📥 Import Directory"):
            if import_dir and os.path.exists(import_dir):
                if use_triple_rag and BULK_INGESTION_AVAILABLE:
                    # Use enhanced Triple RAG bulk import
                    with st.spinner("Processing through Triple RAG system..."):
                        success, stats = enhanced_bulk_import_triple_rag(
                            import_dir, import_type, file_types)

                    if success:
                        st.success(f"✅ Triple RAG Import Complete!")
                        st.markdown(f"""
                        **Import Statistics:**
                        - **Files Processed:** {stats.get('processed', 0)}
                        - **Files Failed:** {stats.get('failed', 0)}
                        - **Success Rate:** {stats.get('success_rate', 0):.1f}%

                        Documents indexed in:
                        - ☁️ Upstash Vector (cloud search)
                        - 💾 LocalRAG FAISS (local vectors)
                        - 🗄️ PostgreSQL pgvector (analytics)
                        - 📚 Knowledge Base CRUD (metadata)
                        """)
                    else:
                        st.error("Triple RAG import failed")
                        if 'error' in stats:
                            st.error(f"Error details: {stats['error']}")
                elif KB_CRUD_AVAILABLE:
                    # Use basic bulk import (without PyTorch dependencies)
                    with st.spinner("Importing documents..."):
                        imported = st.session_state.kb_crud.bulk_import(
                            import_dir, import_type)
                    st.success(
                        f"Imported {len(imported)} documents to Knowledge Base!")
                else:
                    st.error(
                        "Import functionality requires missing dependencies. Please install requirements.txt")
            else:
                st.error("Please select a valid directory path")

    with col2:
        st.write("**Export Document**")
        doc_to_export = st.selectbox(
            "Select document to export",
            options=[(d["id"], d["title"])
                     for d in st.session_state.kb_crud.list_documents()],
            format_func=lambda x: x[1]
        )
        export_dir = st.text_input("Export directory", value="./exports")
        if st.button("📤 Export Document"):
            if doc_to_export:
                path = st.session_state.kb_crud.export_document(
                    doc_to_export[0], export_dir)
                if path:
                    st.success(f"Exported to: {path}")

elif st.session_state.current_page == "RAG Query":
    st.header("🤖 RAG Query Interface")
    st.write(
        "Query the knowledge base using semantic search and retrieval-augmented generation.")

    query = st.text_input(
        "Enter your question", placeholder="What do we know about the Phoenix Lights incident?")

    col1, col2 = st.columns([3, 1])
    with col2:
        top_k = st.number_input("Number of results",
                                min_value=1, max_value=20, value=5)

    if query:
        with st.spinner("Searching knowledge base..."):
            # Use the async retrieve function
            async def get_results():
                return await st.session_state.kb.retrieve(query, top_k=top_k)

            try:
                results = asyncio.run(get_results())

                st.subheader("📚 Retrieved Context")

                if isinstance(results, str):
                    # Display the concatenated results
                    with st.expander("View Retrieved Documents", expanded=True):
                        st.markdown(results)
                else:
                    # Display individual results
                    for i, result in enumerate(results):
                        with st.expander(f"Result {i+1}"):
                            st.markdown(result.get('text', result))

                # Option to use with an LLM
                st.divider()
                st.subheader("💡 Generate Answer")
                st.info(
                    "You can use the retrieved context with an LLM to generate a comprehensive answer.")

                if st.button("Copy Context to Clipboard"):
                    st.code(results, language="markdown")
                    st.success("Context ready to copy!")

            except Exception as e:
                st.error(f"Error retrieving from knowledge base: {str(e)}")
                st.info("Make sure the vector store is initialized with documents.")

# Footer
st.divider()
st.caption("🛸 Disclosure RAG Knowledge Base - Managing UFO/UAP Research Data")
