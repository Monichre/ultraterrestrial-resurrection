#!/usr/bin/env python3
"""
Unified Search UI Component for Streamlit
Integrates the unified RAG orchestrator into the disclosure-rag dashboard
"""

import streamlit as st
import asyncio
import sys
import os

# Add parent directory for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.unified_rag_orchestrator import UnifiedRAGOrchestrator

@st.cache_resource
def get_orchestrator():
    """Initialize and cache the orchestrator"""
    return UnifiedRAGOrchestrator()

def render_unified_search():
    """Render the unified search component"""
    
    st.header("🔍 Unified RAG Search")
    st.markdown("""
    **Intelligent search across all knowledge systems:**
    - 🎯 **Primary**: OpenAI Vector Store (1,477+ files)
    - 📚 **Secondary**: Local Python RAG systems (295+ additional files)
    """)
    
    # Initialize orchestrator
    orchestrator = get_orchestrator()
    
    # Show system status
    with st.expander("📊 System Status", expanded=False):
        status = orchestrator.get_system_status()
        
        for name, sys_status in status.items():
            col1, col2, col3 = st.columns([2, 1, 2])
            
            with col1:
                icon = "✅" if sys_status.available else "❌"
                st.write(f"{icon} **{sys_status.name}**")
            
            with col2:
                if sys_status.file_count:
                    st.metric("Files", f"{sys_status.file_count:,}")
            
            with col3:
                if sys_status.error:
                    st.error(f"Error: {sys_status.error}")
                elif sys_status.available:
                    st.success("Available")
                else:
                    st.warning("Unavailable")
    
    # Search interface
    st.subheader("Search Query")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        query = st.text_input(
            "Enter your search query:",
            placeholder="e.g., UFO sightings near nuclear facilities",
            key="unified_search_query"
        )
    
    with col2:
        max_results = st.selectbox(
            "Max Results:",
            [5, 10, 15, 20],
            index=1
        )
    
    # System preference
    system_pref = st.selectbox(
        "Search Preference:",
        ["auto", "openai_only", "local_only"],
        index=0,
        help="Auto: Smart routing, OpenAI only: Primary tier only, Local only: Supplementary tier only"
    )
    
    # Search button
    if st.button("🔍 Search", type="primary") and query:
        
        with st.spinner("Searching across unified RAG systems..."):
            try:
                # Run async search
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                results = loop.run_until_complete(
                    orchestrator.search(query, max_results, system_pref)
                )
                loop.close()
                
                if results:
                    st.success(f"Found {len(results)} results")
                    
                    # Group results by system
                    systems_used = set(r.system for r in results)
                    
                    st.markdown("**Systems used:** " + ", ".join([
                        f"🎯 OpenAI" if "openai" in systems_used else "",
                        f"📚 Local RAG" if any(s in systems_used for s in ["triple_rag", "upstash", "local"]) else ""
                    ]).strip(", "))
                    
                    # Display results
                    for i, result in enumerate(results, 1):
                        with st.container():
                            # System badge
                            system_badges = {
                                "openai": "🎯 OpenAI",
                                "triple_rag": "📚 Triple RAG", 
                                "upstash": "☁️ Upstash",
                                "local": "💻 Local"
                            }
                            
                            badge = system_badges.get(result.system, f"🔍 {result.system}")
                            
                            col1, col2, col3 = st.columns([3, 1, 1])
                            
                            with col1:
                                st.markdown(f"**{i}. {badge}**")
                                st.markdown(f"*Source: {result.source}*")
                            
                            with col2:
                                st.metric("Score", f"{result.score:.2f}")
                            
                            with col3:
                                if st.button(f"📋 Copy", key=f"copy_{i}"):
                                    st.code(result.content)
                            
                            # Content
                            with st.expander("📄 Content", expanded=True):
                                st.markdown(result.content[:1000] + ("..." if len(result.content) > 1000 else ""))
                                
                                if result.metadata:
                                    st.json(result.metadata)
                            
                            st.divider()
                
                else:
                    st.warning("No results found. Try a different query or check system status.")
                    
            except Exception as e:
                st.error(f"Search failed: {str(e)}")
                st.exception(e)
    
    elif query and not st.button:
        st.info("👆 Click Search to find results across all systems")

def render_search_examples():
    """Render example searches"""
    st.subheader("🎯 Example Searches")
    
    examples = [
        ("UFO sightings nuclear facilities", "Find UFO incidents near nuclear installations"),
        ("Jacques Vallee consciousness", "Search for Vallee's theories on consciousness and UFOs"),
        ("disclosure congressional hearing", "Find content about congressional UFO hearings"),
        ("Garry Nolan metamaterials", "Search for Nolan's research on exotic materials"),
        ("crop circles scientific analysis", "Find scientific studies of crop circle phenomena")
    ]
    
    for query, description in examples:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown(f"**{query}**")
            st.caption(description)
        
        with col2:
            if st.button(f"🔍 Try", key=f"example_{query}"):
                st.session_state.unified_search_query = query
                st.experimental_rerun()

# Main function for standalone testing
def main():
    st.set_page_config(
        page_title="Unified RAG Search",
        page_icon="🔍",
        layout="wide"
    )
    
    render_unified_search()
    
    st.divider()
    
    render_search_examples()

if __name__ == "__main__":
    main()