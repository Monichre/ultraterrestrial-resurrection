from typing import Optional, Dict, Any
from disclosure_rag.agents.disclosure_assistant import DisclosureAssistant
from disclosure_rag.utils.logger import logger
import time
import json
from rich.console import Console
import os
from openai import OpenAI

console = Console()

class DisclosureAssistant:
    """
    A modular class for interacting with an OpenAI Assistant specialized in disclosure analysis.
    Handles thread creation, message management, and assistant interaction.
    """
    
    def __init__(self, assistant_id: Optional[str] = None, api_key: Optional[str] = None, vector_store_id: Optional[str] = None):
        """
        Initialize the DisclosureAssistant.
        
        Args:
            assistant_id: The ID of an existing assistant to use. If None, will try to get from env vars.
            api_key: OpenAI API key. If None, will try to get from env vars.
            vector_store_id: Optional vector store ID to use. If None, will try to get from env vars.
        """
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key)
        
        # Get assistant ID from parameters or environment variables
        self.assistant_id = assistant_id or os.environ.get("DISCLOSURE_ASSISTANT_ID")
        
        # Get default vector store ID from parameters or environment variables
        self.vector_store_id = vector_store_id or os.environ.get("OPENAI_VECTOR_STORE_ID")
        if self.vector_store_id:
            logger.info(f"Using vector store ID: {self.vector_store_id}")
        
        if not self.assistant_id:
            console.print("[yellow]Warning: No assistant ID provided and DISCLOSURE_ASSISTANT_ID environment variable not set[/yellow]")
            console.print("[yellow]Attempting to create a new assistant...[/yellow]")
            self.assistant_id = self._create_default_assistant()
            
        if not self.assistant_id:
            raise ValueError("Failed to initialize disclosure assistant: No assistant ID available")
            
        logger.info(f"Initialized DisclosureAssistant with assistant ID: {self.assistant_id}")
    
    def _create_default_assistant(self) -> Optional[str]:
        """
        Create a default disclosure analysis assistant.
        
        Returns:
            The ID of the created assistant, or None if creation failed
        """
        try:
            creation_params = {
                "name": "Disclosure Analysis Assistant",
                "instructions": """You are a Research Analyst specialized in UFO/UAP content analysis.
                Follow these core principles:
                1. PERSISTENCE: Keep working until the user's query is completely resolved
                2. TOOL CALLING: When unsure, use available tools; do NOT guess
                3. PLANNING: Plan extensively before each analysis step and reflect afterward
                
                Organize information into clear categories: topics, personnel, events, and organizations.
                Provide relevance and credibility assessments for identified entities.
                Be factual and precise, avoiding speculative claims while noting claimed evidence.
                
                When analyzing content:
                1. First identify key entities, dates, and claims
                2. Research connections between entities using file search when available
                3. Evaluate credibility of sources and claims
                4. Summarize findings in structured format
                """,
                "model": "gpt-4.1-2025-04-14",
                "tools": [
                    {"type": "code_interpreter"},
                    {"type": "file_search"}
                ],
                "response_format": {"type": "text"}
            }
            
            # Add vector store to tool resources if available
            if self.vector_store_id:
                creation_params["tool_resources"] = {
                    "file_search": {"vector_store_ids": [self.vector_store_id]}
                }
                logger.info(f"Creating assistant with vector store ID: {self.vector_store_id}")
            
            assistant = self.client.beta.assistants.create(**creation_params)
            
            logger.info(f"Created new assistant with ID: {assistant.id}")
            return assistant.id
            
        except Exception as e:
            logger.error(f"Failed to create assistant: {e}")
            console.print(f"[bold red]Error creating assistant: {str(e)}[/bold red]")
            return None
    
    def analyze_content(self, 
                        content: str, 
                        vector_store_id: Optional[str] = None,
                        custom_instructions: Optional[str] = None,
                        timeout: int = 300) -> Dict[str, Any]:
        """
        Analyze content using the disclosure assistant.
        
        Args:
            content: The content to analyze
            vector_store_id: Optional vector store ID for file search
            custom_instructions: Optional custom instructions for this specific analysis
            timeout: Maximum time to wait for completion in seconds
            
        Returns:
            A dictionary containing the analysis results and metadata
        """
        try:
            logger.info("Starting disclosure assistant analysis")
            console.print("\n[bold blue]Using Disclosure Assistant...[/bold blue]")
            
            start_time = time.time()
            
            # Create thread and add message
            thread = self.client.beta.threads.create()
            
            self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=content
            )
            
            # Set up run parameters
            run_params = {
                "thread_id": thread.id,
                "assistant_id": self.assistant_id,
                "instructions": custom_instructions or "Analyze the provided content thoroughly using research methodology."
            }
            
            # Add vector store if specified, using provided ID or default ID
            effective_vector_store_id = vector_store_id or self.vector_store_id
            if effective_vector_store_id:
                run_params["tool_resources"] = {
                    "file_search": {"vector_store_ids": [effective_vector_store_id]}
                }
                logger.info(f"Using vector store ID for analysis: {effective_vector_store_id}")
            
            # Execute run
            run = self.client.beta.threads.runs.create(**run_params)

    def _handle_tool_calls(self, thread_id: str, run_id: str, run: Any) -> None:
        """
        Handle tool calls during a run.

        Args:
            thread_id: The thread ID
            run_id: The run ID
            run: The run object with the tool calls
        """
        if not hasattr(run, "required_action") or not hasattr(run.required_action, "submit_tool_outputs"):
            return

        tool_outputs = []

        for tool_call in run.required_action.submit_tool_outputs.tool_calls:
            tool_call_id = tool_call.id

            # Only process function calls for now
            if tool_call.type != "function":
                continue

            function_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)

            # Log the function call
            logger.info(f"Tool call: {function_name} with args: {arguments}")

            # Add a default response for now
            # In a real implementation, you'd dispatch to actual function handlers
            tool_outputs.append({
                "tool_call_id": tool_call_id,
                "output": json.dumps({
                    "status": "success",
                    "message": f"Tool {function_name} processed successfully"
                })
            })

        # Submit all tool outputs
        if tool_outputs:
            self.client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread_id,
                run_id=run_id,
                tool_outputs=tool_outputs
            )

    def cross_reference_analysis(self,
                                 original_analysis: str,
                                 timeout: int = 600,
                                 custom_instructions: Optional[str] = None) -> Dict[str, Any]:
        """
        Take an existing analysis and cross-reference it with the knowledge base to create
        a more comprehensive and interconnected analysis.

        Args:
            original_analysis: The existing analysis text to enhance
            timeout: Maximum time to wait for completion in seconds (default: 10 minutes)
            custom_instructions: Optional custom instructions for the cross-referencing

        Returns:
            A dictionary containing the enhanced analysis with cross-referenced information
        """
        try:
            logger.info("Starting cross-reference analysis")
            console.print(
                "\n[bold blue]Cross-referencing analysis with knowledge base...[/bold blue]")

            # If no vector store is available, warn but continue
            if not self.vector_store_id:
                logger.warning(
                    "No vector store available for cross-referencing. Results may be limited.")
                console.print(
                    "[yellow]Warning: No vector store available for cross-referencing. Results may be limited.[/yellow]")

            start_time = time.time()

            # Extract key entities and facts from the original analysis
            extraction_thread = self.client.beta.threads.create()

            # First ask the assistant to extract key entities and claims
            self.client.beta.threads.messages.create(
                thread_id=extraction_thread.id,
                role="user",
                content=f"""Extract the key entities, claims, and data points from this analysis 
                as a structured list of items to research further. Format each item with a short description 
                of what needs further investigation:
                
                {original_analysis}"""
            )

            # Run the extraction
            extraction_run = self.client.beta.threads.runs.create(
                thread_id=extraction_thread.id,
                assistant_id=self.assistant_id,
                instructions="Extract key entities, events, claims, and data points that need cross-referencing. Format as a list of distinct items, one per line, starting with a dash."
            )

            # Wait for extraction completion
            extraction_run = self._wait_for_run_completion(
                extraction_thread.id, extraction_run.id, timeout=120)

            # Get the extraction results
            extraction_messages = self.client.beta.threads.messages.list(
                thread_id=extraction_thread.id,
                order="asc"
            )

            # Find the assistant's response
            extraction_result = ""
            for msg in extraction_messages.data:
                if msg.role == "assistant":
                    for content_item in msg.content:
                        if content_item.type == "text":
                            extraction_result += content_item.text.value

            # Create a new thread for the cross-referencing
            thread = self.client.beta.threads.create()

            # Add the original analysis and extracted entities
            self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=f"""Here is an original analysis followed by key entities and points that need cross-referencing:
                
                # ORIGINAL ANALYSIS
                {original_analysis}
                
                # KEY POINTS TO CROSS-REFERENCE
                {extraction_result}
                
                Please create a comprehensive, enhanced analysis that cross-references each of these points with information
                from the knowledge base. For each key point, provide:
                
                1. Additional context or background
                2. Related events, testimonies, or documents
                3. Corroborating or contradicting evidence
                4. Connections to other events or phenomena
                
                Organize the enhanced analysis by main topics, maintaining the structure of the original analysis but
                enriching it with cross-referenced information."""
            )

            # Set up run parameters with vector store
            run_params = {
                "thread_id": thread.id,
                "assistant_id": self.assistant_id,
                "instructions": custom_instructions or """Create a deeply cross-referenced analysis that connects the original points to related information 
                in the knowledge base. Use the file search tool extensively to find corroborating evidence, related testimonies, 
                and connections between events. Enhance the original analysis with rich context while clearly indicating what 
                information is new versus from the original analysis."""
            }

            # Always add vector store for cross-referencing
            if self.vector_store_id:
                run_params["tool_resources"] = {
                    "file_search": {"vector_store_ids": [self.vector_store_id]}
                }

            # Execute run with longer timeout since this is a complex task
            run = self.client.beta.threads.runs.create(**run_params)

            # Wait for completion
            run = self._wait_for_run_completion(thread.id, run.id, timeout)

            # Process results similarly to analyze_content
            result = {
                "status": run.status,
                "thread_id": thread.id,
                "run_id": run.id,
                "elapsed_time": time.time() - start_time,
                "original_analysis": original_analysis,
                "extracted_points": extraction_result,
                "enhanced_analysis": "",
                "messages": []
            }

            # Get the cross-referenced analysis if run completed
            if run.status == "completed":
                messages = self.client.beta.threads.messages.list(
                    thread_id=thread.id,
                    order="asc"
                )

                # Get the assistant's response
                for msg in messages.data:
                    # Add to message list
                    result["messages"].append({
                        "role": msg.role,
                        "content": [content_item.text.value for content_item in msg.content
                                    if hasattr(content_item, 'text')]
                    })

                    # Get only the assistant's final response
                    if msg.role == "assistant":
                        assistant_response = []
                        for content_item in msg.content:
                            if content_item.type == "text":
                                assistant_response.append(
                                    content_item.text.value)

                # Join and set the enhanced analysis
                result["enhanced_analysis"] = "\n".join(assistant_response)

            else:
                # If run failed, add error information
                error_msg = f"Cross-reference run failed with status: {run.status}"
                if hasattr(run, "last_error") and run.last_error:
                    error_msg += f" - {run.last_error.message}"
                    result["error"] = run.last_error.message

                logger.error(error_msg)
                console.print(f"[bold red]{error_msg}[/bold red]")
                result["enhanced_analysis"] = f"Cross-referencing failed: {error_msg}"

            return result

        except Exception as e:
            logger.error(f"Error in cross-reference analysis: {e}")
            console.print(
                f"[bold red]Cross-Reference Error: {str(e)}[/bold red]")

            return {
                "status": "error",
                "error": str(e),
                "original_analysis": original_analysis,
                "enhanced_analysis": f"Error during cross-referencing: {str(e)}"
            }

