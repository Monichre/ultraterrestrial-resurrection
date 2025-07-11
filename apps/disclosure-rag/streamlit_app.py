#!/usr/bin/env python3
"""
Interactive Disclosure RAG Web Interface
Real-time NER processing, visualization, and Disclosure Bot chat
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json
import time
import io
from datetime import datetime
from typing import Dict, List, Any, Optional
import os
from pathlib import Path

# Import our existing modules
try:
    from lib.visualization.ner_visualizer import NERVisualizationPipeline
    from lib.visualization.geographic_visualizer import (
        GeographicUFOVisualizer, get_ufo_hotspots_sync, 
        get_military_proximity_sync, get_temporal_patterns_sync
    )
    from disclosure_chat import DisclosureBotChat
    from agents.entity_extraction_agent import EntityExtractionAgent
    from processing.web_content_processor import WebContentProcessor
    from components.data_sources_navigator import render_data_sources_navigator
    from scripts.bulk_folder_ingestion import BulkFolderIngestion, DocumentFile
except ImportError as e:
    st.error(f"Import error: {e}")
    st.stop()

# Configure page
st.set_page_config(
    page_title="🛸 Disclosure RAG Interactive Dashboard",
    page_icon="🛸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for dark theme
st.markdown("""
<style>
    .stApp {
        background-color: #0e1117;
        color: #fafafa;
    }
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        color: #60a5fa;
        margin-bottom: 2rem;
    }
    .entity-card {
        background-color: #1f2937;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #60a5fa;
        margin: 0.5rem 0;
    }
    .metrics-container {
        background-color: #111827;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'processed_documents' not in st.session_state:
    st.session_state.processed_documents = []
if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = []
if 'entity_data' not in st.session_state:
    st.session_state.entity_data = {}
if 'ner_visualizer' not in st.session_state:
    st.session_state.ner_visualizer = NERVisualizationPipeline(output_dir="./streamlit_temp")

def initialize_components():
    """Initialize the processing components"""
    try:
        if 'disclosure_bot' not in st.session_state:
            st.session_state.disclosure_bot = DisclosureBotChat()
        if 'entity_agent' not in st.session_state:
            st.session_state.entity_agent = EntityExtractionAgent()
        if 'web_processor' not in st.session_state:
            st.session_state.web_processor = WebContentProcessor()
        return True
    except Exception as e:
        st.error(f"Failed to initialize components: {e}")
        return False

def process_document(content: str, title: str = "Document") -> Dict[str, Any]:
    """Process document content and extract entities"""
    with st.spinner("🔍 Extracting entities with Anthropic Claude..."):
        try:
            # Extract entities using our sophisticated NER
            entities = st.session_state.entity_agent.extract_entities(content)
            
            # Process the results
            processed_doc = {
                'title': title,
                'content': content,
                'entities': entities,
                'timestamp': datetime.now(),
                'word_count': len(content.split()),
                'char_count': len(content)
            }
            
            # Add to session state
            st.session_state.processed_documents.append(processed_doc)
            st.session_state.entity_data[title] = entities
            
            return processed_doc
            
        except Exception as e:
            st.error(f"Error processing document: {e}")
            return None

def process_bulk_folder_import(folder_path: str, file_types: List[str], batch_size: Optional[int] = None) -> bool:
    """Process bulk folder import using the BulkFolderIngestion system."""
    try:
        import asyncio
        
        # Initialize ingestion system
        st.write("🔧 Initializing Triple RAG ingestion system...")
        ingestion = BulkFolderIngestion()
        
        # Find files to process
        folder_path_obj = Path(folder_path)
        files_to_process = []
        
        for file_type in file_types:
            files_to_process.extend(list(folder_path_obj.glob(f"*{file_type}")))
            files_to_process.extend(list(folder_path_obj.glob(f"**/*{file_type}")))
        
        if not files_to_process:
            st.error("No files found to process")
            return False
        
        # Remove duplicates and sort
        files_to_process = sorted(list(set(files_to_process)))
        total_files = len(files_to_process)
        
        st.write(f"📁 Found {total_files} files to process")
        
        # Create progress containers
        progress_bar = st.progress(0)
        status_text = st.empty()
        results_container = st.container()
        
        # Process files
        processed = 0
        failed = 0
        
        async def process_files():
            nonlocal processed, failed
            
            for i, file_path in enumerate(files_to_process):
                # Update progress
                progress = (i + 1) / total_files
                progress_bar.progress(progress)
                status_text.text(f"Processing [{i+1}/{total_files}]: {file_path.name}")
                
                try:
                    # Create document file object
                    doc_file = DocumentFile(
                        path=file_path,
                        name=file_path.name,
                        size=file_path.stat().st_size,
                        extension=file_path.suffix.lower(),
                        mime_type="application/pdf" if file_path.suffix.lower() == '.pdf' else "text/plain"
                    )
                    
                    # Process document
                    result = await ingestion.process_single_document(doc_file)
                    
                    if result.get('success', False):
                        processed += 1
                        with results_container:
                            st.success(f"✅ {file_path.name}")
                    else:
                        failed += 1
                        with results_container:
                            st.error(f"❌ {file_path.name}: {result.get('error', 'Unknown error')}")
                
                except Exception as e:
                    failed += 1
                    with results_container:
                        st.error(f"❌ {file_path.name}: {str(e)}")
                
                # Batch pause
                if batch_size and (i + 1) % batch_size == 0 and i + 1 < total_files:
                    st.info(f"Completed batch of {batch_size} files. Continuing...")
        
        # Run async processing
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            loop.run_until_complete(process_files())
        finally:
            loop.close()
        
        # Final summary
        progress_bar.progress(1.0)
        status_text.text("Processing complete!")
        
        success_rate = (processed / total_files) * 100 if total_files > 0 else 0
        
        st.markdown(f"""
        ### 📊 Bulk Import Summary
        
        - **Total Files:** {total_files}
        - **Successfully Processed:** {processed}
        - **Failed:** {failed}
        - **Success Rate:** {success_rate:.1f}%
        
        The documents have been indexed in the Triple RAG system:
        - ☁️ **Upstash Vector** - Cloud vector search
        - 💾 **LocalRAG FAISS** - Local vector storage  
        - 🗄️ **PostgreSQL pgvector** - Advanced analytics
        """)
        
        return processed > 0
        
    except Exception as e:
        st.error(f"Bulk import failed: {str(e)}")
        return False

def create_real_time_dashboard(entities: Dict[str, Any]):
    """Create interactive dashboard with real-time updates"""
    if not entities:
        st.warning("No entities to visualize")
        return
    
    # Prepare data for visualization
    entity_data = []
    for category, entity_list in entities.items():
        if isinstance(entity_list, list):
            for entity in entity_list:
                if isinstance(entity, dict):
                    entity_data.append({
                        'category': category.title(),
                        'name': entity.get('name', entity.get('title', entity.get('text', 'Unknown'))),
                        'confidence': entity.get('confidence', 0.8),
                        'description': entity.get('description', ''),
                    })
    
    if not entity_data:
        st.warning("No valid entity data found")
        return
    
    df = pd.DataFrame(entity_data)
    
    # Create main dashboard
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("📊 Entity Distribution")
        
        # Interactive bar chart
        entity_counts = df['category'].value_counts()
        fig_bar = px.bar(
            x=entity_counts.index, 
            y=entity_counts.values,
            color=entity_counts.index,
            title="Entity Count by Category",
            color_discrete_sequence=px.colors.qualitative.Set2
        )
        fig_bar.update_layout(
            template="plotly_dark",
            showlegend=False,
            height=400
        )
        st.plotly_chart(fig_bar, use_container_width=True)
        
        # Interactive scatter plot
        st.subheader("🎯 Confidence Analysis")
        fig_scatter = px.scatter(
            df, 
            x='confidence', 
            y='category',
            color='category',
            size='confidence',
            hover_data=['name'],
            title="Entity Confidence Scores"
        )
        fig_scatter.update_layout(template="plotly_dark", height=400)
        st.plotly_chart(fig_scatter, use_container_width=True)
    
    with col2:
        st.subheader("📈 Live Metrics")
        
        # Metrics cards
        total_entities = len(df)
        avg_confidence = df['confidence'].mean()
        top_category = entity_counts.index[0] if not entity_counts.empty else "None"
        
        st.metric("Total Entities", total_entities)
        st.metric("Avg Confidence", f"{avg_confidence:.2f}")
        st.metric("Top Category", top_category)
        
        # Category breakdown
        st.subheader("🏷️ Category Breakdown")
        for category, count in entity_counts.items():
            percentage = (count / total_entities) * 100
            st.write(f"**{category}**: {count} ({percentage:.1f}%)")
    
    # Detailed entity table
    st.subheader("📋 Detailed Entity List")
    
    # Filter options
    col1, col2 = st.columns(2)
    with col1:
        selected_categories = st.multiselect(
            "Filter by Category", 
            df['category'].unique(), 
            default=df['category'].unique()
        )
    with col2:
        min_confidence = st.slider("Minimum Confidence", 0.0, 1.0, 0.0, 0.1)
    
    # Apply filters
    filtered_df = df[
        (df['category'].isin(selected_categories)) & 
        (df['confidence'] >= min_confidence)
    ]
    
    # Display filtered table
    st.dataframe(
        filtered_df[['category', 'name', 'confidence', 'description']],
        use_container_width=True,
        height=300
    )

def chat_interface():
    """Interactive chat with Disclosure Bot"""
    st.subheader("💬 Chat with Disclosure Bot")
    
    # Display chat history
    chat_container = st.container()
    with chat_container:
        for i, message in enumerate(st.session_state.chat_messages):
            if message['role'] == 'user':
                st.write(f"🔍 **You**: {message['content']}")
            else:
                st.write(f"🛸 **Disclosure Bot**: {message['content']}")
    
    # Chat input
    col1, col2 = st.columns([4, 1])
    with col1:
        user_input = st.text_input("Ask about the extracted entities or any UFO/UAP topic:", key="chat_input")
    with col2:
        send_button = st.button("Send", type="primary")
    
    if send_button and user_input:
        # Add user message
        st.session_state.chat_messages.append({
            'role': 'user',
            'content': user_input
        })
        
        # Get bot response
        with st.spinner("🛸 Disclosure Bot is analyzing..."):
            try:
                # Add context from current entities if available
                context = ""
                if st.session_state.entity_data:
                    latest_doc = list(st.session_state.entity_data.keys())[-1]
                    entities = st.session_state.entity_data[latest_doc]
                    context = f"Current document entities: {json.dumps(entities, indent=2)}"
                
                response = st.session_state.disclosure_bot.send_message(user_input, context)
                
                # Add bot response
                st.session_state.chat_messages.append({
                    'role': 'bot',
                    'content': response
                })
                
                # Clear input and rerun to update display
                st.experimental_rerun()
                
            except Exception as e:
                st.error(f"Chat error: {e}")

def geographic_analysis_interface():
    """Geographic UFO Analysis Interface"""
    st.header("🗺️ Geographic UFO Analysis")
    st.markdown("*Real-time analysis of 130,445+ UFO sightings and military installation proximity*")
    
    # Analysis options
    col1, col2 = st.columns([2, 1])
    
    with col2:
        st.subheader("🎛️ Analysis Options")
        analysis_type = st.selectbox(
            "Choose Analysis:",
            ["UFO Hotspots Map", "Military Proximity Analysis", "Temporal Patterns", "Branch Comparison"]
        )
        
        if st.button("🔄 Refresh Data", help="Reload data from database"):
            if 'geo_cache' in st.session_state:
                del st.session_state['geo_cache']
    
    with col1:
        # Initialize visualizer
        try:
            if analysis_type == "UFO Hotspots Map":
                st.subheader("🛸 UFO Geographic Hotspots")
                
                with st.spinner("Loading UFO hotspots data..."):
                    if 'hotspots_data' not in st.session_state:
                        st.session_state.hotspots_data = get_ufo_hotspots_sync()
                    
                    hotspots_df = st.session_state.hotspots_data
                    
                    if not hotspots_df.empty:
                        visualizer = GeographicUFOVisualizer()
                        fig = visualizer.create_ufo_hotspots_map(hotspots_df)
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Show top hotspots table
                        st.subheader("📊 Top UFO Hotspots")
                        display_df = hotspots_df[['state', 'total_sightings', 'cities_affected', 'most_common_shape', 'sightings_per_year']].head(10)
                        st.dataframe(display_df, use_container_width=True)
                    else:
                        st.warning("No hotspots data available")
            
            elif analysis_type == "Military Proximity Analysis":
                st.subheader("🏛️ UFO-Military Installation Proximity")
                
                with st.spinner("Loading military proximity data..."):
                    if 'military_data' not in st.session_state:
                        st.session_state.military_data = get_military_proximity_sync()
                    if 'hotspots_data' not in st.session_state:
                        st.session_state.hotspots_data = get_ufo_hotspots_sync()
                    
                    military_df = st.session_state.military_data
                    hotspots_df = st.session_state.hotspots_data
                    
                    if not military_df.empty and not hotspots_df.empty:
                        visualizer = GeographicUFOVisualizer()
                        fig = visualizer.create_military_proximity_map(hotspots_df, military_df)
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Show proximity stats
                        st.subheader("📊 Closest Military Encounters")
                        display_df = military_df[['site_name', 'component', 'state_terr', 'nearby_sightings', 'closest_sighting_km']].head(10)
                        st.dataframe(display_df, use_container_width=True)
                    else:
                        st.warning("No military proximity data available")
            
            elif analysis_type == "Temporal Patterns":
                st.subheader("🕐 UFO Temporal Activity Patterns")
                
                with st.spinner("Loading temporal patterns..."):
                    if 'temporal_data' not in st.session_state:
                        st.session_state.temporal_data = get_temporal_patterns_sync()
                    
                    temporal_df = st.session_state.temporal_data
                    
                    if not temporal_df.empty:
                        visualizer = GeographicUFOVisualizer()
                        fig = visualizer.create_temporal_heatmap(temporal_df)
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Show peak activity times
                        st.subheader("📊 Peak Activity Periods")
                        peak_hours = temporal_df.groupby('hour')['sightings'].sum().sort_values(ascending=False).head(5)
                        peak_months = temporal_df.groupby('month')['sightings'].sum().sort_values(ascending=False).head(5)
                        
                        col_a, col_b = st.columns(2)
                        with col_a:
                            st.write("**Peak Hours:**")
                            for hour, sightings in peak_hours.items():
                                st.write(f"• {hour}:00 - {sightings:,} sightings")
                        
                        with col_b:
                            st.write("**Peak Months:**")
                            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            for month, sightings in peak_months.items():
                                st.write(f"• {month_names[int(month)-1]} - {sightings:,} sightings")
                    else:
                        st.warning("No temporal data available")
            
            elif analysis_type == "Branch Comparison":
                st.subheader("🏛️ Military Branch UFO Activity")
                
                with st.spinner("Loading branch comparison data..."):
                    if 'military_data' not in st.session_state:
                        st.session_state.military_data = get_military_proximity_sync()
                    
                    military_df = st.session_state.military_data
                    
                    if not military_df.empty:
                        visualizer = GeographicUFOVisualizer()
                        fig = visualizer.create_proximity_analysis_chart(military_df)
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Summary statistics
                        st.subheader("📊 Military Branch Summary")
                        st.markdown("""
                        **Key Findings:**
                        - **Navy installations** have the highest UFO activity
                        - **Air Force bases** show the closest encounters
                        - **Army facilities** have widespread geographic coverage
                        """)
                    else:
                        st.warning("No military data available")
                        
        except Exception as e:
            st.error(f"Error loading geographic analysis: {e}")
            st.info("Make sure the PostgreSQL database is running and accessible")

def main():
    """Main application"""
    # Header
    st.markdown('<h1 class="main-header">🛸 Disclosure RAG Interactive Dashboard</h1>', unsafe_allow_html=True)
    
    # Initialize components
    if not initialize_components():
        st.stop()
    
    # Sidebar controls
    st.sidebar.title("🎛️ Controls")
    
    # Document input options
    st.sidebar.subheader("📄 Document Input")
    input_method = st.sidebar.radio("Choose input method:", ["Text Input", "File Upload", "Bulk Folder Import", "URL Processing"])
    
    if input_method == "Text Input":
        content = st.sidebar.text_area(
            "Paste your UFO/UAP content:", 
            height=200,
            placeholder="Enter text about UFO sightings, testimonies, or research..."
        )
        title = st.sidebar.text_input("Document Title:", "Manual Input")
        
        if st.sidebar.button("🔍 Process Text", type="primary"):
            if content.strip():
                processed_doc = process_document(content, title)
                if processed_doc:
                    st.success(f"✅ Processed: {title}")
                    st.experimental_rerun()
    
    elif input_method == "File Upload":
        uploaded_file = st.sidebar.file_uploader(
            "Upload document:",
            type=['txt', 'pdf', 'docx', 'md'],
            help="Supported formats: TXT, PDF, DOCX, MD"
        )
        
        if uploaded_file and st.sidebar.button("🔍 Process File", type="primary"):
            try:
                # Read file content
                if uploaded_file.type == "text/plain":
                    content = str(uploaded_file.read(), "utf-8")
                else:
                    # For now, treat as text - could add PDF/DOCX processing later
                    content = str(uploaded_file.read(), "utf-8")
                
                processed_doc = process_document(content, uploaded_file.name)
                if processed_doc:
                    st.success(f"✅ Processed: {uploaded_file.name}")
                    st.experimental_rerun()
            except Exception as e:
                st.error(f"File processing error: {e}")
    
    elif input_method == "Bulk Folder Import":
        st.sidebar.markdown("### 📁 Bulk Folder Import")
        st.sidebar.info("Import entire folders of PDF, TXT, DOCX, MD, RTF files through Triple RAG system")
        
        folder_path = st.sidebar.text_input(
            "Folder path:",
            placeholder="e.g., data/raw/greer-document-library",
            help="Enter the path to a folder containing documents to import"
        )
        
        # Processing options
        batch_size = st.sidebar.selectbox(
            "Processing batch size:",
            [None, 5, 10, 20],
            format_func=lambda x: "All at once" if x is None else f"Batches of {x}"
        )
        
        file_types = st.sidebar.multiselect(
            "File types to include:",
            [".pdf", ".txt", ".docx", ".md", ".rtf"],
            default=[".pdf", ".txt", ".md"]
        )
        
        if folder_path and st.sidebar.button("🔍 Preview Folder", type="secondary"):
            if os.path.exists(folder_path):
                folder_path_obj = Path(folder_path)
                
                # Count files
                files_found = []
                for file_type in file_types:
                    files_found.extend(list(folder_path_obj.glob(f"*{file_type}")))
                    files_found.extend(list(folder_path_obj.glob(f"**/*{file_type}")))
                
                if files_found:
                    st.sidebar.success(f"Found {len(files_found)} documents")
                    
                    # Show file type breakdown
                    type_counts = {}
                    for f in files_found:
                        ext = f.suffix.lower()
                        type_counts[ext] = type_counts.get(ext, 0) + 1
                    
                    for ext, count in type_counts.items():
                        st.sidebar.write(f"• {ext.upper()}: {count} files")
                else:
                    st.sidebar.warning("No supported files found")
            else:
                st.sidebar.error("Folder path does not exist")
        
        if folder_path and st.sidebar.button("📥 Start Bulk Import", type="primary"):
            if os.path.exists(folder_path):
                with st.spinner("Starting bulk import..."):
                    success = process_bulk_folder_import(folder_path, file_types, batch_size)
                if success:
                    st.success("✅ Bulk import completed successfully!")
                    st.experimental_rerun()
            else:
                st.error("❌ Invalid folder path")
    
    elif input_method == "URL Processing":
        url = st.sidebar.text_input("Enter URL:", placeholder="https://...")
        
        if st.sidebar.button("🔍 Process URL", type="primary") and url:
            with st.spinner("🌐 Fetching and processing URL..."):
                try:
                    # Use existing web processor
                    processed_content = st.session_state.web_processor.process_url(url)
                    if processed_content and 'content' in processed_content:
                        processed_doc = process_document(
                            processed_content['content'], 
                            processed_content.get('title', url)
                        )
                        if processed_doc:
                            st.success(f"✅ Processed URL: {url}")
                            st.experimental_rerun()
                except Exception as e:
                    st.error(f"URL processing error: {e}")
    
    # Processing options
    st.sidebar.subheader("⚙️ Processing Options")
    auto_visualize = st.sidebar.checkbox("Auto-generate visualizations", True)
    confidence_threshold = st.sidebar.slider("Confidence Threshold", 0.0, 1.0, 0.5, 0.1)
    
    # Main content area
    if st.session_state.processed_documents:
        tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Dashboard", "🗺️ Geographic Analysis", "💬 Chat", "📁 Documents", "🗂️ Data Sources"])
        
        with tab1:
            # Get latest document entities
            latest_doc = st.session_state.processed_documents[-1]
            create_real_time_dashboard(latest_doc['entities'])
        
        with tab2:
            geographic_analysis_interface()
        
        with tab3:
            chat_interface()
        
        with tab4:
            st.subheader("📁 Processed Documents")
            
            for i, doc in enumerate(reversed(st.session_state.processed_documents)):
                with st.expander(f"{doc['title']} - {doc['timestamp'].strftime('%H:%M:%S')}"):
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Words", doc['word_count'])
                    with col2:
                        st.metric("Characters", doc['char_count'])
                    with col3:
                        entity_count = sum(len(v) if isinstance(v, list) else 0 for v in doc['entities'].values())
                        st.metric("Entities", entity_count)
                    
                    # Show entities summary
                    st.write("**Extracted Entities:**")
                    for category, entities in doc['entities'].items():
                        if entities:
                            st.write(f"- **{category.title()}**: {len(entities)} items")
                    
                    # Content preview
                    st.write("**Content Preview:**")
                    st.write(doc['content'][:300] + "..." if len(doc['content']) > 300 else doc['content'])
        
        with tab5:
            # Data Sources Navigator
            render_data_sources_navigator()
    
    else:
        # Welcome screen with data sources navigator
        welcome_tab, data_sources_tab = st.tabs(["👋 Welcome", "🗂️ Data Sources"])
        
        with welcome_tab:
            st.info("""
            👋 **Welcome to the Disclosure RAG Interactive Dashboard!**
            
            This interface combines:
            - 🔍 **Real-time NER processing** with Anthropic Claude
            - 📊 **Interactive visualizations** of extracted entities  
            - 💬 **Chat interface** with the Disclosure Bot
            - 🌐 **Web content processing** for UFO/UAP research
            - 🗂️ **Knowledge base navigation** with 61K+ UFO/UAP records
            
            **Get started by:**
            1. Using the sidebar to input text, upload a file, or process a URL
            2. Watch as entities are extracted and visualized in real-time
            3. Chat with the Disclosure Bot about your findings
            4. Explore the comprehensive knowledge base with case files and transcripts
            
            **Perfect for analyzing:**
            - UFO/UAP testimonies and reports
            - Government disclosure documents
            - Research papers and case studies
            - News articles and interviews
            - Historical transcript archives
            """)
        
        with data_sources_tab:
            # Data Sources Navigator (always available)
            render_data_sources_navigator()

if __name__ == "__main__":
    main()