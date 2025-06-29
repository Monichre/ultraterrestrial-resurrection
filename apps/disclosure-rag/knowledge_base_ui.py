"""
Interactive Knowledge Base UI
Built with Streamlit for easy navigation and CRUD operations
"""

import streamlit as st
import pandas as pd
from datetime import datetime
import os
import sys
from pathlib import Path

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from lib.knowledge_base_crud import KnowledgeBaseCRUD, Document
from lib.knowledge_base import KnowledgeBase
import asyncio

# Page configuration
st.set_page_config(
    page_title="Disclosure RAG Knowledge Base",
    page_icon="🛸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'kb_crud' not in st.session_state:
    st.session_state.kb_crud = KnowledgeBaseCRUD()
if 'kb' not in st.session_state:
    st.session_state.kb = KnowledgeBase()
if 'current_page' not in st.session_state:
    st.session_state.current_page = "Browse"
if 'selected_doc' not in st.session_state:
    st.session_state.selected_doc = None

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
st.markdown('<h1 class="main-header">🛸 Disclosure RAG Knowledge Base</h1>', unsafe_allow_html=True)

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
                    st.caption(f"Type: {doc_info['doc_type']} | Created: {doc_info['created_at'][:10]}")
                    
                    # Display tags
                    if doc_info['tags']:
                        tags_html = " ".join([f'<span class="tag">{tag}</span>' for tag in doc_info['tags']])
                        st.markdown(tags_html, unsafe_allow_html=True)
                
                with col2:
                    if st.button("🗑️ Delete", key=f"del_{doc_info['id']}"):
                        if st.session_state.kb_crud.delete_document(doc_info['id']):
                            st.success("Document deleted!")
                            st.rerun()
        
        # Display selected document
        if st.session_state.selected_doc:
            st.divider()
            doc = st.session_state.kb_crud.get_document(st.session_state.selected_doc)
            if doc:
                st.subheader(f"📖 {doc.title}")
                
                # Edit mode toggle
                edit_mode = st.checkbox("Edit Mode", key="edit_mode")
                
                if edit_mode:
                    # Edit form
                    with st.form("edit_form"):
                        new_title = st.text_input("Title", value=doc.title)
                        new_content = st.text_area("Content", value=doc.content, height=400)
                        new_tags = st.text_input("Tags (comma-separated)", value=", ".join(doc.tags))
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            if st.form_submit_button("💾 Save Changes", use_container_width=True):
                                updated_doc = st.session_state.kb_crud.update_document(
                                    doc.id,
                                    title=new_title,
                                    content=new_content,
                                    tags=[tag.strip() for tag in new_tags.split(",") if tag.strip()]
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
                        tags_html = " ".join([f'<span class="tag">{tag}</span>' for tag in doc.tags])
                        st.markdown(tags_html, unsafe_allow_html=True)
                    
                    st.divider()
                    st.markdown(doc.content)
    else:
        st.info("No documents found. Create your first document!")

elif st.session_state.current_page == "Search":
    st.header("🔍 Search Knowledge Base")
    
    search_query = st.text_input("Enter search query", placeholder="Search for UFO cases, testimonies, etc...")
    
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
        doc_type = st.selectbox("Document Type", ["case_file", "transcript", "article", "research"])
        source = st.text_input("Source", placeholder="URL, file path, or description")
        tags = st.text_input("Tags (comma-separated)", placeholder="ufo, testimony, classified")
        content = st.text_area("Content", height=400, placeholder="Enter or paste document content here...")
        
        col1, col2, col3 = st.columns([1, 1, 2])
        
        with col1:
            submitted = st.form_submit_button("📝 Create Document", use_container_width=True)
        
        with col2:
            # File upload option
            uploaded_file = st.file_uploader("Or upload file", type=['txt', 'md'])
        
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
            st.info("File loaded! Fill in the other fields and click Create Document.")

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
        st.metric("Last Updated", stats["last_updated"][:10] if stats["last_updated"] else "Never")
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
        st.write("**Bulk Import**")
        import_dir = st.text_input("Directory path to import from")
        import_type = st.selectbox("Import as type", ["case_file", "transcript", "article", "research"])
        if st.button("📥 Import Directory"):
            if import_dir and os.path.exists(import_dir):
                with st.spinner("Importing documents..."):
                    imported = st.session_state.kb_crud.bulk_import(import_dir, import_type)
                st.success(f"Imported {len(imported)} documents!")
            else:
                st.error("Invalid directory path")
    
    with col2:
        st.write("**Export Document**")
        doc_to_export = st.selectbox(
            "Select document to export",
            options=[(d["id"], d["title"]) for d in st.session_state.kb_crud.list_documents()],
            format_func=lambda x: x[1]
        )
        export_dir = st.text_input("Export directory", value="./exports")
        if st.button("📤 Export Document"):
            if doc_to_export:
                path = st.session_state.kb_crud.export_document(doc_to_export[0], export_dir)
                if path:
                    st.success(f"Exported to: {path}")

elif st.session_state.current_page == "RAG Query":
    st.header("🤖 RAG Query Interface")
    st.write("Query the knowledge base using semantic search and retrieval-augmented generation.")
    
    query = st.text_input("Enter your question", placeholder="What do we know about the Phoenix Lights incident?")
    
    col1, col2 = st.columns([3, 1])
    with col2:
        top_k = st.number_input("Number of results", min_value=1, max_value=20, value=5)
    
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
                st.info("You can use the retrieved context with an LLM to generate a comprehensive answer.")
                
                if st.button("Copy Context to Clipboard"):
                    st.code(results, language="markdown")
                    st.success("Context ready to copy!")
                    
            except Exception as e:
                st.error(f"Error retrieving from knowledge base: {str(e)}")
                st.info("Make sure the vector store is initialized with documents.")

# Footer
st.divider()
st.caption("🛸 Disclosure RAG Knowledge Base - Managing UFO/UAP Research Data")