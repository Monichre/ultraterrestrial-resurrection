#!/usr/bin/env python3
"""
Enhanced CLI interface for Disclosure RAG using Charm CLI tools.
Integrates gum, huh, glow, glamour for interactive terminal experience.
"""

import subprocess
import json
import sys
import os
import asyncio
from typing import Dict, List, Optional, Any
from pathlib import Path

# Import bulk ingestion functionality
try:
    from scripts.bulk_folder_ingestion import BulkFolderIngestion
except ImportError:
    BulkFolderIngestion = None


class CharmCLI:
    """Wrapper for Charm CLI tools integration."""

    def __init__(self):
        self.available_tools = self._check_available_tools()

    def _check_available_tools(self) -> Dict[str, bool]:
        """Check which Charm tools are available on the system."""
        tools = ['gum', 'huh', 'glow', 'glamour']
        available = {}

        for tool in tools:
            try:
                subprocess.run([tool, '--version'],
                               capture_output=True,
                               check=True,
                               timeout=5)
                available[tool] = True
            except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
                available[tool] = False

        return available

    def gum_input(self, prompt: str, placeholder: str = "", password: bool = False) -> str:
        """Interactive input using gum."""
        if not self.available_tools.get('gum', False):
            try:
                return input(f"{prompt}: ")
            except EOFError:
                return ""

        cmd = ['gum', 'input', '--prompt', f"{prompt}: "]
        if placeholder:
            cmd.extend(['--placeholder', placeholder])
        if password:
            cmd.append('--password')

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, check=True)
            return result.stdout.strip()
        except (subprocess.CalledProcessError, EOFError):
            try:
                return input(f"{prompt}: ")
            except EOFError:
                return ""

    def gum_choose(self, prompt: str, options: List[str], multiple: bool = False) -> str | List[str]:
        """Interactive selection using gum."""
        if not self.available_tools.get('gum', False):
            print(f"\n{prompt}")
            for i, option in enumerate(options, 1):
                print(f"{i}. {option}")
            choice = input("Enter choice number: ")
            try:
                return options[int(choice) - 1]
            except (ValueError, IndexError):
                return options[0] if options else ""

        cmd = ['gum', 'choose']
        if multiple:
            cmd.append('--no-limit')
        cmd.extend(options)

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, check=True)
            selected = result.stdout.strip().split(
                '\n') if multiple else result.stdout.strip()
            return selected
        except subprocess.CalledProcessError:
            return options[0] if options else ""

    def gum_confirm(self, prompt: str, default: bool = True) -> bool:
        """Interactive confirmation using gum."""
        if not self.available_tools.get('gum', False):
            response = input(f"{prompt} (y/N): ").lower()
            return response in ['y', 'yes']

        cmd = ['gum', 'confirm', prompt]
        if default:
            cmd.append('--default=true')
        else:
            cmd.append('--default=false')

        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            return result.returncode == 0
        except subprocess.CalledProcessError:
            return default

    def glow_render(self, content: str, style: str = "auto") -> None:
        """Render markdown using glow."""
        if not self.available_tools.get('glow', False):
            print(content)
            return

        try:
            cmd = ['glow', '--style', style, '-']
            subprocess.run(cmd, input=content, text=True, check=True)
        except subprocess.CalledProcessError:
            print(content)

    def glamour_render(self, content: str, style: str = "auto", width: int = 80) -> str:
        """Render markdown using glamour and return formatted string."""
        if not self.available_tools.get('glamour', False):
            return content

        try:
            cmd = ['glamour', '--style', style, '--width', str(width)]
            result = subprocess.run(cmd, input=content, text=True,
                                    capture_output=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError:
            return content


class DisclosureRAGCLI:
    """Enhanced CLI for Disclosure RAG system."""

    def __init__(self):
        self.charm = CharmCLI()
        self.current_session = None

    def welcome_banner(self):
        """Display welcome banner with styling."""
        banner = """# 🛸 Disclosure RAG Interactive CLI

            > Advanced UFO/UAP Research & Analysis System
            > Powered by Charm CLI Tools

            Welcome to the enhanced disclosure research environment!
        """
        self.charm.glow_render(banner)

    def main_menu(self) -> str:
        """Display main menu and get user choice."""
        options = [
            "🔍 Search Knowledge Base",
            "📁 Bulk Document Ingestion",
            "💬 Start Research Chat",
            "📊 Entity Analysis",
            "🗺️  Geospatial Analysis",
            "📜 Historical Timeline",
            "🌐 Network Analysis",
            "📝 Generate Report",
            "⚙️  Settings",
            "🚪 Exit"
        ]

        choice = self.charm.gum_choose("What would you like to do?", options)
        return choice.split()[1] if choice else "Exit"

    def search_interface(self):
        """Interactive search interface."""
        print("\n🔍 Knowledge Base Search")

        query = self.charm.gum_input(
            "Enter your search query",
            placeholder="e.g., Pentagon UAP reports, Roswell incident"
        )

        if not query:
            return

        # Search type selection
        search_types = [
            "Vector Similarity Search",
            "Keyword Search",
            "Entity-based Search",
            "Temporal Search"
        ]

        search_type = self.charm.gum_choose(
            "Choose search type:", search_types)

        # Show loading spinner simulation
        self._show_processing("Searching knowledge base...")

        # Here you would integrate with your actual search functionality
        results = self._mock_search_results(query, search_type)

        self._display_search_results(results)

    def chat_interface(self):
        """Interactive chat interface."""
        print("\n💬 Research Chat Session")

        # Agent selection
        agents = [
            "General Disclosure Assistant",
            "Claims & Evidence Analyst",
            "Historical Timeline Expert",
            "Entity Extraction Specialist",
            "Testimony Analyzer"
        ]

        agent = self.charm.gum_choose("Select research agent:", agents)

        print(f"\n🤖 Starting session with {agent}")
        print("Type 'exit' to end the session\n")

        while True:
            message = self.charm.gum_input(
                "You", placeholder="Ask about UFO/UAP research...")

            if message.lower() in ['exit', 'quit', 'bye']:
                break

            if not message:
                continue

            # Simulate agent response
            self._show_processing("Agent thinking...")
            response = self._mock_agent_response(agent, message)

            print(f"\n🤖 {agent}:")
            self.charm.glow_render(response)
            print()

    def entity_analysis(self):
        """Entity analysis interface."""
        print("\n📊 Entity Analysis")

        entity_types = [
            "Personnel",
            "Organizations",
            "Locations",
            "Events",
            "Technologies",
            "Documents"
        ]

        selected_types = self.charm.gum_choose(
            "Select entity types to analyze (space to select, enter to confirm):",
            entity_types,
            multiple=True
        )

        if not selected_types:
            return

        self._show_processing("Analyzing entities...")

        # Mock entity analysis results
        for entity_type in selected_types:
            self._display_entity_analysis(entity_type)

    def settings_menu(self):
        """Settings configuration interface."""
        print("\n⚙️  Settings Configuration")

        settings_options = [
            "API Configuration",
            "Search Preferences",
            "Output Format",
            "Agent Behavior",
            "Export Settings"
        ]

        setting = self.charm.gum_choose("Configure:", settings_options)

        if setting == "API Configuration":
            self._configure_api_settings()
        elif setting == "Search Preferences":
            self._configure_search_settings()
        # Add other setting configurations as needed

    def _configure_api_settings(self):
        """Configure API settings."""
        print("\n🔧 API Configuration")

        # OpenAI API Key
        has_openai = self.charm.gum_confirm("Configure OpenAI API?")
        if has_openai:
            api_key = self.charm.gum_input(
                "OpenAI API Key",
                placeholder="sk-...",
                password=True
            )
            # Save securely

        # Anthropic API Key
        has_anthropic = self.charm.gum_confirm("Configure Anthropic API?")
        if has_anthropic:
            api_key = self.charm.gum_input(
                "Anthropic API Key",
                placeholder="sk-ant-...",
                password=True
            )
            # Save securely

    def _show_processing(self, message: str):
        """Show processing message with spinner if gum is available."""
        if self.charm.available_tools.get('gum', False):
            # Use gum spin for loading animation
            try:
                subprocess.run(['gum', 'spin', '--spinner', 'dot',
                                '--title', message, 'sleep', '2'],
                               check=True)
            except subprocess.CalledProcessError:
                print(f"⏳ {message}")
        else:
            print(f"⏳ {message}")

    def _mock_search_results(self, query: str, search_type: str) -> List[Dict]:
        """Mock search results for demonstration."""
        return [
            {
                "title": "Pentagon UAP Report 2023",
                "content": "Official government disclosure on unidentified aerial phenomena...",
                "relevance": 0.95,
                "source": "government_docs"
            },
            {
                "title": "Witness Testimony: Navy Pilot Encounter",
                "content": "First-hand account of UAP encounter during training mission...",
                "relevance": 0.87,
                "source": "testimonies"
            }
        ]

    def _display_search_results(self, results: List[Dict]):
        """Display search results with formatting."""
        if not results:
            print("❌ No results found.")
            return

        result_md = "# Search Results\n\n"
        for i, result in enumerate(results, 1):
            result_md += f"## {i}. {result['title']}\n"
            result_md += f"**Relevance:** {result['relevance']:.2%}\n"
            result_md += f"**Source:** {result['source']}\n\n"
            result_md += f"{result['content'][:200]}...\n\n"
            result_md += "---\n\n"

        self.charm.glow_render(result_md)

    def _mock_agent_response(self, agent: str, message: str) -> str:
        """Mock agent response for demonstration."""
        return f"""Based on my analysis as a **{agent}**, here's what I found:

The topic of "{message}" relates to several key aspects in UFO/UAP research:

- **Historical Context**: This connects to documented cases from the past decades
- **Evidence Quality**: Multiple sources corroborate similar observations  
- **Government Position**: Official stance has evolved significantly
- **Research Implications**: Suggests areas for further investigation

Would you like me to elaborate on any specific aspect?"""

    def _display_entity_analysis(self, entity_type: str):
        """Display entity analysis results."""
        analysis_md = f"""
## {entity_type} Analysis

**Total Entities Found:** 156
**Most Frequent:** Pentagon, Area 51, Roswell
**Confidence Score:** 89%

### Key Patterns:
- Government entities show 67% correlation with disclosure events
- Geographic clustering around military installations
- Temporal patterns align with Cold War periods

### Recommendations:
- Further analysis of government entity relationships
- Cross-reference with historical events timeline
        """

        self.charm.glow_render(analysis_md)

    def bulk_ingestion_interface(self):
        """Bulk document ingestion interface."""
        print("\n📁 Bulk Document Ingestion")

        if BulkFolderIngestion is None:
            print(
                "❌ Bulk ingestion module not available. Please ensure the system is properly set up.")
            return

        # Get source folder
        folder_path = self.charm.gum_input(
            "Enter folder path to ingest",
            placeholder="/path/to/documents or /data/queue/greer-document-library"
        )

        if not folder_path or not os.path.exists(folder_path):
            print("❌ Invalid folder path")
            return

        folder_path = Path(folder_path)

        # Count files to process
        supported_extensions = {'.pdf', '.txt', '.docx', '.md', '.rtf'}
        files_to_process = []
        for ext in supported_extensions:
            files_to_process.extend(list(folder_path.glob(f"*{ext}")))
            files_to_process.extend(list(folder_path.glob(f"**/*{ext}")))

        if not files_to_process:
            print("❌ No supported documents found in the specified folder")
            return

        # Show preview
        preview_md = f"""
## 📁 Bulk Ingestion Preview

**Source Folder:** `{folder_path}`
**Documents Found:** {len(files_to_process)}

**File Types:**
"""
        for ext in supported_extensions:
            count = len(
                [f for f in files_to_process if f.suffix.lower() == ext])
            if count > 0:
                preview_md += f"- {ext.upper()}: {count} files\n"

        preview_md += "\n**First 5 files:**\n"
        for i, file_path in enumerate(files_to_process[:5]):
            preview_md += f"{i+1}. {file_path.name}\n"

        if len(files_to_process) > 5:
            preview_md += f"... and {len(files_to_process) - 5} more\n"

        self.charm.glow_render(preview_md)

        # Confirm processing
        if not self.charm.gum_confirm(f"Process {len(files_to_process)} documents?"):
            return

        # Processing options
        options = [
            "Process all files sequentially",
            "Process in batches of 10",
            "Process in batches of 5",
            "Process only PDFs",
            "Cancel"
        ]

        option = self.charm.gum_choose("Choose processing option:", options)

        if option == "Cancel":
            return

        # Determine batch size
        batch_size = None
        if "batches of 10" in option:
            batch_size = 10
        elif "batches of 5" in option:
            batch_size = 5
        elif "only PDFs" in option:
            files_to_process = [
                f for f in files_to_process if f.suffix.lower() == '.pdf']
            if not files_to_process:
                print("❌ No PDF files found")
                return

        # Start processing
        self._process_bulk_ingestion(folder_path, files_to_process, batch_size)

    def _process_bulk_ingestion(self, folder_path: Path, files_to_process: List[Path], batch_size: Optional[int]):
        """Process bulk ingestion with progress feedback."""
        try:
            # Initialize ingestion system
            print("🔧 Initializing Triple RAG ingestion system...")
            ingestion = BulkFolderIngestion()

            # Process files
            total_files = len(files_to_process)
            processed = 0
            failed = 0

            if batch_size:
                # Process in batches
                for i in range(0, total_files, batch_size):
                    batch = files_to_process[i:i+batch_size]
                    batch_num = (i // batch_size) + 1
                    total_batches = (
                        total_files + batch_size - 1) // batch_size

                    print(
                        f"\n📦 Processing batch {batch_num}/{total_batches} ({len(batch)} files)")

                    for file_path in batch:
                        success = self._process_single_file(
                            ingestion, file_path)
                        if success:
                            processed += 1
                            print(f"✅ {file_path.name}")
                        else:
                            failed += 1
                            print(f"❌ {file_path.name}")

                    # Show batch completion
                    print(
                        f"📊 Batch {batch_num} complete: {len(batch)} files processed")

                    # Pause between batches
                    if i + batch_size < total_files:
                        if not self.charm.gum_confirm("Continue to next batch?", default=True):
                            break
            else:
                # Process all files sequentially
                print(f"\n🔄 Processing {total_files} files...")

                for i, file_path in enumerate(files_to_process, 1):
                    print(f"\n[{i}/{total_files}] Processing: {file_path.name}")

                    success = self._process_single_file(ingestion, file_path)
                    if success:
                        processed += 1
                        print(f"✅ Completed: {file_path.name}")
                    else:
                        failed += 1
                        print(f"❌ Failed: {file_path.name}")

            # Final summary
            summary_md = f"""
## 📊 Bulk Ingestion Complete

**Total Files:** {total_files}
**Successfully Processed:** {processed}
**Failed:** {failed}
**Success Rate:** {(processed/total_files)*100:.1f}%

The documents have been indexed in the Triple RAG system:
- ☁️  **Upstash Vector** - Cloud vector search
- 💾 **LocalRAG FAISS** - Local vector storage  
- 🗄️  **PostgreSQL pgvector** - Advanced analytics

Your documents are now searchable via:
- Web interface (streamlit_app.py)
- Knowledge base UI (knowledge_base_ui.py)
- RAG queries and chat interfaces
"""

            self.charm.glow_render(summary_md)

        except Exception as e:
            print(f"❌ Bulk ingestion failed: {e}")

    def _process_single_file(self, ingestion: BulkFolderIngestion, file_path: Path) -> bool:
        """Process a single file through the ingestion pipeline."""
        try:
            # Run the async processing
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            try:
                # Create document file object
                from scripts.bulk_folder_ingestion import DocumentFile
                doc_file = DocumentFile(
                    path=file_path,
                    name=file_path.name,
                    size=file_path.stat().st_size,
                    extension=file_path.suffix.lower(),
                    mime_type="application/pdf" if file_path.suffix.lower() == '.pdf' else "text/plain"
                )

                # Process document
                result = loop.run_until_complete(
                    ingestion.process_single_document(doc_file))
                return result.get('success', False)

            finally:
                loop.close()

        except Exception as e:
            print(f"Error processing {file_path.name}: {e}")
            return False

    def run(self):
        """Main CLI loop."""
        try:
            import os
            os.system('cls' if os.name == 'nt' else 'clear')
            self.welcome_banner()

            while True:
                choice = self.main_menu()

                if choice == "Search":
                    self.search_interface()
                elif choice == "Bulk":
                    self.bulk_ingestion_interface()
                elif choice == "Start":
                    self.chat_interface()
                elif choice == "Entity":
                    self.entity_analysis()
                elif choice == "Settings":
                    self.settings_menu()
                elif choice == "Exit":
                    if self.charm.gum_confirm("Are you sure you want to exit?"):
                        break
                else:
                    print(f"Feature '{choice}' coming soon!")

                print("\n" + "="*50 + "\n")

        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"\n❌ Error: {e}")
            sys.exit(1)


def main():
    """Entry point for the enhanced CLI."""
    cli = DisclosureRAGCLI()
    cli.run()


if __name__ == "__main__":
    main()
