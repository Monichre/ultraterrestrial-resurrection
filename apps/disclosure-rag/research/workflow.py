import os
from pathlib import Path
from typing import Dict, List, Optional

import anthropic
import streamlit as st
from mem0 import Memory
from phi.assistant import Assistant
from phi.knowledge import CombinedKnowledgeBase, PDFKnowledgeBase
from phi.llm.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.firecrawl import FirecrawlTools
from phi.vectordb.pgvector import PgVector
from raglite import RAGLiteConfig, hybrid_search, insert_document, rag
from research.research_prompt import research_prompt


class UnifiedResearchSystem:
    def __init__(self, openai_key: str, anthropic_key: str, cohere_key: str, db_url: str):
        self.setup_environment(openai_key, anthropic_key, cohere_key)
        self.setup_knowledges(db_url)
        self.setup_memory()
        self.setup_agents()
        self.setup_rag_config(openai_key, anthropic_key, cohere_key, db_url)

    def setup_environment(self, openai_key: str, anthropic_key: str, cohere_key: str):
        os.environ["OPENAI_API_KEY"] = openai_key
        os.environ["ANTHROPIC_API_KEY"] = anthropic_key
        os.environ["COHERE_API_KEY"] = cohere_key
        self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key)

    def setup_knowledges(self, db_url: str):
        vector_db = PgVector(db_url=db_url)
        self.pdf_kb = PDFKnowledgeBase(
            path=Path("data/pdfs"),
            vector_db=vector_db.with_collection("pdf_documents")
        )
        self.combined_kb = CombinedKnowledgeBase(
            sources=[self.pdf_kb],
            vector_db=vector_db.with_collection("combined_documents")
        )

    def setup_memory(self):
        self.memory = Memory.from_config({
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "model": "gpt-4",
                    "host": "localhost",
                    "port": 6333,
                }
            }
        })

    def setup_agents(self):
        # Web Research Agent
        self.web_researcher = Assistant(
            name="Web Researcher",
            role="Research web content and synthesize information",
            tools=[DuckDuckGo(), FirecrawlTools()],
            llm=OpenAIChat(model="gpt-4", temperature=0.7)
        )

        # Document Analysis Agent
        self.doc_analyst = Assistant(
            name="Document Analyst",
            role="Analyze documents and extract key information",
            knowledge=self.combined_kb,
            llm=OpenAIChat(model="gpt-4", temperature=0.5)
        )

        # Research Team
        self.research_team = Assistant(
            name="Research Team",
            team=[self.web_researcher, self.doc_analyst],
            llm=OpenAIChat(model="gpt-4", temperature=0.7)
        )

    def setup_rag_config(self, openai_key: str, anthropic_key: str, cohere_key: str, db_url: str):
        self.rag_config = RAGLiteConfig(
            db_url=db_url,
            llm="claude-3-opus-20240229",
            embedder="text-embedding-3-large",
            embedder_normalize=True,
            chunk_max_size=2000,
            embedder_sentence_window_size=2
        )

    async def process_query(self, query: str, user_id: str) -> Dict:
        # Get relevant memories
        memories = self.memory.search(query, user_id=user_id, limit=3)
        memory_context = " ".join(mem['text'] for mem in memories)

        # Perform RAG search
        chunks = hybrid_search(query, num_results=5, config=self.rag_config)

        # Research team analysis

        team_response = await self.research_team.arun(research_prompt)

        # Save to memory
        self.memory.add(
            text=f"Research Query: {query}\nFindings: {team_response}",
            user_id=user_id
        )

        return {
            "response": team_response,
            "sources": chunks,
            "memories": memories
        }


def create_streamlit_ui():
    st.title("🔍 Unified Research Assistant")

    # API Keys
    with st.sidebar:
        api_keys = {
            "openai": st.text_input("OpenAI API Key", type="password"),
            "anthropic": st.text_input("Anthropic API Key", type="password"),
            "cohere": st.text_input("Cohere API Key", type="password")
        }
        db_url = st.text_input(
            "Database URL", value="postgresql://localhost:5432/research")
        user_id = st.text_input("User ID", value="default_user")

    if all(api_keys.values()):
        if "research_system" not in st.session_state:
            st.session_state.research_system = UnifiedResearchSystem(
                api_keys["openai"],
                api_keys["anthropic"],
                api_keys["cohere"],
                db_url
            )

        # File Upload
        uploaded_files = st.file_uploader(
            "Upload Documents",
            type=["pdf"],
            accept_multiple_files=True
        )
        if uploaded_files:
            for file in uploaded_files:
                insert_document(
                    file.read(),
                    config=st.session_state.research_system.rag_config
                )

        # Query Input
        query = st.text_input("Enter your research query")
        if query:
            with st.spinner("Researching..."):
                results = st.session_state.research_system.process_query(
                    query=query,
                    user_id=user_id
                )

                st.markdown("### Results")
                st.write(results["response"])

                with st.expander("View Sources"):
                    st.write(results["sources"])

                with st.expander("Related Memory"):
                    st.write(results["memories"])


if __name__ == "__main__":
    create_streamlit_ui()