# Convenience function for cross-referencing

def cross_reference_disclosure_analysis(original_analysis: str,
                                        assistant_id: Optional[str] = None,
                                        vector_store_id: Optional[str] = None,
                                        custom_instructions: Optional[str] = None) -> str:
    """
    Cross-reference an existing analysis with the knowledge base and return enhanced analysis.

    Args:
        original_analysis: The existing analysis to enhance
        assistant_id: Optional assistant ID (if not provided, uses environment variable)
        vector_store_id: Optional vector store ID (if not provided, uses OPENAI_VECTOR_STORE_ID)
        custom_instructions: Optional custom instructions for cross-referencing

    Returns:
        The enhanced analysis text with cross-referenced information
    """
    try:
        assistant = DisclosureAssistant(
            assistant_id=assistant_id, vector_store_id=vector_store_id)
        result = assistant.cross_reference_analysis(
            original_analysis=original_analysis,
            custom_instructions=custom_instructions
        )

        return result["enhanced_analysis"]
    except Exception as e:
        logger.error(f"Error in cross_reference_disclosure_analysis: {e}")
        return f"Error cross-referencing analysis: {str(e)}"

# Convenience function for one-off analysis
def analyze_disclosure_content(content: str, 
                              assistant_id: Optional[str] = None,
                              vector_store_id: Optional[str] = None, 
                              custom_instructions: Optional[str] = None) -> str:
    """
    Analyze content with a disclosure assistant and return just the analysis text.
    
    Args:
        content: The content to analyze
        assistant_id: Optional assistant ID (if not provided, uses environment variable)
        vector_store_id: Optional vector store ID for file search (if not provided, uses OPENAI_VECTOR_STORE_ID)
        custom_instructions: Optional custom instructions for this analysis
        
    Returns:
        The analysis text, or an error message if analysis failed
    """
    try:
        assistant = DisclosureAssistant(assistant_id=assistant_id, vector_store_id=vector_store_id)
        result = assistant.analyze_content(
            content=content,
            vector_store_id=vector_store_id,
            custom_instructions=custom_instructions
        )
        
        return result["content"]
    except Exception as e:
        logger.error(f"Error in analyze_disclosure_content: {e}")
        return f"Error analyzing content: {str(e)}"
      # For detailed control:
assistant = DisclosureAssistant(vector_store_id="your-vector-store-id")
result = assistant.cross_reference_analysis(
    original_analysis="Your existing analysis text...",
    custom_instructions="Focus on historical connections and testimonial corroboration"
)
enhanced_analysis = result["enhanced_analysis"]
# See what points were researched
extracted_points = result["extracted_points"]

# Or simple one-line usage:
enhanced_analysis = cross_reference_disclosure_analysis(
    original_analysis="Your existing analysis text..."
)

